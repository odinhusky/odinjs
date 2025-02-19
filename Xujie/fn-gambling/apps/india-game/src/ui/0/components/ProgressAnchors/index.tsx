import React from 'react';

export interface RenderProps<DataType> {
  isAchieve: boolean;
  data: DataType;
  index: number;
}

export interface AnchorObj<DataType> {
  dataList: DataType[];
  render: (props: RenderProps<DataType>) => React.ReactNode;
}

export interface ProgressAnchorsObj<
  TopDataType = undefined,
  BottomDataType = undefined
> {
  totalAnchorList: number[]; // 0~100 的數字
  top?: AnchorObj<TopDataType>;
  bottom?: AnchorObj<BottomDataType>;
}

interface ProgressAnchorsProps<
  TopDataType = undefined,
  BottomDataType = undefined
> {
  percent: number; // 0~100 的數字
  size?: number; // px 為單位
  progressStrokeColor?: string;
  progressTrailColor?: string;
  anchors: ProgressAnchorsObj<TopDataType, BottomDataType>; // 錨點資料
  unAchieveAnchorClass?: string;
  achieveAnchorClass?: string;
  baseProgressClassObj?: {
    trailClass?: string;
    strokeClass?: string;
  };
}

export const ProgressAnchors = <
  TopDataType = undefined,
  BottomDataType = undefined
>({
  percent,
  size = 12,
  progressStrokeColor = 'var(--base-2-main)',
  progressTrailColor = 'var(--transparent-gray-70)',
  anchors,
  unAchieveAnchorClass,
  achieveAnchorClass,
  baseProgressClassObj,
}: ProgressAnchorsProps<TopDataType, BottomDataType>) => {
  return null;
};

export default ProgressAnchors;
