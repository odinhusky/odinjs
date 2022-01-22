import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles } from '@material-ui/core/styles';
import { BaseTooltip } from 'components/BaseTooltip';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import MonacoTextField from './MonacoTextField';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import { PAI_ENV_VAR } from 'views/JobSubmit/utils/constants'

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

const CommandInput = React.memo(({ title, hint, value, defaultValue, ...props }) => {
  const { t } = useTranslation();
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
        lg={9}
        md={9}
        sm={9}
        style={{ paddingLeft: 10 }}
        xl={9}
        xs={9}
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
  title: PropTypes.string,
  hint: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
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