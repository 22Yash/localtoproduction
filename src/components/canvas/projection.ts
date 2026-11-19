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

/**
 * Converts a grid coordinate { x, y } to canvas SVG center coordinates.
 */
export function gridToScreen(pos: Point): Point {
  return {
    x: GRID_MAPPING.originX + (pos.x - 1) * GRID_MAPPING.unitX,
    y: GRID_MAPPING.originY + (pos.y - 1) * GRID_MAPPING.unitY,
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
  hasOppositeFlow = false
): ConnectorEndpoints | null {
  const pA = gridToScreen(fromPos);
  const pB = gridToScreen(toPos);

  const hw = NODE_DIMENSIONS.width / 2;
  const hh = NODE_DIMENSIONS.height / 2;

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
