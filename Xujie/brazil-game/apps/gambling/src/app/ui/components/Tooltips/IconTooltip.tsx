// import { Tooltip } from 'react-tooltip';
import { Tooltip } from 'antd';
import { TooltipPlacement } from 'antd/es/tooltip';
import React from 'react';
interface IIconTooltipProps {
  id: string;
  content: string;
  icon: React.ReactNode;
  className?: string;
  tooltipStyle?: React.CSSProperties;
  place?: TooltipPlacement;
  // | 'top'
  // | 'top-start'
  // | 'top-end'
  // | 'right'
  // | 'right-start'
  // | 'right-end'
  // | 'bottom'
  // | 'bottom-start'
  // | 'bottom-end'
  // | 'left'
  // | 'left-start'
  // | 'left-end';
  offset?: number;
  afterHide?: () => void;
}

export const IconTooltip = ({
  id,
  content,
  icon,
  className,
  tooltipStyle,
  place = 'top',
  offset = 0,
  afterHide = () => {},
}: IIconTooltipProps) => {
  return (
    <Tooltip
      align={{
        offset: [0, offset+20],
      }}
      showArrow={false}
      placement={place}
      overlayInnerStyle={{
        background: 'transparent',
        boxShadow: 'none',
      }}
      title={
        <div
          style={{
            width: '400px',
            whiteSpace: 'pre-wrap',
            fontSize: '14px',
            lineHeight: 'normal',
            color: 'white',
            ...tooltipStyle,
          }}
        >
          {content}
        </div>
      }
      onOpenChange={(open) => {
        !open && afterHide();
      }}
    >
      <div className={className}>{icon}</div>
    </Tooltip>
    // mobile尺寸  Tooltip会被覆盖
    // <a data-tooltip-id={id} className={className}>
    //   {icon}
    //   <Tooltip
    //   isOpen={true}
    //     arrowColor='transparent'
    //
    //     id={id}
    //     place={place}
    //     offset={offset}
    //     content={content}
    //     afterHide={afterHide}

    //   />
    // </a>
  );
};
