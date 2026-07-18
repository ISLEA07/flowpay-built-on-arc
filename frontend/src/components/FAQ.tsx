import { useState } from 'react'

const faqs: { q: string; a: string }[] = [
  {
    q: 'What is FlowPay?',
    a: 'FlowPay is a payments interface for a smart contract deployed on Arc Testnet. It lets you send a payment with an attached note directly from your wallet, with no backend or custodian in between.',
  },
  {
    q: 'Which wallets are supported?',
    a: 'FlowPay connects to MetaMask and Rabby through the browser wallet standard. If you have either installed, FlowPay will detect it and let you choose which one to use.',
  },
  {
    q: 'What network does this run on?',
    a: 'Arc Testnet, chain ID 5042002. If your wallet is connected to a different network, FlowPay will flag it and offer a one-click switch — adding the network first if your wallet doesn\u2019t already have it.',
  },
  {
    q: 'Is the total payments number real?',
    a: 'Yes. It\u2019s read live from the contract\u2019s totalPayments() function — not a placeholder or an estimate. It updates automatically after every payment you send.',
  },
  {
    q: 'Are escrow and revenue split available yet?',
    a: 'Not yet. Both are marked Coming Soon on the Features section. The current contract only supports direct payments with a note.',
  },
  {
    q: 'What does the note field do?',
    a: 'It attaches a short piece of text to your payment onchain, so the reason for the transfer is recorded alongside the transaction itself and visible to anyone looking it up.',
  },
  {
    q: 'Where can I verify a transaction?',
    a: 'Every payment confirmation links to Arcscan, the block explorer for Arc Testnet, so you can verify the transaction independently of FlowPay.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="border-t border-ink-700/60 py-20">
      <div className="container-shell">
        <div className="mb-10 max-w-lg">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-flow-teal">FAQ</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-mist-50">
            Common questions
          </h2>
        </div>

        <div className="card divide-y divide-ink-600">
          {faqs.map((item, i) => {
            const open = openIndex === i
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                  aria-expanded={open}
                >
                  <span className="font-display text-sm font-medium text-mist-50">{item.q}</span>
                  <span
                    className={`flex h-6 w-6 flex-none items-center justify-center rounded-full border border-ink-600 text-mist-300 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M5 0v10M0 5h10" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`grid overflow-hidden px-5 transition-all duration-200 sm:px-6 ${open ? 'grid-rows-[1fr] pb-5 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <p className="min-h-0 text-sm leading-relaxed text-mist-300">{item.a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
