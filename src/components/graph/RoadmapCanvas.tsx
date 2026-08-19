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
  type NodeMouseHandler,
  type NodeTypes,
  type Node
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useRoadmapStore } from '../../store/useRoadmapStore';
import { calculateGraphLayout } from '../../lib/layout';
import { validateRoadmapPayload } from '../../lib/validator';
import rawRoadmapData from '../../data/itil-roadmap.json';
import CustomNode from './CustomNode';

const nodeTypes: NodeTypes = {
  customNode: CustomNode,
};

export const RoadmapCanvas = () => {
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
    <div className="w-full h-full border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      <ReactFlow
        nodes={finalNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={1.5}
        defaultMarkerColor="#94a3b8"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Controls showInteractive={false} />
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
      </ReactFlow>
    </div>
  );
};

export default RoadmapCanvas;
