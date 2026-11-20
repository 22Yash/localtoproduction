import React, { useEffect } from 'react';
import { AnimatePresence, useMotionValue } from 'framer-motion';
import {
  Network,
  Server,
  Zap,
  Database,
  Globe,
  Box,
  Layers,
  Cloud,
  Cpu,
  HardDrive,
  RotateCcw,
  Play,
  Pause,
} from 'lucide-react';
import { NodeKind, SceneNode } from '../../types/course';
import { lessons } from '../../data/modules';
import { useCourseStore } from '../../store/useCourseStore';
import {
  gridToScreen,
  computeConnectorEndpoints,
  getCanvasLayout,
} from './projection';
import { IsoNode } from './IsoNode';
import { Crowd } from './Crowd';
import { Connector } from './Connector';
import { Particle } from './Particle';
import { Legend } from './Legend';
import { FormulaCard } from './FormulaCard';

function getNodeColor(kind: NodeKind): string {
  switch (kind) {
    case 'nginx':
      return 'var(--node-nginx)';
    case 'node':
      return 'var(--node-app)';
    case 'redis':
      return 'var(--node-redis)';
    case 'mongo':
      return 'var(--node-mongo)';
    case 'docker':
      return 'var(--node-app)';
    case 'k8s':
      return 'var(--node-nginx)';
    case 'custom':
      return 'var(--node-custom)';
    default:
      return 'var(--surface)';
  }
}

function getNodeIcon(node: SceneNode): React.ReactNode {
  switch (node.kind) {
    case 'nginx':
      return <Network className="w-6 h-6 text-ink" />;
    case 'node':
      return <Server className="w-6 h-6 text-ink" />;
    case 'redis':
      return <Zap className="w-6 h-6 text-ink" />;
    case 'mongo':
      return <Database className="w-6 h-6 text-ink" />;
    case 'cdn':
      return <Globe className="w-6 h-6 text-ink" />;
    case 'docker':
      return <Box className="w-6 h-6 text-ink" />;
    case 'k8s':
      return <Layers className="w-6 h-6 text-ink" />;
    case 'custom':
      if (node.id.includes('paas')) return <Cloud className="w-6 h-6 text-ink" />;
      if (node.id.includes('iaas') || node.id.includes('vm')) return <Cpu className="w-6 h-6 text-ink" />;
      if (node.id.includes('vps')) return <HardDrive className="w-6 h-6 text-ink" />;
      return <Server className="w-6 h-6 text-ink" />;
    default:
      return <Server className="w-6 h-6 text-ink" />;
  }
}

