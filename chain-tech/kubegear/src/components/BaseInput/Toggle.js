import React from 'react';
import { Toggle as UIToggle } from 'office-ui-fabric-react/lib';

export const TextField = ({ ...props }) => {
  return (
    <UIToggle
      styles={{
        root: { marginBottom: 0, display: 'flex', alignItems: 'center' }
      }}
      {...props}
    />
  )
}

export default TextField
