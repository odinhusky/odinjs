import React from 'react';

// ^ Material-ui Componets(Functions)
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
 * @level  any
 * @component BaseVerticalTabPanelContainer
 * @description Vertical tab panel components' container
*/
const BaseVerticalTabPanelContainer = ({ children, ...other }) => {
  // = style
  const classes = useStyles();

  return (
    <div
      className={classes.baseVerticalTabPanelContainer}
      {...other}
    >
      {children}
    </div>
  );
};

BaseVerticalTabPanelContainer.propTypes = {
  children: PropTypes.node
};

export default BaseVerticalTabPanelContainer;