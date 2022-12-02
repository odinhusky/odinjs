import React from 'react';

// ? context
// import Context from '../../Context';

// ? Self-packed Components || Functions
import TitleDivider from '../TitleDivider';
import PortList from '../Form/PortList';
import { SpinButton } from '../Form';

// ^ Plugin
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/ManageTemplate/TemplateForm/TaskRole/Content/AdvancedSetting
 * @component AdvancedSetting
 * @description AdvancedSetting component
*/
const AdvancedSetting = ({ data, onChange }) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  // const { classes } = useContext(Context);

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