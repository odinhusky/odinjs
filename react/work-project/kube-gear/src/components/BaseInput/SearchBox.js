import React from 'react';
import { SearchBox as UISearchBox } from 'office-ui-fabric-react/lib/SearchBox';

export const SearchBox = ({ ...props }) => {
  return (
    <UISearchBox
      styles={{
        root: {
          minWidth: 200,
          width: 200,
          height: 32,
          borderRadius: '3px'
        }
      }}
      {...props}
    />
  )
}

export default SearchBox
