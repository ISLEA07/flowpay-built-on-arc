export const ARC_TESTNET = {
  chainId: 5042002,
  chainIdHex: '0x' + (5042002).toString(16),
  chainName: 'Arc Testnet',
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.testnet.arc.network'],
  blockExplorerUrls: ['https://testnet.arcscan.app'],
}

export const CONTRACT_ADDRESS = '0xB3adC8E6b845F71e3262cCE1D8e7AeBDc911cDfb'

export const CONTRACT_ABI = [
  'function sendPayment(address receiver, string note) payable',
  'function getPayment(uint256 paymentId) view returns (tuple(address sender, address receiver, uint256 amount, string note, uint256 timestamp))',
  'function totalPayments() view returns (uint256)',
]

export const EXPLORER_TX_URL = (hash: string) => `${ARC_TESTNET.blockExplorerUrls[0]}/tx/${hash}`
export const EXPLORER_ADDRESS_URL = (address: string) => `${ARC_TESTNET.blockExplorerUrls[0]}/address/${address}`
