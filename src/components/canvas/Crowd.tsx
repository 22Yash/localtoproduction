import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users as UsersIcon } from 'lucide-react';
import { CROWD_DIMENSIONS } from './projection';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface CrowdProps {
  x: number;
  y: number;
  users: number;
  label?: string;
  badge?: string;
}

// Distinct palette using theme tokens
const CLOTHING_COLORS = [
  'var(--node-app)',
  'var(--accent)',
  'var(--node-redis)',
  'var(--node-mongo)',
  'var(--traffic-request)',
  'var(--traffic-response)',
];

export function Crowd({
  x,
  y,
  users,
  label = 'Users',
}: CrowdProps): React.JSX.Element {
  const reducedMotion = useReducedMotion();
  const { width, height, radius } = CROWD_DIMENSIONS;

  // Exact figure counts: 4 figures at 200 users, 12 at 2,400 users
  const figureCount = users <= 200 ? 4 : users <= 1000 ? 8 : 12;

  // Compute distinct positions
  const positions: Array<{ px: number; py: number; color: string }> = [];

  if (figureCount === 4) {
    // 2x2 grid cleanly centered
    const xs = [-40, 40];
    const ys = [-8, 26];
    let idx = 0;
    for (const r of ys) {
      for (const c of xs) {
        positions.push({
          px: c,
          py: r,
          color: CLOTHING_COLORS[idx % CLOTHING_COLORS.length],
        });
        idx++;
      }
    }
  } else if (figureCount === 8) {
    // 2 rows of 4
    const xs = [-60, -20, 20, 60];
    const ys = [-8, 26];
    let idx = 0;
    for (const r of ys) {
      for (const c of xs) {
        positions.push({
          px: c,
          py: r,
          color: CLOTHING_COLORS[idx % CLOTHING_COLORS.length],
        });
        idx++;
      }
    }
  } else {
    // 12 figures: 3 rows of 4
    const xs = [-66, -22, 22, 66];
    const ys = [-20, 8, 36];
    let idx = 0;
    for (const r of ys) {
      for (const c of xs) {
        positions.push({
          px: c,
          py: r,
          color: CLOTHING_COLORS[idx % CLOTHING_COLORS.length],
        });
        idx++;
      }
    }
  }

  const pillText = `${users.toLocaleString()} users`;
  const pillWidth = Math.max(124, pillText.length * 8.5 + 40);

  return (
    <g transform={`translate(${x}, ${y})`}>
      <motion.g
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Crowd Platform Hard Offset Shadow */}
        <rect
          x={-width / 2 + 4}
          y={-height / 2 + 4}
          width={width}
          height={height}
          rx={radius}
          fill="var(--ink)"
          fillOpacity={0.9}
        />

        {/* Crowd Platform Surface */}
        <rect
          x={-width / 2}
          y={-height / 2}
          width={width}
          height={height}
          rx={radius}
          fill="var(--surface)"
          stroke="var(--ink)"
          strokeWidth={1.5}
        />

        {/* Platform Title ("USERS PLATFORM" caption >= 11px) */}
        <text
          x={0}
          y={-height / 2 + 18}
          textAnchor="middle"
          fill="var(--ink)"
          fillOpacity={0.7}
          fontSize="11"
          fontWeight="bold"
          fontFamily="monospace"
          className="select-none"
        >
          {label.toUpperCase()} PLATFORM
        </text>

        {/* Stylized People Figures: each in its own static positioning group */}
        <g>
          <AnimatePresence>
            {positions.map((pos, index) => (
              <g
                key={`fig-${figureCount}-${index}`}
                transform={`translate(${pos.px}, ${pos.py})`}
              >
                <motion.g
                  initial={reducedMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
                  animate={reducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
                  exit={reducedMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: reducedMotion ? 0 : index * 0.025,
                    ease: 'easeOut',
                  }}
                >
                  {/* Head */}
                  <circle
                    cx={0}
                    cy={-9}
                    r={5.5}
                    fill="var(--ink)"
                  />
                  {/* Torso */}
                  <path
                    d="M -7 11 C -7 0, 7 0, 7 11 Z"
                    fill={pos.color}
                    stroke="var(--ink)"
                    strokeWidth={1.2}
                  />
                </motion.g>
              </g>
            ))}
          </AnimatePresence>
        </g>

        {/* Pill below the platform so figures never overlap it */}
        <g transform={`translate(0, ${height / 2 + 22})`}>
          {/* Hard offset shadow */}
          <rect
            x={-pillWidth / 2 + 2.5}
            y={-13 + 2.5}
            width={pillWidth}
            height={26}
            rx={7}
            fill="var(--ink)"
          />
          {/* Pill body */}
          <rect
            x={-pillWidth / 2}
            y={-13}
            width={pillWidth}
            height={26}
            rx={7}
            fill="var(--surface)"
            stroke="var(--ink)"
            strokeWidth={1.5}
          />
          {/* User icon */}
          <g transform={`translate(${-pillWidth / 2 + 12}, -8)`} className="text-ink">
            <UsersIcon className="w-4 h-4 text-ink" />
          </g>
          {/* User count text */}
          <text
            x={10}
            y={4.5}
            textAnchor="middle"
            fill="var(--ink)"
            fontSize="12"
            fontWeight="bold"
            fontFamily="monospace"
            className="select-none"
          >
            {pillText}
          </text>
        </g>
      </motion.g>
    </g>
  );
}
