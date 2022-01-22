import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.scss';
import { useTranslation } from 'react-i18next';
import { KeyValueList } from 'views/JobSubmit/components/controls/key-value-list';
const PORT_LABEL_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

const PortList = ({ onChange, ports }) => {
  const { t } = useTranslation();
  const onPortChange = v => onChange('ports', v);
  return (
    <div className={styles.container}>
      <KeyValueList
        // columnWidth={220}
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
    </div>
  );
};

PortList.propTypes = {
  ports: PropTypes.array,
  onChange: PropTypes.func
};

export default PortList;