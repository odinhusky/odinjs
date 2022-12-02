import React, { useContext } from 'react';

// ? context
import UserManageContext from '../UserManageContext';

// ^ Plugins
import PropTypes from 'prop-types';

const Title = ({ text }) => {

  // ? context
  const { classes } = useContext(UserManageContext);

  return (
    <div className={`${classes.titleClass}`}>
      <h3>{text}</h3>
      <span />
    </div>
  );
};

Title.propTypes = {
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ])
};

export default Title;