import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import { BaseTooltip } from 'components/BaseTooltip';
import { BaseTextField } from 'components/BaseMuiInput';
import { debounce } from 'lodash';

// import styles from './index.module.scss';

const useStyles = makeStyles(() => ({
  iconButton: {
    padding: 0,
    marginLeft: 10,
    cursor: 'pointer',
    fontSize: 18
  },
  formLabel: {
    marginBottom: 0,
    fontSize: 14,
    paddingRight: 0
  }
}));

const TextField = ({ title, hint, customButton, onChange, value, ...props }) => {
  const classes = useStyles();
  const [cachedValue, setCachedValue] = useState('');

  useEffect(() =>{
    setCachedValue(value)
  }, [value]);

  const debouncedOnChange = useCallback(debounce(onChange, 200), [onChange])

  const _onChange = useCallback((e) => {
    const value = e.target.value;
    setCachedValue(value);
    debouncedOnChange(value);
  }, [setCachedValue, debouncedOnChange])

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
          <BaseTooltip
            arrow
            title={hint}
          >
            <InfoOutlinedIcon classes={{ root: classes.iconButton }} />
          </BaseTooltip>
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
        <BaseTextField
          onChange={_onChange}
          value={cachedValue}
          {...props}
        />
        {customButton}
      </Grid>
    </Grid>
  );
};

TextField.propTypes = {
  title: PropTypes.string,
  hint: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  onChange: PropTypes.func,
  customButton: PropTypes.node,
  containerClass: PropTypes.object,
  value: PropTypes.string
};

export default TextField;