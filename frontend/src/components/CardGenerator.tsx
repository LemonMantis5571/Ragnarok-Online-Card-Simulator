import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CardComponent } from './Card'
import { generateCard } from '@/lib/api'
import type { CardType } from '@/lib/types'
import { Wand2, Loader2, AlertCircle, Crown, Sparkles } from 'lucide-react'

interface CardGeneratorProps {
  userId?: string
  onCardGenerated?: (card: CardType) => void
}

export function CardGenerator({ userId, onCardGenerated }: CardGeneratorProps) {
  const [generating, setGenerating] = useState(false)
  const [generatedCard, setGeneratedCard] = useState<CardType | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setGenerating(true)
    setError(null)
    try {
      const card = await generateCard(userId)
      setGeneratedCard(card)
      onCardGenerated?.(card)
    } catch (err) {
      if (err instanceof Error && err.message === 'TOO_MANY_REQUESTS') {
        setError('Too many requests in few minutes. Please take a break!')
      } else {
        setError(err instanceof Error ? err.message : 'Failed to generate card')
      }
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="ro-panel p-4 sm:p-6 relative max-w-xl mx-auto">
        <div className="ro-corner ro-corner-tl"></div>
        <div className="ro-corner ro-corner-tr"></div>
        <div className="ro-corner ro-corner-bl"></div>
        <div className="ro-corner ro-corner-br"></div>

        <div className="text-center space-y-4">
          <Wand2 className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-[var(--ro-gold)] opacity-80" />
          <h2 className="text-lg sm:text-xl font-bold text-[var(--ro-gold)]">Card Generator</h2>
          <p className="text-muted-foreground text-xs sm:text-sm px-4">Summon a random card from the depths of the void!</p>
          <p className="text-[10px] text-muted-foreground opacity-70" title="MVP drop rate">
            <Crown className="w-3 h-3 inline mr-1" />
            MVP cards: 0.25% chance
          </p>

          <Button
            onClick={handleGenerate}
            disabled={generating}
            size="lg"
            className="w-full max-w-xs mx-auto"
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-2" />
                Generate
              </>
            )}
          </Button>

          {error && (
            <div className="text-sm text-[var(--ro-red)] bg-[rgba(139,41,66,0.2)] p-3 rounded border border-[var(--ro-red)] flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      </div>

      {generatedCard && (
        <div className="space-y-4">
          <div className="ro-divider"></div>
          <div className="flex items-center justify-center gap-3">
            <h3 className="text-lg font-bold ro-title">Generated Card</h3>
            {generatedCard.mvp && (
              <span className="text-[var(--ro-gold)] animate-pulse flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                MVP!
              </span>
            )}
          </div>
          <div className="max-w-xs mx-auto animate-[cardReveal_0.5s_ease-out_forwards]">
            <CardComponent card={generatedCard} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(30px) rotateY(90deg); }
          to { opacity: 1; transform: translateY(0) rotateY(0deg); }
        }
      `}</style>
    </div>
  )
}
