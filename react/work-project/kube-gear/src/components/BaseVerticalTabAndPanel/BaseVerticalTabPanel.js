import React from 'react';

// ^ Material-ui Componets(Functions)
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles'

// ? styles
import baseVerticalTabAndPanelStyles from './baseVerticalTabAndPanelStyles'

const useStyles = makeStyles((theme) => {
  return {
    ...baseVerticalTabAndPanelStyles(theme)
  }}
);

// plugins
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level any
 * @component BaseVerticalTabPanel
 * @description Vertical Tab Panel Component
*/
const BaseVerticalTabPanel = ({ children, value, index, ...other }) => {
  // = style
  const classes = useStyles();

  return (
    <div
      aria-labelledby={`vertical-tab-${index}`}
      className={classes.baseVerticalTabPanel}
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      role="tabpanel"
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
};

BaseVerticalTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

export default BaseVerticalTabPanel;