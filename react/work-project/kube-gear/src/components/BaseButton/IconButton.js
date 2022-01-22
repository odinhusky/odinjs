import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { default as Icon } from '@material-ui/core/IconButton';

const useStyles = makeStyles(() => ({
  root: {
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.25,1.25)',
      transition: 'transform 0.25s ease'
    }
  }
}))

export const IconButton = ({ children, ...props }) => {
  const classes = useStyles();
  return (
    <Icon
      className={classes.root}
      color="primary"
      {...props}
    >
      {children}
    </Icon>
  );
}

IconButton.propTypes = {
  children: PropTypes.node
}

export default IconButton;
