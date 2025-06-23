import { IConfig } from '@libs/mode2/zustand/components/headerStore';
import isEqual from 'lodash/isEqual';
import { memo, forwardRef, Ref } from 'react';

export const Header = memo(
  forwardRef<HTMLDivElement, Partial<IConfig>>(
    (props: Partial<IConfig>, ref: Ref<HTMLDivElement>) => {
      return null;
    }
  ),
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);

export default Header;
