'use client';

import React, { useMemo } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  MiniMap, 
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
  type NodeMouseHandler,
  type NodeTypes,
  type Node
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Plus, Minus, Maximize } from 'lucide-react';

import { useRoadmapStore } from '../../store/useRoadmapStore';
import { calculateGraphLayout } from '../../lib/layout';
import { validateRoadmapPayload } from '../../lib/validator';
import rawRoadmapData from '../../data/itil-roadmap.json';
import CustomNode from './CustomNode';

const nodeTypes: NodeTypes = {
  customNode: CustomNode,
};

const ZoomControls = () => {
  const { zoomIn, zoomOut, zoomTo, fitView, getViewport } = useReactFlow();
  const [zoomLevel, setZoomLevel] = React.useState(1.0);

  // Sync the slider position with the actual viewport zoom
  React.useEffect(() => {
    const interval = setInterval(() => {
      try {
        const { zoom } = getViewport();
        setZoomLevel(zoom);
      } catch {
        // Safe fallback in case react flow instance isn't ready
      }
    }, 200);
    return () => clearInterval(interval);
  }, [getViewport]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextZoom = parseFloat(e.target.value);
    setZoomLevel(nextZoom);
    zoomTo(nextZoom);
  };

  return (
    <div className="absolute bottom-6 right-[230px] z-50 flex items-center gap-3 bg-white/90 dark:bg-zinc-950/90 border border-slate-300 dark:border-zinc-800 p-2.5 rounded-xl shadow-2xl backdrop-blur-md pointer-events-auto select-none transition-colors">
      {/* Zoom Level Indicator */}
      <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 min-w-[32px] text-right">
        {Math.round(zoomLevel * 100)}%
      </span>

      {/* Zoom Out Button */}
      <button
        onClick={() => {
          zoomOut({ duration: 150 });
          setTimeout(() => setZoomLevel(getViewport().zoom), 160);
        }}
        className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-300 dark:border-zinc-800 rounded-lg text-slate-700 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white transition-all flex items-center justify-center shadow-sm"
        title="Zoom Out"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      {/* Zoom Slider */}
      <input
        type="range"
        min="0.05"
        max="2.5"
        step="0.05"
        value={zoomLevel}
        onChange={handleSliderChange}
        className="w-24 h-1.5 bg-slate-300 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500 hover:accent-blue-500 transition-colors"
        title="Zoom Slider"
      />

      {/* Zoom In Button */}
      <button
        onClick={() => {
          zoomIn({ duration: 150 });
          setTimeout(() => setZoomLevel(getViewport().zoom), 160);
        }}
        className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-300 dark:border-zinc-800 rounded-lg text-slate-700 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white transition-all flex items-center justify-center shadow-sm"
        title="Zoom In"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-5 bg-slate-300 dark:bg-zinc-800" />

      {/* Recenter / Focus Canvas View Button (other than reset progress) */}
      <button
        onClick={() => {
          fitView({ duration: 300, padding: 0.05 });
          setTimeout(() => setZoomLevel(getViewport().zoom), 310);
        }}
        className="p-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-300 dark:border-zinc-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg text-slate-700 dark:text-zinc-300 transition-all flex items-center gap-1.5 text-[11px] font-medium shadow-sm"
        title="Fit whole roadmap within canvas view"
      >
        <Maximize className="w-3.5 h-3.5" />
        Recenter
      </button>
    </div>
  );
};

const RoadmapFlow = () => {
  const { setSelectedNode, selectedNodeId, theme } = useRoadmapStore();
  const { fitView } = useReactFlow();

  // Validate and layout the graph data deterministically
  const { initialNodes, initialEdges } = useMemo(() => {
    const validated = validateRoadmapPayload(rawRoadmapData);
    const { nodes, edges } = calculateGraphLayout(validated.nodes, validated.edges, 'LR');
    return { initialNodes: nodes, initialEdges: edges };
  }, []);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  // Set default initial view zoomed in to see at least 3 tiles clearly readable
  React.useEffect(() => {
    const timer = setTimeout(() => {
      fitView({
        nodes: [
          { id: 'value-co-creation' }, 
          { id: 'service-relationships' }, 
          { id: 'utility-warranty' },
          { id: 'key-roles' }
        ],
        duration: 400,
        padding: 0.25,
      });
    }, 150);
    return () => clearTimeout(timer);
  }, [fitView]);

  // Handle node selection
  const onNodeClick: NodeMouseHandler = (_event, node) => {
    setSelectedNode(node.id);
  };

  const onPaneClick = () => {
    setSelectedNode(null);
  };

  // Sync selected outline status in nodes array
  const finalNodes = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      selected: node.id === selectedNodeId,
    }));
  }, [nodes, selectedNodeId]);

  const dotColor = theme === 'dark' ? '#3f3f46' : '#cbd5e1';
  const miniMapMask = theme === 'dark' ? 'rgba(9, 9, 11, 0.85)' : 'rgba(241, 245, 249, 0.85)';

  return (
    <ReactFlow
      nodes={finalNodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodeClick={onNodeClick}
      onPaneClick={onPaneClick}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      minZoom={0.1}
      maxZoom={2.5}
      defaultMarkerColor={theme === 'dark' ? '#94a3b8' : '#64748b'}
    >
      <Background variant={BackgroundVariant.Dots} gap={20} size={1.2} color={dotColor} />
      <Controls showInteractive={false} showZoom={false} />
      <MiniMap 
        nodeColor={(node: Node) => {
          const category = (node.data as { node?: { category?: string } })?.node?.category;
          if (category === 'practices_detail') return '#3b82f6';
          if (category === 'practices_overview') return '#60a5fa';
          if (category === 'concepts') return '#a855f7';
          return theme === 'dark' ? '#e2e8f0' : '#475569';
        }}
        maskColor={miniMapMask}
        className="bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 rounded-xl transition-colors"
        pannable
        zoomable
      />
      <ZoomControls />
    </ReactFlow>
  );
};

export const RoadmapCanvas = () => {
  return (
    <div className="w-full h-full border border-slate-300 dark:border-zinc-800 rounded-xl overflow-hidden bg-slate-200/50 dark:bg-zinc-950 relative transition-colors">
      <ReactFlowProvider>
        <RoadmapFlow />
      </ReactFlowProvider>
    </div>
  );
};

export default RoadmapCanvas;
