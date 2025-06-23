import React, { useState } from 'react';
import MilestoneProgressProps from '../MilestoneProgressProps';
import BaseProgress from '@libs/mode2/components/BaseProgress';
import { cx, useDebouncedEffect } from '@libs/commonUtils';

const getProgressSegment = (
  milestones: number[],
  current: number
): [number, number] => {
  if (current <= milestones[0]) return [0, 0];
  if (current >= milestones[milestones.length - 1])
    return [milestones.length - 2, 1];

  for (let i = 1; i < milestones.length; i++) {
    if (current < milestones[i]) {
      const prev = milestones[i - 1];
      const next = milestones[i];
      const withinSegment = (current - prev) / (next - prev);
      return [i - 1, withinSegment];
    }
  }
  return [milestones.length - 2, 1];
};

export const MilestoneProgressBar = ({
  milestones,
  currentValue,
  progressBarContainerClass,

  // BaseProgress 相關 props
  strokeWidth,
  strokeColor,
  strokeClass,
  trailColor,
  trailClass,
  strokeStyle,
}: MilestoneProgressProps) => {
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const [segmentIndex, segmentProgress] = getProgressSegment(
    milestones.map((m) => m.value),
    currentValue
  );
  const progressPercent =
    ((segmentIndex + segmentProgress) / (milestones.length - 1)) * 100;

  useDebouncedEffect(
    () => {
      setAnimatedPercent(progressPercent);
    },
    [progressPercent],
    700
  );

  return (
    <div className="relative w-full h-full">
      {/* Progress Bar */}
      <div
        className={cx(
          'absolute top-1/2 left-0 right-0 transform -translate-y-1/2',
          progressBarContainerClass
        )}
      >
        <BaseProgress
          percent={animatedPercent}
          strokeWidth={strokeWidth}
          strokeColor={strokeColor ? strokeColor : 'var(--state-error-main)'}
          strokeClass={strokeClass}
          strokeStyle={strokeStyle}
          trailColor={trailColor ? trailColor : 'var(--transparent-gray-30)'}
          trailClass={trailClass}
        />
      </div>

      {/* Milestones */}
      {milestones.map((m, i) => {
        const isReached = currentValue >= m.value;
        const isNext = segmentIndex + 1 === i;

        const params = {
          isReached,
          isNext,
        };

        const renderTop =
          typeof m.renderTop === 'function' ? m.renderTop(params) : m.renderTop;

        const renderBottom =
          typeof m.renderBottom === 'function'
            ? m.renderBottom(params)
            : m.renderBottom;

        const renderAnchor =
          typeof m.renderAnchor === 'function'
            ? m.renderAnchor(params)
            : m.renderAnchor ?? (
                <div
                  className={cx(
                    'w-[14px] h-[14px]',
                    'rounded-full',
                    'border-[1.5px]',
                    {
                      'bgi-[var(--base-1-variant1)] bgi-border-[var(--base-1-60)]':
                        isReached,
                      'bgi-[var(--base-2-variant14)] bgi-border-[var(--base-1-variant1)]':
                        !isReached,
                    },
                    'border-gray-500',
                    'z-10'
                  )}
                />
              );

        return (
          <div
            key={m.id}
            className="absolute flex flex-col items-center"
            style={{
              left: `${(i / (milestones.length - 1)) * 100}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="mb-2">{renderTop}</div>
            {renderAnchor}
            <div className="mt-2">{renderBottom}</div>
          </div>
        );
      })}
    </div>
  );
};

export default MilestoneProgressBar;
