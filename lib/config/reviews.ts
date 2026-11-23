/**
 * Review metadata for the homepage. Copy lives in the home.reviews i18n
 * namespace; ratings stay here so the component stays data-driven.
 */

export const REVIEW_KEYS = ["0", "1", "2"] as const;

export const REVIEW_RATINGS: Record<(typeof REVIEW_KEYS)[number], number> = {
  "0": 5,
  "1": 4,
  "2": 5,
};
