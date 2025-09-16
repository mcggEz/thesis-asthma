import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export type LatestReading = {
  ts: number
  spo2: number
  respRate: number
  pm25: number
  wheeze: boolean
  cough: boolean
}

type Risk = { level: 'low' | 'medium' | 'high'; score: number }

// Read from WebSocket URL if provided, else use local mock data generator
export function useSensorStream() {
  const url = (import.meta as any).env?.VITE_SENSOR_WS as string | undefined
  const [connected, setConnected] = useState(false)
  const [latest, setLatest] = useState<LatestReading | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const intervalRef = useRef<number | null>(null)
  const connectedRef = useRef(false)

  const connect = useCallback(() => {
    if (connectedRef.current) return
    if (url) {
      const ws = new WebSocket(url)
      wsRef.current = ws
      ws.onopen = () => { setConnected(true); connectedRef.current = true }
      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data)
          setLatest(normalize(data))
        } catch {}
      }
      ws.onclose = () => { setConnected(false); connectedRef.current = false }
      ws.onerror = () => { setConnected(false); connectedRef.current = false }
    } else {
      // Mock generator at 1Hz
      setConnected(true)
      connectedRef.current = true
      intervalRef.current = window.setInterval(() => {
        const now = Date.now()
        const spo2 = clamp(92 + noise(0, 3), 86, 100)
        const respRate = clamp(18 + noise(0, 5), 10, 40)
        const pm25 = clamp(12 + noise(0, 8), 1, 120)
        const wheeze = Math.random() < 0.05
        const cough = Math.random() < 0.06
        setLatest({ ts: now, spo2, respRate, pm25, wheeze, cough })
      }, 1000)
    }
  }, [url])

  const disconnect = useCallback(() => {
    wsRef.current?.close()
    wsRef.current = null
    if (intervalRef.current) window.clearInterval(intervalRef.current)
    intervalRef.current = null
    setConnected(false)
    connectedRef.current = false
  }, [])

  useEffect(() => {
    connect()
    return () => disconnect()
    // Run once on mount; connect/disconnect are stable and use refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const risk: Risk = useMemo(() => {
    if (!latest) return { level: 'low', score: 0 }
    // Simple meta-classifier: combine spo2, pm25, wheeze/cough
    let score = 0
    score += latest.spo2 < 92 ? 40 : latest.spo2 < 95 ? 20 : 5
    score += latest.pm25 > 75 ? 30 : latest.pm25 > 35 ? 15 : 5
    score += latest.wheeze ? 15 : 0
    score += latest.cough ? 10 : 0
    score = clamp(score, 0, 100)
    const level = score < 33 ? 'low' : score < 66 ? 'medium' : 'high'
    return { level, score }
  }, [latest])

  return { connected, latest, risk, connect, disconnect }
}

function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)) }
function noise(mean: number, stdev: number) { return mean + stdev * gaussianRandom() }
function gaussianRandom() {
  let u = 0, v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}

function normalize(input: any): LatestReading {
  return {
    ts: input.ts ?? Date.now(),
    spo2: Number(input.spo2 ?? input.SpO2 ?? 98),
    respRate: Number(input.respRate ?? input.resp ?? 18),
    pm25: Number(input.pm25 ?? input.PM25 ?? 12),
    wheeze: Boolean(input.wheeze ?? input.w),
    cough: Boolean(input.cough ?? input.c),
  }
}


