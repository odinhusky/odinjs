

import React from 'react';

// ^ Material-ui Componets(Functions)
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles'

// ? styles
import baseTabAndPanelStyles from './baseTabAndPanelStyles'

const useStyles = makeStyles((theme) => {
  return {
    ...baseTabAndPanelStyles(theme)
  }}
);

// ^ plugins
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level any
 * @component BaseTabs
 * @description Tabs component
*/
const BaseTabs = ({ tabsArray, currentTabIndex, handleTabsChange }) => {
  // = styles
  const classes = useStyles();

  // - methods
  /**
   * @author odin
   * @description Give specific "id" and "aria-controls" props
  */
  const tabProps = (index) => ({
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  });

  return (
    <Tabs
      aria-label="Simple tabs"
      classes={{
        indicator: classes.indicator
      }}
      className={classes.baseTabs}
      onChange={handleTabsChange}
      value={currentTabIndex}
    >
      {
        tabsArray.map((tab, index) => (
          <Tab
            key={`vertical-tab-${index}-${tab.label}`}
            label={tab.label}
            {...tabProps(index)}
          />
        ))
      }
    </Tabs>
  );
};

BaseTabs.propTypes = {
  tabsArray: PropTypes.array.isRequired,
  currentTabIndex: PropTypes.number.isRequired,
  handleTabsChange: PropTypes.func.isRequired
};

export default BaseTabs;