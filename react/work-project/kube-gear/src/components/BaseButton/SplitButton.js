import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

// % styles
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  btnGroupRoot: {
    minHeight: 40,
    maxHeight: 40
  },
  btnRootClass: {
    backgroundColor: theme.palette.customColor.white,
    fontSize: '14px',
    border: `1px solid ${theme.palette.customColor.themeDefaultBorderColor}`,
    boxShadow: 'none',
    '&:focus': {
      backgroundColor: theme.palette.customColor.btnFocusColor
    },
    '&:hover': {
      backgroundColor: theme.palette.customColor.themeDefaultBackgroundHover
    }
  },
  btnLabel: {
    '& > .MuiButton-label': {
      fontSize: '14px'
    }
  },
  btnRootRightClass: {
    borderLeft: 'none'
  },
  menuPaper: {
    width: 180
  },
  menuItem: {
    width: '100%',
    display: 'flex',
    alignContent: 'center',
    padding: '4px 24px'
  },
  menuIcon: {
    marginRight: 20,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    '& .MuiIcon-root': {
      marginRight: 0
    }
  }
}))


export const SplitButton = ({ text, onClick, startIcon, options, ButtonGroupProps, classNameObj, ...props }) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const defaultMeunItem = (option) => {
    const { wrapperLink } = option;
    return (
      <MenuItem
        className={classes.menuItem}
        key={option.id}
        onClick={() => {
          if (option.handleItemclick) {
            option.handleItemclick()
          }
          setOpen(false)
        }}
        {...option}
      >
        {
          wrapperLink
            ?
            wrapperLink(
              option,
              <>
                <div className={classes.menuIcon}>
                  {option.icon}
                </div>
                <div className={classes.menuLabel}>
                  {option.label}
                </div>
              </>
            )
            :
            <>
              <div className={classes.menuIcon}>
                {option.icon}
              </div>
              <div className={classes.menuLabel}>
                {option.label}
              </div>
            </>
        }
      </MenuItem>
    )
  }

  // = styles
  const classes = useStyles();

  return (
    <>
      <ButtonGroup
        aria-label="split button"
        className={`${classes.btnGroupRoot} ${classNameObj?.btnGroup}`}
        disableElevation
        ref={anchorRef}
        variant="contained"
        {...ButtonGroupProps}
      >
        <Button
          className={`${classes.btnRootClass} ${classes.btnLabel} ${classNameObj?.left}`}

          onClick={onClick}
          startIcon={startIcon}
          {...props}
        >{text}</Button>
        <Button
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="menu"
          className={`${classes.btnRootClass} ${classes.btnRootRightClass} ${classNameObj?.right}`}
          // aria-label="select merge strategy"
          disabled={options.length === 0}
          onClick={handleToggle}
          size="small"
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        anchorEl={anchorRef.current}
        // disablePortal
        className={`${classNameObj?.popper}`}
        open={open}
        role={undefined}
        style={{ zIndex: 2 }}
        transition
      >
        {({ TransitionProps, placement }) => {
          return (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
              }}
            >
              <Paper className={`${classes.menuPaper} ${classNameObj?.menuPaper}`}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList>
                    {options.map((option) => defaultMeunItem(option))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        }
      </Popper>
    </>
  );
}

SplitButton.propTypes = {
  onClick: PropTypes.func,
  options: PropTypes.array,
  text: PropTypes.string,
  startIcon: PropTypes.node,
  classNameObj: PropTypes.object,
  ButtonGroupProps: PropTypes.object
}

export default SplitButton;