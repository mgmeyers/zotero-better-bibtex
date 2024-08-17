import { RegularItem, Item, Collection } from '../../gen/typings/serialized-item'

type CacheableItem = Item & { $cacheable: boolean }
type CacheableRegularItem = RegularItem & { $cacheable: boolean }

type NestedCollection = {
  key: string
  name: string
  items: CacheableItem[]
  collections: NestedCollection[]
  parent?: NestedCollection
}

export class Items {
  private items: CacheableItem[] = []
  public map: Record<number | string, CacheableItem> = {}
  public current: CacheableItem

  constructor() {
    let item: CacheableItem
    while (item = Zotero.nextItem()) {
      this.items.push(this.map[item.itemID] = this.map[item.itemKey] = item)
    }
  }

  private sortkey(item) {
    return `${ item.itemID === 'number' ? 'a' : 'b' }\t${ item.citationKey || '' }\t${ item.itemID === 'number' ? item.itemID : '' }`
  }

  public sort(sort: 'off' | 'id' | 'citekey'): void {
    switch (sort) {
      case 'id':
        this.items.sort((a: any, b: any) => {
          if (typeof a.itemID !== 'number') return 1
          if (typeof b.itemID !== 'number') return -1
          return a.itemID - b.itemID
        })
        break
      case 'citekey':
        this.items.sort((a: any, b: any) => this.sortkey(a).localeCompare(this.sortkey(b)))
        break
    }
  }

  public erase(): void {
    this.items = []
    this.map = {}
    this.current = null
  }

  public cacheable(cacheable: boolean): void {
    for (const item of this.items) {
      item.$cacheable = cacheable
    }
  }

  *[Symbol.iterator](): Generator<CacheableItem, void, unknown> {
    // trace('items: start item delivery')
    for (const item of this.items) {
      yield item
    }
    // trace('items: end item delivery')
  }

  public get regular(): Generator<CacheableRegularItem, void, unknown> {
    return this._regular()
  }

  private *_regular(): Generator<CacheableRegularItem, void, unknown> {
    // trace('items: start item delivery')
    for (const item of this.items) {
      switch (item.itemType) {
        case 'annotation':
        case 'note':
        case 'attachment':
          break

        default:
          yield (this.current = item) as unknown as CacheableRegularItem
      }
    }
    // trace('items: end item delivery')
  }
}

export class Collections {
  public byKey: Record<string, Collection> = {}

  constructor(private items: Items, collections?: Record<string, Collection>) {
    if (collections) {
      this.byKey = collections
    }
    else if (Zotero.nextCollection) {
      let collection: any
      while (collection = Zotero.nextCollection()) {
        this.registerCollection(collection, '')
      }
    }
  }

  public erase(): void {
    this.byKey = {}
  }

  private registerCollection(collection, parent: string) {
    const key = (collection.primary ? collection.primary : collection).key
    if (this.byKey[key]) return // why does JM send collections twice?!

    this.byKey[key] = {
      key,
      parent,
      name: collection.name,
      collections: [],
      items: [],
    }

    for (const child of (collection.descendents || collection.children)) {
      switch (child.type) {
        case 'collection':
          this.byKey[key].collections.push(child.key as string)
          this.registerCollection(child, key)
          break
        case 'item':
          this.byKey[key].items.push(child.id as number)
          break
      }
    }
  }

  public get collectionTree(): NestedCollection[] {
    return Object.values(this.byKey)
      .filter(coll => !coll.parent)
      .map(coll => this.nestedCollection(coll))
  }

  private nestedCollection(collection: Collection): NestedCollection {
    const nested: NestedCollection = {
      key: collection.key,
      name: collection.name,
      items: collection.items.map((itemID: number) => this.items.map[itemID]).filter((item: Item) => item),
      collections: collection.collections
        .map((key: string) => this.nestedCollection(this.byKey[key]))
        .filter((coll: NestedCollection) => coll),
    }

    for (const coll of nested.collections) {
      coll.parent = nested
    }
    return nested
  }
}

export class Input {
  public items: Items
  public collections: Collections

  constructor() {
    this.items = new Items
    this.collections = new Collections(this.items)
  }

  public erase(): void {
    this.items = null
    this.collections = null
  }
}
