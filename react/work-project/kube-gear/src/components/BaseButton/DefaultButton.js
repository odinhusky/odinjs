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
  }
}));

export const DefaultButton = ({ children, classNameProps = '', ...props }) => {

  // = styles
  const classes = useStyles();

  return (
    <Button
      className={`${classes.btnRootClass} ${classNameProps}`}
      {...props}
    >
      {children}
    </Button>
  )
}

DefaultButton.propTypes = {
  children: PropTypes.node,
  classNameProps: PropTypes.string
}

export default DefaultButton