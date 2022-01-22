import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import PortList from '../Form/PortList';
import { SpinButton } from '../Form'
import styles from './index.module.scss';

const AdvancedSetting = ({ data, onChange }) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className={`${styles.width100} ${styles.paddingLeftRight10}`}>
        <PortList
          onChange={onChange}
          ports={data.ports}
        />
      </div>
      {
        data.completion &&
        <>
          <div className={`${styles.row} ${styles.paddingLeftRight10} ${styles.marginTop10}`}>
            {t('conditionsOfCompletion')}
          </div>
          <div className={styles.row}>
            <div className={`${styles.width50} ${styles.paddingLeftRight10}`}>
              <SpinButton
                min={0}
                onChange={value => onChange('completion', { ...data.completion, minFailedInstances: value })}
                title={t('minimumCountOfFailedInstances')}
                value={data.completion.minFailedInstances}
              />
            </div>
            <div className={`${styles.width50} ${styles.paddingLeftRight10}`}>
              <SpinButton
                min={0}
                onChange={value => onChange('completion', { ...data.completion, minSucceededInstances: value })}
                title={t('minimumCountOfSuccessfulInstances')}
                value={data.completion.minSucceededInstances}
              />
            </div>
          </div>
        </>
      }
    </div>
  );
};

AdvancedSetting.propTypes = {
  data: PropTypes.object,
  onChange: PropTypes.func
};

export default AdvancedSetting;