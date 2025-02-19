interface AnchorListProps {
  percent: number;
  sizeRem: number;
  totalAnchorList: number[]; // 0~100 的數字
  unAchieveAnchorClass?: string;
  achieveAnchorClass?: string;
}
export const AnchorList = ({
  percent,
  sizeRem,
  totalAnchorList,
  unAchieveAnchorClass = 'bgi-[var(--base-1-main)] bgi-border-[var(--linear-2)]',
  achieveAnchorClass = 'bgi-[var(--grayscale-100)] bgi-border-[var(--base-2-main)]',
}: AnchorListProps) => {
  return null;
};

export default AnchorList;
