import React from 'react';

// ^ Material-ui Components(Functions)
import Grid from '@material-ui/core/Grid';

// ? Self-packed Components || Functions
import { PAI_ENV_VAR } from 'views/JobSubmit/utils/constants'
import MonacoTextField from './MonacoTextField';

// ^ Plugins
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

// ? styles
import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles';

const useStyles = makeStyles((theme) => {
  return {
    ...commonStyle(theme)
  }
});

const CommandInput = React.memo(({
  value,
  defaultValue,
  ...props
}) => {

  // $ init data
  const { t } = useTranslation();

  // = styles
  const classes = useStyles();

  return (
    <Grid
      className={`${classes.flex_align_center} ${classes.w_full}`}
      container
      item
    >
      <Grid
        className={`${classes.w_full}`}
        item
      >
        <MonacoTextField
          completionItems={[...PAI_ENV_VAR.map(x => x.key)]}
          errorMessage={isEmpty(value) ? t('commandCannotBeEmpty') : null}
          monacoProps={{ height: 150, language: 'shell', defaultValue }}
          value={value}
          {...props}
        />
      </Grid>
    </Grid>
  );
});

CommandInput.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string
  ]),
  defaultValue: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string
  ])
};

export default CommandInput;