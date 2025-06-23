import { CSSProperties } from 'react';

export interface BaseBadgeBtnProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  classNameText?: string;
  style?: CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  debounceTimer?: number;
}
