/**
 * Standard animation durations and easing curves for ShipToProd.
 * Keeps transitions consistent across scene nodes, traffic particles, and UI transitions.
 */

export const transitions = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.35,
  slow: 0.6,
  particleTravel: 1.2,
} as const;

export const easings = {
  standard: [0.4, 0, 0.2, 1] as const,
  entrance: [0, 0, 0.2, 1] as const,
  exit: [0.4, 0, 1, 1] as const,
  linear: [0, 0, 1, 1] as const,
};
