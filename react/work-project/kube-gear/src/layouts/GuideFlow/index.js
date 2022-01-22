import React, {
  // useState,
  useEffect
} from 'react';

// ? context
import GuideFlowContext from './GuideFlowContext';

// ? Self-packed Components || Functions

// ? styles
import { makeStyles } from '@material-ui/core/styles'
import commonStyle from 'common/commonStyles'
import guideFlowStyle from './guideFlowStyle'
/**
 * @param  {} (theme
 */
const useStyles = makeStyles((theme) => {
  return {
    ...commonStyle(theme),
    ...guideFlowStyle(theme)
  }});

// ^ plugins
import PropTypes from 'prop-types';
// import { isEmpty, find, isNull } from 'lodash';
// import { toast } from 'react-toastify';
// import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom'

/**
 * @author Odin
 * @level layouts/GuideFlow
 * @prop {boolean} isShow -- 是否要顯示
 * @prop {boolean} isAdmin -- 是否為管理者帳號
 * @prop {function} onClose -- 關閉的函式
 * @component GuideFlow
 * @description GuideFlow Component
*/
export const GuideFlow = ({ isShow, onClose }) => {

  // $init data
  // const { t } = useTranslation();
  const location = useLocation();
  const path = location.pathname;

  console.log('path', path)

  // # states
  // const [], setSystemSetting] = useState([]);

  // = styles
  const classes = useStyles();

  // - methods
  // const getCurrentGuide

  // & handled data
  const contextValue = {
    classes
  }

  // * hooks
  /**
   * @author odin
   * @description componentDidMount
  */
  useEffect(() => {
    // initData();
  }, [])

  useEffect(() => {
  }, [isShow, onClose])


  return (
    <GuideFlowContext.Provider value={contextValue}>
      <div className={`${classes.guideContainer}`}>
        <div className={`${classes.mask}`} />


      </div>
    </GuideFlowContext.Provider>
  );
};

GuideFlow.propTypes = {
  isShow: PropTypes.bool,
  isAdmin: PropTypes.bool,
  onClose: PropTypes.func
};

export default GuideFlow;
