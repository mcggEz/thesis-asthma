import { Outlet, Link, useLocation } from 'react-router-dom'

function App() {
  const location = useLocation()

  return (
    <div className="min-h-dvh bg-gradient-to-b from-sky-50 to-white text-slate-800">
      <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-block h-8 w-8 rounded-full bg-sky-600 text-white grid place-items-center">BC</span>
            <span className="font-semibold text-slate-900">BreathCare</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/" className={location.pathname==='/'? 'text-sky-700 font-medium' : 'text-slate-600'}>Home</Link>
            <Link to="/dashboard" className={location.pathname.startsWith('/dashboard')? 'text-sky-700 font-medium' : 'text-slate-600'}>Dashboard</Link>
            <Link to="/login" className="rounded-md bg-sky-600 px-3 py-1.5 text-white hover:bg-sky-700">Login</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
      <footer className="mt-10 border-t py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} BreathCare. Caring tech for easier breathing.
      </footer>
    </div>
  )
}

export default App
