import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormulaRow } from '../../types/course';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface FormulaCardProps {
  x?: number;
  y?: number;
  formula?: {
    title: string;
    rows: FormulaRow[];
  };
}

export function FormulaCard({
  x = 20,
  y = 20,
  formula,
}: FormulaCardProps): React.JSX.Element | null {
  const reducedMotion = useReducedMotion();

  if (!formula || formula.rows.length === 0) return null;

  const width = 340;
  const height = 124;

  return (
    <AnimatePresence>
      <motion.g
        key={formula.title}
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
        transition={{ duration: 0.25 }}
        className="pointer-events-auto select-none"
      >
        {/* Hard offset shadow */}
        <rect
          x={x + 3}
          y={y + 3}
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

        {/* Header Title */}
        <text
          x={x + 10}
          y={y + 16}
          fill="var(--ink)"
          fillOpacity={0.75}
          fontSize="13.5"
          fontWeight="bold"
          fontFamily="monospace"
          letterSpacing="0.04em"
        >
          {formula.title.toUpperCase()}
        </text>

        {/* Divider Line */}
        <line
          x1={x}
          y1={y + 24}
          x2={x + width}
          y2={y + 24}
          stroke="var(--divider)"
          strokeWidth={1}
        />

        {/* Monospace Formula Rows */}
        {formula.rows.map((row, idx) => {
          const rowY = y + 28 + idx * 22;
          const isHigh = Boolean(row.highlighted);

          return (
            <g key={idx}>
              {isHigh && (
                <rect
                  x={x + 4}
                  y={rowY}
                  width={width - 8}
                  height={20}
                  rx={4}
                  fill="var(--accent)"
                  stroke="var(--ink)"
                  strokeWidth={1}
                />
              )}

              {/* Label */}
              <text
                x={x + 8}
                y={rowY + 15}
                fill="var(--ink)"
                fontSize="15.5"
                fontWeight={isHigh ? 'bold' : '600'}
                fontFamily="monospace"
              >
                {row.label}
              </text>

              {/* Expression */}
              <text
                x={x + 102}
                y={rowY + 15}
                fill="var(--ink)"
                fillOpacity={isHigh ? 1 : 0.7}
                fontSize="15"
                fontWeight={isHigh ? 'bold' : 'normal'}
                fontFamily="monospace"
              >
                {row.expression}
              </text>

              {/* Result */}
              {row.result && (
                <text
                  x={x + width - 8}
                  y={rowY + 15}
                  textAnchor="end"
                  fill="var(--ink)"
                  fontSize="15.5"
                  fontWeight={isHigh ? 'bold' : 'normal'}
                  fontFamily="monospace"
                >
                  {row.result}
                </text>
              )}
            </g>
          );
        })}
      </motion.g>
    </AnimatePresence>
  );
}
