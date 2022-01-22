import React from 'react';
import PropTypes from 'prop-types';
import style from './index.module.scss';

const Title = ({ text }) => {
  return (
    <div className={style.title}>
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