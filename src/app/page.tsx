'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { NodeDetailSheet } from '../components/drawer/NodeDetailSheet';
import { MasterGridView } from '../components/grid/MasterGridView';
import rawRoadmapData from '../data/itil-roadmap.json';
import { 
  Compass, 
  Sparkles,
  RotateCcw,
  X,
  Keyboard,
  Sun,
  Moon,
  LayoutGrid,
  ListFilter,
  SlidersHorizontal,
  Info
} from 'lucide-react';

// Dynamically load the RoadmapCanvas with SSR disabled to prevent hydration failures
const RoadmapCanvas = dynamic(() => import('../components/graph/RoadmapCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[600px] flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl animate-pulse p-8">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-sm font-semibold text-slate-600 dark:text-zinc-400">Loading interactive canvas layout...</p>
    </div>
  ),
});

export default function Home() {
  const { 
    completedNodeIds, 
    resetProgress,
    hasHydrated,
    theme,
    toggleTheme,
    viewMode,
    setViewMode
  } = useRoadmapStore();

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [infoOverlayOpen, setInfoOverlayOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync html element class with theme state
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const progressPercent = mounted && hasHydrated
    ? Math.round((completedNodeIds.length / rawRoadmapData.nodes.length) * 100)
    : 0;



  return (
    <div className="min-h-screen bg-slate-100 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/80 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-50 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg text-white shadow-lg shadow-blue-500/20 shrink-0">
            <Compass className="w-5 h-5 sm:w-6 sm:h-6 animate-spin-slow" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent flex items-center gap-1.5 flex-wrap">
              <span className="truncate">ITIL 4 Foundation Roadmap</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-zinc-400 truncate hidden xs:block">Trace prerequisites, definitions, resources, and progress.</p>
          </div>
        </div>

        {mounted && hasHydrated && (
          <div className="flex items-center gap-2 shrink-0">
            {/* View Mode Toggle: Interactive Canvas vs All Nodes Grid */}
            <div className="flex items-center bg-slate-100 dark:bg-zinc-900 p-0.5 sm:p-1 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
              <button
                onClick={() => setViewMode('canvas')}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  viewMode === 'canvas'
                    ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Interactive Canvas Graph View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Canvas Graph</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="All Nodes Master Grid View"
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Master Grid</span>
              </button>
            </div>

            {/* Mobile Controls Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center p-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white shadow-sm transition-all"
              title="Toggle settings & filters"
            >
              <SlidersHorizontal className={`w-3.5 h-3.5 transition-transform ${mobileMenuOpen ? 'rotate-90 text-blue-600 dark:text-blue-400' : ''}`} />
            </button>

            {/* Desktop Settings Tray */}
            <div className="hidden md:flex items-center gap-3">




              {/* Theme Toggle Button (Light / Dark) */}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200 shadow-sm bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>

              {/* Progress indicators */}
              <div className="flex items-center gap-3 bg-white/80 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800/80 px-3 py-1.5 rounded-xl">
                <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Syllabus Mastery:</span>
                <div className="w-24 bg-slate-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden border border-slate-300 dark:border-zinc-700 relative">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="font-bold text-xs text-emerald-600 dark:text-green-400 min-w-[40px] text-right">
                  {progressPercent}%
                </span>
              </div>

              {/* Reset progress */}
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to reset all your syllabus progress?")) {
                    resetProgress();
                  }
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl text-xs text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200 transition-all duration-200"
                title="Reset progress"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Collapsible Control Tray (Glassmorphism + soft shadow) */}
      {mounted && hasHydrated && mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/90 backdrop-blur-lg px-6 py-4 flex flex-col gap-4 sticky top-[57px] z-40 shadow-lg animate-in fade-in slide-in-from-top-4 duration-200">


          <div className="flex flex-wrap items-center gap-3">


            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all duration-200 shadow-sm bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800/80 px-4 py-2.5 rounded-xl">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Mastery:</span>
              <span className="font-bold text-xs text-emerald-600 dark:text-green-400">
                {progressPercent}%
              </span>
            </div>
            <div className="flex-1 max-w-[120px] bg-slate-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden border border-slate-300 dark:border-zinc-700 relative">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {/* Reset progress */}
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to reset all your syllabus progress?")) {
                  resetProgress();
                }
              }}
              className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg text-xs text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200 transition-all duration-200"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace: Full Screen Canvas vs Grid */}
      <main className="flex-1 flex flex-col relative p-2 sm:p-4 h-[calc(100vh-65px)] min-h-0">
        
        {/* Workspace container */}
        <div className="flex-1 min-h-0 w-full relative">
          <div className="absolute inset-0">
            {viewMode === 'canvas' ? (
              <RoadmapCanvas />
            ) : (
              <MasterGridView />
            )}
          </div>
        </div>

        {/* Float instructions banner & legend only in Canvas view (Desktop only) */}
        {viewMode === 'canvas' && (
          <>
            <div className="hidden md:flex absolute top-8 left-8 p-3 bg-white/90 dark:bg-zinc-950/80 backdrop-blur-md rounded-xl border border-slate-200 dark:border-zinc-800 text-[10px] text-slate-600 dark:text-zinc-400 pointer-events-none flex-col gap-1 shadow-lg max-w-xs transition-colors">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Click any node to view definitions, interactive matrix, and resources.</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-500 pt-0.5 border-t border-slate-200 dark:border-zinc-800/80">
                <Keyboard className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400 shrink-0" />
                <span>Use <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-zinc-800 rounded text-slate-700 dark:text-zinc-300 font-mono text-[9px]">Tab</kbd> and <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-zinc-800 rounded text-slate-700 dark:text-zinc-300 font-mono text-[9px]">Enter</kbd> for keyboard navigation.</span>
              </div>
            </div>

            <div className="hidden md:flex absolute bottom-8 left-8 p-3 bg-white/90 dark:bg-zinc-950/80 backdrop-blur-md rounded-xl border border-slate-200 dark:border-zinc-800 text-[10px] space-y-1.5 shadow-lg flex-col pointer-events-none transition-colors">
              <span className="font-bold text-slate-800 dark:text-zinc-300 uppercase tracking-wider mb-1">Syllabus Categories</span>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm bg-purple-500 shrink-0" />
                  <span className="text-slate-600 dark:text-zinc-400">Key Concepts</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm bg-amber-500 shrink-0" />
                  <span className="text-slate-600 dark:text-zinc-400">4 Dimensions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm bg-indigo-500 shrink-0" />
                  <span className="text-slate-600 dark:text-zinc-400">Guiding Principles</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm bg-rose-500 shrink-0" />
                  <span className="text-slate-600 dark:text-zinc-400">SVS</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm bg-teal-500 shrink-0" />
                  <span className="text-slate-600 dark:text-zinc-400">Value Chain</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm bg-sky-500 shrink-0" />
                  <span className="text-slate-600 dark:text-zinc-400">Governance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shrink-0" />
                  <span className="text-slate-600 dark:text-zinc-400">Practices Detail</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm bg-blue-500 shrink-0" />
                  <span className="text-slate-600 dark:text-zinc-400">Practices Overview</span>
                </div>
              </div>

              <div className="w-full h-px bg-slate-200 dark:bg-zinc-800 my-1" />

              <span className="font-bold text-slate-800 dark:text-zinc-300 uppercase tracking-wider mb-1">Status Key</span>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm bg-slate-350 dark:bg-zinc-700 border border-slate-450 dark:border-zinc-500" />
                <span className="text-slate-600 dark:text-zinc-400">Incomplete (Color coded outline)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500 border border-emerald-600 flex items-center justify-center text-white text-[7px] font-bold">✓</div>
                <span className="text-slate-600 dark:text-zinc-400">Completed (Green check + tint)</span>
              </div>

              <div className="w-full h-px bg-slate-200 dark:bg-zinc-800 my-1" />

              <span className="font-bold text-slate-800 dark:text-zinc-300 uppercase tracking-wider mb-1">Relationships</span>
              <div className="flex items-center gap-2">
                <div className="w-5 h-0.5 bg-slate-400 dark:bg-zinc-500 relative">
                  <div className="absolute right-0 -top-[3px] w-2 h-2 border-t-2 border-r-2 border-slate-400 dark:border-zinc-500 transform rotate-45" />
                </div>
                <span className="text-slate-600 dark:text-zinc-400">Prerequisite / Next Steps</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-0.5 border-t-2 border-dashed border-red-500 relative">
                  <div className="absolute right-0 -top-[3.5px] w-2 h-2 border-t-2 border-r-2 border-red-500 transform rotate-45" />
                </div>
                <span className="text-slate-600 dark:text-zinc-400">Feedback Loop (Continuous alignment)</span>
              </div>
            </div>

            {/* Mobile-only Float Action Button (FAB) for Info & Legend */}
            <button
              onClick={() => setInfoOverlayOpen(true)}
              className="md:hidden fixed bottom-4 left-4 z-40 flex items-center justify-center gap-1 px-3 py-2.5 bg-blue-600/90 dark:bg-blue-500/90 backdrop-blur-md text-white rounded-full shadow-lg hover:bg-blue-600 active:scale-95 transition-all text-xs font-semibold"
            >
              <Info className="w-4 h-4" />
              <span>Info & Legend</span>
            </button>
          </>
        )}

        {/* Mobile Info/Legend Overlay Modal (Antigravity glassmorphic style) */}
        {mounted && hasHydrated && infoOverlayOpen && (
          <div 
            onClick={() => setInfoOverlayOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:hidden"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-white/95 dark:bg-zinc-950/95 backdrop-blur-lg border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-5 w-full max-w-sm space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-slate-800 dark:text-zinc-200"
            >
              <button
                onClick={() => setInfoOverlayOpen(false)}
                className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-slate-250 dark:hover:bg-zinc-900 text-slate-400 hover:text-slate-700 dark:text-zinc-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="space-y-1">
                <h3 className="text-sm font-bold flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                  <Sparkles className="w-4 h-4" />
                  Syllabus Guide
                </h3>
                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-zinc-400">
                  Click any node to view definitions, interactive matrix, and resources. Use Tab and Enter for keyboard navigation.
                </p>
              </div>

              <div className="w-full h-px bg-slate-200 dark:bg-zinc-800" />

              <div className="space-y-2">
                <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400 dark:text-zinc-500">Syllabus Categories</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-sm bg-purple-500 shrink-0" />
                    <span>Concepts</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-sm bg-amber-500 shrink-0" />
                    <span>Dimensions</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-sm bg-indigo-500 shrink-0" />
                    <span>Principles</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-sm bg-rose-500 shrink-0" />
                    <span>SVS</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-sm bg-teal-500 shrink-0" />
                    <span>Value Chain</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-sm bg-sky-500 shrink-0" />
                    <span>Governance</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-sm bg-emerald-500 shrink-0" />
                    <span>Practices Dtl</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-sm bg-blue-500 shrink-0" />
                    <span>Practices Ovw</span>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-slate-200 dark:bg-zinc-800" />

              <div className="space-y-2">
                <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400 dark:text-zinc-500">Status Key</span>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-sm bg-slate-300 dark:bg-zinc-700 border border-slate-400 dark:border-zinc-500" />
                  <span>Incomplete (Outline colored)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500 flex items-center justify-center text-white text-[7px] font-bold">✓</div>
                  <span>Completed</span>
                </div>
              </div>

              <div className="w-full h-px bg-slate-200 dark:bg-zinc-800" />

              <div className="space-y-2">
                <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400 dark:text-zinc-500">Relationships</span>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-5 h-0.5 bg-slate-400 dark:bg-zinc-500 relative shrink-0">
                    <div className="absolute right-0 -top-[3px] w-2 h-2 border-t-2 border-r-2 border-slate-400 dark:border-zinc-500 transform rotate-45" />
                  </div>
                  <span>Prerequisite / Next Steps</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-5 h-0.5 border-t-2 border-dashed border-red-500 relative shrink-0">
                    <div className="absolute right-0 -top-[3.5px] w-2 h-2 border-t-2 border-r-2 border-red-500 transform rotate-45" />
                  </div>
                  <span>Feedback Loop (Continuous alignment)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Slide-over Drawer component */}
        <NodeDetailSheet />
      </main>
    </div>
  );
}
