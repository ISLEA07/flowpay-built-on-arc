import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { BrowserProvider, Contract, formatEther, parseEther, JsonRpcSigner } from 'ethers'
import { ARC_TESTNET, CONTRACT_ABI, CONTRACT_ADDRESS } from './constants'

// ---- Minimal EIP-1193 typing (no `any` leakage) ----------------------------
interface Eip1193Provider {
  request: (args: { method: string; params?: unknown[] | Record<string, unknown> }) => Promise<unknown>
  on: (event: string, handler: (...args: unknown[]) => void) => void
  removeListener: (event: string, handler: (...args: unknown[]) => void) => void
  isMetaMask?: boolean
  isRabby?: boolean
  providers?: Eip1193Provider[]
}

declare global {
  interface Window {
    ethereum?: Eip1193Provider
  }
}

export type WalletName = 'MetaMask' | 'Rabby' | 'Injected Wallet'

export interface PaymentRecord {
  id: number
  sender: string
  receiver: string
  amount: string
  note: string
  timestamp: number
}

interface WalletState {
  address: string | null
  chainId: number | null
  balance: string | null
  connecting: boolean
  walletName: WalletName | null
  isCorrectNetwork: boolean
  hasProvider: boolean
  availableWallets: WalletName[]
  totalPayments: number | null
  connect: (preferred?: WalletName) => Promise<void>
  disconnect: () => void
  switchNetwork: () => Promise<void>
  sendPayment: (receiver: string, note: string, amountEth: string) => Promise<string>
  refreshBalance: () => Promise<void>
  refreshTotalPayments: () => Promise<void>
  getPayment: (id: number) => Promise<PaymentRecord | null>
  error: string | null
  clearError: () => void
}

const WalletContext = createContext<WalletState | undefined>(undefined)

function detectProviders(): { provider: Eip1193Provider | null; names: WalletName[] } {
  if (typeof window === 'undefined' || !window.ethereum) return { provider: null, names: [] }
  const eth = window.ethereum
  const list: Eip1193Provider[] = eth.providers && eth.providers.length > 0 ? eth.providers : [eth]
  const names: WalletName[] = list.map((p) => {
    if (p.isRabby) return 'Rabby'
    if (p.isMetaMask) return 'MetaMask'
    return 'Injected Wallet'
  })
  return { provider: eth, names }
}

