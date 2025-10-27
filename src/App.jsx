import React, { useMemo, useState } from 'react';
import { Bell, Filter, Search, TrendingUp } from 'lucide-react';
import HeroSpline from './components/HeroSpline';
import GalaxyCanvas from './components/GalaxyCanvas';
import FiltersPanel from './components/FiltersPanel';
import TradeFlowView from './components/TradeFlowView';

const seedAssets = [
  {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    sector: 'L1',
    chain: 'Bitcoin',
    risk: 'A',
    marketCap: 1200000000000,
    price: 68000,
    perf24h: 2.4,
    volatility: 0.32,
    headlineMomentum: 0.7,
    unusualFlow: 0.35,
    arpi: 82,
    region: 'Global',
    language: 'en',
    venues: [
      { name: 'Binance', depth: 9.2 },
      { name: 'Coinbase', depth: 7.8 },
      { name: 'OKX', depth: 6.9 },
    ],
  },
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    sector: 'L1',
    chain: 'Ethereum',
    risk: 'A-',
    marketCap: 380000000000,
    price: 3600,
    perf24h: 1.2,
    volatility: 0.41,
    headlineMomentum: 0.63,
    unusualFlow: 0.22,
    arpi: 78,
    region: 'Global',
    language: 'en',
    venues: [
      { name: 'Binance', depth: 8.4 },
      { name: 'Bybit', depth: 6.1 },
      { name: 'Kraken', depth: 5.7 },
    ],
  },
  {
    id: 'sol',
    symbol: 'SOL',
    name: 'Solana',
    sector: 'L1',
    chain: 'Solana',
    risk: 'B+',
    marketCap: 92000000000,
    price: 180,
    perf24h: -0.8,
    volatility: 0.55,
    headlineMomentum: 0.48,
    unusualFlow: 0.51,
    arpi: 69,
    region: 'Global',
    language: 'en',
    venues: [
      { name: 'Binance', depth: 7.1 },
      { name: 'Bybit', depth: 6.8 },
      { name: 'Jupiter', depth: 5.2 },
    ],
  },
  {
    id: 'arb',
    symbol: 'ARB',
    name: 'Arbitrum',
    sector: 'L2',
    chain: 'Arbitrum',
    risk: 'B',
    marketCap: 3400000000,
    price: 1.2,
    perf24h: 3.2,
    volatility: 0.72,
    headlineMomentum: 0.39,
    unusualFlow: 0.65,
    arpi: 58,
    region: 'Global',
    language: 'en',
    venues: [
      { name: 'Binance', depth: 4.2 },
      { name: 'OKX', depth: 3.7 },
      { name: 'Uni v3', depth: 2.4 },
    ],
  },
  {
    id: 'link',
    symbol: 'LINK',
    name: 'Chainlink',
    sector: 'Oracle',
    chain: 'Ethereum',
    risk: 'A-',
    marketCap: 18000000000,
    price: 15.5,
    perf24h: 0.6,
    volatility: 0.38,
    headlineMomentum: 0.52,
    unusualFlow: 0.28,
    arpi: 73,
    region: 'Global',
    language: 'en',
    venues: [
      { name: 'Binance', depth: 5.6 },
      { name: 'Coinbase', depth: 4.9 },
      { name: 'Uni v2', depth: 2.8 },
    ],
  },
  {
    id: 'bnb',
    symbol: 'BNB',
    name: 'BNB',
    sector: 'L1',
    chain: 'BNB Chain',
    risk: 'A-',
    marketCap: 92000000000,
    price: 600,
    perf24h: 1.9,
    volatility: 0.44,
    headlineMomentum: 0.41,
    unusualFlow: 0.33,
    arpi: 71,
    region: 'APAC',
    language: 'en',
    venues: [
      { name: 'Binance', depth: 9.5 },
      { name: 'Bybit', depth: 6.0 },
      { name: 'PancakeSwap', depth: 4.1 },
    ],
  },
];

