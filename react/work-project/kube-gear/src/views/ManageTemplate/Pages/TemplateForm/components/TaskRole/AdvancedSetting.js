import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import TitleDivider from '../TitleDivider';
import PortList from '../Form/PortList';
import { SpinButton } from '../Form';

const AdvancedSetting = ({ data, onChange }) => {
  const { t } = useTranslation();
  return (
    <>
      <TitleDivider
        title={`${t('Advanced')}${t('enSpace')}${t('setting')}`}
      />
      <PortList
        onChange={onChange}
        ports={data.ports}
      />
      {
        data.completion &&
          <>
            <SpinButton
              max={1}
              min={0}
              onChange={value => onChange('completion', { ...data.completion, minFailedInstances: value })}
              title={t('minimumCountOfFailedInstances')}
              value={data.completion.minFailedInstances}
            />
            <SpinButton
              max={1}
              min={0}
              onChange={value => onChange('completion', { ...data.completion, minSucceededInstances: value })}
              title={t('minimumCountOfSuccessfulInstances')}
              value={data.completion.minSucceededInstances}
            />
          </>
      }
    </>
  );
};

AdvancedSetting.propTypes = {
  data: PropTypes.object,
  onChange: PropTypes.func
};

export default AdvancedSetting;