import React from 'react';

const ctx = React.createContext()

export const { Provider, Consumer } = ctx;

export const withGlobalContext = Component => props =>
  <Consumer>
    { 
      value => 
        <Component
          {...props}
          {...value} 
        />
    }
  </Consumer>

export default ctx;