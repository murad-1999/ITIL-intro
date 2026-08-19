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
  HelpCircle
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

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
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'cheatsheet':
        return <BookOpen className="w-4 h-4 text-yellow-400" />;
      case 'video':
        return <PlayCircle className="w-4 h-4 text-red-400" />;
      case 'exam_tip':
        return <HelpCircle className="w-4 h-4 text-purple-400" />;
      default:
        return <ExternalLink className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={twMerge(
          clsx(
            "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )
        )}
        onClick={() => setSelectedNode(null)}
      />

      {/* Slide-over Drawer Panel */}
      <div 
        className={twMerge(
          clsx(
            "fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-zinc-950/95 border-l border-zinc-800 text-zinc-100 z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out transform",
            isOpen ? "translate-x-0" : "translate-x-full"
          )
        )}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase bg-blue-950/40 border border-blue-900 px-2 py-0.5 rounded-full w-max">
              {node.category.replace(/_/g, ' ')}
            </span>
            <h3 className="text-base font-bold text-white mt-1 leading-snug">{node.title}</h3>
          </div>
          <button 
            onClick={() => setSelectedNode(null)}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Prerequisite Alert Panel */}
          {isLocked && (
            <div className="p-4 rounded-xl border border-red-900/60 bg-red-950/20 text-red-300 flex items-start gap-3">
              <Lock className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400">Topic Locked</h4>
                <p className="text-xs text-red-200/80 leading-relaxed mt-1">
                  Complete the following prerequisites on the roadmap before marking this topic as completed:
                </p>
                <ul className="list-disc list-inside mt-2 text-xs space-y-1 pl-1">
                  {unmetPrereqs.map(prereq => (
                    <li key={prereq.id}>
                      <button 
                        onClick={() => setSelectedNode(prereq.id)}
                        className="underline hover:text-red-100 font-medium text-left"
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
          <div className="p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/80">
            <p className="text-xs text-zinc-300 leading-relaxed italic">
              &quot;{node.summary}&quot;
            </p>
          </div>

          {/* Full Markdown explanation render */}
          <div className="space-y-4 prose prose-invert prose-xs max-w-none">
            {node.contentMarkdown.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('# ')) {
                return (
                  <h3 key={index} className="text-base font-bold text-white border-b border-zinc-800 pb-1 mt-6">
                    {paragraph.replace('# ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h4 key={index} className="text-sm font-bold text-zinc-200 mt-4">
                    {paragraph.replace('### ', '')}
                  </h4>
                );
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <ul key={index} className="list-disc list-inside space-y-1.5 pl-2 my-2 text-xs text-zinc-300 leading-relaxed">
                    {paragraph.split('\n').map((li, liIndex) => (
                      <li key={liIndex}>{li.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              
              // Custom table mapping for Utility/Warranty
              if (paragraph.includes('|')) {
                const rows = paragraph.split('\n').filter(r => r.trim() !== '');
                if (rows.length > 1) {
                  return (
                    <div key={index} className="overflow-x-auto my-3 border border-zinc-800 rounded-lg">
                      <table className="min-w-full divide-y divide-zinc-800 text-xs">
                        <tbody className="divide-y divide-zinc-800 bg-zinc-900/20">
                          {rows.map((row, rIndex) => {
                            const cells = row.split('|').map(c => c.trim()).filter((_, cIndex) => cIndex > 0 && cIndex < row.split('|').length - 1);
                            if (row.includes('---')) return null; // skip separator row
                            return (
                              <tr key={rIndex} className={rIndex === 0 ? "bg-zinc-900 font-bold" : ""}>
                                {cells.map((cell, cIndex) => (
                                  <td key={cIndex} className="px-3 py-2 text-zinc-300">{cell}</td>
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
                <p key={index} className="text-xs text-zinc-400 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Resources links list */}
          {node.resources.length > 0 && (
            <div className="border-t border-zinc-800 pt-5">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Study Resources</h4>
              <div className="space-y-2">
                {node.resources.map(resource => (
                  <a
                    key={resource.id}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 hover:bg-zinc-800/40 transition-all text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {getResourceIcon(resource.type)}
                      <span className="font-semibold text-zinc-200">{resource.title}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Sticky Footer with completion action */}
        <div className="p-5 border-t border-zinc-800 bg-zinc-950 flex flex-col gap-3">
          <button
            onClick={() => toggleNodeCompletion(node.id)}
            disabled={isLocked}
            className={twMerge(
              clsx(
                "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-all duration-200",
                isCompleted
                  ? "bg-green-600/20 text-green-400 border-green-500 hover:bg-green-600/30"
                  : isLocked
                    ? "bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent hover:shadow-lg hover:shadow-blue-500/20"
              )
            )}
          >
            <CheckCircle className={`w-4 h-4 ${isCompleted ? 'fill-current text-green-500' : ''}`} />
            {isCompleted ? 'Mark as Incomplete' : isLocked ? 'Prerequisites Required' : 'Mark as Completed'}
          </button>
          
          <button 
            onClick={() => setSelectedNode(null)}
            className="w-full text-center text-xs text-zinc-500 hover:text-zinc-300 py-1.5 transition-colors"
          >
            Dismiss Detail Pane
          </button>
        </div>
      </div>
    </>
  );
};

export default NodeDetailSheet;
