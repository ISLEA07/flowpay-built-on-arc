import { useState } from 'react'
import { useWallet, type WalletName } from '../lib/WalletContext'

function truncate(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export default function Header() {
  const { address, connecting, connect, disconnect, isCorrectNetwork, switchNetwork, availableWallets, hasProvider } =
    useWallet()
  const [menuOpen, setMenuOpen] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)

  const walletOptions: WalletName[] = hasProvider
    ? availableWallets.length
      ? availableWallets
      : ['Injected Wallet']
    : ['MetaMask', 'Rabby']

  return (
    <header className="sticky top-0 z-40 border-b border-ink-700/80 bg-ink-900/85 backdrop-blur-md">
      <div className="container-shell flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-flow-gradient">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 12 L8 4 L14 12" stroke="#07090C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-mist-50">FlowPay</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          <a href="#features" className="text-sm text-mist-300 transition-colors hover:text-mist-50">Features</a>
          <a href="#dashboard" className="text-sm text-mist-300 transition-colors hover:text-mist-50">Dashboard</a>
          <a href="#contract" className="text-sm text-mist-300 transition-colors hover:text-mist-50">Contract</a>
          <a href="#faq" className="text-sm text-mist-300 transition-colors hover:text-mist-50">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          {address && !isCorrectNetwork && (
            <button
              onClick={() => switchNetwork()}
              className="hidden items-center gap-1.5 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-xs font-medium text-danger transition-colors hover:bg-danger/20 sm:inline-flex"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-danger" />
              Wrong network — Switch
            </button>
          )}

          {!address ? (
            <div className="relative">
              <button
                onClick={() => setPickerOpen((v) => !v)}
                disabled={connecting}
                className="btn-primary !px-4 !py-2 text-xs"
              >
                {connecting ? 'Connecting…' : 'Connect Wallet'}
              </button>
              {pickerOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-ink-600 bg-ink-800 shadow-card">
                  {walletOptions.map(
                    (name) => (
                      <button
                        key={name}
                        onClick={async () => {
                          setPickerOpen(false)
                          await connect(name)
                        }}
                        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-mist-200 transition-colors hover:bg-ink-700"
                      >
                        {name}
                        <span className="text-xs text-mist-400">→</span>
                      </button>
                    ),
                  )}
                  {!hasProvider && (
                    <p className="border-t border-ink-600 px-4 py-2.5 text-xs text-mist-400">
                      No wallet detected — install MetaMask or Rabby.
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-ink-600 bg-ink-800/70 px-3 py-2 text-xs"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${isCorrectNetwork ? 'bg-flow-teal' : 'bg-danger'}`}
                />
                <span className="font-mono text-mist-100">{truncate(address)}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-ink-600 bg-ink-800 shadow-card">
                  <div className="border-b border-ink-600 px-4 py-3">
                    <p className="text-xs text-mist-400">{isCorrectNetwork ? 'Arc Testnet' : 'Wrong network'}</p>
                  </div>
                  {!isCorrectNetwork && (
                    <button
                      onClick={() => {
                        setMenuOpen(false)
                        switchNetwork()
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-danger transition-colors hover:bg-ink-700"
                    >
                      Switch to Arc Testnet
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      disconnect()
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-mist-300 transition-colors hover:bg-ink-700"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
