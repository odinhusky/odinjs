import React, { useState, useEffect } from 'react';

// ^ plugins
import PropTypes from 'prop-types';


const BaseNumAnimation = ({
  num
}) => {

  // # state
  const [showNum, setShowNum] = useState(0)


  // - methods
  /**
   * @author odin
   * @description Increase progressBar
  */
  const updateNum = () => {
    setTimeout(() => {
      // 設定 Number 的動畫
      setShowNum(showNum + 1)
    }, 5)
  }

  // * hooks
  /**
   * @author odin
   * @description triggered when num prop is changed. This is needed instead of a simple [], that will be on mount, because if you use this component in combination with a backend service you first will pass num={0} and later in async mode, a value.
  */
  useEffect(() => {
    if (num > 0) updateNum()
  }, [num])

  /**
   * @author odin
   * @description triggered when the progessBar is modified.
  */
  useEffect(() => {
    if (showNum < num) updateNum()
  }, [showNum])

  return (
    <>
      {showNum}
    </>
  );
};

BaseNumAnimation.propTypes = {
  num: PropTypes.number
}

export default BaseNumAnimation;