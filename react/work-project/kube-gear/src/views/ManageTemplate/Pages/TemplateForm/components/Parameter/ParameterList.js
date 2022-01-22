import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import { KeyValueListMui } from '../Form/KeyValueListMui';
import Context from '../../Context'

const ParametersList = () => {
  const { t } = useTranslation();
  const { parameters, setParameters } = useContext(Context)
  const onPortChange = v => setParameters(v);
  return (
    <Grid
      container
      item
      style={{ display: 'flex', alignItems: 'center' }}
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
        container
        item
        lg={9}
        md={9}
        sm={9}
        style={{ paddingLeft: 10 }}
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