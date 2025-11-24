import React from 'react'

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-50">
      <div className="max-w-3xl px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold mb-4">
          Sentient Partners
        </h1>
        <p className="text-lg md:text-xl text-slate-300 mb-8">
          AI, Automations & Always-On Revenue
        </p>
        <p className="text-sm md:text-base text-slate-400 mb-8">
          If you see this screen, your Vite + React + GitHub Pages wiring is working.
          Next step is to plug in your real Sentient Partners UI.
        </p>
        <a
          href="https://cal.com/sentient-partners/meeting"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium transition"
        >
          Book a Discovery Call
        </a>
      </div>
    </div>
  )
}

export default App
