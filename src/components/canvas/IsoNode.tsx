import React from 'react';
import { motion } from 'framer-motion';
import { X as CloseIcon } from 'lucide-react';
import { NodeStatus } from '../../types/course';
import { NODE_DIMENSIONS } from './projection';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface IsoNodeProps {
  id: string;
  x: number;
  y: number;
  color?: string;
  icon?: React.ReactNode;
  label: string;
  sublabel?: string;
  status: NodeStatus;
  badge?: string;
}

export function IsoNode({
  x,
  y,
  color = 'var(--node-app)',
  icon,
  label,
  sublabel,
  status,
  badge,
}: IsoNodeProps): React.JSX.Element | null {
  const reducedMotion = useReducedMotion();

  if (status === 'hidden') {
    return null;
  }

  const { width, height, radius } = NODE_DIMENSIONS;
  const isCrashed = status === 'crashed';
  const isOverloaded = status === 'overloaded';
  const isRecovering = status === 'recovering';

  // Determine background fill from status & theme tokens
  let fillColor = color;
  if (isCrashed) {
    fillColor = 'var(--node-crashed)';
  } else if (isOverloaded) {
    fillColor = 'var(--node-overloaded)';
  } else if (isRecovering) {
    fillColor = 'var(--node-recovering)';
  }

  // Animation variants
  const motionProps = (() => {
    if (reducedMotion) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
      };
    }

    if (isOverloaded) {
      return {
        initial: { opacity: 0, scale: 0.85 },
        animate: {
          opacity: 1,
          scale: [1, 1.03, 1],
          transition: {
            scale: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' },
            opacity: { duration: 0.3 },
          },
        },
        exit: { opacity: 0, scale: 0.85, transition: { duration: 0.25 } },
      };
    }

    if (isRecovering) {
      return {
        initial: { opacity: 0, scale: 0.85 },
        animate: {
          opacity: [0.75, 1, 0.75],
          scale: 1,
          transition: {
            opacity: { repeat: Infinity, duration: 1.4, ease: 'easeInOut' },
            scale: { duration: 0.3 },
          },
        },
        exit: { opacity: 0, scale: 0.85, transition: { duration: 0.25 } },
      };
    }

    return {
      initial: { opacity: 0, scale: 0.85 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.85 },
      transition: { duration: 0.3, ease: 'easeOut' },
    };
  })();

  // Badge pill width estimation
  const badgeText = badge ?? '';
  const badgeWidth = Math.max(60, badgeText.length * 10 + 26);

  return (
    <g transform={`translate(${x}, ${y})`}>
      <motion.g {...motionProps}>
        {/* Hard offset shadow (flat blueprint style) */}
        <rect
          x={-width / 2 + 4}
          y={-height / 2 + 4}
          width={width}
          height={height}
          rx={radius}
          fill="var(--ink)"
          fillOpacity={0.9}
        />

        {/* Main box container */}
        <rect
          x={-width / 2}
          y={-height / 2}
          width={width}
          height={height}
          rx={radius}
          fill={fillColor}
          stroke="var(--ink)"
          strokeWidth={1.5}
        />

        {/* Node Icon */}
        <g transform="translate(-14, -42)" className="text-ink">
          {isCrashed ? (
            <CloseIcon className="w-7 h-7 stroke-[2.5] text-ink" />
          ) : (
            icon
          )}
        </g>

        {/* Node Label (rendered >= 14px at 1440px viewport) */}
        <text
          x={0}
          y={sublabel ? 8 : 12}
          textAnchor="middle"
          fill="var(--ink)"
          fontSize="20.5"
          fontWeight="bold"
          fontFamily="monospace"
          className="select-none"
        >
          {label}
        </text>

        {/* Node Sublabel (rendered >= 12px at 1440px viewport) */}
        {sublabel && (
          <text
            x={0}
            y={35}
            textAnchor="middle"
            fill="var(--ink)"
            fillOpacity={0.7}
            fontSize="17"
            fontFamily="monospace"
            className="select-none"
          >
            {sublabel}
          </text>
        )}

        {/* Node Badge Pill (rendered >= 12px at 1440px viewport) */}
        {badge && (
          <g transform={`translate(${width / 2 - badgeWidth / 2 - 8}, ${-height / 2})`}>
            {/* Hard shadow on badge */}
            <rect
              x={-badgeWidth / 2 + 2}
              y={-13 + 2}
              width={badgeWidth}
              height={26}
              rx={7}
              fill="var(--ink)"
            />
            {/* Badge pill */}
            <rect
              x={-badgeWidth / 2}
              y={-13}
              width={badgeWidth}
              height={26}
              rx={7}
              fill={isCrashed ? 'var(--node-crashed)' : isOverloaded ? 'var(--node-overloaded)' : 'var(--surface)'}
              stroke="var(--ink)"
              strokeWidth={1.2}
            />
            <text
              x={0}
              y={5.5}
              textAnchor="middle"
              fill="var(--ink)"
              fontSize="17"
              fontWeight="bold"
              fontFamily="monospace"
              className="select-none"
            >
              {badge}
            </text>
          </g>
        )}
      </motion.g>
    </g>
  );
}
