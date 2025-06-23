import { TooltipPlacement } from 'antd/es/tooltip';
import * as React from 'react';
import { RenderFunction } from 'antd/es/_util/getRenderPropValue';

export type QuestionTooltipProps = {
  placement?: TooltipPlacement;
  title: React.ReactNode | RenderFunction;
  overlayClassName?: string;
  btnClassName?: string;
  iconClassName?: string;
  color?: string;
  iconName?: string;
  offset?: number[];
};
