import React from 'react';

// ^ Material-ui Componets(Functions)
// import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles'

// ? styles
import baseTabAndPanelStyles from './baseTabAndPanelStyles'

const useStyles = makeStyles((theme) => {
  return {
    ...baseTabAndPanelStyles(theme)
  }}
);

// plugins
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level any
 * @component BaseTabPanel
 * @description Simple Tab Panel Component
*/
const BaseTabPanel = ({ children, value, index, ...other }) => {
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
        <>
          { children }
        </>
      )}
    </div>
  );
};

BaseTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

export default BaseTabPanel;