import dagre from '@dagrejs/dagre';
import { type Node, type Edge, MarkerType } from '@xyflow/react';
import { type RoadmapNode, type RoadmapEdge } from '../types/schema';

export function calculateGraphLayout(
  nodes: RoadmapNode[],
  edges: RoadmapEdge[],
  direction = 'LR'
): { nodes: Node[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: direction,
    nodesep: 80,
    ranksep: 120,
  });
  g.setDefaultEdgeLabel(() => ({}));

  // Set nodes in dagre
  nodes.forEach((node) => {
    const width = node.width ?? 260;
    const height = node.height ?? 120;
    g.setNode(node.id, { width, height });
  });

  // Set edges in dagre
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(g);

  // Map to XyFlow Nodes
  const xyNodes: Node[] = nodes.map((node) => {
    const dagreNode = g.node(node.id);
    const width = node.width ?? 260;
    const height = node.height ?? 120;
    
    return {
      id: node.id,
      type: 'customNode',
      data: { node },
      position: {
        x: dagreNode.x - width / 2,
        y: dagreNode.y - height / 2,
      },
      width,
      height,
    };
  });

  // Map to XyFlow Edges
  const xyEdges: Edge[] = edges.map((edge) => {
    const isFeedback = edge.isFeedbackLoop === true;
    
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      type: 'default', // Use default smooth bezier curves
      style: isFeedback
        ? { strokeDasharray: '5,5', stroke: '#ef4444', strokeWidth: 2 }
        : { stroke: '#94a3b8', strokeWidth: 1.5 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: isFeedback ? '#ef4444' : '#94a3b8',
        width: 16,
        height: 16,
      },
    };
  });

  return { nodes: xyNodes, edges: xyEdges };
}
