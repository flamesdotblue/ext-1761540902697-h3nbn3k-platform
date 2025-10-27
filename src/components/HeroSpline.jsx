import React from 'react';
import Spline from '@splinetool/react-spline';

export default function HeroSpline() {
  return (
    <div className="relative h-[52vh] sm:h-[60vh] w-full">
      <Spline scene="https://prod.spline.design/N8g2VNcx8Rycz93J/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-center px-6">
        <div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300">
            Fulo Atlas Sphere™
          </h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-white/80">
            A zoomable 3D galaxy of the market. Discover, filter, and trade from a single interactive sphere.
          </p>
        </div>
      </div>
    </div>
  );
}
