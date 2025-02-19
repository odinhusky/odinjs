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
      {...props}
      trigger={isMobile ? 'click' : 'hover'}
      arrow={true}
      autoAdjustOverflow={true}
      onOpenChange={setOpen}
      color={props.color || 'var(--base-1-dark)'}
      overlayClassName={cx(
        'max-w-[188px] bgi-border-[var(--base-1-light)] rounded-lg text-xs',
        props.overlayClassName
      )}
    >
      <button className={cx('relative z-[1] w-5 h-5', props.btnClassName)}>
        <Icon
          className={cx('h-5 w-5', props.iconClassName)}
          name={props.iconName ? props.iconName : 'ic_question'}
          color={isOpen ? 'var(--base-1-main)' : 'var(--grayscale-100)'}
        />
      </button>
    </Tooltip>
  );
};

export default QuestionTooltip;
