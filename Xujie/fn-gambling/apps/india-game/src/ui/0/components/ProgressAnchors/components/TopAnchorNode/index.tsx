import { AnchorObj } from '@components/ProgressAnchors';

interface TopAnchorNodeProps<TopDataType> {
  top?: AnchorObj<TopDataType>;
  totalAnchorList: number[];
  percent: number;
}

export const TopAnchorNode = <TopDataType,>({
  top,
  totalAnchorList,
  percent,
}: TopAnchorNodeProps<TopDataType>) => {
  return null;
};

export default TopAnchorNode;
