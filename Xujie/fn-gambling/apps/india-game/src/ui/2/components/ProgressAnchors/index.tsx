import { cx } from '@libs/commonUtils';
import { FLEX_COL, remToPx } from '@libs/constant/style';
import React from 'react';
import BaseProgress from '@mode2/components/BaseProgress';
import TopAnchorNode from './components/TopAnchorNode';
import BottomAnchorNode from './components/BottomAnchorNode';
import AnchorList from './components/AnchorList';

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
  const totalAnchorList = anchors.totalAnchorList;
  const sizeRem = size / remToPx;

  return (
    <div className={cx('w-full', 'relative', FLEX_COL, 'gap-1')}>
      {/* 上方的文字 */}
      <TopAnchorNode
        percent={percent}
        totalAnchorList={totalAnchorList}
        top={anchors?.top}
      />

      <div className={cx('relative')}>
        <BaseProgress
          percent={percent}
          strokeWidth={size}
          strokeColor={progressStrokeColor}
          trailColor={progressTrailColor}
          strokeClass={baseProgressClassObj?.strokeClass}
          trailClass={baseProgressClassObj?.trailClass}
        />

        {/* 錨點們 */}
        <AnchorList
          percent={percent}
          totalAnchorList={totalAnchorList}
          sizeRem={sizeRem}
          unAchieveAnchorClass={unAchieveAnchorClass}
          achieveAnchorClass={achieveAnchorClass}
        />
      </div>

      {/* 下方的文字 */}
      <BottomAnchorNode
        percent={percent}
        totalAnchorList={totalAnchorList}
        bottom={anchors?.bottom}
      />
    </div>
  );
};

export default ProgressAnchors;
