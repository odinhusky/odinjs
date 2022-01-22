import React, { useState, useEffect, useCallback, useMemo }  from 'react';
import PropTypes from 'prop-types';

import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';
import { BaseTextField } from 'components/BaseMuiInput';

import { debounce } from 'lodash';

const useStyles = makeStyles(() => ({
  iconButton: {
    padding: 0
  },
  formLabel: {
    marginBottom: 0,
    fontSize: 14,
    paddingRight: 0
  }
}));

const SpinButton = ({ title, hint, onChange, value, ...props }) => {
  const classes = useStyles();
  const [retryNum, setRetryNum] = useState(0);

  const debouncedOnChange = useMemo(() => debounce(onChange, 200), [onChange]);

  const _onChange = useCallback(e => {
    const value = e.target.value
    if (onChange !== undefined) {
      setRetryNum(value)
      debouncedOnChange(Number(value));
    }
  }, [onChange]);

  useEffect(() => setRetryNum(value), [value])

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
        <BaseTextField
          onChange={_onChange}
          type="number"
          value={retryNum}
          variant="outlined"
          {...props}
        />
      </Grid>
    </Grid>
  );
};

SpinButton.propTypes = {
  title: PropTypes.string,
  hint: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default SpinButton;