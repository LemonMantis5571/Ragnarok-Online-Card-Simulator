import type { CardType, Collection } from './types'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8089/api'

export interface PackResponse {
  cards: CardType[]
  count: number
}

export type { CardType, Collection }

async function handleResponse(response: Response, errorMessage: string) {
  if (response.status === 429) {
    throw new Error('TOO_MANY_REQUESTS')
  }
  if (!response.ok) {
    throw new Error(errorMessage)
  }
  return response.json()
}

export async function getAllCards(): Promise<CardType[]> {
  const response = await fetch(`${API_BASE}/cards`)
  return handleResponse(response, 'Failed to fetch cards')
}

export async function openPack(userId?: string, cardsPerPack: number = 8): Promise<PackResponse> {
  const response = await fetch(`${API_BASE}/packs/open`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, cardsPerPack }),
  })
  return handleResponse(response, 'Failed to open pack')
}

export async function generateCard(userId?: string): Promise<CardType> {
  const response = await fetch(`${API_BASE}/cards/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  })
  return handleResponse(response, 'Failed to generate card')
}

export async function getCollection(userId: string): Promise<Collection> {
  const response = await fetch(`${API_BASE}/collection/${userId}`)
  return handleResponse(response, 'Failed to fetch collection')
}

export async function addToCollection(userId: string, cards: CardType[]): Promise<void> {
  const response = await fetch(`${API_BASE}/collection/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cards }),
  })
  if (response.status === 429) throw new Error('TOO_MANY_REQUESTS')
  if (!response.ok) throw new Error('Failed to add cards to collection')
}
