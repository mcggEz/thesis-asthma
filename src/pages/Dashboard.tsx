import { useEffect, useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAuth } from '../services/auth/AuthContext'
import { useSensorStream } from '../services/data/useSensorStream'

type Sample = { t: number; spo2: number; respRate: number; pm25: number }

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { latest, risk, connected, connect, disconnect } = useSensorStream()
  const [history, setHistory] = useState<Sample[]>([])

  useEffect(() => {
    if (!latest) return
    setHistory((prev) => {
      const next = [...prev, { t: latest.ts, spo2: latest.spo2, respRate: latest.respRate, pm25: latest.pm25 }]
      return next.slice(-120)
    })
  }, [latest])

  const statusColor = connected ? 'text-emerald-700' : 'text-rose-700'

  const chartData = useMemo(() => history.map(h => ({
    name: new Date(h.t).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
    SpO2: h.spo2,
    Resp: h.respRate,
    PM25: h.pm25,
  })), [history])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Hello!</h2>
          <p className={"text-sm " + statusColor}>{connected ? 'Live data connected' : 'Disconnected'}{latest ? ` — updated ${new Date(latest.ts).toLocaleTimeString()}` : ''}</p>
        </div>
        <div className="flex gap-2 self-start md:self-auto">
          <button onClick={connected? disconnect : connect} className="rounded-md border px-3 py-2 text-slate-700 hover:bg-slate-50">{connected? 'Disconnect' : 'Connect'}</button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Overall Risk" value={risk.score.toFixed(0) + '%'} subtitle={risk.level.toUpperCase()} icon="❤️" />
        <Card title="SpO₂" value={latest ? `${latest.spo2}%` : '—'} subtitle="pulse oximeter" icon="🫀" />
        <Card title="Respiration" value={latest ? `${latest.respRate} bpm` : '—'} subtitle="breaths/min" icon="🫁" />
        <Card title="PM2.5" value={latest ? `${latest.pm25} µg/m³` : '—'} subtitle="air quality" icon="🌫️" />
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h3 className="font-medium mb-3">Trends</h3>
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" hide/>
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="SpO2" stroke="#0284c7" fillOpacity={1} fill="url(#g1)" />
              <Area type="monotone" dataKey="Resp" stroke="#38bdf8" fillOpacity={0.3} />
              <Area type="monotone" dataKey="PM25" stroke="#ef4444" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function Card({ title, value, subtitle, icon }: { title: string; value: string; subtitle?: string; icon?: string }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
    </div>
  )
}


