import { cx } from '@libs/commonUtils';
import { FLEX_COL, remToPx } from '@libs/constant/style';
import React from 'react';
import BaseProgress from '@mode2/components/BaseProgress';
import TopAnchorNode from './components/TopAnchorNode';
import BottomAnchorNode from './components/BottomAnchorNode';
import AnchorList from './components/AnchorList';
import { ProgressAnchorsProps } from '../ProgressAnchorsProps';

export const ProgressAnchors = <
  TopDataType = undefined,
  BottomDataType = undefined
>({
  percent,
  size = 12,
  progressStrokeColor = 'var(--base-2-main)',
  progressTrailColor = 'var(--transparent-gray-70)',
  anchors,
  anchorListClassObj,
  baseProgressClassObj,
  customAnchorNode,
  isShowZeroAnchor,
}: ProgressAnchorsProps<TopDataType, BottomDataType>) => {
  const totalAnchorList = anchors.totalAnchorList;
  const sizeRem = size / remToPx;

  return (
    <div
      className={cx(
        'relative',
        FLEX_COL,
        'gap-1',
        baseProgressClassObj?.containerClass
      )}
    >
      {/* 上方的文字 */}
      <TopAnchorNode
        percent={percent}
        totalAnchorList={totalAnchorList}
        top={anchors?.top}
      />

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
        unAchieveAnchorClass={anchorListClassObj?.unAchieveAnchorClass}
        achieveAnchorClass={anchorListClassObj?.achieveAnchorClass}
        className={anchorListClassObj?.className}
        firstAnchorClass={anchorListClassObj?.firstAnchorClass}
        lastAnchorClass={anchorListClassObj?.lastAnchorClass}
        otherAnchorClass={anchorListClassObj?.otherAnchorClass}
        customAnchorNode={customAnchorNode}
        isShowZeroAnchor={isShowZeroAnchor}
      />

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
