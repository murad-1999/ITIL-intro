import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, type EdgeProps } from '@xyflow/react';
import { clsx } from 'clsx';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  data,
}: EdgeProps) {
  const [edgePath, defaultLabelX, defaultLabelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 8,
  });

  const isFeedback = data?.isFeedbackLoop === true;

  // Calculate smart label coordinates to avoid overlapping node cards
  let renderLabelX = defaultLabelX;
  let renderLabelY = defaultLabelY;

  if (label) {
    if (!isFeedback) {
      const isStraightHorizontal = Math.abs(sourceY - targetY) < 25;

      if (isStraightHorizontal) {
        // Straight line: center between source and target, offset slightly above line
        renderLabelX = (sourceX + targetX) / 2;
        renderLabelY = sourceY - 14;
      } else {
        // Bending edge across ranks: place label on the initial horizontal segment
        // near source handle so it stays clear of intermediate nodes on other ranks
        const gap = targetX - sourceX;
        renderLabelX = Math.min(sourceX + 70, sourceX + gap * 0.35);
        renderLabelY = sourceY - 14;
      }
    } else {
      // Feedback loops: offset slightly above the midpoint
      renderLabelY = defaultLabelY - 14;
    }
  }

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -100%) translate(${renderLabelX}px,${renderLabelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan z-20"
          >
            <span
              className={clsx(
                "px-2 py-0.5 rounded-md text-[9.5px] font-semibold tracking-tight shadow-md border backdrop-blur-md transition-colors select-none inline-block whitespace-nowrap",
                isFeedback
                  ? "bg-red-950/95 text-red-200 border-red-700/80 shadow-red-950/50"
                  : "bg-slate-900/95 dark:bg-zinc-900/95 text-slate-100 dark:text-zinc-100 border-slate-700 dark:border-zinc-700 shadow-black/30"
              )}
            >
              {label as string}
            </span>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
