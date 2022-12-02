import React, { useContext } from 'react';

// ? context
import Context from '../../Context'

// ^ Material-ui Componets(Functions)
import Grid from '@material-ui/core/Grid';

// ? Self-packed Components || Functions
import { KeyValueListMui } from '../Form/KeyValueListMui';

// ^ Plugin
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/ManageTemplate/TemplateForm/Parameter/ParametersList
 * @component ParametersList
 * @description ParametersList component
*/
const ParametersList = () => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const { parameters, setParameters, classes } = useContext(Context)

  // - methods
  const onPortChange = v => setParameters(v);
  return (
    <Grid
      className={`${classes.flex_align_center}`}
      container
      item
    >
      <Grid
        container
        item
        lg={3}
        md={3}
        sm={3}
        xl={3}
        xs={3}
      />
      <Grid
        className={`${classes.pl_10}`}
        container
        item
        lg={9}
        md={9}
        sm={9}
        xl={9}
        xs={9}
      >
        <KeyValueListMui
          columnWidth={180}
          keyField="key"
          keyName={t('keyword')}
          name="Parameter List"
          onChange={onPortChange}
          value={parameters}
          valueField="value"
          valueName={t('Value')}
        />
      </Grid>
    </Grid>
  );
};

export default ParametersList;