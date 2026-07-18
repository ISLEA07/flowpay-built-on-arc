interface Feature {
  title: string
  description: string
  status: 'live' | 'soon'
}

const features: Feature[] = [
  {
    title: 'Direct payments',
    description: 'Send funds to any address in one transaction, settled onchain with no intermediary holding the balance.',
    status: 'live',
  },
  {
    title: 'Payment notes',
    description: 'Attach a short note to every payment so the reason for the transfer is recorded onchain alongside it.',
    status: 'live',
  },
  {
    title: 'Explorer verification',
    description: 'Every send links straight to Arcscan so you can confirm the transaction independent of FlowPay.',
    status: 'live',
  },
  {
    title: 'Escrow',
    description: 'Hold funds until both sides confirm delivery, with automatic release conditions.',
    status: 'soon',
  },
  {
    title: 'Revenue split',
    description: 'Route a single incoming payment to multiple recipients by a fixed percentage, automatically.',
    status: 'soon',
  },
  {
    title: 'Payment history',
    description: 'Look up any payment on the network by its ID and see the sender, receiver, amount, and note.',
    status: 'live',
  },
]

export default function Features() {
  return (
    <section id="features" className="border-t border-ink-700/60 py-20">
      <div className="container-shell">
        <div className="mb-12 max-w-lg">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-flow-teal">Capabilities</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-mist-50">
            What FlowPay does today — and what's next
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="card relative flex flex-col p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-flow-gradient-soft">
                  <span className="h-2 w-2 rounded-full bg-flow-teal" />
                </div>
                {f.status === 'soon' && (
                  <span className="rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-gold-soft">
                    Coming soon
                  </span>
                )}
              </div>
              <h3 className="mb-1.5 font-display text-base font-semibold text-mist-50">{f.title}</h3>
              <p className="text-sm leading-relaxed text-mist-300">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
