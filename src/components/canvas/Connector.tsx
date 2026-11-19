import React from 'react';
import { motion } from 'framer-motion';
import { Flow } from '../../types/course';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface ConnectorProps {
  id: string;
  flow: Flow;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export function Connector({
  id,
  flow,
  startX,
  startY,
  endX,
  endY,
}: ConnectorProps): React.JSX.Element | null {
  const reducedMotion = useReducedMotion();

  if (!flow.active) {
    return null;
  }

  const isBlocked = flow.type === 'blocked';

  return (
    <motion.line
      key={id}
      x1={startX}
      y1={startY}
      x2={endX}
      y2={endY}
      stroke={isBlocked ? 'var(--traffic-blocked, #EF4444)' : 'var(--ink)'}
      strokeWidth={2.5}
      strokeDasharray={isBlocked ? '6 4' : undefined}
      strokeLinecap="round"
      markerEnd={isBlocked ? 'url(#blocked-x)' : 'url(#arrowhead)'}
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pointer-events-none"
    />
  );
}
