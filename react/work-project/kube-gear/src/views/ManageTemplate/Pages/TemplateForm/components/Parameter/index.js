import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../index.module.scss';
import BasePanel from 'components/BasePanel';
import ParameterList from './ParameterList';
import TooltipIcon from '../TooltipIcon';

const Parameter = () => {
  const { t } = useTranslation()
  return (
    <BasePanel
      style={{ marginTop: 20 }}
      title={
        <>
          <div style={{ fontSize: 18, fontWeight: 'bold' }}>{t('environmentVariable')}</div>
          <TooltipIcon
            content={t('toolTipsParameters')}
            style={{ marginLeft: 10 }}
          />
        </>
      }
    >
      <div className={styles.formContent}>
        <ParameterList />
      </div>
    </BasePanel>
  );
};

export default Parameter;