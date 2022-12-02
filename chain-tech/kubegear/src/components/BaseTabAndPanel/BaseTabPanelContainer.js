import React from 'react';

// ^ Material-ui Componets(Functions)
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
 * @level  any
 * @component BaseTabPanelContainer
 * @description Simple tab panel components' container
*/
const BaseTabPanelContainer = ({ children, ...other }) => {
  // = style
  const classes = useStyles();

  return (
    <div
      className={classes.baseTabPanelContainer}
      {...other}
    >
      {children}
    </div>
  );
};

BaseTabPanelContainer.propTypes = {
  children: PropTypes.node
};

export default BaseTabPanelContainer;