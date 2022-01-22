import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';
import Radio from '@material-ui/core/Radio';
import { RadioGroup as RadioGroupMui } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// import styles from './index.module.scss';

const useStyles = makeStyles(() => ({
  radioGroup: {
    width: '100%',
    paddingLeft: 15
  },
  iconButton: {
    padding: 0
  },
  label: {
    marginBottom: 0
  },
  checkboxLabel: {
    fontSize: 14
  },
  formLabel: {
    marginBottom: 0,
    fontSize: 14,
    paddingRight: 0
  }
}));

const RadioGroup = ({ title, hint, options, ...props })  => {
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
        lg={9}
        md={9}
        sm={9}
        xl={9}
        xs={9}
      >
        <RadioGroupMui
          classes={{ root: classes.radioGroup }}
          {...props}
        >
          {
            options.map(opt => {
              return (
                <FormControlLabel
                  classes={{ root: classes.label, label: classes.checkboxLabel }}
                  control={<Radio  />}
                  key={opt.key}
                  label={opt.text}
                  value={opt.key}
                />
              )
            })
          }
        </RadioGroupMui>
      </Grid>
    </Grid>
  );
};

RadioGroup.propTypes = {
  title: PropTypes.string,
  hint: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  options: PropTypes.array
};

export default RadioGroup;