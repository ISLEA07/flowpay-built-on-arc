import { ARC_TESTNET, CONTRACT_ADDRESS, EXPLORER_ADDRESS_URL } from '../lib/constants'

const rows: { label: string; value: string; mono?: boolean; href?: string }[] = [
  { label: 'Network', value: ARC_TESTNET.chainName },
  { label: 'Chain ID', value: String(ARC_TESTNET.chainId), mono: true },
  { label: 'RPC URL', value: ARC_TESTNET.rpcUrls[0], mono: true },
  { label: 'Block explorer', value: ARC_TESTNET.blockExplorerUrls[0], mono: true, href: ARC_TESTNET.blockExplorerUrls[0] },
  { label: 'Native currency', value: `${ARC_TESTNET.nativeCurrency.name} (${ARC_TESTNET.nativeCurrency.symbol})` },
  { label: 'Contract address', value: CONTRACT_ADDRESS, mono: true, href: EXPLORER_ADDRESS_URL(CONTRACT_ADDRESS) },
]

const functions = [
  { sig: 'sendPayment(address receiver, string note)', note: 'payable — sends value to the receiver with an attached note' },
  { sig: 'getPayment(uint256 paymentId)', note: 'reads back the sender, receiver, amount, note, and timestamp for an ID' },
  { sig: 'totalPayments()', note: 'returns the running count of payments processed by the contract' },
]

export default function ContractInfo() {
  return (
    <section id="contract" className="border-t border-ink-700/60 py-20">
      <div className="container-shell">
        <div className="mb-12 max-w-lg">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-flow-teal">Onchain details</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-mist-50">
            The contract, in the open
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-mist-300">
            FlowPay doesn't run a backend. Every read and write goes straight from your wallet to
            this deployed contract on Arc Testnet.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card divide-y divide-ink-600 p-2">
            {rows.map((row) => (
              <div key={row.label} className="flex flex-col gap-1 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs text-mist-400">{row.label}</span>
                {row.href ? (
                  <a
                    href={row.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`break-all text-right text-sm text-flow-teal hover:underline ${row.mono ? 'font-mono' : ''}`}
                  >
                    {row.value}
                  </a>
                ) : (
                  <span className={`break-all text-right text-sm text-mist-100 ${row.mono ? 'font-mono' : ''}`}>
                    {row.value}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="card p-2">
            {functions.map((fn) => (
              <div key={fn.sig} className="border-b border-ink-600 px-4 py-3.5 last:border-b-0">
                <p className="font-mono text-xs text-flow-teal">{fn.sig}</p>
                <p className="mt-1 text-xs leading-relaxed text-mist-300">{fn.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
