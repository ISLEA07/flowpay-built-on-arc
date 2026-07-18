import { useWallet } from '../lib/WalletContext'

export default function Hero() {
  const { address, connect, connecting } = useWallet()

  return (
    <section id="top" className="relative overflow-hidden bg-grid-fade pb-20 pt-16 sm:pt-24">
      <div className="container-shell relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="pill mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-flow-teal animate-pulseSoft" />
              Built on Arc · Testnet Live
            </div>

            <h1 className="max-w-xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-mist-50 sm:text-5xl">
              Programmable payments,<span className="flow-text"> built on Arc.</span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-mist-300 sm:text-lg">
              FlowPay sends onchain payments with an attached note, straight from your wallet to
              any address — settled on Arc Testnet, verifiable on the explorer, no intermediaries.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {!address && (
                <button onClick={() => connect()} disabled={connecting} className="btn-primary">
                  {connecting ? 'Connecting…' : 'Connect Wallet'}
                </button>
              )}
              <a href="#dashboard" className="btn-secondary">
                Open Dashboard
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-mist-400">
              <div>
                <span className="font-mono text-mist-200">5042002</span> chain ID
              </div>
              <div className="h-3 w-px bg-ink-600" />
              <div>
                <span className="font-mono text-mist-200">USDC</span> native currency
              </div>
              <div className="h-3 w-px bg-ink-600" />
              <div>No custody. No backend.</div>
            </div>
          </div>

          {/* Signature: a live "flow" ribbon — payments moving from a sender
              node to a receiver node, rendered as an animated gradient path. */}
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-0 rounded-full bg-flow-gradient-soft blur-3xl" />
            <svg viewBox="0 0 400 400" className="relative h-full w-full">
              <defs>
                <linearGradient id="flowline" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#34E7C4" />
                  <stop offset="100%" stopColor="#3E86F5" />
                </linearGradient>
              </defs>

              {[0, 1, 2].map((i) => (
                <path
                  key={i}
                  d="M60 300 C 140 300, 140 100, 220 100 S 340 100, 340 100"
                  fill="none"
                  stroke="url(#flowline)"
                  strokeWidth={2.5 - i * 0.5}
                  strokeLinecap="round"
                  opacity={0.85 - i * 0.25}
                  transform={`translate(0, ${i * 22 - 22})`}
                />
              ))}

              <circle cx="60" cy="278" r="7" fill="#34E7C4" />
              <circle cx="340" cy="78" r="7" fill="#3E86F5" />

              <circle r="4.5" fill="#F5F7FA">
                <animateMotion
                  dur="3.4s"
                  repeatCount="indefinite"
                  path="M60 300 C 140 300, 140 100, 220 100 S 340 100, 340 100"
                />
              </circle>
              <circle r="4.5" fill="#F5F7FA" opacity="0.6">
                <animateMotion
                  dur="3.4s"
                  repeatCount="indefinite"
                  begin="1.1s"
                  path="M60 300 C 140 300, 140 100, 220 100 S 340 100, 340 100"
                />
              </circle>

              <text x="30" y="330" fill="#8A93A6" fontSize="11" fontFamily="IBM Plex Mono, monospace">
                sender
              </text>
              <text x="300" y="60" fill="#8A93A6" fontSize="11" fontFamily="IBM Plex Mono, monospace">
                receiver
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
