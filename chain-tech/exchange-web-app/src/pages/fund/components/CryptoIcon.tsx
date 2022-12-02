import React from "react";
import PropTypes from "prop-types";
import Icon from "react-crypto-icons";


export const CryptoIcon = ({ name, size, ...props }) => {
  return <Icon name={name} size={size} {...props} />;
};

CryptoIcon.propTypes = {
  name: PropTypes.string,
  size: PropTypes.number
};

export default CryptoIcon;
