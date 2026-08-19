'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { NodeDetailSheet } from '../components/drawer/NodeDetailSheet';
import rawRoadmapData from '../data/itil-roadmap.json';
import { 
  Compass, 
  Sparkles,
  RotateCcw
} from 'lucide-react';

// Dynamically load the RoadmapCanvas with SSR disabled to prevent hydration failures
const RoadmapCanvas = dynamic(() => import('../components/graph/RoadmapCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[600px] flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl animate-pulse p-8">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Loading interactive canvas layout...</p>
    </div>
  ),
});

export default function Home() {
  const { 
    completedNodeIds, 
    resetProgress,
    hasHydrated 
  } = useRoadmapStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const progressPercent = mounted && hasHydrated
    ? Math.round((completedNodeIds.length / rawRoadmapData.nodes.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg text-white shadow-lg shadow-blue-500/20">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent flex items-center gap-2">
              ITIL 4 Foundation Syllabus Roadmap
              <span className="text-[10px] font-normal tracking-wide px-2 py-0.5 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-full">
                Interactive V1.0
              </span>
            </h1>
            <p className="text-xs text-zinc-400">Trace prerequisites, explore key definitions, study resources, and monitor status.</p>
          </div>
        </div>

        {mounted && hasHydrated && (
          <div className="flex items-center gap-6">
            {/* Progress indicators */}
            <div className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-800/80 px-4 py-2 rounded-xl">
              <span className="text-xs text-zinc-400 font-medium">Syllabus Mastery:</span>
              <div className="w-40 bg-zinc-800 h-2.5 rounded-full overflow-hidden border border-zinc-700 relative">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="font-bold text-xs text-green-400 min-w-[50px] text-right">
                {progressPercent}% ({completedNodeIds.length}/{rawRoadmapData.nodes.length})
              </span>
            </div>

            {/* Reset progress */}
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to reset all your syllabus progress?")) {
                  resetProgress();
                }
              }}
              className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 rounded-xl text-xs text-zinc-400 hover:text-zinc-200 transition-all duration-200"
              title="Reset progress"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        )}
      </header>

      {/* Main Workspace: Full Screen Canvas */}
      <main className="flex-1 flex flex-col relative p-4 h-[calc(100vh-73px)] min-h-0">
        
        {/* Canvas container */}
        <div className="flex-1 min-h-0 w-full relative">
          <div className="absolute inset-0">
            <RoadmapCanvas />
          </div>
        </div>

        {/* Float instructions banner at top-left of canvas */}
        <div className="absolute top-8 left-8 p-3 bg-zinc-950/80 backdrop-blur-md rounded-xl border border-zinc-800 text-[10px] text-zinc-400 pointer-events-none flex items-center gap-2 shadow-lg">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Click any node to view definitions, tables, resources, and mark completed.</span>
        </div>

        {/* Floating color legend at bottom-left */}
        <div className="absolute bottom-8 left-8 p-3 bg-zinc-950/80 backdrop-blur-md rounded-xl border border-zinc-800 text-[10px] space-y-1.5 shadow-lg flex flex-col pointer-events-none">
          <span className="font-bold text-zinc-300 uppercase tracking-wider mb-1">Status Key</span>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded bg-zinc-700 border border-dashed border-zinc-500" />
            <span className="text-zinc-400">Locked (Prerequisites missing)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded bg-blue-500" />
            <span className="text-zinc-400">Available (Ready to study)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded bg-green-500" />
            <span className="text-zinc-400">Completed</span>
          </div>

          <div className="w-full h-px bg-zinc-800 my-1" />

          <span className="font-bold text-zinc-300 uppercase tracking-wider mb-1">Relationships</span>
          <div className="flex items-center gap-2">
            <div className="w-5 h-0.5 bg-zinc-500 relative">
              <div className="absolute right-0 -top-[3px] w-2 h-2 border-t-2 border-r-2 border-zinc-500 transform rotate-45" />
            </div>
            <span className="text-zinc-400">Prerequisite / Next Steps</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-0.5 border-t-2 border-dashed border-red-500 relative">
              <div className="absolute right-0 -top-[3.5px] w-2 h-2 border-t-2 border-r-2 border-red-500 transform rotate-45" />
            </div>
            <span className="text-zinc-400">Feedback Loop (Continuous alignment)</span>
          </div>
        </div>

        {/* Global Slide-over Drawer component */}
        <NodeDetailSheet />
      </main>
    </div>
  );
}
