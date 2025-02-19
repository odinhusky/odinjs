import { TooltipPlacement } from 'antd/es/tooltip';
import * as React from 'react';
import { RenderFunction } from 'antd/es/_util/getRenderPropValue';
import { cx, useBreakPoint } from '@libs/commonUtils';
import { useState } from 'react';
import { Tooltip } from 'antd';
import Icon from '@components/Icon';
import './index.scss';

type QuestionTooltipProps = {
  placement?: TooltipPlacement;
  title: React.ReactNode | RenderFunction;
  overlayClassName?: string;
  btnClassName?: string;
  iconClassName?: string;
  color?: string;
  iconName?: string;
};

const QuestionTooltip = (props: QuestionTooltipProps) => {
  const { isMobile } = useBreakPoint();

  const [isOpen, setOpen] = useState(false);
  return (
    <Tooltip
      align={{
        offset: [-12.5, 7], // X 軸不變，Y 軸往上或往下 5px
      }}
      {...props}
      trigger={isMobile ? 'click' : 'hover'}
      arrow={true}
      autoAdjustOverflow={false}
      onOpenChange={setOpen}
      color={props.color || 'var(--base-1-dark)'}
      overlayClassName={cx(
        'w-[218px] min-h-[83px] bgi-border-[var(--base-1-light)] text-xs',
        'rounded',
        'border bgi-border-[var(--base-1-main)] after-rounded',
        props.overlayClassName
      )}
    >
      <button
        className={cx('relative z-[1] w-5 h-5 p-[2px]', props.btnClassName)}
      >
        <Icon
          className={cx('h-4 w-4', props.iconClassName)}
          name={props.iconName ? props.iconName : 'ic_tips_fill'}
        />
      </button>
    </Tooltip>
  );
};

export default QuestionTooltip;
