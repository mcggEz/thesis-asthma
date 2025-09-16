import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type User = { id: string; name: string; email: string }

type AuthContextValue = {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (input: { name: string; email: string; password: string }) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const cached = window.localStorage.getItem('bc_user')
    if (cached) setUser(JSON.parse(cached))
  }, [])

  useEffect(() => {
    if (user) window.localStorage.setItem('bc_user', JSON.stringify(user))
    else window.localStorage.removeItem('bc_user')
  }, [user])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    async signIn(email, _password) {
      // Fake auth: accept any email/password
      const next = { id: 'u1', name: email.split('@')[0] || 'Parent', email }
      setUser(next)
    },
    async signUp({ name, email }) {
      const next = { id: 'u1', name: name || 'Parent', email }
      setUser(next)
    },
    signOut() {
      setUser(null)
      if (typeof window !== 'undefined') {
        window.location.assign('/')
      }
    },
  }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


