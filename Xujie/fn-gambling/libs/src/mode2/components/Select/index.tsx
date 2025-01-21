import React from 'react';
import BaseSelect from '../../../components/Select';

const Mode2Select: typeof BaseSelect = (props) => {
  return <BaseSelect {...props} mobileMode={false} />;
};

export default Mode2Select;
