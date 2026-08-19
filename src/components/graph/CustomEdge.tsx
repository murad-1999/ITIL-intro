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
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 8,
  });

  const isFeedback = data?.isFeedbackLoop === true;

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan z-30"
          >
            <span
              className={clsx(
                "px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-tight shadow-lg border backdrop-blur-md transition-colors select-none inline-block whitespace-nowrap",
                isFeedback
                  ? "bg-red-950/95 text-red-200 border-red-700/80 shadow-red-950/50"
                  : "bg-slate-900/95 dark:bg-zinc-900/95 text-slate-100 dark:text-zinc-100 border-slate-700 dark:border-zinc-700 shadow-black/40"
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
