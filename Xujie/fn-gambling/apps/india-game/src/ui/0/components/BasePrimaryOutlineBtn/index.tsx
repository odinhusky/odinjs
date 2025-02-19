import React, { CSSProperties } from 'react';

interface BasePrimaryOutlineBtnProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  classNameBg?: string;
  classNameText?: string;
  style?: CSSProperties;
  onClick?: () => void;
  debounceTimer?: number;
}

export const BasePrimaryOutlineBtn = ({
  children,
  type = 'button',
  disabled = false,
  className = '',
  classNameBg = '',
  classNameText = '',
  style = {},
  onClick = () => {},
  debounceTimer = 0,
}: BasePrimaryOutlineBtnProps) => {
  return null;
};

export default BasePrimaryOutlineBtn;
