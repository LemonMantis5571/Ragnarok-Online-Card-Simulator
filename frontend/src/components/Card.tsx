import { type CardType } from '@/lib/types'
import { Crown } from 'lucide-react'
import { useState, useRef } from 'react'

interface CardComponentProps {
  card: CardType
  quantity?: number
  onClick?: () => void
}

export function CardComponent({ card, quantity, onClick }: CardComponentProps) {
  const isMVP = card.mvp
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (!isMVP || !cardRef.current || isTouch) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (centerY - y) / 12
    const rotateY = (x - centerX) / 12

    setRotate({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 })
  }

  return (
    <div
      ref={cardRef}
      className={`relative cursor-pointer group rounded-lg overflow-hidden transition-all duration-200 bg-[var(--ro-brown-dark)] shadow-2xl ${isMVP ? 'mvp-3d' : 'border border-[var(--ro-silver)]/30 hover:border-[var(--ro-silver)] hover:scale-105 hover:shadow-[0_0_15px_rgba(203,213,225,0.2)]'
        }`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={isMVP ? {
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.05, 1.05, 1.05)`,
        transition: rotate.x === 0 ? 'all 0.5s ease-out' : 'none'
      } : undefined}
      title={isMVP ? 'MVP Card - 0.25% drop rate' : card.name}
    >
      {/* Full size image section */}
      <div className="relative aspect-[3/4.2] overflow-hidden bg-black">
        <img
          src={`https://static.divine-pride.net/images/items/cards/${card.id}.png`}
          alt={card.name}
          className="w-full h-full object-fill relative z-10"
          style={isMVP ? {
            transform: `translateZ(20px) scale(0.95)`,
          } : undefined}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            e.currentTarget.nextElementSibling?.classList.remove('hidden')
          }}
        />
        <div className="hidden absolute inset-0 flex items-center justify-center bg-zinc-900 text-5xl">🎴</div>

        {/* Advanced Holographic/3D Shine Layer */}
        {isMVP && (
          <>
            <div
              className="mvp-holo-shine absolute inset-0 pointer-events-none z-20"
              style={{
                backgroundPosition: `${50 + rotate.y * 2}% ${50 - rotate.x * 2}%`,
                filter: `brightness(${1.2 + Math.abs(rotate.x + rotate.y) / 20}) contrast(1.2)`
              }}
            ></div>
            <div className="mvp-glitter absolute inset-0 pointer-events-none z-21 opacity-0 group-hover:opacity-40 transition-opacity"></div>
          </>
        )}

        {/* Title Overlay */}
        <div
          className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent z-30 opacity-0 group-hover:opacity-100 transition-opacity"
          style={isMVP ? { transform: 'translateZ(40px)' } : undefined}
        >
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-bold font-[Cinzel] ${isMVP ? 'text-[var(--ro-gold)]' : 'text-[var(--ro-silver)]'}`}>{card.name}</h3>
            {isMVP && <Crown className="w-4 h-4 text-[var(--ro-gold)]" />}
          </div>
        </div>

        {/* MVP Badge */}
        {isMVP && (
          <div
            className="absolute bottom-2 right-2 z-30 bg-gradient-to-r from-[var(--ro-gold)] to-[var(--ro-gold-dark)] text-[var(--ro-brown-dark)] text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-lg border border-white/20"
            style={{ transform: 'translateZ(30px)' }}
          >
            <Crown className="w-3 h-3" />
            <span>MVP</span>
          </div>
        )}

        {/* Normal Rarity Accent */}
        {!isMVP && (
          <div className="absolute top-2 left-2 z-30 opacity-40 group-hover:opacity-100 transition-opacity">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--ro-silver)] shadow-[0_0_5px_var(--ro-silver)]"></div>
          </div>
        )}
      </div>

      {/* Description section */}
      <div
        className="p-2 bg-[var(--ro-brown-dark)] relative z-40"
        style={isMVP ? { transform: 'translateZ(10px)' } : undefined}
      >
        <div className={`border p-2 rounded-sm bg-black/40 shadow-inner transition-colors ${isMVP ? 'border-[var(--ro-gold-dark)] group-hover:border-[var(--ro-gold)]' : 'border-[var(--ro-silver)]/20 group-hover:border-[var(--ro-silver)]/50'
          }`}>
          <p className={`text-[10px] leading-tight line-clamp-2 italic ${isMVP ? 'text-[var(--ro-parchment)]' : 'text-[var(--ro-silver)]/80'}`}>
            {card.Description}
          </p>
        </div>

        {quantity !== undefined && quantity > 0 && (
          <div className="mt-1 flex items-center justify-between px-1">
            <span className={`text-[9px] opacity-50 font-bold ${isMVP ? 'text-[var(--ro-gold)]' : 'text-[var(--ro-silver)]'}`}>COLLECTION</span>
            <span className={`text-xs font-bold font-[Cinzel] ${isMVP ? 'text-[var(--ro-gold)]' : 'text-[var(--ro-text-light)]'}`}>x{quantity}</span>
          </div>
        )}
      </div>

      {/* Frame border */}
      <div className={`absolute inset-0 rounded-lg border-2 pointer-events-none z-50 transition-colors ${isMVP ? 'border-[var(--ro-gold)]' : 'border-[var(--ro-silver)]/10 group-hover:border-[var(--ro-silver)]/30'
        }`}></div>
    </div>
  )
}
