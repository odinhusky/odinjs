

import React from 'react';

// ^ Material-ui Componets(Functions)
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles'

// ? styles
import baseVerticalTabAndPanelStyles from './baseVerticalTabAndPanelStyles'

const useStyles = makeStyles((theme) => {
  return {
    ...baseVerticalTabAndPanelStyles(theme)
  }}
);

// ^ plugins
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level any
 * @component BaseVerticalTabs
 * @description Vertical tabs component
*/
const BaseVerticalTabs = ({ tabsArray, currentTabIndex, handleTabsChange }) => {
  // = styles
  const classes = useStyles();

  // - methods
  /**
   * @author odin
   * @description Give specific "id" and "aria-controls" props
  */
  const tabProps = (index) => ({
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  });

  return (
    <Tabs
      aria-label="Vertical tabs"
      classes={{
        indicator: classes.indicator
      }}
      className={classes.baseVerticalTabs}
      onChange={handleTabsChange}
      orientation="vertical"
      value={currentTabIndex}
      variant="scrollable"
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

BaseVerticalTabs.propTypes = {
  tabsArray: PropTypes.array.isRequired,
  currentTabIndex: PropTypes.number.isRequired,
  handleTabsChange: PropTypes.func.isRequired
};

export default BaseVerticalTabs;