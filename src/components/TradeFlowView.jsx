import React, { useMemo } from 'react';
import { TrendingUp, Radio, Globe, ArrowRight } from 'lucide-react';

function tvSymbol(asset) {
  if (!asset) return 'BINANCE:BTCUSDT';
  const s = asset.symbol?.toUpperCase?.() || 'BTC';
  return `BINANCE:${s}USDT`;
}

export default function TradeFlowView({ asset }) {
  const signalBadges = useMemo(() => {
    if (!asset) return [];
    const arr = [];
    if ((asset.headlineMomentum || 0) > 0.6) arr.push({ label: 'Headline momentum', color: 'bg-emerald-500/30 text-emerald-300' });
    if ((asset.unusualFlow || 0) > 0.5) arr.push({ label: 'Unusual flow', color: 'bg-amber-500/30 text-amber-300' });
    if (Math.abs(asset.perf24h) > 2) arr.push({ label: 'Move > 2%', color: 'bg-fuchsia-500/30 text-fuchsia-200' });
    return arr;
  }, [asset]);

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
      <div className="p-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-500 to-fuchsia-500 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">{asset ? `${asset.name} • ${asset.symbol}` : 'Select an asset'}</div>
            <div className="text-xs text-white/60">Trade Flow View</div>
          </div>
        </div>
        {asset && (
          <div className="flex gap-2">
            {signalBadges.map((b) => (
              <span key={b.label} className={`text-[11px] px-2 py-1 rounded-md ${b.color} border border-white/10`}>{b.label}</span>
            ))}
          </div>
        )}
      </div>

      <div className="aspect-video bg-black/60">
        <iframe
          key={tvSymbol(asset)}
          title="chart"
          src={`https://s.tradingview.com/widgetembed/?symbol=${encodeURIComponent(tvSymbol(asset))}&interval=60&hidesidetoolbar=1&symboledit=1&saveimage=0&toolbarbg=f1f3f6&studies=[]&theme=dark&style=1&timezone=Etc%2FUTC&hideideas=1&withdateranges=1`}
          className="w-full h-full"
          frameBorder="0"
          allowTransparency
        />
      </div>

      <div className="p-3 grid grid-cols-2 gap-3">
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <div className="text-xs text-white/60 mb-2">ARPI Overlay</div>
          <div className="text-2xl font-semibold">{asset ? asset.arpi : 0}</div>
          <div className="text-[11px] text-white/50">Adaptive Risk-Performance Index</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <div className="text-xs text-white/60 mb-2">24h</div>
          <div className="text-sm">{asset ? asset.perf24h : 0}% <span className="text-white/60">• Vol</span> {asset ? asset.volatility : 0}</div>
          <div className="text-[11px] text-white/50">Change and realized volatility</div>
        </div>
      </div>

      <div className="px-3 grid grid-cols-1 gap-3">
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-white/60">Liquidity & Venues</div>
            <Radio className="w-4 h-4 text-white/60" />
          </div>
          <div className="mt-2 space-y-2">
            {(asset?.venues || []).map((v) => (
              <div key={v.name} className="flex items-center justify-between text-sm">
                <span className="text-white/80">{v.name}</span>
                <span className="text-white/60">Depth {v.depth.toFixed(1)}</span>
              </div>
            ))}
            {!asset && <div className="text-sm text-white/50">Select an asset to view depth</div>}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-white/60">News & Pulse</div>
            <Globe className="w-4 h-4 text-white/60" />
          </div>
          <div className="mt-2 space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 mt-1" />
              <div className="flex-1">Momentum rising on social mentions • 30m</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-400 mt-1" />
              <div className="flex-1">Option flow skew detected • 1h</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan-400 mt-1" />
              <div className="flex-1">Dev activity uptick • 3h</div>
            </div>
          </div>
        </div>

        <a
          href={asset ? `https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=${encodeURIComponent(asset.symbol)}` : '#'}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:opacity-95 transition rounded-xl px-4 py-3 text-sm font-medium"
        >
          Route to swap {asset ? asset.symbol : ''}
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      <div className="h-2" />
    </div>
  );
}
