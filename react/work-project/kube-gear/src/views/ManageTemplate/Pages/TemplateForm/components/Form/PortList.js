import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';

import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import { KeyValueListMui } from './KeyValueListMui';

import Context from '../../Context';

const PORT_LABEL_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

const PortList = ({ onChange, ports }) => {
  const { t } = useTranslation();
  const { classes } = useContext(Context);
  const onPortChange = v => onChange('ports', v);
  return (
    <Grid
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
      >
        <Grid
          container
          item
          style={
            !isEmpty(ports)
              ? { display: 'flex', justifyContent: 'flex-end' }
              : { display: 'flex', justifyContent: 'flex-end', padding: '22px 0 0 0' }
          }
        >
          <FormLabel className={classes.portListFormLabel}>
            {`${t('port')}${t('enSpace')}${t('setting')}(${t('optional')})`}
          </FormLabel>
        </Grid>
      </Grid>
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
          columnWidth={220}
          isFieldOnlyNumber
          keyField="key"
          keyName={t('portName')}
          name="Port List"
          onChange={onPortChange}
          onValidateKey={val => {
            if (!PORT_LABEL_REGEX.test(val)) {
              return `${t('stringFormatIs')} ^[a-zA-Z_][a-zA-Z0-9_]*$`;
            }
          }}
          onValidateValue={val => {
            let int = val;
            if (typeof val === 'string') {
              int = parseInt(val, 10);
            }
            if (int < 0 || isNaN(int)) {
              return `${t('fillInAnInteger')}`;
            }
          }}
          value={ports}
          valueField="value"
          valueName={t('portNumber')}
        />
      </Grid>
    </Grid>
  );
};

PortList.propTypes = {
  ports: PropTypes.array,
  onChange: PropTypes.func
};

export default PortList;