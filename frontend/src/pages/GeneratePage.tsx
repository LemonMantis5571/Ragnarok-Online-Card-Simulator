import { CardGenerator } from '@/components/CardGenerator'
import { getCollection } from '@/lib/api'
import type { Collection } from '@/lib/types'
import { useEffect, useState } from 'react'
import { Package } from 'lucide-react'

interface GeneratePageProps {
  userId: string
}

export function GeneratePage({ userId }: GeneratePageProps) {
  const [collection, setCollection] = useState<Collection | null>(null)

  useEffect(() => {
    loadCollection()
  }, [userId])

  const loadCollection = async () => {
    try {
      const userCollection = await getCollection(userId)
      setCollection(userCollection)
    } catch {
      // Collection might not exist yet
    }
  }

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold ro-title mb-2">Generate Cards</h1>
        <p className="text-muted-foreground">Summon a random card!</p>
      </div>

      <CardGenerator userId={userId} onCardGenerated={loadCollection} />

      {collection && (
        <div className="ro-panel p-4 relative">
          <div className="ro-corner ro-corner-tl"></div>
          <div className="ro-corner ro-corner-tr"></div>
          <div className="ro-corner ro-corner-bl"></div>
          <div className="ro-corner ro-corner-br"></div>
          <div className="flex items-center justify-center gap-3 text-[var(--ro-gold)]">
            <Package className="w-5 h-5" />
            <span>Total cards:</span>
            <span className="text-xl font-bold">{collection.totalCards}</span>
          </div>
        </div>
      )}
    </div>
  )
}
