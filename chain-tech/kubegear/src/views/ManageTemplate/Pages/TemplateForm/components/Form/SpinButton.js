import React, {
  useState,
  useEffect,
  useCallback,
  useMemo
}  from 'react';

// ^ Material-ui Componets(Functions)
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';

// ? Self-packed Components || Functions
import { BaseTextField } from 'components/BaseMuiInput';
import { BaseTooltip } from 'components/BaseTooltip';

// ? styles
import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles'

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme)
}));

// ^ Plugins
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

/**
 * @author odin
 * @level views/ManageTemplate/TemplateForm/Form/BasicSetting/SpinButton
 * @component SpinButton
 * @description SpinButton Component
*/
const SpinButton = ({
  title,
  hint,
  onChange,
  value,
  ...props
}) => {

  // = styles
  const classes = useStyles();

  // # states
  const [retryNum, setRetryNum] = useState(0);

  // - methods
  const debouncedOnChange = useMemo(() => debounce(onChange, 200), [onChange]);

  const _onChange = useCallback(e => {
    const value = e.target.value
    if (onChange !== undefined) {
      setRetryNum(value)
      debouncedOnChange(Number(value));
    }
  }, [onChange]);

  // * hooks
  useEffect(() => setRetryNum(value), [value])

  return (
    <Grid
      container
      item
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <Grid
        alignItems={'center'}
        className={`${classes.mr_10}`}
        container
        item
        justify={'flex-end'}
        lg={3}
        md={3}
        sm={3}
        xl={3}
        xs={3}
      >
        <FormLabel className={`${classes.fz_14} ${classes.mb_0} ${classes.pr_0}`}>{title}</FormLabel>
        {
          hint &&
          <BaseTooltip
            arrow
            title={hint}
          >
            <Icon
              children={<Icon>info</Icon>}
              className={classes.p_0}
            />
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