export default function App() {
  const [query, setQuery] = useState('');
  const [heatMetric, setHeatMetric] = useState('perf');
  const [filters, setFilters] = useState({
    sector: 'All',
    chain: 'All',
    risk: 'All',
    region: 'All',
    language: 'All',
    window: '24h',
  });
  const [selected, setSelected] = useState(null);
  const [watchlist, setWatchlist] = useState(['BTC', 'ETH', 'SOL']);

  const assets = useMemo(() => seedAssets, []);

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      const matchesQuery = query
        ? a.symbol.toLowerCase().includes(query.toLowerCase()) ||
          a.name.toLowerCase().includes(query.toLowerCase())
        : true;
      const f = filters;
      const sect = f.sector === 'All' || a.sector === f.sector;
      const ch = f.chain === 'All' || a.chain === f.chain;
      const r = f.risk === 'All' || a.risk === f.risk;
      const reg = f.region === 'All' || a.region === f.region;
      const lang = f.language === 'All' || a.language === f.language;
      return matchesQuery && sect && ch && r && reg && lang;
    });
  }, [assets, query, filters]);

  const arpiSummary = useMemo(() => {
    if (!filtered.length) return 0;
    return Math.round(
      filtered.reduce((acc, x) => acc + x.arpi, 0) / filtered.length
    );
  }, [filtered]);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="relative">
        <HeroSpline />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black pointer-events-none" />
        <div className="absolute inset-x-0 top-0 px-4 sm:px-6 lg:px-12 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-bold">FA</div>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight">Fulo Atlas Sphere</h1>
              <p className="text-xs text-white/70">Market intelligence + trading UI</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-full pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                placeholder="Search assets, sectors..."
              />
              <Search className="w-4 h-4 text-white/60 absolute left-3 top-2.5" />
            </div>
            <button className="inline-flex items-center gap-2 text-sm bg-white/5 border border-white/10 rounded-full px-3 py-2 hover:bg-white/10">
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button className="relative inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-pink-500 text-[10px] leading-4 text-center">3</span>
            </button>
          </div>
        </div>
        <div className="absolute bottom-4 inset-x-0 px-4 sm:px-6 lg:px-12">
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-500 to-fuchsia-500 flex items-center justify-center"><TrendingUp className="w-5 h-5" /></div>
              <div>
                <div className="text-xs uppercase tracking-wide text-white/70">ARPI Aggregate</div>
                <div className="text-lg font-semibold">{arpiSummary}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="md:hidden relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-full pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  placeholder="Search..."
                />
                <Search className="w-4 h-4 text-white/60 absolute left-3 top-2.5" />
              </div>
              <button onClick={() => setHeatMetric((m) => (m === 'perf' ? 'volatility' : 'perf'))} className="text-xs bg-white/10 hover:bg-white/20 border border-white/10 rounded-full px-3 py-2">
                Heatmap: {heatMetric === 'perf' ? 'Performance' : 'Volatility'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="grid lg:grid-cols-12 gap-4 lg:gap-6 px-4 sm:px-6 lg:px-12 py-6">
        <aside className="lg:col-span-3 order-2 lg:order-1 space-y-4">
          <FiltersPanel
            filters={filters}
            onChange={setFilters}
            heatMetric={heatMetric}
            setHeatMetric={setHeatMetric}
            watchlist={watchlist}
            toggleWatch={(sym) =>
              setWatchlist((w) => (w.includes(sym) ? w.filter((s) => s !== sym) : [...w, sym]))
            }
          />
        </aside>

        <section className="lg:col-span-6 order-1 lg:order-2">
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/5 to-white/0">
            <GalaxyCanvas
              assets={filtered}
              heatMetric={heatMetric}
              onSelect={(a) => setSelected(a)}
              selectedId={selected?.id}
            />
          </div>
        </section>

        <aside className="lg:col-span-3 order-3">
          <TradeFlowView asset={selected} />
        </aside>
      </main>

      <footer className="px-4 sm:px-6 lg:px-12 py-6 text-center text-white/50 text-xs">
        Fulo Atlas Sphere™ — Advanced market galaxy. Data shown is for demo only.
      </footer>
    </div>
  );
}
