import React from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { FlowType } from '../../types/course';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface ParticleProps {
  id: string;
  type: FlowType;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  groupIndex: number;
  groupSize: number;
  isCrashedTarget?: boolean;
  clock: MotionValue<number>;
}

function getTrafficColor(type: FlowType): string {
  switch (type) {
    case 'request':
      return 'var(--traffic-request)';
    case 'response':
      return 'var(--traffic-response)';
    case 'cacheMiss':
      return 'var(--traffic-cache-miss)';
    case 'cacheFill':
    case 'invalidate':
      return 'var(--traffic-invalidate)';
    case 'blocked':
      return 'var(--traffic-blocked, #EF4444)';
    default:
      return 'var(--traffic-request)';
  }
}

export function Particle({
  type,
  startX,
  startY,
  endX,
  endY,
  groupIndex,
  groupSize,
  isCrashedTarget,
  clock,
}: ParticleProps): React.JSX.Element | null {
  const reducedMotion = useReducedMotion();

  // Particle timing configuration (in seconds)
  const travelDuration = 1.0;
  const staggerInterval = 0.85;
  const groupCycle = Math.max(1, groupSize) * staggerInterval;

  // Stagger responses slightly so they follow incoming requests
  const isResponse = type === 'response';
  const responsePhase = isResponse ? 0.45 : 0;
  const emitTime = (groupIndex * staggerInterval + responsePhase) % groupCycle;

  const cx = useTransform(clock, (t) => {
    const cycleTime = t % groupCycle;
    const delta = (cycleTime - emitTime + groupCycle) % groupCycle;
    if (delta <= travelDuration) {
      const p = delta / travelDuration;
      return startX + p * (endX - startX);
    }
    return endX;
  });

  const cy = useTransform(clock, (t) => {
    const cycleTime = t % groupCycle;
    const delta = (cycleTime - emitTime + groupCycle) % groupCycle;
    if (delta <= travelDuration) {
      const p = delta / travelDuration;
      return startY + p * (endY - startY);
    }
    return endY;
  });

  const opacity = useTransform(clock, (t) => {
    if (reducedMotion || isCrashedTarget || type === 'blocked') {
      return 0;
    }
    const cycleTime = t % groupCycle;
    const delta = (cycleTime - emitTime + groupCycle) % groupCycle;
    if (delta <= travelDuration) {
      const p = delta / travelDuration;
      if (p < 0.08) return p / 0.08;
      if (p > 0.92) return (1 - p) / 0.08;
      return 1;
    }
    return 0;
  });

  if (reducedMotion || isCrashedTarget || type === 'blocked') {
    return null;
  }

  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={4.5}
      fill={getTrafficColor(type)}
      stroke="var(--ink)"
      strokeWidth={1}
      style={{ opacity }}
      className="pointer-events-none"
    />
  );
}
