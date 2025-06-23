import BaseIcon from '@mode2/components/BaseIcon';
import { memo } from 'react';
import isEqual from 'lodash/isEqual';
import { IconProps } from '../IconProps';

export const Icon = (props: IconProps) => {
  return <BaseIcon {...props} />;
};

export default memo(Icon, (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps);
});
