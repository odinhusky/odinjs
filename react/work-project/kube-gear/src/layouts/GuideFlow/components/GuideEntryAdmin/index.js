/*
 * @Author: your name
 * @Date: 2022-01-21 10:34:53
 * @LastEditTime: 2022-01-21 14:49:54
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /kube-gear/src/layouts/GuideFlow/components/GuideEntryAdmin/index.js
 */
import React, {
  // useState,
  useEffect,
  useContext
} from 'react';

// ? context
import GuideFlowContext from '../GuideFlowContext';

// ? Self-packed Components || Functions

// ^ plugins
import PropTypes from 'prop-types';
// import { isEmpty, find, isNull } from 'lodash';
// import { toast } from 'react-toastify';
// import { useTranslation } from 'react-i18next';

/**
 * @author Odin
 * @level layouts/GuideFlow/GuideEntryAdmin
 * @component GuideEntryAdmin
 * @description GuideEntryAdmin Component
*/
export const GuideEntryAdmin = () => {

  // $init data
  // const { t } = useTranslation();

  // # states
  // const [, setSystemSetting] = useState([]);

  // = styles
  const { classes } = useContext(GuideFlowContext);

  // - methods

  // * hooks
  /**
   * @author odin
   * @description componentDidMount
  */
  useEffect(() => {
    // initData();
  }, [])


  return (
    <div className={`${classes.guideContainer}`}>
      GuideEntryAdmin
    </div>
  );
};

GuideEntryAdmin.propTypes = {
  isShow: PropTypes.bool,
  isAdmin: PropTypes.bool,
  onClose: PropTypes.func
};

export default GuideEntryAdmin;
