import React from 'react';
import PropTypes from 'prop-types';
import { Label } from 'office-ui-fabric-react'

const styles = {
  root: {
    // position: 'absolute',
    padding: '0',
    color: '#DD4B39'
  }
}
const ErrorMessage = ({ err }) => {
  return <Label styles={styles}>{err}</Label>;
}

ErrorMessage.propTypes = {
  err: PropTypes.string
};

export default ErrorMessage