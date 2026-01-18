import { useEffect, useState } from 'react'
import { CardGrid } from '@/components/CardGrid'
import { Button } from '@/components/ui/button'
import { getAllCards, getCollection } from '@/lib/api'
import type { CardType, Collection } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { CardComponent } from '@/components/Card'
import { RefreshCw, AlertTriangle, Inbox, Crown, SortAsc, SortDesc, Sparkles } from 'lucide-react'

interface AlbumPageProps {
  userId: string
}

type SortOption = 'name' | 'mvp-first' | 'mvp-last' | 'id'

export function AlbumPage({ userId }: AlbumPageProps) {
  const [allCards, setAllCards] = useState<CardType[]>([])
  const [collection, setCollection] = useState<Collection | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('mvp-first')

  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [cards, userCollection] = await Promise.all([
        getAllCards(),
        getCollection(userId).catch(() => null),
      ])
      setAllCards(cards)
      setCollection(userCollection)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleCardClick = (card: CardType) => {
    setSelectedCard(card)
  }

  const sortCards = (cards: CardType[]): CardType[] => {
    const sorted = [...cards]
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case 'mvp-first':
        return sorted.sort((a, b) => {
          if (a.mvp && !b.mvp) return -1
          if (!a.mvp && b.mvp) return 1
          return a.name.localeCompare(b.name)
        })
      case 'mvp-last':
        return sorted.sort((a, b) => {
          if (a.mvp && !b.mvp) return 1
          if (!a.mvp && b.mvp) return -1
          return a.name.localeCompare(b.name)
        })
      case 'id':
        return sorted.sort((a, b) => a.id - b.id)
      default:
        return sorted
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="ro-panel inline-block px-8 py-6">
          <div className="ro-corner ro-corner-tl"></div>
          <div className="ro-corner ro-corner-tr"></div>
          <div className="ro-corner ro-corner-bl"></div>
          <div className="ro-corner ro-corner-br"></div>
          <div className="text-[var(--ro-gold)] animate-pulse flex items-center gap-3">
            <RefreshCw className="w-5 h-5 animate-spin" />
            Loading cards...
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="ro-panel p-6 max-w-md mx-auto relative">
          <div className="ro-corner ro-corner-tl"></div>
          <div className="ro-corner ro-corner-tr"></div>
          <div className="ro-corner ro-corner-bl"></div>
          <div className="ro-corner ro-corner-br"></div>
          <div className="text-[var(--ro-red)] mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
          <Button onClick={loadData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const collectedCards = allCards.filter(card => {
    if (!collection) return false
    return collection.entries.some(e => e.cardId === card.id)
  })

  const sortedCards = sortCards(collectedCards)
  const mvpCount = collectedCards.filter(c => c.mvp).length

  const completion = allCards.length > 0
    ? Math.round((collectedCards.length / allCards.length) * 100)
    : 0

  return (
    <div className="p-4 space-y-6">
      <div className="ro-panel p-6 relative">
        <div className="ro-corner ro-corner-tl"></div>
        <div className="ro-corner ro-corner-tr"></div>
        <div className="ro-corner ro-corner-bl"></div>
        <div className="ro-corner ro-corner-br"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <h1 className="text-xl sm:text-3xl font-bold ro-title mb-2">Card Album</h1>
            <div className="grid grid-cols-2 sm:flex sm:flex-row items-center gap-2 sm:gap-4 text-[10px] sm:text-sm text-muted-foreground">
              <span className="flex items-center gap-1 bg-[rgba(255,255,255,0.05)] px-2 py-1.5 rounded border border-white/5">
                <Inbox className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--ro-silver)]" />
                <span className="text-[var(--ro-text-light)] truncate">{collection?.totalCards || 0} cards</span>
              </span>
              <span className="flex items-center gap-1 bg-[rgba(255,255,255,0.05)] px-2 py-1.5 rounded border border-white/5">
                <span className="text-xs sm:text-lg">🎴</span>
                <span className="text-[var(--ro-text-light)] truncate">{collectedCards.length} unique</span>
              </span>
              <span className="flex items-center gap-1 bg-[rgba(212,164,76,0.1)] px-2 py-1.5 rounded border border-[var(--ro-gold-dark)]/30">
                <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--ro-gold)]" />
                <span className="text-[var(--ro-gold)] font-bold truncate">{mvpCount} MVP</span>
              </span>
              <span className="flex items-center gap-1 bg-[rgba(59,130,246,0.1)] px-2 py-1.5 rounded border border-[var(--ro-blue)]/30 col-span-2 sm:col-span-1">
                <span className="text-[var(--ro-blue)] font-bold truncate">{completion}% Completion</span>
              </span>
            </div>
          </div>
          <div className="flex justify-start sm:justify-end gap-2">
            <Button onClick={loadData} variant="outline" size="sm" className="ro-button-ghost bg-black/20">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <div className="ro-progress h-4">
            <div
              className="ro-progress-bar h-full"
              style={{ width: `${completion}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-2">
            <span className="text-[var(--ro-blue)] font-bold uppercase tracking-wider">Base EXP</span>
            <span className="text-[var(--ro-text-light)] font-mono">{collectedCards.length} / {allCards.length}</span>
          </div>
        </div>
      </div>

      {collectedCards.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <SortAsc className="w-4 h-4" />
            Sort by:
          </span>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={sortBy === 'mvp-first' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('mvp-first')}
            >
              <Crown className="w-3 h-3 mr-1" />
              MVP First
            </Button>
            <Button
              variant={sortBy === 'mvp-last' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('mvp-last')}
            >
              <SortDesc className="w-3 h-3 mr-1" />
              MVP Last
            </Button>
            <Button
              variant={sortBy === 'name' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('name')}
            >
              A-Z
            </Button>
            <Button
              variant={sortBy === 'id' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('id')}
            >
              ID
            </Button>
          </div>
        </div>
      )}

      {collectedCards.length === 0 ? (
        <div className="ro-panel p-12 text-center relative">
          <div className="ro-corner ro-corner-tl"></div>
          <div className="ro-corner ro-corner-tr"></div>
          <div className="ro-corner ro-corner-bl"></div>
          <div className="ro-corner ro-corner-br"></div>
          <Inbox className="w-16 h-16 mx-auto mb-4 text-[var(--ro-gold)] opacity-50" />
          <p className="text-[var(--ro-gold)] text-lg mb-2">Your album is empty!</p>
          <p className="text-muted-foreground">
            Open some packs or generate cards to start your collection!
          </p>
        </div>
      ) : (
        <CardGrid
          cards={sortedCards}
          collection={collection || undefined}
          onCardClick={handleCardClick}
        />
      )}

      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        {selectedCard && (
          <DialogContent className="ro-panel border-0 max-w-md">
            <DialogHeader>
              <DialogTitle className="ro-title text-xl flex items-center gap-2">
                {selectedCard.mvp && <Crown className="w-5 h-5 text-[var(--ro-gold)]" />}
                {selectedCard.name}
              </DialogTitle>
              <DialogDescription>
                {selectedCard.mvp && (
                  <span className="text-[var(--ro-gold)] flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    MVP Card
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="max-w-xs mx-auto">
              <CardComponent card={selectedCard} />
            </div>
            <div className="mt-4 p-4 bg-[var(--ro-brown-dark)] rounded border border-[var(--ro-gold-dark)]">
              <p className="text-sm text-[var(--ro-parchment)] whitespace-pre-line leading-relaxed">
                {selectedCard.Description}
              </p>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
