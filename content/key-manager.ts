Components.utils.import('resource://gre/modules/Services.jsm')

import { orchestrator } from './orchestrator'

import ETA from 'node-eta'

import { alert, prompt } from './prompt'

import { kuroshiro } from './key-manager/japanese'
import { chinese } from './key-manager/chinese'

import { Scheduler } from './scheduler'
import { log } from './logger'
import { flash } from './flash'
import { Events } from './events'
import { fetchAsync as fetchInspireHEP } from './inspire-hep'
import * as Extra from './extra'
import { excelColumn, sentenceCase } from './text'

import * as ZoteroDB from './db/zotero'

import { getItemsAsync } from './get-items-async'

import { Preference } from './prefs'
import { Formatter } from './key-manager/formatter'
import { DB as Cache } from './db/cache'

import { patch as $patch$ } from './monkey-patch'

import { sprintf } from 'sprintf-js'

import * as l10n from './l10n'

type CitekeyRecord = { itemID: number, libraryID: number, itemKey: string, citekey: string }

const NoParse = { noParseParams: true }

class Progress {
  private win: any
  private progress: any
  private eta: ETA

  constructor(total: number, message: string) {
    this.win = new Zotero.ProgressWindow({ closeOnClick: false })
    this.win.changeHeadline(`Better BibTeX: ${message}`)
    const icon = `chrome://zotero/skin/treesource-unfiled${Zotero.hiDPI ? '@2x' : ''}.png`
    this.progress = new this.win.ItemProgress(icon, message)
    this.win.show()

    this.eta = new ETA(total, { autoStart: true })
  }

  next() {
    this.eta.iterate()

    if ((this.eta.done % 10) === 1) {
      this.progress.setProgress((this.eta.done * 100) / this.eta.count)
      this.progress.setText(this.eta.format(`${this.eta.done} / ${this.eta.count}, {{etah}} remaining`))
    }
  }

  done() {
    this.progress.setProgress(100)
    this.progress.setText('Ready')
    this.win.startCloseTimer(500)
  }
}

