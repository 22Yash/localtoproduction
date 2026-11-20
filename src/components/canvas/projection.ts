import { Lesson } from '../../types/course';

/**
 * Screen projection system for ShipToProd.
 * Converts grid coordinates { x, y } to SVG pixel coordinates.
 * gridToScreen is the single source of truth for coordinate conversion.
 */

export interface Point {
  x: number;
  y: number;
}

export const CANVAS_VIEWBOX = {
  width: 980,
  height: 550,
} as const;

export const NODE_DIMENSIONS = {
  width: 240,
  height: 120,
  radius: 10,
} as const;

export const CROWD_DIMENSIONS = {
  width: 240,
  height: 120,
  radius: 10,
} as const;

const GRID_MAPPING = {
  originX: 160,
  originY: 110,
  unitX: 165,
  unitY: 88,
};

export interface CanvasLayoutConfig {
  viewBox: { width: number; height: number };
  unitX: number;
  unitY: number;
  originX: number;
  originY: number;
  nodeDimensions: { width: number; height: number; radius: number };
}

/**
 * Derives viewBox and projection layout from the union of all node positions across a lesson's steps.
 * For standard lessons (maxX <= 5), yields the exact default 980x550 layout.
 * For wider lessons (e.g. 4 columns of nodes), dynamically calculates width and reduces column spacing
 * to keep node labels >= 12px rendered font size at 1440px viewport.
 */
export function getCanvasLayout(lesson?: Lesson | null): CanvasLayoutConfig {
  const defaultWidth = 980;
  const defaultHeight = 550;
  const defaultUnitX = 165;
  const defaultUnitY = 88;
  const defaultOriginX = 160;
  const defaultOriginY = 110;

  if (!lesson || !lesson.steps || lesson.steps.length === 0) {
    return {
      viewBox: { width: defaultWidth, height: defaultHeight },
      unitX: defaultUnitX,
      unitY: defaultUnitY,
      originX: defaultOriginX,
      originY: defaultOriginY,
      nodeDimensions: NODE_DIMENSIONS,
    };
  }

  // Find max grid x across all steps in the lesson
  let maxX = 5;
  for (const step of lesson.steps) {
    for (const node of step.nodes) {
      if (node.position.x > maxX) {
        maxX = node.position.x;
      }
    }
  }

  // If maxX <= 5, exactly match the default standard layout
  if (maxX <= 5) {
    return {
      viewBox: { width: defaultWidth, height: defaultHeight },
      unitX: defaultUnitX,
      unitY: defaultUnitY,
      originX: defaultOriginX,
      originY: defaultOriginY,
      nodeDimensions: NODE_DIMENSIONS,
    };
  }

  // Wider lesson layout
  const renderedWidth = 721;
  const minRenderedFontSize = 12;
  const baseLabelFontSize = 20.5;

  let unitX = defaultUnitX;
  let lastNodeCenterX = defaultOriginX + (maxX - 1) * unitX;
  let requiredWidth = lastNodeCenterX + NODE_DIMENSIONS.width / 2 + 40;

  // If the wider viewBox would make a node label render below 12px at a 1440px viewport,
  // reduce the spacing between columns (to about node width plus 50: 240 + 50 = 290 px center-to-center => unitX = 145)
  if (baseLabelFontSize * (renderedWidth / requiredWidth) < minRenderedFontSize) {
    unitX = 145;
    lastNodeCenterX = defaultOriginX + (maxX - 1) * unitX;
    requiredWidth = lastNodeCenterX + NODE_DIMENSIONS.width / 2 + 40;
  }

  return {
    viewBox: { width: Math.max(defaultWidth, requiredWidth), height: defaultHeight },
    unitX,
    unitY: defaultUnitY,
    originX: defaultOriginX,
    originY: defaultOriginY,
    nodeDimensions: NODE_DIMENSIONS,
  };
}

/**
 * Converts a grid coordinate { x, y } to canvas SVG center coordinates.
 */
export function gridToScreen(pos: Point, layout?: CanvasLayoutConfig): Point {
  const originX = layout?.originX ?? GRID_MAPPING.originX;
  const originY = layout?.originY ?? GRID_MAPPING.originY;
  const unitX = layout?.unitX ?? GRID_MAPPING.unitX;
  const unitY = layout?.unitY ?? GRID_MAPPING.unitY;
  return {
    x: originX + (pos.x - 1) * unitX,
    y: originY + (pos.y - 1) * unitY,
  };
}

export interface ConnectorEndpoints {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

/**
 * Computes clipped start and end coordinates for a flow connector between two node positions.
 * Coordinates are computed from gridToScreen, trimmed to node boundaries, and offset for opposing flows.
 */
export function computeConnectorEndpoints(
  fromPos: Point,
  toPos: Point,
  hasOppositeFlow = false,
  layout?: CanvasLayoutConfig
): ConnectorEndpoints | null {
  const pA = gridToScreen(fromPos, layout);
  const pB = gridToScreen(toPos, layout);

  const hw = (layout?.nodeDimensions ?? NODE_DIMENSIONS).width / 2;
  const hh = (layout?.nodeDimensions ?? NODE_DIMENSIONS).height / 2;

  const dx = pB.x - pA.x;
  const dy = pB.y - pA.y;
  const L = Math.hypot(dx, dy);

  if (L < 1) return null;

  const ux = dx / L;
  const uy = dy / L;

  // Intersect ray with source box boundary
  const scaleA = Math.min(
    Math.abs(dx) > 0.0001 ? hw / Math.abs(dx) : Infinity,
    Math.abs(dy) > 0.0001 ? hh / Math.abs(dy) : Infinity
  );
  const edgeAx = pA.x + dx * scaleA;
  const edgeAy = pA.y + dy * scaleA;
  let startX = edgeAx + ux * 6;
  let startY = edgeAy + uy * 6;

  // Intersect ray with target box boundary
  const scaleB = Math.min(
    Math.abs(dx) > 0.0001 ? hw / Math.abs(dx) : Infinity,
    Math.abs(dy) > 0.0001 ? hh / Math.abs(dy) : Infinity
  );
  const edgeBx = pB.x - dx * scaleB;
  const edgeBy = pB.y - dy * scaleB;
  let endX = edgeBx - ux * 6;
  let endY = edgeBy - uy * 6;

  // If there's an opposing flow, shift along the right-hand perpendicular normal
  if (hasOppositeFlow) {
    const nx = uy;
    const ny = -ux;
    const offset = 8;
    startX += nx * offset;
    startY += ny * offset;
    endX += nx * offset;
    endY += ny * offset;
  }

  return { startX, startY, endX, endY };
}
