import React from 'react';
import PropTypes from 'prop-types';
// import styles from './index.module.scss';

import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  iconButton: {
    padding: 0
  },
  textcolor: {
    color: theme.palette.customColor.themePrimary
  },
  textField: {
    maxWidth: '100%',
    width: '100%',
    '& > div': {
      height: 40
    },
    '& .MuiSvgIcon-root' : {
      top: '30%'
    }
  },
  formLabel: {
    marginBottom: 0,
    fontSize: 14,
    paddingRight: 0
  }
}));

const Dropdown = ({ title, hint, options, ...props }) => {
  const classes = useStyles();
  return (
    <Grid
      container
      item
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <Grid
        alignItems={'center'}
        container
        item
        justify={'flex-end'}
        lg={3}
        md={3}
        sm={3}
        style={{ marginRight: 10 }}
        xl={3}
        xs={3}
      >
        <FormLabel className={classes.formLabel}>{title}</FormLabel>
        {
          hint &&
          <Tooltip
            arrow
            title={hint}
          >
            <Icon
              children={<Icon>info</Icon>}
              className={classes.iconButton}
            />
          </Tooltip>
        }
      </Grid>
      <Grid
        item
        lg={3}
        md={3}
        sm={3}
        xl={3}
        xs={3}
      >
        <TextField
          classes={{ root: classes.textField }}
          select
          variant="outlined"
          {...props}
        >
          {options.map((item) => {
            if (item.itemType === 0) {
              return (<Divider key={item.key} />)
            }
            if (item.itemType === 2) {
              return (
                <MenuItem
                  className={classes.textcolor}
                  disabled
                  key={item.key}
                  style={{ opacity: 1, fontWeight: 700 }}
                >
                  {item.text}
                </MenuItem>
              )
            }
            return (
              <MenuItem
                key={item.value}
                value={item.text}
              >
                {item.text}
              </MenuItem>
            )
          })}
        </TextField>
      </Grid>
    </Grid>
  );
};

Dropdown.propTypes = {
  title: PropTypes.string,
  hint: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  options: PropTypes.array
};

export default Dropdown;