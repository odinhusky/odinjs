
/* eslint-disable */
import React from 'react';

// ? styles
import { makeStyles } from '@material-ui/core/styles'
import commonStyle from 'common/commonStyles'

const useStyles = makeStyles((theme) => {
  return {
    ...commonStyle(theme),
    baseTextBadge: {
      padding: 8,
      minWidth: 128,
      textAlign: 'center',
      borderRadius: 4
    }
  }
});


// ^ Plugins
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level Any/BaseTextBadge
 * @param {Any} children -- children node
 * @param {String} bgColor -- Trail circle Color
 * @component BaseTextBadge
 * @description BaseTextBadge component
*/
export default function BaseTextBadge({
  children,
  bgColor,
  textClass,
  baseTextBadgeClass
 }) {

  // = styles
  const classes = useStyles();

  return (
    <div className={`${classes.baseTextBadge} ${baseTextBadgeClass}`} style={{ backgroundColor: bgColor }}>
      <span className={textClass}>
        {children}
      </span>
    </div>
  );
}

BaseTextBadge.propTypes = {
  children: PropTypes.any,
  bgColor: PropTypes.string,
  textClass: PropTypes.string,
  baseTextBadgeClass: PropTypes.string
}
