import { cx } from '@libs/commonUtils';
import { remToPx } from '@libs/constant/style';
import React from 'react';

export interface BaseProgressProps {
  percent: number; // 0~100 的數字
  strokeWidth?: number; // px 為單位
  strokeColor?: string;
  strokeClass?: string;
  trailColor?: string;
  trailClass?: string;
  strokeStyle?: React.CSSProperties;
}

export const BaseProgress = ({
  percent = 0,
  strokeWidth = 12,
  strokeColor = 'var(--base-2-main)',
  trailColor = 'var(--transparent-gray-70)',
  strokeClass = '',
  trailClass = '',
  strokeStyle = {},
}: BaseProgressProps) => {
  const strokeWidthRem = strokeWidth / remToPx;
  const strokeBg = `bgi-[${strokeColor}]`;
  const trailBg = `bgi-[${trailColor}]`;

  return (
    <div className={cx('w-full')}>
      <div
        className={cx('relative', 'w-full', trailBg, trailClass)}
        style={{
          height: `${strokeWidthRem}rem`,
          borderRadius: `${strokeWidthRem}rem`,
        }}
      >
        <div
          className={cx(
            'duration-500',
            'transition-[all]',
            'ease-[cubic-bezier(0.25, 0.1, 0.25, 1)]',
            'absolute left-0 top-0 z-[1]',
            strokeBg,
            strokeClass
          )}
          style={{
            width: `${percent}%`,
            height: `${strokeWidthRem}rem`,
            borderRadius: `${strokeWidthRem}rem`,
            ...strokeStyle,
          }}
        ></div>
      </div>
    </div>
  );
};

export default BaseProgress;
