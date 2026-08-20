'use client';

import React from 'react';
import { useRoadmapStore, getNodeStatus, CHANGE_MANAGER_FOCUS_NODE_IDS } from '../../store/useRoadmapStore';
import rawRoadmapData from '../../data/itil-roadmap.json';
import { type RoadmapNode } from '../../types/schema';
import { 
  BookOpen, 
  Layers, 
  Compass, 
  Settings, 
  Workflow, 
  Activity, 
  Eye, 
  Shield, 
  CheckCircle2, 
  Lock,
  ChevronRight,
  Target
} from 'lucide-react';
import { clsx } from 'clsx';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'concepts':
      return <BookOpen className="w-4 h-4" />;
    case 'dimensions':
      return <Layers className="w-4 h-4" />;
    case 'guiding_principles':
      return <Compass className="w-4 h-4" />;
    case 'svs':
      return <Settings className="w-4 h-4" />;
    case 'service_value_chain':
      return <Workflow className="w-4 h-4" />;
    case 'practices_detail':
      return <Activity className="w-4 h-4" />;
    case 'practices_overview':
      return <Eye className="w-4 h-4" />;
    case 'governance':
      return <Shield className="w-4 h-4" />;
    default:
      return <BookOpen className="w-4 h-4" />;
  }
};

const categoryGroups = [
  {
    title: '1. Key Concepts of Service Management',
    categories: ['concepts'],
    description: 'Foundational definitions of value, utility, warranty, roles, costs, and service relationships.'
  },
  {
    title: '2. The 4 Dimensions of Service Management',
    categories: ['dimensions'],
    description: 'The holistic perspectives required to create efficient, effective service value.'
  },
  {
    title: '3. The 7 ITIL Guiding Principles',
    categories: ['guiding_principles'],
    description: 'Universal recommendations that guide an organization in all circumstances.'
  },
  {
    title: '4. Service Value System & Value Chain',
    categories: ['svs', 'governance', 'service_value_chain'],
    description: 'How organizational components and activities work together to co-create value.'
  },
  {
    title: '5. Management Practices',
    categories: ['practices_overview', 'practices_detail'],
    description: 'Sets of organizational resources designed for performing work or accomplishing objectives.'
  }
];

export function MasterGridView() {
  const { 
    completedNodeIds, 
    setSelectedNode, 
    toggleNodeCompletion,
    searchQuery, 
    isChangeManagerFocusMode 
  } = useRoadmapStore();

  const allNodes = rawRoadmapData.nodes as RoadmapNode[];

  // Filter nodes if search query is active
  const filteredNodes = searchQuery.trim()
    ? allNodes.filter((node) =>
        node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allNodes;

  return (
    <div className="w-full h-full border border-slate-300 dark:border-zinc-800 rounded-xl overflow-y-auto bg-slate-50 dark:bg-zinc-950 p-4 sm:p-6 space-y-6 sm:space-y-8 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span>Master Syllabus Overview Grid</span>
            <span className="text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {filteredNodes.length} / {allNodes.length} Items Listed
            </span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            View, read, and track all ITIL 4 Foundation syllabus items simultaneously with 100% text clarity.
          </p>
        </div>
      </div>

      {categoryGroups.map((group) => {
        const groupNodes = filteredNodes.filter((n) => group.categories.includes(n.category));
        if (groupNodes.length === 0) return null;

        return (
          <section key={group.title} className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{group.title}</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">{group.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupNodes.map((node) => {
                const status = getNodeStatus(node.id, node.prerequisites, completedNodeIds);
                const isFocusedNode = CHANGE_MANAGER_FOCUS_NODE_IDS.includes(node.id);
                const isFocusDimmed = isChangeManagerFocusMode && !isFocusedNode;
                const isSearchMatched = searchQuery.trim().length > 0;

                return (
                  <div
                    key={node.id}
                    className={clsx(
                      "p-4 rounded-xl border-[3px] flex flex-col justify-between space-y-3 transition-all duration-300 relative group shadow-sm hover:shadow-md hover:-translate-y-0.5",
                      status === 'locked'
                        ? "bg-slate-100/70 dark:bg-zinc-900/60 border-dashed border-slate-400 dark:border-zinc-650 opacity-60"
                        : status === 'completed'
                        ? "bg-emerald-50/50 dark:bg-emerald-950/30 border-green-600 dark:border-green-500 shadow-sm"
                        : "bg-white dark:bg-zinc-900 border-slate-500 dark:border-zinc-400 hover:border-blue-600 dark:hover:border-blue-400 shadow-sm dark:shadow-zinc-950/50",
                      isSearchMatched && "ring-2 ring-amber-400 dark:ring-amber-300 shadow-amber-500/20",
                      isChangeManagerFocusMode && isFocusedNode && "ring-2 ring-blue-500 dark:ring-blue-400 shadow-blue-500/20",
                      isFocusDimmed && "opacity-45 grayscale"
                    )}
                  >
                    {/* Header: Badge & Status Icon */}
                    <div className="flex items-center justify-between">
                      <span
                        className={clsx(
                          "text-[9px] font-bold px-2 py-0.5 rounded tracking-wider uppercase flex items-center gap-1.5",
                          status === 'locked' && "bg-slate-200 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300",
                          status === 'available' && "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
                          status === 'completed' && "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200"
                        )}
                      >
                        {isChangeManagerFocusMode && isFocusedNode && (
                          <Target className="w-2.5 h-2.5 text-blue-500 animate-pulse" />
                        )}
                        {node.category.toUpperCase().replace(/_/g, ' ')}
                      </span>

                      <div className="flex items-center gap-2">
                        {status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : status === 'locked' ? (
                          <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                        ) : (
                          <div className="text-blue-600 dark:text-blue-400">
                            {getCategoryIcon(node.category)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Title & Summary */}
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                        {node.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed mt-1 line-clamp-3">
                        {node.summary}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 border-t border-slate-200/80 dark:border-zinc-800/80 flex items-center justify-between gap-2 text-xs">
                      <button
                        onClick={() => toggleNodeCompletion(node.id)}
                        disabled={status === 'locked'}
                        className={clsx(
                          "px-2.5 py-1 rounded-lg font-medium text-[11px] transition-colors flex items-center gap-1",
                          status === 'completed'
                            ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200"
                            : status === 'locked'
                            ? "text-slate-400 dark:text-zinc-500 cursor-not-allowed"
                            : "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500"
                        )}
                      >
                        {status === 'completed' ? '✓ Completed' : status === 'locked' ? 'Locked' : 'Mark Completed'}
                      </button>

                      <button
                        onClick={() => setSelectedNode(node.id)}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium text-[11px] flex items-center gap-1 transition-colors shadow-sm"
                      >
                        <span>Open Drawer</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default MasterGridView;
