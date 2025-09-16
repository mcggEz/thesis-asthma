import type { FormEvent } from 'react'
import { useState } from 'react'
import { useAuth } from '../services/auth/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch (err: unknown) {
      setError((err as Error).message)
    }
  }

  return (
    <div>
    <div className="mx-auto grid min-h-[70vh] max-w-sm content-center">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Welcome back</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full rounded-md border px-3 py-2" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full rounded-md border px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        {error && <p className="text-rose-600 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button className="flex-1 rounded-md bg-sky-600 px-4 py-2 text-white hover:bg-sky-700">Login</button>
          <Link to="/dashboard" className="flex-1 rounded-md border border-sky-200 px-4 py-2 text-center text-sky-700 hover:bg-sky-50">View Demo</Link>
        </div>
      </form>
      <p className="mt-3 text-sm text-slate-600">No account? <Link to="/signup" className="text-sky-700">Sign up</Link></p>
      </div>
    </div>
    </div>
  )
}


