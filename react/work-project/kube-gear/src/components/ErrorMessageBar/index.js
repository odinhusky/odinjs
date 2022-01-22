import React from 'react';
import PropTypes from 'prop-types';
import {
  MessageBar,
  MessageBarType
} from 'office-ui-fabric-react/lib/MessageBar';

export const ErrorMessageBar = ({ error, ...props }) => {
  return (
    <MessageBar
      messageBarType={MessageBarType.severeWarning}
      {...props}
    >
      {error}
    </MessageBar>
  );
}

ErrorMessageBar.propTypes = {
  error: PropTypes.string
}

export default ErrorMessageBar;