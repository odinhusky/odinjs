import React, { CSSProperties } from 'react';

export interface BasePrimaryOutlineBtnProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  classNameBg?: string;
  classNameText?: string;
  style?: CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  debounceTimer?: number;
}
