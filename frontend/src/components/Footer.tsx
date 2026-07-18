import { ARC_TESTNET, CONTRACT_ADDRESS, EXPLORER_ADDRESS_URL } from '../lib/constants'

export default function Footer() {
  return (
    <footer className="border-t border-ink-700/60 py-12">
      <div className="container-shell">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <a href="#top" className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-flow-gradient">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M2 12 L8 4 L14 12" stroke="#07090C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="font-display text-base font-semibold text-mist-50">FlowPay</span>
            </a>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-mist-400">
              Programmable payments built on Arc. No custody, no backend — just your wallet and the contract.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-6 sm:flex sm:gap-14">
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-mist-400">Product</p>
              <ul className="space-y-2 text-sm text-mist-300">
                <li><a href="#features" className="transition-colors hover:text-mist-50">Features</a></li>
                <li><a href="#dashboard" className="transition-colors hover:text-mist-50">Dashboard</a></li>
                <li><a href="#faq" className="transition-colors hover:text-mist-50">FAQ</a></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-mist-400">Network</p>
              <ul className="space-y-2 text-sm text-mist-300">
                <li>{ARC_TESTNET.chainName}</li>
                <li className="font-mono text-xs text-mist-400">Chain {ARC_TESTNET.chainId}</li>
                <li>
                  <a
                    href={EXPLORER_ADDRESS_URL(CONTRACT_ADDRESS)}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-flow-teal"
                  >
                    View contract ↗
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-ink-700/60 pt-6 text-xs text-mist-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} FlowPay. Built on Arc.</p>
          <p className="font-mono">{CONTRACT_ADDRESS}</p>
        </div>
      </div>
    </footer>
  )
}
