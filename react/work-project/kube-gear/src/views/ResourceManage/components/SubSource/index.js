import React, { useState } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles';

import PropTypes from 'prop-types';

import Group from './components/Group';
import SubResource from './components/SubResource';

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme)
}));

const SubSource = ({ resourceData, vgData, setIsCreateResourceModalShow, resourceUnits }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [tabKey, setTabKey] = useState(0)

  const handleChange = (event, newValue) => {
    setTabKey(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    };
  }

  return (
    <>
      <Toolbar disableGutters>
        <Tabs
          aria-label="tabs"
          className={classes.tabs}
          indicatorColor="primary"
          onChange={handleChange}
          value={tabKey}
        >
          <Tab
            label={t('subResource')}
            {...a11yProps(0)}
          />
          <Tab
            label={t('group')}
            {...a11yProps(1)}
          />
        </Tabs>
      </Toolbar>
      {
        tabKey === 1
          ?
          <Group
            data={vgData}
            resourceUnits={resourceUnits}
          />
          :
          <SubResource
            data={resourceData}
            resourceUnits={resourceUnits}
            setIsCreateResourceModalShow={setIsCreateResourceModalShow}
          />
      }
    </>
  );
};

SubSource.propTypes = {
  resourceData: PropTypes.array,
  vgData: PropTypes.array,
  setIsCreateResourceModalShow: PropTypes.func,
  resourceUnits: PropTypes.object
}

export default SubSource;