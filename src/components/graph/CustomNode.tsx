import React from 'react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { useRoadmapStore, getNodeStatus } from '../../store/useRoadmapStore';
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
  CheckCircle2
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

const getCategoryLabel = (category: string) => {
  return category.toUpperCase().replace(/_/g, ' ');
};

export type CustomNodeType = Node<{ node: RoadmapNode }, 'customNode'>;

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

export const CustomNode = ({ data, selected }: NodeProps<CustomNodeType>) => {
  const node = data.node;
  const { 
    completedNodeIds, 
    setSelectedNode
  } = useRoadmapStore();

  const nodeStatus = getNodeStatus(node.id, node.prerequisites, completedNodeIds);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedNode(node.id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${node.title} - ${getCategoryLabel(node.category)} - Status: ${nodeStatus}`}
      onKeyDown={handleKeyDown}
      className={twMerge(
        clsx(
          "w-[260px] h-[120px] p-3 rounded-xl border-[3px] bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between shadow-md relative group select-none transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-950 cursor-pointer hover:scale-105",
          getCategoryBorderClass(node.category),
          {
            "bg-emerald-50/20 dark:bg-emerald-950/10": nodeStatus === 'completed',
          },
          {
            "ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400": selected,
          }
        )
      )}
    >
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-2.5 !h-2.5 !bg-zinc-400 dark:!bg-zinc-600 border border-white dark:border-zinc-900" 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-2.5 !h-2.5 !bg-zinc-400 dark:!bg-zinc-600 border border-white dark:border-zinc-900" 
      />

      <div className="flex items-center justify-between w-full">
        <span 
          className={twMerge(
            clsx("text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase flex items-center gap-1", 
              nodeStatus === 'completed'
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200"
                : getCategoryBadgeClass(node.category)
            )
          )}
        >
          {getCategoryLabel(node.category)}
        </span>
        
        <div className="text-slate-400 dark:text-zinc-400">
          {nodeStatus === 'completed' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          ) : (
            getCategoryIcon(node.category)
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center my-1 overflow-hidden">
        <h4 className="font-bold text-xs leading-tight line-clamp-1 text-slate-950 dark:text-white">
          {node.title}
        </h4>
        <p className="text-[10px] text-slate-700 dark:text-zinc-100 leading-snug line-clamp-2 mt-0.5">
          {node.summary}
        </p>
      </div>

      <div className="flex items-center justify-between text-[8.5px] font-medium text-slate-600 dark:text-zinc-300">
        <span />
        <span>{nodeStatus === 'completed' ? 'Completed' : 'Ready to learn'}</span>
      </div>
    </div>
  );
};

export default CustomNode;
