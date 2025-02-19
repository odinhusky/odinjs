import { AnchorObj } from '@components/ProgressAnchors';

interface BottomAnchorNodeProps<TopDataType> {
  bottom?: AnchorObj<TopDataType>;
  totalAnchorList: number[];
  percent: number;
}

export const BottomAnchorNode = <TopDataType,>({
  bottom,
  totalAnchorList,
  percent,
}: BottomAnchorNodeProps<TopDataType>) => {
  return null;
};

export default BottomAnchorNode;
