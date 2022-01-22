import React from 'react';
import Main from './Main';

import { Provider } from 'react-redux';
import store from './store';

import PropTypes from 'prop-types';

const Wrapper = ({ children }) => {
  return (
    <Provider store={store}>
      <Main
        children={children}
      />
    </Provider>
  )
}

export default Wrapper;

Wrapper.propTypes = {
  children: PropTypes.node
};