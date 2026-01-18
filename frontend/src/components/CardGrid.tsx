import type { CardType } from '@/lib/types'
import { CardComponent } from './Card'
import { type Collection } from '@/lib/types'

interface CardGridProps {
  cards: CardType[]
  collection?: Collection
  onCardClick?: (card: CardType) => void
}

export function CardGrid({ cards, collection, onCardClick }: CardGridProps) {
  const getQuantity = (cardId: number): number => {
    if (!collection) return 0
    const entry = collection.entries.find(e => e.cardId === cardId)
    return entry?.quantity || 0
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((card) => (
        <CardComponent
          key={card.id}
          card={card}
          quantity={getQuantity(card.id)}
          onClick={() => onCardClick?.(card)}
        />
      ))}
    </div>
  )
}
