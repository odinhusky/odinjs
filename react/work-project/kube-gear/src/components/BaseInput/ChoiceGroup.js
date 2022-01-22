import React from 'react';
import { ChoiceGroup as UIChoiceGroup } from 'office-ui-fabric-react/lib';

export const ChoiceGroup = ({ ...props }) => {
  return (
    <UIChoiceGroup
      {...props}
    />
  )
}

export default ChoiceGroup
