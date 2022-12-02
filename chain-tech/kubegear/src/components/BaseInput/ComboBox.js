import React from 'react';
import { ComboBox as UIComboBox } from 'office-ui-fabric-react/lib';

export const ComboBox = ({ ...props }) => {
  return (
    <UIComboBox
      styles={{
        root: { borderRadius: '3px' },
        fieldGroup: { borderRadius: '3px' }
      }}
      {...props}
    />
  )
}

export default ComboBox
