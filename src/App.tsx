import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Globe } from 'lucide-react';
import DeviceFrame from './components/DeviceFrame';
import siteSnapImage from '../assets/sitesnap-image.png';

const SCENE_BASE_WIDTH = 1500;
const SCENE_BASE_HEIGHT = 1000;

export default function App() {
  const [urlInput, setUrlInput] = useState('');
  const [activeUrl, setActiveUrl] = useState('');
  const [isUrlValid, setIsUrlValid] = useState(false);
  const [sceneScale, setSceneScale] = useState(1);
  const sceneViewportRef = useRef<HTMLDivElement>(null);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;
    
    let formattedUrl = urlInput;
    if (!/^https?:\/\//i.test(urlInput)) {
      formattedUrl = 'https://' + urlInput;
    }
    
    setActiveUrl(formattedUrl);
  };

  useEffect(() => {
    try {
      if (activeUrl) {
        new URL(activeUrl);
        setIsUrlValid(true);
      } else {
        setIsUrlValid(false);
      }
    } catch {
      setIsUrlValid(false);
    }
  }, [activeUrl]);

  useEffect(() => {
    if (!activeUrl) return;

    const updateScale = () => {
      const viewport = sceneViewportRef.current;
      if (!viewport) return;
      const widthScale = viewport.clientWidth / SCENE_BASE_WIDTH;
      const heightScale = viewport.clientHeight / SCENE_BASE_HEIGHT;
      setSceneScale(Math.min(widthScale, heightScale, 1));
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    if (sceneViewportRef.current) observer.observe(sceneViewportRef.current);
    window.addEventListener('resize', updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [activeUrl]);

  return (
    <div className="relative min-h-screen bg-[#f8fafc] overflow-hidden font-sans text-slate-900 transition-colors duration-500">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000000 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />

      {/* Header / Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 sm:flex block items-center justify-between px-8 py-5 bg-white/70 backdrop-blur-2xl border-b border-slate-200/50">
        <div className="flex items-center gap-3">
          <div className="size-10">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-10 h-10"><rect x="10" y="6" width="44" height="30" rx="3" stroke="currentColor" stroke-width="3"></rect><path d="M26 36L24 46H40L38 36" fill="currentColor" opacity="0.1"></path><path d="M26 36L24 46H40L38 36" stroke="currentColor" stroke-width="3" stroke-linejoin="round"></path><path d="M18 46H46" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path><g stroke="#6366F1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M26 14L22 18L26 22"></path><path d="M34 24L30 12"></path><path d="M38 14L42 18L38 22"></path></g><rect x="2" y="30" width="28" height="18" rx="2" fill="white" stroke="currentColor" stroke-width="3"></rect><path d="M0 48H32" stroke="currentColor" stroke-width="4" stroke-linecap="round"></path><path d="M6 34H26" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><rect x="42" y="22" width="16" height="28" rx="3" fill="white" stroke="currentColor" stroke-width="3"></rect><path d="M47 26H53" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path><circle cx="50" cy="45" r="1.5" fill="currentColor"></circle></svg>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-slate-900">SiteSnap</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">By Saifullah</p>
          </div>
        </div>

        <form onSubmit={handleUrlSubmit} className="sm:max-w-2xl sm:mx-12 mx-0 sm:mt-0 mt-4 w-full">
          <div className="relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Globe size={18} className="text-slate-300 group-focus-within:text-slate-500 transition-colors" />
            </div>
            <input
              value={urlInput}
              name="url"
              type="url"
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter website URL to sync..."
              className="w-full bg-slate-100/50 border border-slate-200 rounded-2xl py-3.5 pl-14 pr-28 text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition-all placeholder:text-slate-400 shadow-sm"
            />
            <div className="absolute inset-y-2 right-2 flex gap-1">
              {activeUrl && (
                <button 
                  type="button"
                  onClick={() => {
                    setUrlInput('');
                    setActiveUrl('');
                  }}
                  className="px-3 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors text-xs font-medium"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                className="bg-slate-900 text-white text-xs font-bold px-5 rounded-xl hover:bg-slate-800 transition-all shadow-md active:scale-95"
              >
                Preview
              </button>
            </div>
          </div>
        </form>

        <div />
      </nav>

      {/* Main Showcase Stage */}
      <main className="relative w-full min-h-screen pt-32 pb-40 flex items-center justify-center overflow-x-hidden">
        {/* Empty State */}
        {!activeUrl && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center z-0"
          >
            <div className="text-center max-w-lg px-8">
              <div className="">
                <img
                  src={siteSnapImage}
                  alt="SiteSnap preview"
                  className="object-contain"
                />
              </div>
              <h2 className="sr-only">Visualize your project.</h2>
              <p className="sr-only">
                Experience your work exactly as your users do. Paste a URL to see it synchronized across every display format.
              </p>
            </div>
          </motion.div>
        )}

        {/* Scene Composition */}
        {activeUrl && (
          <div className="relative w-full flex items-center justify-center px-4">
            <div
              ref={sceneViewportRef}
              className="relative w-full max-w-[1400px] h-[72vh] min-h-[440px] max-h-[900px]"
            >
              <div
                className="absolute left-1/2 top-1/2 origin-center transition-transform duration-700"
                style={{
                  width: `${SCENE_BASE_WIDTH}px`,
                  height: `${SCENE_BASE_HEIGHT}px`,
                  transform: `translate(-50%, -50%) scale(${sceneScale})`,
                }}
              >
                {/* Monitor (Center Back) */}
                <div className="absolute top-[20px] left-[260px]">
                  <DeviceFrame type="monitor" url={activeUrl} baseZ={1} dragScale={sceneScale} />
                </div>

                {/* Laptop (Right Foreground) */}
                <div className="absolute top-[380px] left-[640px]">
                  <DeviceFrame type="laptop" url={activeUrl} baseZ={3} dragScale={sceneScale} />
                </div>

                {/* Portrait Monitor (Right Middle) */}
                <div className="absolute top-[220px] left-[1080px]">
                  <DeviceFrame type="monitorPortrait" url={activeUrl} baseZ={2} dragScale={sceneScale} />
                </div>

                {/* Tablet (Left Background/Middle) */}
                <div className="absolute top-[260px] left-[120px]">
                  <DeviceFrame type="tablet" url={activeUrl} baseZ={2} dragScale={sceneScale} />
                </div>

                {/* Mobile (Left Foreground Overlap) */}
                <div className="absolute top-[500px] left-[440px]">
                  <DeviceFrame type="mobile" url={activeUrl} baseZ={4} dragScale={sceneScale} />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="fixed bottom-0 left-0 right-0 pointer-events-none px-12 py-8 z-50 flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-[0.1em] font-semibold">
            Created By{' '}
            <a href="https://iamsaifullah.com" className="cursor-pointer pointer-events-auto">
              Saifullah
            </a>
            {' '}|{' '}
            <a
              href="https://iamsaifullah.com"
              className="cursor-pointer pointer-events-auto"
            >
              Contact
            </a>
          </span>
          {/* <div className="flex items-center gap-3">
            <div className="w-1.5 h-10 bg-slate-900 rounded-full" />
            <span className="text-3xl font-black text-slate-900/5 select-none uppercase tracking-tighter leading-none">REALTIME<br/>MOCKUP</span>
          </div> */}
        </div>
      </footer>
    </div>

  );
}
