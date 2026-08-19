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
  CheckCircle2, 
  Lock 
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

export const CustomNode = ({ data, selected }: NodeProps<CustomNodeType>) => {
  const node = data.node;
  const { completedNodeIds, hasHydrated } = useRoadmapStore();

  if (!hasHydrated) {
    return (
      <div className="w-[260px] h-[120px] rounded-xl border border-gray-200 bg-gray-50 animate-pulse" />
    );
  }

  const nodeStatus = getNodeStatus(node.id, node.prerequisites, completedNodeIds);

  return (
    <div
      className={twMerge(
        clsx(
          "w-[260px] h-[120px] p-3 rounded-xl border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between shadow-md relative group select-none",
          {
            "opacity-50 border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 grayscale": nodeStatus === 'locked',
            "border-blue-500 dark:border-blue-400 hover:scale-105 transition-transform duration-200 cursor-pointer": nodeStatus === 'available',
            "border-green-500 dark:border-green-400 bg-green-50/10 dark:bg-green-950/10 cursor-pointer": nodeStatus === 'completed',
          },
          {
            "ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400": selected
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
            clsx("text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase", {
              "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400": nodeStatus === 'locked',
              "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300": nodeStatus === 'available',
              "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300": nodeStatus === 'completed',
            })
          )}
        >
          {getCategoryLabel(node.category)}
        </span>
        
        <div className="text-zinc-400 dark:text-zinc-500">
          {nodeStatus === 'completed' ? (
            <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400" />
          ) : nodeStatus === 'locked' ? (
            <Lock className="w-3.5 h-3.5" />
          ) : (
            getCategoryIcon(node.category)
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center my-1.5 overflow-hidden">
        <h4 className="font-semibold text-xs leading-tight line-clamp-1">
          {node.title}
        </h4>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-snug line-clamp-2 mt-0.5">
          {node.summary}
        </p>
      </div>

      <div className="text-[8px] text-zinc-400 dark:text-zinc-500 self-end">
        {nodeStatus === 'locked' ? 'Prerequisites required' : nodeStatus === 'available' ? 'Ready to learn' : 'Completed'}
      </div>
    </div>
  );
};

export default CustomNode;
