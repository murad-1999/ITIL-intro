'use client';

import React, { useEffect, useState } from 'react';
import { useRoadmapStore, getNodeStatus } from '../../store/useRoadmapStore';
import rawRoadmapData from '../../data/itil-roadmap.json';
import { 
  X, 
  CheckCircle, 
  ExternalLink, 
  Lock, 
  FileText, 
  BookOpen, 
  PlayCircle, 
  HelpCircle,
  ShieldAlert,
  Check,
  AlertCircle
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

// Interactive Change Authority Decision Matrix Mini-Assessment for Change Enablement
const ChangeAuthorityQuiz = () => {
  const scenarios = [
    {
      id: 1,
      scenario: "Routine automated kernel patch deployment via CI/CD testing pipeline on web servers.",
      options: [
        { label: "Standard Change", correct: true, reason: "Low risk, frequent, pre-authorized, follows strict automated procedure." },
        { label: "Normal Change (CAB)", correct: false, reason: "Incorrect: Routing low-risk routine changes to a CAB creates unnecessary bottlenecks." },
        { label: "Emergency Change", correct: false, reason: "Incorrect: This is a scheduled routine deployment, not an urgent crisis." }
      ]
    },
    {
      id: 2,
      scenario: "Migrating the core ERP database to cloud multi-region infrastructure over weekend.",
      options: [
        { label: "Standard Change", correct: false, reason: "Incorrect: Major infrastructure shifts carry high risk and impact, so cannot be pre-authorized." },
        { label: "Normal Change (Change Authority / CAB)", correct: true, reason: "High risk & organizational impact. Requires thorough risk assessment and designated Change Authority (e.g. CAB/Architecture review)." },
        { label: "Emergency Change", correct: false, reason: "Incorrect: This is a planned major initiative, not an active outage or emergency." }
      ]
    },
    {
      id: 3,
      scenario: "Active zero-day remote code execution vulnerability being exploited in production server.",
      options: [
        { label: "Standard Change", correct: false, reason: "Incorrect: Requires rapid response outside normal pre-approved standard scope." },
        { label: "Normal Change", correct: false, reason: "Incorrect: Waiting for full normal change lead time could result in severe data breach." },
        { label: "Emergency Change", correct: true, reason: "Requires immediate implementation. Uses an expedited emergency change authorization pipeline." }
      ]
    }
  ];

  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  const currentScenario = scenarios[activeScenarioIndex];

  return (
    <div className="my-6 p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/60 text-slate-800 dark:text-zinc-200 space-y-4">
      <div className="flex items-center justify-between border-b border-blue-200 dark:border-blue-900/60 pb-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h4 className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
            ITIL 4 Change Authority Decision Simulator
          </h4>
        </div>
        <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-400">
          Scenario {activeScenarioIndex + 1}/{scenarios.length}
        </span>
      </div>

      <p className="text-xs font-medium text-slate-800 dark:text-zinc-200 leading-relaxed">
        {currentScenario.scenario}
      </p>

      <div className="space-y-2">
        {currentScenario.options.map((opt, idx) => {
          const isSelected = selectedAnswers[currentScenario.id] === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedAnswers(prev => ({ ...prev, [currentScenario.id]: idx }))}
              className={twMerge(
                clsx(
                  "w-full text-left p-2.5 rounded-lg border text-xs transition-all flex flex-col gap-1",
                  isSelected
                    ? opt.correct
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200"
                      : "bg-red-50 dark:bg-red-950/40 border-red-500 text-red-900 dark:text-red-200"
                    : "bg-white dark:bg-zinc-900/60 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-700 dark:text-zinc-300"
                )
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{opt.label}</span>
                {isSelected && (
                  opt.correct ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                )}
              </div>
              {isSelected && (
                <p className="text-[11px] opacity-90 leading-tight mt-0.5">
                  {opt.reason}
                </p>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setActiveScenarioIndex(prev => Math.max(0, prev - 1))}
          disabled={activeScenarioIndex === 0}
          className="text-[11px] text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 disabled:opacity-30 disabled:pointer-events-none"
        >
          &larr; Previous Scenario
        </button>
        <button
          onClick={() => setActiveScenarioIndex(prev => Math.min(scenarios.length - 1, prev + 1))}
          disabled={activeScenarioIndex === scenarios.length - 1}
          className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-30 disabled:pointer-events-none"
        >
          Next Scenario &rarr;
        </button>
      </div>
    </div>
  );
};

export const NodeDetailSheet = () => {
  const { 
    selectedNodeId, 
    completedNodeIds, 
    toggleNodeCompletion, 
    setSelectedNode,
    hasHydrated 
  } = useRoadmapStore();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (selectedNodeId) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [selectedNodeId]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedNode(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedNode]);

  if (!hasHydrated || !selectedNodeId) return null;

  const node = rawRoadmapData.nodes.find(n => n.id === selectedNodeId);
  if (!node) return null;

  const status = getNodeStatus(node.id, node.prerequisites, completedNodeIds);
  const isCompleted = status === 'completed';
  const isLocked = status === 'locked';

  // Get unmet prerequisites list
  const unmetPrereqs = node.prerequisites
    .filter(prereqId => !completedNodeIds.includes(prereqId))
    .map(prereqId => {
      const prereqNode = rawRoadmapData.nodes.find(n => n.id === prereqId);
      return { id: prereqId, title: prereqNode?.title || prereqId };
    });

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'documentation':
        return <FileText className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
      case 'cheatsheet':
        return <BookOpen className="w-4 h-4 text-amber-500 dark:text-yellow-400" />;
      case 'video':
        return <PlayCircle className="w-4 h-4 text-red-500 dark:text-red-400" />;
      case 'exam_tip':
        return <HelpCircle className="w-4 h-4 text-purple-500 dark:text-purple-400" />;
      default:
        return <ExternalLink className="w-4 h-4 text-slate-400 dark:text-zinc-400" />;
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={twMerge(
          clsx(
            "fixed inset-0 bg-black/25 dark:bg-black/40 backdrop-blur-[1px] z-50 transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )
        )}
        onClick={() => setSelectedNode(null)}
      />

      {/* Slide-over Drawer Panel */}
      <div 
        className={twMerge(
          clsx(
            "fixed right-0 top-0 bottom-0 w-full sm:w-[500px] bg-white dark:bg-zinc-950 border-l border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out transform",
            isOpen ? "translate-x-0" : "translate-x-full"
          )
        )}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/50">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold tracking-widest text-blue-700 dark:text-blue-400 uppercase bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 px-2 py-0.5 rounded-full w-max">
              {node.category.replace(/_/g, ' ')}
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 leading-snug">{node.title}</h3>
          </div>
          <button 
            onClick={() => setSelectedNode(null)}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
            title="Close drawer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Prerequisite Alert Panel */}
          {isLocked && (
            <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-300 flex items-start gap-3">
              <Lock className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400">Topic Locked</h4>
                <p className="text-xs text-red-700 dark:text-red-200/80 leading-relaxed mt-1">
                  Complete the following prerequisites on the roadmap before marking this topic as completed:
                </p>
                <ul className="list-disc list-inside mt-2 text-xs space-y-1 pl-1">
                  {unmetPrereqs.map(prereq => (
                    <li key={prereq.id}>
                      <button 
                        onClick={() => setSelectedNode(prereq.id)}
                        className="underline hover:text-red-950 dark:hover:text-red-100 font-medium text-left"
                      >
                        {prereq.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Short summary card */}
          <div className="p-4 bg-slate-50 dark:bg-zinc-900/40 rounded-xl border border-slate-200 dark:border-zinc-800/80">
            <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed italic">
              &quot;{node.summary}&quot;
            </p>
          </div>

          {/* Interactive Change Authority Decision Simulator if change-enablement */}
          {node.id === 'change-enablement' && (
            <ChangeAuthorityQuiz />
          )}

          {/* Full Markdown explanation render */}
          <div className="space-y-4 prose dark:prose-invert prose-xs max-w-none">
            {node.contentMarkdown.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('# ')) {
                return (
                  <h3 key={index} className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-zinc-800 pb-1 mt-6">
                    {paragraph.replace('# ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h4 key={index} className="text-sm font-bold text-slate-800 dark:text-zinc-200 mt-4">
                    {paragraph.replace('### ', '')}
                  </h4>
                );
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <ul key={index} className="list-disc list-inside space-y-1.5 pl-2 my-2 text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                    {paragraph.split('\n').map((li, liIndex) => (
                      <li key={liIndex}>{li.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              
              // Custom table mapping for Utility/Warranty or comparisons
              if (paragraph.includes('|')) {
                const rows = paragraph.split('\n').filter(r => r.trim() !== '');
                if (rows.length > 1) {
                  return (
                    <div key={index} className="overflow-x-auto my-3 border border-slate-200 dark:border-zinc-800 rounded-lg">
                      <table className="min-w-full divide-y divide-slate-200 dark:divide-zinc-800 text-xs">
                        <tbody className="divide-y divide-slate-200 dark:divide-zinc-800 bg-slate-50/50 dark:bg-zinc-900/20">
                          {rows.map((row, rIndex) => {
                            const cells = row.split('|').map(c => c.trim()).filter((_, cIndex) => cIndex > 0 && cIndex < row.split('|').length - 1);
                            if (row.includes('---')) return null; // skip separator row
                            return (
                              <tr key={rIndex} className={rIndex === 0 ? "bg-slate-100 dark:bg-zinc-900 font-bold text-slate-900 dark:text-white" : ""}>
                                {cells.map((cell, cIndex) => (
                                  <td key={cIndex} className="px-3 py-2 text-slate-700 dark:text-zinc-300">{cell}</td>
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                }
              }

              return (
                <p key={index} className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Resources links list */}
          {node.resources.length > 0 && (
            <div className="border-t border-slate-200 dark:border-zinc-800 pt-5">
              <h4 className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-3">Study Resources</h4>
              <div className="space-y-2">
                {node.resources.map(resource => (
                  <a
                    key={resource.id}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800/40 transition-all text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {getResourceIcon(resource.type)}
                      <span className="font-semibold text-slate-800 dark:text-zinc-200">{resource.title}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Sticky Footer with completion action */}
        <div className="p-5 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col gap-3">
          <button
            onClick={() => toggleNodeCompletion(node.id)}
            disabled={isLocked}
            className={twMerge(
              clsx(
                "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-all duration-200",
                isCompleted
                  ? "bg-emerald-50 dark:bg-green-600/20 text-emerald-700 dark:text-green-400 border-emerald-400 dark:border-green-500 hover:bg-emerald-100 dark:hover:bg-green-600/30"
                  : isLocked
                    ? "bg-slate-100 dark:bg-zinc-900 text-slate-400 dark:text-zinc-600 border-slate-200 dark:border-zinc-800 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent hover:shadow-lg hover:shadow-blue-500/20"
              )
            )}
          >
            <CheckCircle className={`w-4 h-4 ${isCompleted ? 'fill-current text-emerald-600 dark:text-green-500' : ''}`} />
            {isCompleted ? 'Mark as Incomplete' : isLocked ? 'Prerequisites Required' : 'Mark as Completed'}
          </button>
          
          <button 
            onClick={() => setSelectedNode(null)}
            className="w-full text-center text-xs text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300 py-1.5 transition-colors"
          >
            Dismiss Detail Pane
          </button>
        </div>
      </div>
    </>
  );
};

export default NodeDetailSheet;
