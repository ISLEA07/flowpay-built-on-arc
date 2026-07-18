import { WalletProvider } from './lib/WalletContext'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import Dashboard from './components/Dashboard'
import ContractInfo from './components/ContractInfo'
import FAQ from './components/FAQ'
import Footer from './components/Footer'

export default function App() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-ink-900">
        <Header />
        <main>
          <Hero />
          <Features />
          <Dashboard />
          <ContractInfo />
          <FAQ />
        </main>
        <Footer />
      </div>
    </WalletProvider>
  )
}
