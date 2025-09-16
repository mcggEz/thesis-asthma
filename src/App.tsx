import { Outlet, Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from './services/auth/AuthContext'
import Footer from './components/Footer'

function App() {
  const location = useLocation()
  const { user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [notify, setNotify] = useState<boolean>(() => {
    const saved = window.localStorage.getItem('bc_notify')
    return saved ? saved === '1' : true
  })
  useEffect(() => {
    window.localStorage.setItem('bc_notify', notify ? '1' : '0')
  }, [notify])

  return (
    <div className="relative min-h-dvh bg-gradient-to-b from-sky-50 to-white text-slate-800">
      {/* full-page breathing background on all pages */}
      <div className="breath-bg">
        <div className="breath-blob left-[-10%] top-[10%] h-96 w-96 bg-sky-300/30"></div>
        <div className="breath-blob right-[-10%] bottom-[5%] h-[28rem] w-[28rem] bg-rose-300/30 animation-delay-3000"></div>
      </div>
      <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-block h-8 w-8 rounded-full bg-sky-600 text-white grid place-items-center">BC</span>
            <span className="font-semibold text-slate-900">BreathCare</span>
          </Link>
          <nav className="relative flex items-center gap-4 text-sm">
            {location.pathname.startsWith('/dashboard') ? (
              <div className="relative">
                <button onClick={()=>setMenuOpen(v=>!v)} className="flex items-center gap-2 rounded-full border px-2 py-1 hover:bg-slate-50">
                  <span className="inline-grid h-7 w-7 place-items-center rounded-full bg-sky-600 text-white">
                    {(user?.name?.[0] ?? 'U').toUpperCase()}
                  </span>
                  <span className="hidden sm:inline text-slate-700">{user?.name ?? 'Account'}</span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md border bg-white p-2 shadow-md">
                    <div className="flex items-center justify-between gap-3 rounded px-3 py-2 text-slate-700">
                      <span className="text-sm">Notify me</span>
                      <button
                        aria-label="Toggle notifications"
                        onClick={()=>setNotify(v=>!v)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notify? 'bg-sky-600' : 'bg-slate-300'}`}
                      >
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${notify? 'translate-x-5' : 'translate-x-1'}`}></span>
                      </button>
                    </div>
                    <button onClick={()=>{ setMenuOpen(false); signOut() }} className="mt-1 w-full rounded px-3 py-2 text-left text-slate-700 hover:bg-slate-50">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/" className={location.pathname==='/'? 'text-sky-700 font-medium' : 'text-slate-600'}>Home</Link>
                <Link to="/login" className="rounded-md bg-sky-600 px-3 py-1.5 text-white hover:bg-sky-700">Login</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
      {!location.pathname.startsWith('/dashboard') && <Footer />}
    </div>
  )
}

export default App