export function Canvas(): React.JSX.Element {
  const currentLessonId = useCourseStore((s) => s.currentLessonId);
  const currentStepIndex = useCourseStore((s) => s.currentStepIndex);
  const isPlaying = useCourseStore((s) => s.isPlaying);
  const speed = useCourseStore((s) => s.speed);
  const replayNonce = useCourseStore((s) => s.replayNonce);
  const togglePlay = useCourseStore((s) => s.togglePlay);
  const replay = useCourseStore((s) => s.replay);
  const setSpeed = useCourseStore((s) => s.setSpeed);

  const lesson = lessons[currentLessonId];
  const layout = getCanvasLayout(lesson);
  const viewBox = layout.viewBox;
  const step = lesson?.steps[currentStepIndex];
  const nodes = step?.nodes ?? [];
  const visibleNodes = nodes.filter((n) => n.status !== 'hidden');
  const flows = step?.flows ?? [];
  const activeFlows = flows.filter((f) => f.active);

  // Deterministic animation clock driving traffic particles
  const clock = useMotionValue(0);

  // Reset clock on step change, lesson change, or replay action
  useEffect(() => {
    clock.set(0);
  }, [currentStepIndex, currentLessonId, replayNonce, clock]);

  // RequestAnimationFrame clock loop
  useEffect(() => {
    let animId: number;
    let lastTime: number | null = null;

    const tick = (now: number) => {
      if (lastTime !== null && isPlaying) {
        const deltaSec = (now - lastTime) / 1000;
        // Cap deltaSec to 0.1s to prevent jumps if tab was backgrounded
        const cappedDelta = Math.min(deltaSec, 0.1);
        clock.set(clock.get() + cappedDelta * speed);
      }
      lastTime = now;
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, speed, clock]);

  // Build round-robin sequence groups for active flows (excluding crashed targets)
  const flowGroupMap = new Map<string, typeof activeFlows>();
  for (const flow of activeFlows) {
    const targetNode = nodes.find((n) => n.id === flow.to);
    if (targetNode && targetNode.status !== 'crashed') {
      const key = `${flow.from}:${flow.type}`;
      const list = flowGroupMap.get(key) ?? [];
      list.push(flow);
      flowGroupMap.set(key, list);
    }
  }

  // Sort each group deterministically by sequence
  flowGroupMap.forEach((list) => {
    list.sort((a, b) => (a.sequence ?? 1) - (b.sequence ?? 1));
  });

  return (
    <div className="w-full p-2 sm:p-4 flex flex-col items-stretch select-none">
      {/* Top Toolbar Strip: Reserved row above SVG, right-aligned, not floating over diagram */}
      <div className="w-full flex items-center justify-end pb-2 shrink-0">
        <div className="flex items-center gap-1.5 bg-surface border border-ink rounded-lg p-1 shadow-sm select-none">
          <button
            type="button"
            onClick={replay}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-semibold border border-transparent hover:border-ink/20 rounded bg-transparent hover:bg-tint text-ink transition-colors"
            title="Replay step (R)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Replay</span>
          </button>
          <button
            type="button"
            onClick={togglePlay}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-semibold border border-transparent hover:border-ink/20 rounded bg-transparent hover:bg-tint text-ink transition-colors"
            title="Toggle play / pause (Space)"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Play</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setSpeed(speed === 1 ? 2 : 1)}
            className="px-2 py-1 text-xs font-mono font-bold border border-transparent hover:border-ink/20 rounded bg-transparent hover:bg-tint text-ink transition-colors"
            title="Toggle simulation speed (1x / 2x)"
          >
            {speed}x
          </button>
        </div>
      </div>

      {/* Interactive Canvas Area: dynamic viewBox aspect-ratio */}
      <div
        className="w-full relative overflow-hidden"
        style={{ aspectRatio: `${viewBox.width} / ${viewBox.height}` }}
      >
        <svg
          viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full block drop-shadow-sm"
        >
          <defs>
            {/* Faint diamond grid floor pattern */}
            <pattern
              id="canvas-diamond-grid"
              width="48"
              height="28"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 24 0 L 48 14 L 24 28 L 0 14 Z"
                fill="none"
                stroke="var(--divider)"
                strokeWidth="0.8"
                strokeOpacity="0.4"
              />
            </pattern>

            {/* Crisp ink arrowhead marker */}
            <marker
              id="arrowhead"
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerUnits="userSpaceOnUse"
              markerWidth="9"
              markerHeight="9"
              orient="auto"
            >
              <path d="M 1 2 L 8 5 L 1 8 z" fill="var(--ink)" />
            </marker>

            {/* Blocked flow end marker (crisp red X) */}
            <marker
              id="blocked-x"
              viewBox="0 0 12 12"
              refX="6"
              refY="6"
              markerUnits="userSpaceOnUse"
              markerWidth="12"
              markerHeight="12"
              orient="auto"
            >
              <path
                d="M 2 2 L 10 10 M 10 2 L 2 10"
                stroke="var(--traffic-blocked, #EF4444)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </marker>
          </defs>

          {/* Diamond Grid Floor Background */}
          <rect
            width="100%"
            height="100%"
            fill="url(#canvas-diamond-grid)"
            rx="12"
          />

          {/* Connectors Layer */}
          <g id="canvas-connectors">
            <AnimatePresence>
              {activeFlows.map((flow) => {
                const fromNode = nodes.find((n) => n.id === flow.from);
                const toNode = nodes.find((n) => n.id === flow.to);
                if (
                  !fromNode ||
                  !toNode ||
                  fromNode.status === 'hidden' ||
                  toNode.status === 'hidden'
                ) {
                  return null;
                }

                const hasOpposite = activeFlows.some(
                  (f) => f.from === flow.to && f.to === flow.from
                );

                const endpoints = computeConnectorEndpoints(
                  fromNode.position,
                  toNode.position,
                  hasOpposite,
                  layout
                );

                if (!endpoints) return null;

                return (
                  <Connector
                    key={flow.id}
                    id={flow.id}
                    flow={flow}
                    startX={endpoints.startX}
                    startY={endpoints.startY}
                    endX={endpoints.endX}
                    endY={endpoints.endY}
                  />
                );
              })}
            </AnimatePresence>
          </g>

          {/* Traffic Particles Layer */}
          <g id="canvas-particles">
            {activeFlows.map((flow) => {
              const fromNode = nodes.find((n) => n.id === flow.from);
              const toNode = nodes.find((n) => n.id === flow.to);
              if (
                !fromNode ||
                !toNode ||
                fromNode.status === 'hidden' ||
                toNode.status === 'hidden'
              ) {
                return null;
              }

              const isCrashedTarget = toNode.status === 'crashed';
              const hasOpposite = activeFlows.some(
                (f) => f.from === flow.to && f.to === flow.from
              );

              const endpoints = computeConnectorEndpoints(
                fromNode.position,
                toNode.position,
                hasOpposite,
                layout
              );

              if (!endpoints) return null;

              const key = `${flow.from}:${flow.type}`;
              const group = flowGroupMap.get(key) ?? [];
              const groupIndex = Math.max(0, group.findIndex((f) => f.id === flow.id));
              const groupSize = group.length;

              return (
                <Particle
                  key={`particle-${flow.id}`}
                  id={flow.id}
                  type={flow.type}
                  startX={endpoints.startX}
                  startY={endpoints.startY}
                  endX={endpoints.endX}
                  endY={endpoints.endY}
                  groupIndex={groupIndex}
                  groupSize={groupSize}
                  isCrashedTarget={isCrashedTarget}
                  clock={clock}
                />
              );
            })}
          </g>

          {/* Interactive Nodes Layer */}
          <g id="canvas-nodes">
            <AnimatePresence>
              {visibleNodes.map((node) => {
                const screen = gridToScreen(node.position, layout);

                if (node.kind === 'users') {
                  return (
                    <Crowd
                      key={node.id}
                      x={screen.x}
                      y={screen.y}
                      users={step?.crowd?.users ?? 200}
                      label={node.label}
                      badge={node.badge}
                    />
                  );
                }

                return (
                  <IsoNode
                    key={node.id}
                    id={node.id}
                    x={screen.x}
                    y={screen.y}
                    label={node.label}
                    sublabel={node.sublabel}
                    status={node.status}
                    badge={node.badge}
                    color={getNodeColor(node.kind)}
                    icon={getNodeIcon(node)}
                  />
                );
              })}
            </AnimatePresence>
          </g>

          {/* Compact Formula Card: rendered inside SVG in top-left, zero collision */}
          <FormulaCard formula={step?.formula} />

          {/* Legend: rendered inside SVG in bottom-left, zero collision */}
          <Legend flows={flows} />
        </svg>
      </div>
    </div>
  );
}