export const KeyManager = new class _KeyManager {
  public searchEnabled = false

  public keys: any
  public bucket: Map<string, CitekeySearchRecord[]>
  public query: {
    field: { extra?: number, title?: number }
    type: {
      note?: number
      attachment?: number
      annotation?: number
    }
  }
  public autopin: Scheduler<number> = new Scheduler<number>('autoPinDelay', 1000)

  private started = false

  private getField(item: { getField: ((str: string) => string)}, field: string): string {
    try {
      return item.getField(field) || ''
    }
    catch (err) {
      return ''
    }
  }

  public async set(): Promise<void> {
    const ids = this.expandSelection('selected')

    if (ids.length !== 1) return alert({ text: l10n.localize('better-bibtex_citekey_set_toomany') })

    const existingKey = this.get(ids[0]).citekey
    const citationKey = prompt({ text: l10n.localize('better-bibtex_citekey_set_change'), value: existingKey }) || existingKey
    if (citationKey === existingKey) return

    Cache.remove(ids, `setting key for ${ids}`)

    const item = await getItemsAsync(ids[0])
    item.setField('extra', Extra.set(item.getField('extra'), { citationKey }))
    await item.saveTx() // this should cause an update and key registration
  }

  public async pin(ids: 'selected' | number | number[], inspireHEP = false): Promise<void> {
    ids = this.expandSelection(ids)

    for (const item of await getItemsAsync(ids)) {
      if (item.isFeedItem || !item.isRegularItem()) continue

      const extra = this.getField(item, 'extra')
      const parsed = Extra.get(extra, 'zotero')
      let citationKey: string = null

      if (inspireHEP) {
        citationKey = await fetchInspireHEP(item)
        if (!citationKey || parsed.extraFields.citationKey === citationKey) continue
      }
      else {
        if (parsed.extraFields.citationKey) continue

        citationKey = this.get(item.id).citekey || this.update(item)
      }

      item.setField('extra', Extra.set(extra, { citationKey }))
      await item.saveTx() // this should cause an update and key registration
    }
  }

  public async unpin(ids: 'selected' | number | number[]): Promise<void> {
    ids = this.expandSelection(ids)

    for (const item of await getItemsAsync(ids)) {
      if (item.isFeedItem || !item.isRegularItem()) continue

      const parsed = Extra.get(item.getField('extra'), 'zotero', { citationKey: true })
      if (!parsed.extraFields.citationKey) continue

      item.setField('extra', parsed.extra) // citekey is stripped here but will be regenerated by the notifier
      item.saveTx()
    }

  }

  public async refresh(ids: 'selected' | number | number[], manual = false): Promise<void> {
    ids = this.expandSelection(ids)

    Cache.remove(ids, `refreshing keys for ${ids}`)

    const warnAt = manual ? Preference.warnBulkModify : 0
    if (warnAt > 0 && ids.length > warnAt) {
      const affected = this.keys.find({ $and: [{ itemID: { $in: ids } }, { pinned: { $eq: false } } ] }).length
      if (affected > warnAt) {
        const ps = Components.classes['@mozilla.org/embedcomp/prompt-service;1'].getService(Components.interfaces.nsIPromptService)
        const index = ps.confirmEx(
          null, // no parent
          'Better BibTeX for Zotero', // dialog title
          l10n.localize('better-bibtex_bulk-keys-confirm_warning', { treshold: warnAt }),
          ps.STD_OK_CANCEL_BUTTONS + ps.BUTTON_POS_2 * ps.BUTTON_TITLE_IS_STRING, // buttons
          null, null, l10n.localize('better-bibtex_bulk-keys-confirm_stop_asking'), // button labels
          null, {} // no checkbox
        )
        switch (index) {
          case 0: // OK
            break
          case 2: // don't ask again
            Preference.warnBulkModify = 0
            break
          default:
            return
        }
      }
    }

    const updates: ZoteroItem[] = []
    const progress: Progress = ids.length > 10 ? new Progress(ids.length, 'Refreshing citation keys') : null
    for (const item of await getItemsAsync(ids)) {
      if (item.isFeedItem || !item.isRegularItem()) continue

      const extra = item.getField('extra')

      let citekey = Extra.get(extra, 'zotero', { citationKey: true }).extraFields.citationKey
      if (citekey) continue // pinned, leave it alone

      citekey = this.get(item.id).citekey
      if (this.update(item) === citekey) continue

      // remove the new citekey from the aliases if present
      citekey = this.get(item.id).citekey
      const aliases = Extra.get(extra, 'zotero', { aliases: true })
      if (aliases.extraFields.aliases.includes(citekey)) {
        aliases.extraFields.aliases = aliases.extraFields.aliases.filter(alias => alias !== citekey)

        if (aliases.extraFields.aliases.length) {
          item.setField('extra', Extra.set(aliases.extra, { aliases: aliases.extraFields.aliases }))
        }
        else {
          item.setField('extra', aliases.extra)
        }
        await item.saveTx()
        await Zotero.Promise.delay(10)
      }
      else {
        updates.push(item)
      }

      progress?.next()
    }
    progress?.done()

    if (updates.length) void Events.emit('items-changed', { items: updates, action: 'modify', reason: 'refresh' })
  }

  constructor() {
    orchestrator.add('keymanager', {
      description: 'keymanager',
      needs: ['sqlite', 'database'],
      startup: async () => {
        log.debug('keymanager: init: kuroshiro/jieba')
        await kuroshiro.init()
        chinese.init()

        log.debug('keymanager: init: get keys')
        this.keys = this.watch(DB.getCollection('citekey'))

        this.query = {
          field: {},
          type: {},
        }

        log.debug('keymanager: init: pre-fetching types/fields')
        for (const type of await ZoteroDB.queryAsync('select itemTypeID, typeName from itemTypes')) { // 1 = attachment, 14 = note
          this.query.type[type.typeName] = type.itemTypeID
        }

        for (const field of await ZoteroDB.queryAsync('select fieldID, fieldName from fields')) {
          this.query.field[field.fieldName] = field.fieldID
        }

        log.debug('keymanager: init: compiling', Preference.citekeyFormat)
        Formatter.update([Preference.citekeyFormat])
        log.debug('keymanager: init: done')

        await this.start()
      },
    })
    orchestrator.add('citekeysearch', {
      description: 'citation key search',
      needs: ['keymanager'],
      startup: async () => {
        await this.enableSearch()
      },
    })
  }

  private async enableSearch(): Promise<void> {
    if (!Preference.citekeySearch || this.searchEnabled) return
    this.searchEnabled = true

    const citekeySearchCondition = {
      name: 'citationKey',
      operators: {
        is: true,
        isNot: true,
        contains: true,
        doesNotContain: true,
      },
      table: 'betterbibtex.citationkey',
      field: 'citationKey',
      localized: 'Citation Key',
    }
    $patch$(Zotero.Search.prototype, 'addCondition', original => function addCondition(condition: string, operator: any, value: any, _required: any) {
      // detect a quick search being set up
      if (condition.match(/^quicksearch/)) this.__add_bbt_citekey = true
      // creator is always added in a quick search so use it as a trigger
      if (condition === 'creator' && this.__add_bbt_citekey) {
        original.call(this, citekeySearchCondition.name, operator, value, false)
        delete this.__add_bbt_citekey
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, prefer-rest-params
      return original.apply(this, arguments)
    })
    $patch$(Zotero.SearchConditions, 'hasOperator', original => function hasOperator(condition: string, operator: string | number) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      if (condition === citekeySearchCondition.name) return citekeySearchCondition.operators[operator]
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, prefer-rest-params
      return original.apply(this, arguments)
    })
    $patch$(Zotero.SearchConditions, 'get', original => function get(condition: string) {
      if (condition === citekeySearchCondition.name) return citekeySearchCondition
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, prefer-rest-params
      return original.apply(this, arguments)
    })
    $patch$(Zotero.SearchConditions, 'getStandardConditions', original => function getStandardConditions() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, prefer-rest-params
      return original.apply(this, arguments).concat({
        name: citekeySearchCondition.name,
        localized: citekeySearchCondition.localized,
        operators: citekeySearchCondition.operators,
      }).sort((a: { localized: string }, b: { localized: any }) => a.localized.localeCompare(b.localized))
    })
    $patch$(Zotero.SearchConditions, 'getLocalizedName', original => function getLocalizedName(str: string) {
      if (str === citekeySearchCondition.name) return citekeySearchCondition.localized
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, prefer-rest-params
      return original.apply(this, arguments)
    })
  }

  private watch(keys: any): any {
    const insert = item => {
      if (!item) return

      if (Array.isArray(item)) {
        item.map(insert)
        return
      }

      const bucket = this.bucket.get(item.citekey)
      if (!bucket) {
        this.bucket.set(item.citekey, [item])
      }
      else {
        bucket.push(item)
      }
    }

    const remove = item => {
      if (!item) return

      if (Array.isArray(item)) {
        item.map(remove)
        return
      }

      let bucket = this.bucket.get(item.citekey)
      if (!bucket) return
      bucket = bucket.filter(i => i.itemID !== item.itemID)
      if (bucket.length) {
        this.bucket.set(item.citekey, bucket)
      }
      else {
        this.bucket.delete(item.citekey)
      }
    }

    this.bucket = new Map
    for (const item of keys.data) {
      insert(item)
    }

    keys.on(['pre-update'], item => {
      log.debug('keymanager: pre-update:', item)
      if (Array.isArray(item)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        remove(item.map(i => this.keys.get(i.$loki)))
      }
      else {
        remove(this.keys.get(item.$loki))
      }
    })
    keys.on(['delete'], item => {
      log.debug('keymanager: delete:', item)
      remove(item)
    })
    keys.on(['insert', 'update'], item => {
      log.debug('keymanager: update:insert:', item)
      insert(item)
    })

    return keys
  }

  private async start(): Promise<void> {
    const tables = await Zotero.DB.columnQueryAsync("SELECT LOWER(name) FROM betterbibtex.sqlite_master where type='table'")
    if (!tables.includes('citationkey')) {
      for (const ddl of require('./db/citation-key.sql')) {
        await Zotero.DB.queryAsync(ddl, [], NoParse)
      }
    }

    if (tables.includes('better-bibtex')) {
      const data = await Zotero.DB.valueQueryAsync('SELECT data FROM betterbibtex."better-bibtex" WHERE name=?', ['better-bibtex.citekey'])
      if (data) {
        const db = JSON.parse(data)
        await Zotero.DB.executeTransaction(async () => {
          for (const key of db.data) {
            Zotero.DB.queryAsync('REPLACE INTO betterbibtex.citationkey (itemID, itemKey, libraryID, citationKey, pinned) VALUES (?, ?, ?, ?, ?)', [
              key.itemID,
              key.itemKey,
              key.libraryID,
              key.citationKey,
              key.pinned ? 1 : 0,
            ])
          }
          await Zotero.DB.queryAsync('UPDATE betterbibtex."better-bibtex" SET name = ? WHERE name = ?', ['migrated.citekey', 'better-bibtex.citekey'])
        })
      }
    }

    if (Zotero.Libraries.userLibraryID > 1) {
      await Zotero.DB.queryAsync('UPDATE betterbibtex.citationkey SET libraryID = ? WHERE libraryID IN (0, 1)', [Zotero.Libraries.userLibraryID])
    }

    await this.rescan()

    Events.on('preference-changed', pref => {
      switch (pref) {
        case 'autoAbbrevStyle':
        case 'citekeyFormat':
        case 'citekeyFold':
        case 'citekeyUnsafeChars':
        case 'skipWords':
          Formatter.update([Preference.citekeyFormat])
          break
        case 'citekeySearch':
          void this.enableSearch()
      }
    })
    Events.on('items-changed-prep', ({ ids, action }) => {
      log.debug('keymanager: items-changed-prep:', action, ids)
      let warn_titlecase = 0
      switch (action) {
        case 'delete':
          this.remove(ids)
          break

        case 'add':
        case 'modify':
          for (const item of Zotero.Items.get(ids).filter(i => i.isRegularItem() && !i.isFeedItem)) {
            this.update(item)
            if (Preference.warnTitleCased) {
              const title = item.getField('title')
              if (title !== sentenceCase(title)) warn_titlecase += 1
            }
          }

          if (warn_titlecase) {
            const actioned = action === 'add' ? 'added' : 'saved'
            const msg = warn_titlecase === 1
              ? `${warn_titlecase} item ${actioned} which looks like it has a title-cased title`
              : `${warn_titlecase} items ${actioned} which look like they have title-cased titles`
            flash(`Possibly title-cased title${warn_titlecase > 1 ? 's' : ''} ${actioned}`, msg, 3)
          }
          break
      }
    })

    this.keys.on(['insert', 'update'], async (citekey: { itemID: number, itemKey: any, citekey: any, pinned: any }) => {
      if (Preference.citekeySearch) {
        await ZoteroDB.queryAsync('INSERT OR REPLACE INTO betterbibtexsearch.citekeys (itemID, itemKey, citekey) VALUES (?, ?, ?)', [ citekey.itemID, citekey.itemKey, citekey.citekey ])
      }

      // async is just a heap of fun. Who doesn't enjoy a good race condition?
      // https://github.com/retorquere/zotero-better-bibtex/issues/774
      // https://groups.google.com/forum/#!topic/zotero-dev/yGP4uJQCrMc
      await Zotero.Promise.delay(Preference.itemObserverDelay)

      let item
      try {
        item = await Zotero.Items.getAsync(citekey.itemID)
      }
      catch (err) {
        item = undefined
      }
      if (!item) {
        // assume item has been deleted before we could get to it -- did I mention I hate async? I hate async
        log.error('could not load', citekey.itemID)
        return
      }
      if (item.isFeedItem || !item.isRegularItem()) {
        log.error('citekey registered for item of type', item.isFeedItem ? 'feedItem' : Zotero.ItemTypes.getName(item.itemTypeID))
        return
      }

      // update display panes by issuing a fake item-update notification
      Zotero.Notifier.trigger('modify', 'item', [citekey.itemID], { [citekey.itemID]: { bbtCitekeyUpdate: true } })

      if (!citekey.pinned && this.autopin.enabled) {
        this.autopin.schedule(citekey.itemID, () => {
          this.pin([citekey.itemID]).catch(err => log.error('failed to pin', citekey.itemID, ':', err))
        })
      }
      if (citekey.pinned && Preference.keyConflictPolicy === 'change') {
        const conflictQuery: Query = { $and: [
          { itemID: { $ne: item.id } },
          { pinned: { $eq: false } },
          { citekey: { $eq: citekey.citekey } },
        ]}
        if (Preference.keyScope !== 'global')  conflictQuery.$and.push( { libraryID: { $eq: item.libraryID } } )

        for (const conflict of this.keys.find(conflictQuery)) {
          item = await Zotero.Items.getAsync(conflict.itemID)
          this.update(item, conflict)
        }
      }
    })

    this.keys.on('delete', async (citekey: { itemID: any }) => {
      if (Preference.citekeySearch) {
        await ZoteroDB.queryAsync('DELETE FROM betterbibtexsearch.citekeys WHERE itemID = ?', [ citekey.itemID ])
      }
    })

    this.started = true
  }

  public async load(): Promise<void> {
    await Zotero.DB.queryTx('DELETE FROM betterbibtex.citationkey WHERE itemID NOT IN (SELECT itemID FROM items)')
    const keys: Map<number, CitekeyRecord> = new Map

    // basic load
    for (const key of await Zotero.DB.queryAsync('SELECT * from betterbibtex.citationkey')) {
      keys.set(key.itemID, { itemID: key.itemID, itemKey: key.itemKey, libraryID: key.libraryID, citationKey: key.citationKey, pinned: key.pinned })
    }

    // fetch pinned keys to be sure
    const keyLine = /(^|\n)Citation Key\s*:\s*(.+?)(\n|$)/i
    const getKey = (extra: string) => {
      if (!extra) return ''
      const m = keyLine.exec(extra)
      return m ? m[2].trim() : ''
    }

    let pinned: string
    let key: CitationkeyRecord
    for const (item of (await ZoteroDB.queryAsync(`
      SELECT item.itemID, item.key, item.libraryID, extra.value as extra
      FROM items item

      LEFT JOIN itemData extraField ON extraField.itemID = item.itemID AND extraField.fieldID = ${this.query.field.extra}
      LEFT JOIN itemDataValues extra ON extra.valueID = extraField.valueID

      WHERE item.itemID NOT IN (SELECT itemID FROM deletedItems)
        AND item.itemTypeID NOT IN (${this.query.type.attachment}, ${this.query.type.note}, ${this.query.type.annotation || this.query.type.note})
        AND item.itemID NOT IN (SELECT itemID from feedItems)
    `))) {
      pinned = getKey(item.extra)
      if (pinned) {
        keys.set(item.itemID, { itemID: item.itemID, itemKey: item.itemKey, libraryID: item.libraryID, citationKey: pinned, pinned: true })
      }
      else if (key = keys.get(item.itemID)) {
        key.pinned = false
      }
    }

    await insertMany(this.keys, [...keys.values()])

    // generate keys for entries that don't have them yet
    const missing: number[] =  await ZoteroDB.columnQueryAsync(`
      SELECT itemID FROM items
      WHERE item.itemID NOT IN (SELECT itemID from betterbibtex.citationkey)
        AND item.itemTypeID NOT IN (${this.query.type.attachment}, ${this.query.type.note}, ${this.query.type.annotation || this.query.type.note})
        AND item.itemID NOT IN (SELECT itemID from feedItems)
    `)
    const progress = new Progress(missing.length, 'Assigning citation keys')
    for (const itemID of missing) {
      try {
        this.update(await getItemsAsync(itemID))
      }
      catch (err) {
        log.error('KeyManager.rescan: update failed:', err.message || `${err}`, err.stack)
      }

      progress.next()
    }

    progress.done()
  }

  public update(item: ZoteroItem, current?: { pinned: boolean, citekey: string }): string {
    if (item.isFeedItem || !item.isRegularItem()) return null

    current = current || this.keys.findOne($and({ itemID: item.id }))

    const proposed = this.propose(item)

    if (current && (current.pinned || !this.autopin.enabled) && (current.pinned === proposed.pinned) && (current.citekey === proposed.citekey)) return current.citekey

    if (current) {
      current.pinned = proposed.pinned
      current.citekey = proposed.citekey
      this.keys.update(current)
    }
    else {
      this.keys.insert({ itemID: item.id, libraryID: item.libraryID, itemKey: item.key, pinned: proposed.pinned, citekey: proposed.citekey })
    }

    return proposed.citekey
  }

  public remove(ids: number[] | number): void {
    if (!Array.isArray(ids)) ids = [ids]
    this.keys.findAndRemove({ itemID : { $in : ids } })
  }

  public get(itemID: number): { citekey: string, pinned: boolean, retry?: boolean } {
    // I cannot prevent being called before the init is done because Zotero unlocks the UI *way* before I'm getting the
    // go-ahead to *start* my init.
    if (!this.keys || !this.started) return { citekey: '', pinned: false, retry: true }

    const key = (this.keys.findOne($and({ itemID })) as { citekey: string, pinned: boolean })
    if (key) return key
    return { citekey: '', pinned: false, retry: true }
  }

  public propose(item: ZoteroItem): { citekey: string, pinned: boolean } {
    let citekey: string = Extra.get(item.getField('extra') as string, 'zotero', { citationKey: true }).extraFields.citationKey

    if (citekey) return { citekey, pinned: true }

    citekey = Formatter.format(item)

    const g = Preference.keyScope === 'global'

    const seen: Set<string> = new Set
    // eslint-disable-next-line no-constant-condition
    for (let n = Formatter.postfix.offset; true; n += 1) {
      const postfixed = citekey.replace(Formatter.postfix.marker, () => {
        let postfix = ''
        if (n) {
          const alpha = excelColumn(n)
          postfix = sprintf(Formatter.postfix.template, { a: alpha.toLowerCase(), A: alpha, n })
        }
        // this should never happen, it'd mean the postfix pattern doesn't have placeholders, which should have been caught by parsePattern
        if (seen.has(postfix)) throw new Error(`${JSON.stringify(Formatter.postfix)} does not generate unique postfixes`)
        seen.add(postfix)
        return postfix
      })

      log.debug('keymanager: propose:', { item: { itemID: item.id, libraryID: item.libraryID }, postfixed, bucket: this.bucket.get(postfixed) || [], conflict: this.bucket.get(postfixed)?.find(i => i.itemID !== item.id && (g || i.libraryID === item.libraryID)) || false })
      if (this.bucket.get(postfixed)?.find(i => i.itemID !== item.id && (g || i.libraryID === item.libraryID))) continue

      return { citekey: postfixed, pinned: false }
    }
  }

  public async tagDuplicates(libraryID: number): Promise<void> {
    const tag = '#duplicate-citation-key'

    const tagged = (await ZoteroDB.queryAsync(`
      SELECT items.itemID
      FROM items
      JOIN itemTags ON itemTags.itemID = items.itemID
      JOIN tags ON tags.tagID = itemTags.tagID
      WHERE (items.libraryID = ? OR 'global' = ?) AND tags.name = ? AND items.itemID NOT IN (select itemID from deletedItems)
    `, [ libraryID, Preference.keyScope, tag ])).map((item: { itemID: number }) => item.itemID)

    const citekeys: {[key: string]: any[]} = {}
    for (const item of this.keys.find(Preference.keyScope === 'global' ? undefined : $and({ libraryID }))) {
      if (!citekeys[item.citekey]) citekeys[item.citekey] = []
      citekeys[item.citekey].push({ itemID: item.itemID, tagged: tagged.includes(item.itemID), duplicate: false })
      if (citekeys[item.citekey].length > 1) citekeys[item.citekey].forEach(i => i.duplicate = true)
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const mistagged = Object.values(citekeys).reduce((acc, val) => acc.concat(val), []).filter(i => i.tagged !== i.duplicate).map(i => i.itemID)
    for (const item of await getItemsAsync(mistagged)) {
      if (tagged.includes(item.id)) {
        item.removeTag(tag)
      }
      else {
        item.addTag(tag)
      }

      await item.saveTx()
    }
  }

  private expandSelection(ids: 'selected' | number | number[]): number[] {
    if (Array.isArray(ids)) return ids

    if (ids === 'selected') {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return Zotero.getActiveZoteroPane().getSelectedItems(true)
      }
      catch (err) { // zoteroPane.getSelectedItems() doesn't test whether there's a selection and errors out if not
        log.error('Could not get selected items:', err)
        return []
      }
    }

    return [ids]
  }
}
