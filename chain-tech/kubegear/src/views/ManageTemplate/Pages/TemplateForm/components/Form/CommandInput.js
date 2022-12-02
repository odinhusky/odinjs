import React, { useContext } from 'react';

// ? context
import Context from '../../Context'

// ^ Material-ui Componets(Functions)
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import { BaseTooltip } from 'components/BaseTooltip';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

// ? Self-packed Components || Functions
import MonacoTextField from './MonacoTextField';
import { PAI_ENV_VAR } from 'views/JobSubmit/utils/constants';

// ^ Plugin
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';

/**
 * @author odin
 * @level views/ManageTemplate/TemplateForm/TaskRole/Content/CommandInput
 * @component CommandInput
 * @description CommandInput component
*/
const CommandInput = React.memo(({
  title,
  hint,
  value,
  defaultValue,
  ...props
}) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const { classes } = useContext(Context);

  return (
    <Grid
      className={`${classes.flex_align_center}`}
      container
      item
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
        className={`${classes.pl_10}`}
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