/* eslint-disable */
import * as CSL from 'citeproc'

function makeRegExp(lst) {
  lst = lst.slice()
  const ret = new RegExp( "(?:(?:[?!:]*\\s+|-|^)(?:" + lst.join("|") + ")(?=[!?:]*\\s+|-|$))", "g")
  return ret
}

class State {
  public opt = { lang: 'en' }
  public locale: { [locale: string]: { opts: { 'skip-words'?: string[], 'skip-words-regexp'?: RegExp } } }
  public tmp: any

  constructor() {
    this.locale = {}
    this.locale[this.opt.lang] = { opts: {} }
    this.locale[this.opt.lang].opts['skip-words'] = CSL.SKIP_WORDS
    this.locale[this.opt.lang].opts["skip-words-regexp"] = makeRegExp(this.locale[this.opt.lang].opts["skip-words"]) // eslint-disable-line @typescript-eslint/quotes, @typescript-eslint/semi,@typescript-eslint/member-delimiter-style
    this.tmp = {}
  }
}

export function titleCase(text: string): string {
  return CSL.Output.Formatters.title(new State, text)
}

export type Citation = {
  id: number
  locator: string
  suppressAuthor: boolean
  prefix: string
  suffix: string
  label: string
  citekey: string

  uri: string
  itemType: string
  title: string
}

export function formatted_citation(citations: Citation[], options: { style: string, locale?: string, contentType?: string}): string {
  options = {
    locale: Zotero.Prefs.get('export.quickCopy.locale'),
    contentType: 'text',
    ...options,
  }

  // items must be pre-loaded for the citation processor
  // await getItemsAsync(citations.map(item => item.id))
  const csl = Zotero.Styles.get(options.style).getCiteProc(options.locale)
  csl.updateItems(citations.map(item => item.id))

  const citation = {
    citationItems: citations.map(item => ({ ...item, 'suppress-author': item.suppressAuthor })),
    properties: {},
  }

  return csl.previewCitationCluster(citation, [], [], options.contentType)
}
