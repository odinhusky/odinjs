import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  btnRootClass: {
    backgroundColor: theme.palette.customColor.white,
    border: `1px solid ${theme.palette.customColor.themeDefaultBorderColor}`,
    fontSize: '14px',
    fontWeight: 'normal',
    padding: '7px 10px',
    color: theme.palette.text.black,
    maxHeight: 40,
    boxShadow: 'none',
    '&:focus': {
      backgroundColor: theme.palette.customColor.themeDefaultBackgroundFocus
    },
    '&:hover': {
      backgroundColor: theme.palette.customColor.themeDefaultBackgroundHover
    }
  },
  active: {
    backgroundColor: theme.palette.customColor.themePrimary,
    color: theme.palette.customColor.white,
    '&:focus': {
      backgroundColor: theme.palette.customColor.themePrimary
    },
    '&:hover': {
      backgroundColor: theme.palette.customColor.themePrimary
    }
  }
}));

export const DefaultButton = ({ children, className, classNameProps = '', isActive,  ...props }) => {

  // = styles
  const classes = useStyles();

  return (
    <Button
      className={`${classes.btnRootClass} ${className} ${isActive && classes.active} ${classNameProps}`}
      {...props}
    >
      {children}
    </Button>
  )
}

DefaultButton.propTypes = {
  children: PropTypes.node,
  classNameProps: PropTypes.string,
  className: PropTypes.string,
  isActive: PropTypes.bool
}

export default DefaultButton