import { useState, useEffect } from 'react'
import { AlbumPage } from './pages/AlbumPage'
import { PackPage } from './pages/PackPage'
import { GeneratePage } from './pages/GeneratePage'
import { Button } from './components/ui/button'
import { BookOpen, Gift, Sparkles, User, LogOut, ChevronRight } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './components/ui/dialog'

type Page = 'album' | 'pack' | 'generate'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('album')
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('ragnarok_userId'))
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [tempId, setTempId] = useState('')

  useEffect(() => {
    if (!userId) {
      setIsLoginOpen(true)
    }
  }, [userId])

  const handleGuestLogin = () => {
    const newId = `guest_${Math.floor(Math.random() * 1000000)}`
    login(newId)
  }

  const handleDemoLogin = () => {
    if (tempId.trim()) {
      login(tempId.trim())
    }
  }

  const login = (id: string) => {
    localStorage.setItem('ragnarok_userId', id)
    setUserId(id)
    setIsLoginOpen(false)
  }

  const logout = () => {
    localStorage.removeItem('ragnarok_userId')
    setUserId(null)
    setIsLoginOpen(true)
  }

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-[100] sm:mx-4 mt-2 sm:mt-4 mb-6 ro-navbar">
        <div className="ro-corner ro-corner-tl"></div>
        <div className="ro-corner ro-corner-tr"></div>
        <div className="ro-corner ro-corner-bl"></div>
        <div className="ro-corner ro-corner-br"></div>

        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
              <h1 className="text-lg sm:text-2xl font-bold ro-title whitespace-nowrap">Card Album Simulator</h1>
              {userId && (
                <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-[var(--ro-gold-dark)]/30 scale-90 sm:scale-100">
                  <User className="w-3 h-3 text-[var(--ro-gold)]" />
                  <span className="text-[10px] font-mono text-[var(--ro-gold)] uppercase tracking-tighter max-w-[120px] sm:max-w-none truncate">Account: {userId}</span>
                  <button onClick={logout} title="Sign Out">
                    <LogOut className="w-3 h-3 text-[var(--ro-red)] hover:scale-110 transition-transform" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              <Button
                variant={currentPage === 'album' ? 'default' : 'ghost'}
                className={`flex items-center gap-2 px-3 sm:px-4 ${currentPage === 'album' ? 'ro-button' : 'ro-button-ghost'}`}
                onClick={() => setCurrentPage('album')}
              >
                <BookOpen className={`w-4 h-4 ${currentPage === 'album' ? '' : 'text-[var(--ro-blue)]'}`} />
                <span className="sm:inline">Album</span>
              </Button>
              <Button
                variant={currentPage === 'pack' ? 'default' : 'ghost'}
                className={`flex items-center gap-2 px-3 sm:px-4 ${currentPage === 'pack' ? 'ro-button' : 'ro-button-ghost'}`}
                onClick={() => setCurrentPage('pack')}
              >
                <Gift className={`w-4 h-4 ${currentPage === 'pack' ? '' : 'text-[var(--ro-red)]'}`} />
                <span className="sm:inline">Pack</span>
              </Button>
              <Button
                variant={currentPage === 'generate' ? 'default' : 'ghost'}
                className={`flex items-center gap-2 px-3 sm:px-4 ${currentPage === 'generate' ? 'ro-button' : 'ro-button-ghost'}`}
                onClick={() => setCurrentPage('generate')}
              >
                <Sparkles className={`w-4 h-4 ${currentPage === 'generate' ? '' : 'text-[var(--ro-purple)]'}`} />
                <span className="sm:inline">Generate</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4">
        {userId && (
          <>
            {currentPage === 'album' && <AlbumPage userId={userId} />}
            {currentPage === 'pack' && <PackPage userId={userId} />}
            {currentPage === 'generate' && <GeneratePage userId={userId} />}
          </>
        )}
      </main>

      <footer className="mt-12 py-6">
        <div className="ro-divider max-w-md mx-auto"></div>
        <div className="text-center text-sm text-muted-foreground mt-4">
          <p className="ro-title text-xs">Ragnarok Online Card Album Simulator</p>
          <p className="mt-2 opacity-50">Card images from Divine Pride</p>
        </div>
      </footer>

      {/* Login Modal */}
      <Dialog open={isLoginOpen} onOpenChange={(open) => { if (userId) setIsLoginOpen(open) }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Venture into the World</DialogTitle>
            <DialogDescription className="text-center">
              Choose your identity to start collecting cards.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-[var(--ro-gold)] tracking-widest">Guest Access</label>
              <Button onClick={handleGuestLogin} className="w-full ro-button py-6 text-lg group">
                Enter as Guest
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="ro-divider flex items-center justify-center">
              <span className="bg-[#1a1410] px-4 text-[10px] text-muted-foreground uppercase font-bold font-mono">OR</span>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-[var(--ro-gold)] tracking-widest">Demo Login</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter User ID..."
                  className="flex-1 bg-black/40 border border-[var(--ro-gold-dark)]/50 rounded px-4 py-2 text-[var(--ro-text-light)] focus:outline-none focus:border-[var(--ro-gold)] transition-colors font-mono text-sm"
                  value={tempId}
                  onChange={(e) => setTempId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleDemoLogin()}
                />
                <Button onClick={handleDemoLogin} className="ro-button-ghost border border-[var(--ro-gold-dark)] h-auto px-4">
                  Go
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App
