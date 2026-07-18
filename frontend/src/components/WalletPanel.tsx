import { useWallet } from '../lib/WalletContext'
import { ARC_TESTNET, EXPLORER_ADDRESS_URL } from '../lib/constants'

function truncate(address: string) {
  return `${address.slice(0, 8)}…${address.slice(-6)}`
}

export default function WalletPanel() {
  const { address, balance, connecting, connect, isCorrectNetwork, switchNetwork, chainId, walletName } = useWallet()

  return (
    <div className="card p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-mist-50">Your Wallet</h3>
        {address && (
          <span className={`pill !py-0.5 ${isCorrectNetwork ? '' : 'border-danger/40 text-danger'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isCorrectNetwork ? 'bg-flow-teal' : 'bg-danger'}`} />
            {isCorrectNetwork ? 'Arc Testnet' : `Chain ${chainId ?? '—'}`}
          </span>
        )}
      </div>

      {!address ? (
        <div className="flex flex-col items-start gap-4">
          <p className="text-sm text-mist-300">
            Connect MetaMask or Rabby to view your balance and send a payment.
          </p>
          <button onClick={() => connect()} disabled={connecting} className="btn-primary w-full sm:w-auto">
            {connecting ? 'Connecting…' : 'Connect Wallet'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="field-label">Address</p>
            <a
              href={EXPLORER_ADDRESS_URL(address)}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-sm text-mist-100 transition-colors hover:text-flow-teal"
            >
              {truncate(address)}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="field-label">Balance</p>
              <p className="font-mono text-lg font-medium text-mist-50">
                {balance ? Number(balance).toFixed(4) : '0.0000'}{' '}
                <span className="text-xs text-mist-400">USDC</span>
              </p>
            </div>
            <div>
              <p className="field-label">Wallet</p>
              <p className="text-sm text-mist-200">{walletName ?? '—'}</p>
            </div>
          </div>

          {!isCorrectNetwork && (
            <div className="rounded-lg border border-danger/30 bg-danger/10 p-3">
              <p className="mb-2 text-xs text-danger">
                You're connected to chain {chainId ?? 'unknown'}. FlowPay runs on {ARC_TESTNET.chainName}.
              </p>
              <button onClick={() => switchNetwork()} className="btn-secondary !py-2 !text-xs w-full">
                Switch to Arc Testnet
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
