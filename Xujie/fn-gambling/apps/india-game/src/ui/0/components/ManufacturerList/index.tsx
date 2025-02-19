import { memo } from 'react';
import isEqual from 'lodash/isEqual';

interface ManufacturerListProps {
  sceneFrom: 'modal' | 'footer';
  styles?: Record<string, string>;
}

export const ManufacturerList = memo(
  (props: ManufacturerListProps) => {
    return null;
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);

export default ManufacturerList;
