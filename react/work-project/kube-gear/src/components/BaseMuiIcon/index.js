import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';

const useStyles = makeStyles(() => ({
  root: {
    fontFamily: 'Material Icons Outlined'
  }
}))

export const BaseMuiIcon = ({ className, ...props }) => {
  const classes = useStyles();
  return (
    <Icon
      className={`${classes.root} ${className}`}
      {...props}
    />
  );
}

BaseMuiIcon.propTypes = {
  className: PropTypes.string
}

export default BaseMuiIcon;
