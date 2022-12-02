import React, { useContext } from 'react';

// ? context
import Context from '../../Context';

// ? Self-packed Components || Functions
import BasePanel from 'components/BasePanel';
import ParameterList from './ParameterList';
import TooltipIcon from '../TooltipIcon';

// ^ Plugin
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/ManageTemplate/TemplateForm/Parameter
 * @component Parameter
 * @description Parameter component
*/
const Parameter = () => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const { classes } = useContext(Context);

  return (
    <BasePanel
      className={`${classes.mt_20}`}
      title={
        <>
          <div className={`${classes.fz_18} ${classes.fw_bold}`}>{t('environmentVariable')}</div>

          <TooltipIcon
            className={`${classes.ml_10}`}
            content={t('toolTipsParameters')}
          />
        </>
      }
    >
      <div className={`${classes.manageTemplateFormContent}`}>
        <ParameterList />
      </div>
    </BasePanel>
  );
};

export default Parameter;