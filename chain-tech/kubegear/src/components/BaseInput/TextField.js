import React from 'react';
import { TextField as UITextField } from 'office-ui-fabric-react/lib';

export const TextField = ({ ...props }) => {
  return (
    <UITextField
      styles={{
        fieldGroup: { borderRadius: '3px' }
      }}
      {...props}
    />
  )
}

export default TextField
