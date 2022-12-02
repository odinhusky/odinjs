import React, {
  useState,
  useContext
} from 'react';

// ? context
import ResourceManageContext from '../../ResourceManageContext';

// ^ Material-ui Componets(Functions)
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// ? Self-packed Components || Functions
import Group from './components/Group';
import SubResource from './components/SubResource';

// ^ Plugins
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/ResourceManage/SubSource
 * @component SubSource
 * @description SubSource component
*/
const SubSource = ({
  resourceData,
  vgData,
  resourceUnits
}) => {
  const { t } = useTranslation();

  // ? context
  const { classes } = useContext(ResourceManageContext);

  // # states
  const [tabKey, setTabKey] = useState(0);

  // - methods
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
          />
      }
    </>
  );
};

SubSource.propTypes = {
  resourceData: PropTypes.array,
  vgData: PropTypes.array,
  resourceUnits: PropTypes.object
}

export default SubSource;