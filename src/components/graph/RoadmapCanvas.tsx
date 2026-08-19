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
import { Plus, Minus } from 'lucide-react';

import { useRoadmapStore } from '../../store/useRoadmapStore';
import { calculateGraphLayout } from '../../lib/layout';
import { validateRoadmapPayload } from '../../lib/validator';
import rawRoadmapData from '../../data/itil-roadmap.json';
import CustomNode from './CustomNode';

const nodeTypes: NodeTypes = {
  customNode: CustomNode,
};

const ZoomControls = () => {
  const { zoomIn, zoomOut } = useReactFlow();

  return (
    <div className="absolute bottom-6 right-6 z-50 flex flex-col gap-2 bg-zinc-950/80 border border-zinc-800 p-1.5 rounded-xl shadow-lg backdrop-blur-md pointer-events-auto">
      <button
        onClick={() => zoomIn({ duration: 150 })}
        className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-300 hover:text-white transition-colors duration-150 flex items-center justify-center shadow-sm"
        title="Zoom In"
      >
        <Plus className="w-4 h-4" />
      </button>
      <button
        onClick={() => zoomOut({ duration: 150 })}
        className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-300 hover:text-white transition-colors duration-150 flex items-center justify-center shadow-sm"
        title="Zoom Out"
      >
        <Minus className="w-4 h-4" />
      </button>
    </div>
  );
};

const RoadmapFlow = () => {
  const { setSelectedNode, selectedNodeId } = useRoadmapStore();

  // Validate and layout the graph data deterministically
  const { initialNodes, initialEdges } = useMemo(() => {
    const validated = validateRoadmapPayload(rawRoadmapData);
    const { nodes, edges } = calculateGraphLayout(validated.nodes, validated.edges, 'LR');
    return { initialNodes: nodes, initialEdges: edges };
  }, []);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

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

  return (
    <ReactFlow
      nodes={finalNodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodeClick={onNodeClick}
      onPaneClick={onPaneClick}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      fitViewOptions={{ padding: 0.05, maxZoom: 1.0 }}
      minZoom={0.05}
      maxZoom={2.5}
      defaultMarkerColor="#94a3b8"
    >
      <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
      <Controls showInteractive={false} showZoom={false} />
      <MiniMap 
        nodeColor={(node: Node) => {
          const category = (node.data as { node?: { category?: string } })?.node?.category;
          if (category === 'practices_detail') return '#3b82f6';
          if (category === 'practices_overview') return '#60a5fa';
          if (category === 'concepts') return '#a855f7';
          return '#e2e8f0';
        }}
        maskColor="rgba(244, 244, 245, 0.4)"
        className="dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
      />
      <ZoomControls />
    </ReactFlow>
  );
};

export const RoadmapCanvas = () => {
  return (
    <div className="w-full h-full border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-950 relative">
      <ReactFlowProvider>
        <RoadmapFlow />
      </ReactFlowProvider>
    </div>
  );
};

export default RoadmapCanvas;
