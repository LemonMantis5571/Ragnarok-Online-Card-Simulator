import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CardComponent } from './Card'
import { openPack } from '@/lib/api'
import type { CardType } from '@/lib/types'
import { Package, Loader2, AlertCircle, Crown, Sparkles } from 'lucide-react'

interface PackOpeningProps {
  userId?: string
  onPackOpened?: (cards: CardType[]) => void
}

export function PackOpening({ userId, onPackOpened }: PackOpeningProps) {
  const [opening, setOpening] = useState(false)
  const [openedCards, setOpenedCards] = useState<CardType[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showMvpCelebration, setShowMvpCelebration] = useState(false)

  const handleOpenPack = async () => {
    setOpening(true)
    setError(null)
    setOpenedCards([])
    setShowMvpCelebration(false)

    try {
      const result = await openPack(userId, 8)
      setOpenedCards(result.cards)
      onPackOpened?.(result.cards)

      if (result.cards.some(c => c.mvp)) {
        setShowMvpCelebration(true)
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'TOO_MANY_REQUESTS') {
        setError('Too many openings in few minutes. Please take a break!')
      } else {
        setError(err instanceof Error ? err.message : 'Failed to open pack')
      }
    } finally {
      setOpening(false)
    }
  }

  const mvpCount = openedCards.filter(c => c.mvp).length

  return (
    <div className="space-y-6">
      <div className="ro-panel p-6 relative">
        <div className="ro-corner ro-corner-tl"></div>
        <div className="ro-corner ro-corner-tr"></div>
        <div className="ro-corner ro-corner-bl"></div>
        <div className="ro-corner ro-corner-br"></div>

        <div className="text-center space-y-4">
          <Package className="w-20 h-20 mx-auto text-[var(--ro-gold)] opacity-80" />
          <h2 className="text-xl font-bold text-[var(--ro-gold)]">Card Pack</h2>
          <p className="text-muted-foreground text-sm">Contains 8 random cards from the Ragnarok universe!</p>
          <p className="text-xs text-muted-foreground opacity-70" title="MVP drop rate">
            <Crown className="w-3 h-3 inline mr-1" />
            MVP cards: 0.25% chance
          </p>

          {showMvpCelebration && mvpCount > 0 ? (
            <div className="bg-[rgba(139,41,66,0.3)] p-4 sm:p-6 rounded-lg border border-[var(--ro-gold)] animate-pulse shadow-[0_0_20px_rgba(240,196,92,0.3)] mx-auto max-w-sm">
              <div className="flex items-center gap-2 mb-2 justify-center">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--ro-gold)] animate-bounce" />
                <span className="text-lg sm:text-2xl font-bold text-[var(--ro-gold)] drop-shadow-md">
                  MVP FOUND!
                </span>
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--ro-purple)]" />
              </div>
              <p className="text-[var(--ro-text-light)] text-sm sm:text-base opacity-90 mb-4 font-bold">You found {mvpCount} MVP card{mvpCount > 1 ? 's' : ''}!</p>
              <Button onClick={() => setShowMvpCelebration(false)} className="ro-button px-6 sm:px-8">
                Awesome!
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleOpenPack}
              disabled={opening}
              size="lg"
              className="w-full max-w-xs mx-auto"
            >
              {opening ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin text-[var(--ro-blue)]" />
                  Opening...
                </>
              ) : (
                <>
                  <Package className="w-5 h-5 mr-2" />
                  Open Pack
                </>
              )}
            </Button>
          )}

          {error && (
            <div className="text-sm text-[var(--ro-red)] bg-[rgba(139,41,66,0.1)] p-3 rounded border border-[var(--ro-red)]/30 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      </div>

      {openedCards.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 animate-in fade-in zoom-in duration-500">
          {openedCards.map((card, index) => (
            <div
              key={`${card.id}-${index}`}
              style={{ animationDelay: `${index * 100}ms` }}
              className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
            >
              <CardComponent card={card} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