function pickProvider(preferred?: WalletName): Eip1193Provider | null {
  if (typeof window === 'undefined' || !window.ethereum) return null
  const eth = window.ethereum
  const list: Eip1193Provider[] = eth.providers && eth.providers.length > 0 ? eth.providers : [eth]
  if (preferred === 'Rabby') return list.find((p) => p.isRabby) ?? list[0]
  if (preferred === 'MetaMask') return list.find((p) => p.isMetaMask && !p.isRabby) ?? list[0]
  return list[0]
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [walletName, setWalletName] = useState<WalletName | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [rawProvider, setRawProvider] = useState<Eip1193Provider | null>(null)
  const [totalPayments, setTotalPayments] = useState<number | null>(null)

  const { provider: hasEthereum, names: availableWallets } = useMemo(detectProviders, [])

  const browserProvider = useMemo(() => {
    if (!rawProvider) return null
    return new BrowserProvider(rawProvider)
  }, [rawProvider])

  const readOnlyContract = useMemo(() => {
    // Contract reads should work even before wallet connection, via the
    // injected provider if present. If no wallet exists, reads are skipped.
    if (!browserProvider) return null
    return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, browserProvider)
  }, [browserProvider])

  const isCorrectNetwork = chainId === ARC_TESTNET.chainId

  const clearError = useCallback(() => setError(null), [])

  const refreshBalance = useCallback(async () => {
    if (!browserProvider || !address) return
    try {
      const bal = await browserProvider.getBalance(address)
      setBalance(formatEther(bal))
    } catch {
      // silent — balance is best-effort display data
    }
  }, [browserProvider, address])

  const refreshTotalPayments = useCallback(async () => {
    if (!readOnlyContract) return
    try {
      const total: bigint = await readOnlyContract.totalPayments()
      setTotalPayments(Number(total))
    } catch {
      setTotalPayments(null)
    }
  }, [readOnlyContract])

  const getPayment = useCallback(
    async (id: number): Promise<PaymentRecord | null> => {
      if (!readOnlyContract) return null
      try {
        const result = await readOnlyContract.getPayment(id)
        // Access positionally — resilient even if struct field names differ
        // from our ABI guess, since tuple order is what actually matters.
        const arr = result as unknown as Record<string | number, unknown>
        const sender = String(arr[0] ?? '')
        const receiver = String(arr[1] ?? '')
        const amountRaw = arr[2] as bigint | undefined
        const note = String(arr[3] ?? '')
        const timestampRaw = arr[4] as bigint | undefined
        return {
          id,
          sender,
          receiver,
          amount: amountRaw !== undefined ? formatEther(amountRaw) : '0',
          note,
          timestamp: timestampRaw !== undefined ? Number(timestampRaw) : 0,
        }
      } catch {
        return null
      }
    },
    [readOnlyContract],
  )

  const connect = useCallback(
    async (preferred?: WalletName) => {
      setError(null)
      const p = pickProvider(preferred)
      if (!p) {
        setError('No wallet extension detected. Install MetaMask or Rabby to continue.')
        return
      }
      setConnecting(true)
      try {
        const accounts = (await p.request({ method: 'eth_requestAccounts' })) as string[]
        if (!accounts || accounts.length === 0) {
          setError('No account was authorized.')
          setConnecting(false)
          return
        }
        setRawProvider(p)
        setAddress(accounts[0])
        const chainHex = (await p.request({ method: 'eth_chainId' })) as string
        setChainId(parseInt(chainHex, 16))
        const name: WalletName = p.isRabby ? 'Rabby' : p.isMetaMask ? 'MetaMask' : 'Injected Wallet'
        setWalletName(name)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Connection was rejected.'
        setError(message)
      } finally {
        setConnecting(false)
      }
    },
    [],
  )

  const disconnect = useCallback(() => {
    setAddress(null)
    setBalance(null)
    setWalletName(null)
    setRawProvider(null)
  }, [])

  const switchNetwork = useCallback(async () => {
    if (!rawProvider) {
      setError('Connect a wallet first.')
      return
    }
    setError(null)
    try {
      await rawProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ARC_TESTNET.chainIdHex }],
      })
    } catch (switchErr) {
      const code = (switchErr as { code?: number })?.code
      if (code === 4902) {
        try {
          await rawProvider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: ARC_TESTNET.chainIdHex,
                chainName: ARC_TESTNET.chainName,
                nativeCurrency: ARC_TESTNET.nativeCurrency,
                rpcUrls: ARC_TESTNET.rpcUrls,
                blockExplorerUrls: ARC_TESTNET.blockExplorerUrls,
              },
            ],
          })
        } catch (addErr) {
          const message = addErr instanceof Error ? addErr.message : 'Could not add Arc Testnet.'
          setError(message)
        }
      } else {
        const message = switchErr instanceof Error ? switchErr.message : 'Network switch was rejected.'
        setError(message)
      }
    }
  }, [rawProvider])

  const sendPayment = useCallback(
    async (receiver: string, note: string, amountEth: string): Promise<string> => {
      if (!browserProvider || !address) throw new Error('Connect a wallet first.')
      if (!isCorrectNetwork) throw new Error('Switch to Arc Testnet first.')
      const signer: JsonRpcSigner = await browserProvider.getSigner()
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      const value = amountEth && Number(amountEth) > 0 ? amountEth : '0'
      const tx = await contract.sendPayment(receiver, note, {
        value: parseEther(value),
      })
      const receipt = await tx.wait()
      await refreshBalance()
      await refreshTotalPayments()
      return receipt?.hash ?? tx.hash
    },
    [browserProvider, address, isCorrectNetwork, refreshBalance, refreshTotalPayments],
  )

  // React to account / chain changes from the extension
  useEffect(() => {
    if (!rawProvider) return
    const onAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[]
      setAddress(accounts && accounts.length > 0 ? accounts[0] : null)
    }
    const onChainChanged = (...args: unknown[]) => {
      const chainHex = args[0] as string
      setChainId(parseInt(chainHex, 16))
    }
    rawProvider.on('accountsChanged', onAccountsChanged)
    rawProvider.on('chainChanged', onChainChanged)
    return () => {
      rawProvider.removeListener('accountsChanged', onAccountsChanged)
      rawProvider.removeListener('chainChanged', onChainChanged)
    }
  }, [rawProvider])

  // Attempt silent reconnect on load if a provider is already authorized
  useEffect(() => {
    if (!hasEthereum) return
    ;(async () => {
      try {
        const accounts = (await hasEthereum.request({ method: 'eth_accounts' })) as string[]
        if (accounts && accounts.length > 0) {
          setRawProvider(hasEthereum)
          setAddress(accounts[0])
          const chainHex = (await hasEthereum.request({ method: 'eth_chainId' })) as string
          setChainId(parseInt(chainHex, 16))
          const name: WalletName = hasEthereum.isRabby ? 'Rabby' : hasEthereum.isMetaMask ? 'MetaMask' : 'Injected Wallet'
          setWalletName(name)
        }
      } catch {
        // ignore
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasEthereum])

  useEffect(() => {
    if (address && browserProvider) {
      refreshBalance()
    } else {
      setBalance(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, browserProvider])

  useEffect(() => {
    if (readOnlyContract) {
      refreshTotalPayments()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readOnlyContract])

  const value: WalletState = {
    address,
    chainId,
    balance,
    connecting,
    walletName,
    isCorrectNetwork,
    hasProvider: !!hasEthereum,
    availableWallets,
    totalPayments,
    connect,
    disconnect,
    switchNetwork,
    sendPayment,
    refreshBalance,
    refreshTotalPayments,
    getPayment,
    error,
    clearError,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet(): WalletState {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used within a WalletProvider')
  return ctx
}
