import { useState, type FormEvent } from 'react'
import { isAddress } from 'ethers'
import { useWallet, type PaymentRecord } from '../lib/WalletContext'
import { EXPLORER_TX_URL } from '../lib/constants'
import WalletPanel from './WalletPanel'

type SendStatus = 'idle' | 'sending' | 'success' | 'error'

export default function Dashboard() {
  const { address, isCorrectNetwork, sendPayment, totalPayments, refreshTotalPayments, getPayment } = useWallet()

  const [receiver, setReceiver] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [status, setStatus] = useState<SendStatus>('idle')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const [lookupId, setLookupId] = useState('')
  const [lookupResult, setLookupResult] = useState<PaymentRecord | null>(null)
  const [lookupState, setLookupState] = useState<'idle' | 'loading' | 'not_found'>('idle')

  const canSubmit = address && isCorrectNetwork && status !== 'sending'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    setTxHash(null)

    if (!address) {
      setFormError('Connect your wallet first.')
      return
    }
    if (!isCorrectNetwork) {
      setFormError('Switch to Arc Testnet first.')
      return
    }
    if (!isAddress(receiver)) {
      setFormError('Enter a valid receiver address.')
      return
    }
    if (!amount || Number(amount) <= 0) {
      setFormError('Enter an amount greater than 0.')
      return
    }
    if (note.length > 280) {
      setFormError('Note is too long — keep it under 280 characters.')
      return
    }

    setStatus('sending')
    try {
      const hash = await sendPayment(receiver, note, amount)
      setTxHash(hash)
      setStatus('success')
      setReceiver('')
      setAmount('')
      setNote('')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Transaction failed.'
      setFormError(message)
      setStatus('error')
    }
  }

  async function handleLookup(e: FormEvent) {
    e.preventDefault()
    setLookupResult(null)
    const id = Number(lookupId)
    if (!Number.isInteger(id) || id < 0) {
      setLookupState('not_found')
      return
    }
    setLookupState('loading')
    const record = await getPayment(id)
    if (record) {
      setLookupResult(record)
      setLookupState('idle')
    } else {
      setLookupState('not_found')
    }
  }

  return (
    <section id="dashboard" className="border-t border-ink-700/60 py-20">
      <div className="container-shell">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-lg">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-flow-teal">Dashboard</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-mist-50">
              Send a payment, verified onchain
            </h2>
          </div>

          <div className="card flex items-center gap-4 px-5 py-4">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-mist-400">Total payments on FlowPay</p>
              <p className="font-mono text-2xl font-semibold text-mist-50">
                {totalPayments !== null ? totalPayments.toLocaleString() : '—'}
              </p>
            </div>
            <button
              onClick={() => refreshTotalPayments()}
              title="Refresh"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-600 text-mist-400 transition-colors hover:border-flow-teal/50 hover:text-flow-teal"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 2.5v3.5H10"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <WalletPanel />

          <div className="card p-6">
            <h3 className="mb-5 font-display text-sm font-semibold text-mist-50">Send Payment</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="field-label" htmlFor="receiver">Receiver address</label>
                <input
                  id="receiver"
                  className="field-input"
                  placeholder="0x…"
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                  spellCheck={false}
                />
              </div>

              <div>
                <label className="field-label" htmlFor="amount">Amount (USDC)</label>
                <input
                  id="amount"
                  className="field-input"
                  placeholder="0.00"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div>
                <label className="field-label" htmlFor="note">Note</label>
                <textarea
                  id="note"
                  className="field-input min-h-[84px] resize-none font-body"
                  placeholder="What's this payment for?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={280}
                />
                <p className="mt-1 text-right text-[11px] text-mist-400">{note.length}/280</p>
              </div>

              {formError && (
                <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5 text-xs text-danger">
                  {formError}
                </div>
              )}

              {status === 'success' && txHash && (
                <div className="rounded-lg border border-flow-teal/30 bg-flow-teal/10 px-3 py-2.5 text-xs text-mist-100">
                  <p className="mb-1 font-medium text-flow-teal">Payment confirmed</p>
                  <a
                    href={EXPLORER_TX_URL(txHash)}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-mist-200 underline decoration-flow-teal/40 underline-offset-2 hover:text-flow-teal"
                  >
                    View on Arcscan →
                  </a>
                </div>
              )}

              <button type="submit" disabled={!canSubmit} className="btn-primary w-full">
                {status === 'sending' ? 'Confirm in wallet…' : 'Send Payment'}
              </button>

              {!address && <p className="text-center text-xs text-mist-400">Connect your wallet to send a payment.</p>}
              {address && !isCorrectNetwork && (
                <p className="text-center text-xs text-danger">Switch to Arc Testnet to send a payment.</p>
              )}
            </form>
          </div>
        </div>

        <div className="card mt-6 p-6">
          <h3 className="mb-4 font-display text-sm font-semibold text-mist-50">Look up a payment</h3>
          <form onSubmit={handleLookup} className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[160px]">
              <label className="field-label" htmlFor="lookupId">Payment ID</label>
              <input
                id="lookupId"
                className="field-input"
                placeholder="e.g. 12"
                inputMode="numeric"
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-secondary">
              {lookupState === 'loading' ? 'Looking up…' : 'Look up'}
            </button>
          </form>

          {lookupState === 'not_found' && (
            <p className="mt-4 text-xs text-mist-400">No payment found for that ID.</p>
          )}

          {lookupResult && (
            <div className="mt-5 grid gap-4 border-t border-ink-600 pt-5 sm:grid-cols-2">
              <div>
                <p className="field-label">Sender</p>
                <p className="break-all font-mono text-xs text-mist-100">{lookupResult.sender}</p>
              </div>
              <div>
                <p className="field-label">Receiver</p>
                <p className="break-all font-mono text-xs text-mist-100">{lookupResult.receiver}</p>
              </div>
              <div>
                <p className="field-label">Amount</p>
                <p className="font-mono text-sm text-mist-100">{lookupResult.amount} USDC</p>
              </div>
              <div>
                <p className="field-label">Note</p>
                <p className="text-sm text-mist-100">{lookupResult.note || '—'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
