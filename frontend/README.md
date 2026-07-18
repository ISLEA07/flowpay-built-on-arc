# FlowPay

Programmable payments built on Arc.

FlowPay is a static React + TypeScript frontend for a payments smart contract
deployed on **Arc Testnet**. It has no backend — every read and write goes
directly from the browser wallet to the contract via `ethers.js`.

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- ethers.js v6
- MetaMask / Rabby (any EIP-1193 injected wallet)

## Network

| | |
|---|---|
| Network name | Arc Testnet |
| Chain ID | `5042002` |
| RPC URL | `https://rpc.testnet.arc.network` |
| Block explorer | `https://testnet.arcscan.app` |
| Native currency | USDC |

## Contract

Address: `0xB3adC8E6b845F71e3262cCE1D8e7AeBDc911cDfb`

```solidity
function sendPayment(address receiver, string note) payable
function getPayment(uint256 paymentId)
function totalPayments()
```

`getPayment` is read positionally (by tuple index) rather than by field name,
so the UI stays correct even if the on-chain struct's field names differ from
what's declared in the local ABI fragment.

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL, install MetaMask or Rabby if you haven't
already, and click **Connect Wallet**. If your wallet isn't on Arc Testnet,
FlowPay will prompt you to switch — adding the network automatically if your
wallet doesn't have it yet.

## Build

```bash
npm run build
npm run preview
```

`npm run build` type-checks the project with `tsc -b` before bundling with
Vite, so a successful build means there are no TypeScript errors.

## Project structure

```
src/
  components/
    Header.tsx        top nav + wallet connect / network switch
    Hero.tsx           landing hero, "Built on Arc"
    Features.tsx        live features + Escrow / Revenue Split (Coming Soon)
    Dashboard.tsx        send payment form, live totalPayments, payment lookup
    WalletPanel.tsx      wallet balance / address / network card
    ContractInfo.tsx     network + contract address + function reference
    FAQ.tsx               accordion FAQ
    Footer.tsx             footer, "Built on Arc"
  lib/
    constants.ts          network + contract constants, ABI
    WalletContext.tsx      wallet connection, network switching, contract calls
  App.tsx
  main.tsx
  index.css
```

## Notes

- No fake transactions or placeholder statistics — the total payments count
  and payment lookups are read live from the deployed contract.
- Escrow and Revenue Split are shown as **Coming Soon**; the deployed
  contract doesn't currently implement either.
- No backend, database, or Supabase — this is a pure static frontend.
