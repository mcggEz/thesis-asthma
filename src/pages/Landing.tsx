import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <section className="grid gap-10 md:grid-cols-2 items-center">
      <div className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
          Gentle monitoring for children with asthma
        </h1>
        <p className="text-slate-700 text-lg">
          BreathCare turns your ESP32 sensor data into clear, timely insights.
          Parents get reassuring notifications and clinicians get trends.
        </p>
        <div className="flex gap-3">
          <Link to="/signup" className="rounded-md bg-sky-600 px-4 py-2 text-white hover:bg-sky-700">Get Started</Link>
          <Link to="/dashboard" className="rounded-md border border-sky-200 px-4 py-2 text-sky-700 hover:bg-sky-50">View Demo</Link>
        </div>
        <ul className="mt-4 grid gap-2 text-sm text-slate-600">
          <li>• Real-time wheeze and cough detection</li>
          <li>• SpO₂ and respiration trends</li>
          <li>• Air quality and trigger alerts</li>
        </ul>
      </div>
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="h-64 bg-gradient-to-br from-sky-100 to-rose-50 rounded-xl grid place-items-center text-slate-600">
          Caring medicine-inspired design to keep families informed
        </div>
      </div>
    </section>
  )
}


