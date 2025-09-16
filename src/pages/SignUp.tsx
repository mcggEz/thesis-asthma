import { FormEvent, useState } from 'react'
import { useAuth } from '../services/auth/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function SignUp() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await signUp({ name, email, password })
      navigate('/dashboard')
    } catch (err: unknown) {
      setError((err as Error).message)
    }
  }

  return (
    <div>
    <div className="mx-auto grid min-h-[70vh] max-w-sm content-center">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Create your account</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full rounded-md border px-3 py-2" placeholder="Child / Family Name" value={name} onChange={(e)=>setName(e.target.value)} />
        <input className="w-full rounded-md border px-3 py-2" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full rounded-md border px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        {error && <p className="text-rose-600 text-sm">{error}</p>}
        <button className="w-full rounded-md bg-sky-600 px-4 py-2 text-white hover:bg-sky-700">Create account</button>
      </form>
      <p className="mt-3 text-sm text-slate-600">Have an account? <Link to="/login" className="text-sky-700">Log in</Link></p>
      </div>
    </div>
    </div>
  )
}


