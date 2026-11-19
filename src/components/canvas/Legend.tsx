import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flow, FlowType } from '../../types/course';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface LegendProps {
  x?: number;
  y?: number;
  flows: Flow[];
}

interface LegendItemConfig {
  type: FlowType;
  label: string;
  color: string;
}

const ALL_LEGEND_ITEMS: LegendItemConfig[] = [
  { type: 'request', label: 'request', color: 'var(--traffic-request)' },
  { type: 'response', label: 'response', color: 'var(--traffic-response)' },
  { type: 'cacheMiss', label: 'cache miss', color: 'var(--traffic-cache-miss)' },
  { type: 'cacheFill', label: 'cache fill / write', color: 'var(--traffic-invalidate)' },
  { type: 'invalidate', label: 'invalidate', color: 'var(--traffic-invalidate)' },
];

export function Legend({
  x = 40,
  y = 496,
  flows,
}: LegendProps): React.JSX.Element | null {
  const reducedMotion = useReducedMotion();
  const activeTypes = new Set(flows.filter((f) => f.active).map((f) => f.type));
  const visibleItems = ALL_LEGEND_ITEMS.filter((item) => activeTypes.has(item.type));

  if (visibleItems.length === 0) return null;

  const itemWidth = 85;
  const width = visibleItems.length * itemWidth + 24;
  const height = 26;

  return (
    <AnimatePresence>
      <motion.g
        key="canvas-legend"
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="pointer-events-auto select-none"
      >
        {/* Hard offset shadow */}
        <rect
          x={x + 2}
          y={y + 2}
          width={width}
          height={height}
          rx={6}
          fill="var(--ink)"
          fillOpacity={0.9}
        />

        {/* Card Surface */}
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={6}
          fill="var(--surface)"
          stroke="var(--ink)"
          strokeWidth={1.2}
        />

        {/* Items */}
        {visibleItems.map((item, idx) => {
          const itemX = x + 12 + idx * itemWidth;

          return (
            <g key={item.type}>
              {/* Color dot */}
              <circle
                cx={itemX + 4}
                cy={y + 13}
                r={3.5}
                fill={item.color}
                stroke="var(--ink)"
                strokeWidth={0.8}
              />
              {/* Label */}
              <text
                x={itemX + 13}
                y={y + 16.5}
                fill="var(--ink)"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="500"
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </motion.g>
    </AnimatePresence>
  );
}
