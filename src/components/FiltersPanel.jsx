import React from 'react';
import { Star, Activity } from 'lucide-react';

const Select = ({ label, value, onChange, options }) => (
  <label className="block">
    <div className="text-xs text-white/60 mb-1">{label}</div>
    <div className="relative">
      <select
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-black">{o}</option>
        ))}
      </select>
    </div>
  </label>
);

export default function FiltersPanel({ filters, onChange, heatMetric, setHeatMetric, watchlist, toggleWatch }) {
  const set = (k, v) => onChange({ ...filters, [k]: v });
  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-cyan-300" />
          <div className="text-sm font-medium">Filters</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Select label="Sector" value={filters.sector} onChange={(v) => set('sector', v)} options={[ 'All','L1','L2','Oracle','DeFi','DEX' ]} />
          <Select label="Chain" value={filters.chain} onChange={(v) => set('chain', v)} options={[ 'All','Bitcoin','Ethereum','Solana','Arbitrum','BNB Chain' ]} />
          <Select label="Risk" value={filters.risk} onChange={(v) => set('risk', v)} options={[ 'All','A','A-','B+','B','C' ]} />
          <Select label="Region" value={filters.region} onChange={(v) => set('region', v)} options={[ 'All','Global','AMER','EMEA','APAC' ]} />
          <Select label="Language" value={filters.language} onChange={(v) => set('language', v)} options={[ 'All','en','es','zh','ko' ]} />
          <Select label="Window" value={filters.window} onChange={(v) => set('window', v)} options={[ '24h','7d','30d' ]} />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-xs text-white/60">Heatmap metric</div>
          <div className="inline-flex bg-white/10 rounded-lg p-1 border border-white/10">
            <button
              onClick={() => setHeatMetric('perf')}
              className={`px-3 py-1 rounded-md text-xs ${heatMetric==='perf' ? 'bg-cyan-500/30 text-white' : 'text-white/70 hover:text-white'}`}
            >Performance</button>
            <button
              onClick={() => setHeatMetric('volatility')}
              className={`px-3 py-1 rounded-md text-xs ${heatMetric==='volatility' ? 'bg-cyan-500/30 text-white' : 'text-white/70 hover:text-white'}`}
            >Volatility</button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-yellow-300" />
          <div className="text-sm font-medium">Watchlist Alerts</div>
        </div>
        <div className="space-y-2">
          {['BTC','ETH','SOL','ARB','LINK','BNB'].map((sym) => (
            <label key={sym} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={watchlist.includes(sym)} onChange={() => toggleWatch(sym)} />
                <span className="font-medium">{sym}</span>
              </div>
              <span className="text-xs text-white/60">Signal: {sym==='ARB' ? 'Unusual flow' : 'Momentum'}</span>
            </label>
          ))}
        </div>
        <button className="mt-3 w-full text-xs bg-gradient-to-r from-cyan-500/30 to-fuchsia-500/30 hover:from-cyan-500/40 hover:to-fuchsia-500/40 border border-white/10 rounded-lg px-3 py-2">
          Create Alert
        </button>
      </div>

      <div className="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div className="text-xs text-white/60 mb-2">Heat legend</div>
        <div className="h-2 w-full bg-gradient-to-r from-pink-500 via-zinc-300 to-emerald-400 rounded-full" />
        <div className="flex justify-between text-[11px] text-white/60 mt-1">
          <span>Bearish</span>
          <span>Neutral</span>
          <span>Bullish</span>
        </div>
      </div>
    </div>
  );
}
