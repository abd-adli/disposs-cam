import CameraComponent from '@/components/CameraComponent';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_#F9F8F6_20%,_#8A9A86_120%)] selection:bg-[var(--color-terracotta)] selection:text-white flex flex-col items-center">
      {/* Immersive Film Grain Overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 mix-blend-overlay opacity-40">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-[0.15]">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
        </svg>
      </div>

      <div className="relative z-20 flex flex-col min-h-screen max-w-md mx-auto w-full px-6 py-8">
        
        {/* Retro Viewfinder Header Stats */}
        <div className="flex justify-between items-center w-full mb-6 font-mono text-[10px] tracking-widest text-gray-700/80 uppercase">
          <div className="flex items-center space-x-1.5 bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-white/40">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
            <span className="font-bold">Flash: AUTO</span>
          </div>
          <div className="bg-black/80 text-green-400 px-3 py-1.5 rounded-md shadow-inner border border-gray-600 font-bold digital-font">
            SHOTS: 36
          </div>
        </div>

        {/* Main Title Section */}
        <header className="flex-1 flex flex-col items-center justify-start pt-4 text-center">
          <h2 className="text-[var(--color-terracotta)] text-xl font-extrabold tracking-wider mb-2 drop-shadow-sm">
            #AnchoredRealm
          </h2>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 leading-tight mb-4 tracking-tight shadow-black/5 drop-shadow-md">
            Adli & Rima
          </h1>
          <div className="w-16 h-1 bg-[var(--color-sage)] mx-auto rounded-full opacity-70 shadow-sm"></div>
          
          <p className="mt-6 text-gray-700 font-medium text-center text-sm leading-relaxed max-w-[280px]">
            Help us capture memories! Grab this digital disposable camera and snap a shot for our gallery.
          </p>
        </header>

        {/* Camera Section */}
        <div className="flex-[2] flex flex-col items-center justify-center w-full relative">
          <CameraComponent />
        </div>

        {/* Footer */}
        <footer className="py-6 text-center text-xs text-gray-500 font-bold tracking-widest uppercase flex flex-col items-center">
          <span>11 • 10 • 2026</span>
          <span className="text-[10px] opacity-60 mt-1 font-mono">ISO 400 • 35MM LENS</span>
        </footer>
      </div>
    </main>
  );
}
