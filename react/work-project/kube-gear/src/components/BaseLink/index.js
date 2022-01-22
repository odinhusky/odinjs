import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { theme } from 'theme';

export const BaseLink = ({ children, style, ...props }) => {

  return (
    <Link
      style={{
        padding: '5px 0',
        display: 'inline-block',
        color: theme.themePrimary,
        fontSize: '14px',
        ...style
      }}
      {...props}
    >
      {children}
    </Link>
  )
}

BaseLink.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object
}

export default BaseLink;
