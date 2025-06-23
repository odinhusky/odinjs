export const RANKING_PAGE_SCALE_TIMES = 0.78571429;

export const scaleRankingValue = ({
  isModalMode,
  value,
}: {
  isModalMode?: boolean;
  value: number;
}): number => (isModalMode ? value * RANKING_PAGE_SCALE_TIMES : value);
