import React, { CSSProperties } from 'react';

interface BaseSecondaryBtnProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  classNameText?: string;
  style?: CSSProperties;
  onClick?: () => void;
  debounceTimer?: number;
}

export const BaseSecondaryBtn = ({
  children,
  type = 'button',
  disabled = false,
  className = '',
  classNameText = '',
  style = {},
  onClick = () => {},
  debounceTimer = 0,
}: BaseSecondaryBtnProps) => {
  return null;
};

export default BaseSecondaryBtn;
