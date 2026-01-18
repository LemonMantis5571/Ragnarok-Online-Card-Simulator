export type CardType = {
  id: number
  AegisName: string
  name: string
  type: string
  mvp?: boolean
  Description: string
}

export interface CollectionEntry {
  cardId: number
  quantity: number
}

export interface Collection {
  userId: string
  entries: CollectionEntry[]
  totalCards: number
}
