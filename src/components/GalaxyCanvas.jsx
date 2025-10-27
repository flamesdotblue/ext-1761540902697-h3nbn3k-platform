import React, { useEffect, useRef, useState, useMemo } from 'react';

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
const sectors = {
  L1: '#7dd3fc',
  L2: '#d8b4fe',
  Oracle: '#fca5a5',
  DeFi: '#bef264',
  DEX: '#fdba74',
};

export default function GalaxyCanvas({ assets, heatMetric = 'perf', onSelect, selectedId }) {
  const canvasRef = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [drag, setDrag] = useState(null);

  const nodes = useMemo(() => {
    const rng = (seed) => {
      let x = Math.sin(seed) * 10000; return x - Math.floor(x);
    };
    const maxCap = Math.max(...assets.map((a) => a.marketCap || 1), 1);
    const baseRadius = 10;
    return assets.map((a, i) => {
      const r = 600;
      const t = (i / Math.max(assets.length, 1)) * Math.PI * 2;
      const jitter = (rng(i + 1) - 0.5) * 120;
      const x = Math.cos(t) * (r + jitter);
      const y = Math.sin(t) * (r + jitter);
      const size = baseRadius + 28 * Math.sqrt((a.marketCap || 1) / maxCap);
      return { id: a.id, x, y, size, data: a };
    });
  }, [assets]);

  const stars = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 600; i++) {
      arr.push({ x: (Math.random() - 0.5) * 4000, y: (Math.random() - 0.5) * 4000, s: Math.random() * 1.5 + 0.2, a: Math.random() * 0.6 + 0.2 });
    }
    return arr;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      canvas.width = Math.floor(clientWidth * dpr);
      canvas.height = Math.floor(clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      const cx = canvas.clientWidth / 2 + transform.x;
      const cy = canvas.clientHeight / 2 + transform.y;
      const k = transform.k;

      // background gradient
      const g = ctx.createRadialGradient(cx, cy, 50, cx, cy, Math.max(width, height));
      g.addColorStop(0, 'rgba(12,15,24,0.6)');
      g.addColorStop(1, 'rgba(0,0,0,1)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

      // stars parallax
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(0.8 + k * 0.2, 0.8 + k * 0.2);
      for (const s of stars) {
        ctx.globalAlpha = s.a;
        ctx.fillStyle = '#9ca3af';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.s, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      ctx.globalAlpha = 1;

      // cluster rings
      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = 'rgba(59,130,246,0.15)';
      for (let r = 160; r <= 800; r += 160) {
        ctx.beginPath();
        ctx.arc(0, 0, r * k, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // nodes
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(k, k);

      for (const n of nodes) {
        const a = n.data;
        const heat = heatMetric === 'perf' ? a.perf24h : a.volatility;
        const isSel = selectedId === n.id;
        const base = sectors[a.sector] || '#93c5fd';
        // halo
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size * 1.25, 0, Math.PI * 2);
        ctx.fillStyle = isSel ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)';
        ctx.fill();
        // core with heatmap modulation
        const hue = heatMetric === 'perf' ? (heat > 0 ? 160 : 340) : 50 + clamp(heat, 0, 1) * 40;
        const intensity = heatMetric === 'perf' ? clamp(Math.abs(heat) / 8, 0.15, 0.95) : clamp(heat, 0.1, 0.95);
        const color = heatMetric === 'perf' ? `hsla(${hue},80%,${Math.floor(40 + intensity * 30)}%,1)` : `hsla(${200 - intensity * 160},85%,50%,1)`;
        const gradient = ctx.createRadialGradient(n.x - n.size * 0.2, n.y - n.size * 0.2, n.size * 0.2, n.x, n.y, n.size);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.4, base);
        gradient.addColorStop(1, color);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
        ctx.fill();

        // label
        ctx.font = '12px Inter, system-ui, -apple-system';
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.textAlign = 'center';
        ctx.fillText(a.symbol, n.x, n.y + n.size + 14);
      }
      ctx.restore();

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [nodes, stars, transform, heatMetric, selectedId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const toWorld = (sx, sy) => {
      const cx = canvas.clientWidth / 2 + transform.x;
      const cy = canvas.clientHeight / 2 + transform.y;
      const k = transform.k;
      const x = (sx - cx) / k;
      const y = (sy - cy) / k;
      return { x, y };
    };

    const onWheel = (e) => {
      e.preventDefault();
      const delta = -e.deltaY;
      const k0 = transform.k;
      const k1 = clamp(k0 * (delta > 0 ? 1.08 : 0.92), 0.5, 3.5);
      // zoom to mouse point
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const { x: wx, y: wy } = toWorld(mx, my);
      const cx = canvas.clientWidth / 2 + transform.x;
      const cy = canvas.clientHeight / 2 + transform.y;
      const nx = mx - (wx * k1 + cx);
      const ny = my - (wy * k1 + cy);
      setTransform((t) => ({ x: t.x + nx, y: t.y + ny, k: k1 }));
    };

    let last = null;
    const onDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      last = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      setDrag(last);
    };
    const onMove = (e) => {
      if (!drag) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const dx = x - drag.x;
      const dy = y - drag.y;
      setTransform((t) => ({ ...t, x: t.x + dx, y: t.y + dy }));
      last = { x, y };
      setDrag(last);
    };
    const onUp = (e) => {
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const { x, y } = toWorld(sx, sy);
      let hit = null;
      for (const n of nodes) {
        const dist = Math.hypot(x - n.x, y - n.y);
        if (dist <= n.size) { hit = n; break; }
      }
      if (hit && onSelect) onSelect(hit.data);
      setDrag(null);
    };

    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [drag, nodes, onSelect, transform]);

  return (
    <div className="h-[64vh] sm:h-[70vh] lg:h-[64vh] w-full relative">
      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="pointer-events-none absolute top-3 left-3 text-[11px] uppercase tracking-wide text-white/60 bg-black/40 border border-white/10 rounded-full px-3 py-1">
        Zoom, drag, click assets
      </div>
    </div>
  );
}
