'use client';

import React from 'react';
import { useRoadmapStore, getNodeStatus } from '../../store/useRoadmapStore';
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
  ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const getCategoryBorderClass = (category: string) => {
  switch (category) {
    case 'concepts':
      return 'border-purple-500 dark:border-purple-400 hover:shadow-purple-500/10';
    case 'dimensions':
      return 'border-amber-500 dark:border-amber-400 hover:shadow-amber-500/10';
    case 'guiding_principles':
      return 'border-indigo-500 dark:border-indigo-400 hover:shadow-indigo-500/10';
    case 'svs':
      return 'border-rose-500 dark:border-rose-400 hover:shadow-rose-500/10';
    case 'service_value_chain':
      return 'border-teal-500 dark:border-teal-400 hover:shadow-teal-500/10';
    case 'practices_detail':
      return 'border-emerald-500 dark:border-emerald-400 hover:shadow-emerald-500/10';
    case 'practices_overview':
      return 'border-blue-500 dark:border-blue-400 hover:shadow-blue-500/10';
    case 'governance':
      return 'border-sky-500 dark:border-sky-400 hover:shadow-sky-500/10';
    default:
      return 'border-slate-500 dark:border-slate-400';
  }
};

const getCategoryBadgeClass = (category: string) => {
  switch (category) {
    case 'concepts':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-200';
    case 'dimensions':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200';
    case 'guiding_principles':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-200';
    case 'svs':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200';
    case 'service_value_chain':
      return 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-200';
    case 'practices_detail':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200';
    case 'practices_overview':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-200';
    case 'governance':
      return 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-200';
    default:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200';
  }
};

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
    toggleNodeCompletion
  } = useRoadmapStore();

  const allNodes = rawRoadmapData.nodes as RoadmapNode[];
  const filteredNodes = allNodes;

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

                return (
                  <div
                    key={node.id}
                    className={twMerge(
                      clsx(
                        "p-4 rounded-xl border-[3px] flex flex-col justify-between space-y-3 transition-all duration-300 relative group shadow-sm hover:shadow-md hover:-translate-y-0.5 bg-white dark:bg-zinc-900 border-slate-500 dark:border-zinc-400",
                        getCategoryBorderClass(node.category),
                        {
                          "bg-emerald-50/20 dark:bg-emerald-950/10": status === 'completed',
                        }
                      )
                    )}
                  >
                    {/* Header: Badge & Status Icon */}
                    <div className="flex items-center justify-between">
                      <span
                        className={twMerge(
                          clsx(
                            "text-[9px] font-bold px-2 py-0.5 rounded tracking-wider uppercase flex items-center gap-1.5",
                            status === 'completed'
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200"
                              : getCategoryBadgeClass(node.category)
                          )
                        )}
                      >

                        {node.category.toUpperCase().replace(/_/g, ' ')}
                      </span>

                      <div className="flex items-center gap-2">
                        {status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
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
                        className={clsx(
                          "px-2.5 py-1 rounded-lg font-medium text-[11px] transition-colors flex items-center gap-1",
                          status === 'completed'
                            ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200"
                            : "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500"
                        )}
                      >
                        {status === 'completed' ? '✓ Completed' : 'Mark Completed'}
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
