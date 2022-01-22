import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.customColor.themePrimary,
    fontSize: '14px',
    padding: '8px 10px',
    maxHeight: 40,
    '&:hover': {
      backgroundColor: theme.palette.customColor.themePrimaryHover
    },
    '&.Mui-disabled': {
      background: theme.palette.customColor.themeDisablePrimaryBackground,
      color: theme.palette.customColor.themeDisablePrimaryColor
    }
  },
  text: {
    color: theme.palette.customColor.white
  }
}));

export const PrimaryButton = ({ children, classNameProps = '', ...props }) => {
  const classes = useStyles();
  return (
    <Button
      className={`${classes.root} ${classes.text} ${classNameProps}`}
      // color="primary"
      {...props}
    >
      {children}
    </Button>
  )
}

PrimaryButton.propTypes = {
  children: PropTypes.node,
  classNameProps: PropTypes.string
}

export default PrimaryButton