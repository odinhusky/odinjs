/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';

// # API
import {
// getSystemParam,
// setCustomizedSystemParam,
// setSystemParam
} from 'utils/api';

// ? context
import GlobalContext from 'layouts/Main/GlobalContext';
import SystemSettingContext from './SystemSettingContext';

// ? Self-packed Components || Functions
import BreadCrumbs from 'components/BreadCrumbs';
import BaseVerticalTabs from 'components/BaseVerticalTabAndPanel/BaseVerticalTabs'
import BaseVerticalTabPanelContainer from 'components/BaseVerticalTabAndPanel/BaseVerticalTabPanelContainer'

import DefaultImagePanel from './components/DefaultImagePanel'
import SysyemSettingPanel from './components/SysyemSettingPanel'

// ? styles
import { makeStyles } from '@material-ui/core/styles'
import commonStyle from 'common/commonStyles'
import systemSettingStyles from './systemSettingStyles'

const useStyles = makeStyles((theme) => {
  return {
    ...commonStyle(theme),
    ...systemSettingStyles(theme)
  }});

// ^ plugins
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/SystemSetting
 * @component SystemSetting
 * @description System Setting Page
*/
const SystemSetting = () => {
  // $ init data
  const history = useHistory();
  const { t } = useTranslation();

  // = styles
  const classes = useStyles();

  // % context
  const { systemSetting, setSystemSetting } = useContext(GlobalContext);
  const systemSettingContext = {
    classes
  };

  // # states
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  // & handled data
  const tabsArray = [
    // 系統設置
    {
      label: `${t('system')}${t('enSpace')}${t('setting')}`
    },
    // 預設映像
    {
      label: `${t('default')}${t('enSpace')}${t('image')}`
    }
  ]

  // - methods
  /**
   * @author odin
   * @description Handle Change currentTabIndex
  */
  const handleTabsChange = (event, newValue) => {
    setCurrentTabIndex(newValue);
  };

  // * hooks

  return (
    <>
      {/* Materail UI layout */}
      <SystemSettingContext.Provider value={systemSettingContext}>
        <div className={classes.pageContainer}>
          <BreadCrumbs />
          <div className={`${classes.root} ${classes.borderRadius_4}`}>
            {/* tabs */}
            <BaseVerticalTabs
              currentTabIndex={currentTabIndex}
              handleTabsChange={handleTabsChange}
              tabsArray={tabsArray}
            />

            <BaseVerticalTabPanelContainer>
              {/* 系統設置 */}
              <SysyemSettingPanel
                currentTabIndex={currentTabIndex}
                history={history}
                setSystemSetting={setSystemSetting}
                systemSetting={systemSetting}
              />

              {/* 預設映像 */}
              <DefaultImagePanel
                currentTabIndex={currentTabIndex}
                setSystemSetting={setSystemSetting}
                systemSetting={systemSetting}
              />
            </BaseVerticalTabPanelContainer>
          </div>
        </div>
      </SystemSettingContext.Provider>
    </>
  );
};

export default SystemSetting;
