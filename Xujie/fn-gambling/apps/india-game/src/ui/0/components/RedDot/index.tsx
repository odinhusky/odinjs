import { memo } from 'react';

interface RedDotProps {
  type?: 'img' | 'css';
  size?: string;
  className?: string;
}

export const RedDot = memo(({ type = 'css', size, className }: RedDotProps) => {
  return null;
});

export default RedDot;
