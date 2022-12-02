import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(() => ({
  root: {
    fontFamily: 'Material Icons Outlined'
  }
}))

export const BaseMuiIcon = ({
  className,
  isIconButton = false,
  ...props
}) => {
  const classes = useStyles();
  return (
    isIconButton ? (
      <IconButton
        className={`${classes.root} ${className}`}
        {...props}
      />
    ) : (
      <Icon
        className={`${classes.root} ${className}`}
        {...props}
      />
    )
  );
}

BaseMuiIcon.propTypes = {
  className: PropTypes.string,
  isIconButton: PropTypes.bool
}

export default BaseMuiIcon;
