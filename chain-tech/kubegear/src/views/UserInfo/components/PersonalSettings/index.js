import React, { useState, useEffect, useContext } from 'react'

// # API
import { updateUser } from 'utils/api';

// ? context
import UserInfoContext from '../../UserInfoContext';

// ^ Material-ui Componets(Functions)
import Typography from '@material-ui/core/Typography';

// ? Self-packed Components
import BaseVerticalTabPanel from 'components/BaseVerticalTabAndPanel/BaseVerticalTabPanel';

import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import { PrimaryButton } from 'components/BaseButton';
import rules from 'common/commonValidation'

// ^ plugins
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/UserInfo/BaseVerticalTabPanelContainer/PersonalSettings
 * @component PersonalSettings
 * @description Personal setting tab
*/
export default function PersonalSettings({ currentTabIndex, userInfo }) {

  // $ init data
  const { t } = useTranslation();

  const stateText = state => {
    switch (state) {
      // 被拒絕無法登入不會看到登入後頁面
      // case -1:
      //   return t('denied');
      case 0:
        return t('verifying');
      case 1:
        return t('verified');
      default:
        return '';
    }
  };

  const stateColor = state => {
    switch (state) {
      // 被拒絕無法登入不會看到登入後頁面
      // case -1:
      //   return 'userInfo__container__block__info--red';
      case 0:
        return 'userInfo__container__block__info--state';
      case 1:
        return 'userInfo__container__block__info--green';
      default:
        return 'userInfo__container__block__info--green';
    }
  }

  const defaultInfo = {
    userCode: userInfo.userCode ? userInfo.userCode : '',
    name: userInfo.name ? userInfo.name : '',
    phone: userInfo.phone ? userInfo.phone : '',
    email: userInfo.email ? userInfo.email : ''
  };

  const defaultErrorMsg = {
    userCode: '',
    name: '',
    email: '',
    phone: ''
  };

  // # states
  const [newInfo, setNewInfo] = useState(defaultInfo);
  const [newInfoErrMsg, setNewInfoErrMsg] = useState(defaultErrorMsg);
  const [isLoading, setIsLoading] = useState(false);

  // & handled data
  // userInfo.state === 1 : 已認證(verified)
  // userInfo.state === 0 : 驗證中(verifying)
  // 其他 : denied
  const isStatusDisabled = userInfo.state !== 1 ? true : false;

  // 沒有任何的錯誤訊息
  const isErrorOrLoadingDisabled = Object.values(newInfoErrMsg).some(v => v !== '') || isLoading

  const isDisabledSubmit = isStatusDisabled || isErrorOrLoadingDisabled

  // = style
  const { classes } = useContext(UserInfoContext);

  // * hooks
  /**
   * @author odin
   * @type hooks
   * @description 切換頁籤的時候消除錯誤的提示
  */
  useEffect(() => {
    setNewInfoErrMsg(defaultErrorMsg);
  }, [currentTabIndex])

  // - methods
  /**
   * @author odin
   * @description 送出修改個人資料的API + error handling
  */
  const submitInfo = async() => {
    setIsLoading(true);
    const formData = {
      ...newInfo,
      username: userInfo.username
    }

    try {
      await updateUser(formData)
      setIsLoading(false);
      toast.success('Success');
    } catch (err) {
      const msg = err.data ? err.data.message : err.toString();
      toast.error(msg)
    }
    setIsLoading(false);
  };

  return (
    <BaseVerticalTabPanel
      className={classes.tabPanelWidthLimit}
      index={0}
      value={currentTabIndex}
    >
      {/* Title */}
      <Typography
        className={classes.settingTitle}
        component="span"
        variant="h3"
      >
        {userInfo.username}
      </Typography>

      {/* Status */}
      <div className={classes.statusContainer}>
        <span className={`${classes[stateColor(userInfo.state)]} ${classes.borderRadius_4}`}>{stateText(userInfo.state)}</span>
      </div>

      {/* Modify Form */}
      <div className={classes.modifyFormContainer}>
        {/* 工號/學號 */}
        <div className={classes.modifyFormCtrl}>
          <MuiAutocomplete
            classes={{ root: `${classes.h_auto} ${classes.col_4}` }}
            disabled={isStatusDisabled}
            onInputChange={(e, userCode) => {
              // 更新 state
              setNewInfo(newInfo => ({ ...newInfo, userCode }));

              // 檢查欄位並置放錯誤訊息
              const checkField = rules.required(userCode, t);
              setNewInfoErrMsg(prev => ({ ...prev, userCode: checkField }))
            }}
            placeholder={t('jobNumberSlashStudentID')}
            required
            textFieldProps={{
              error: newInfoErrMsg.userCode ? true : false,
              helperText: newInfoErrMsg.userCode
            }}
            value={newInfo.userCode}
          />
        </div>

        {/* 姓名 */}
        <div className={classes.modifyFormCtrl}>
          <MuiAutocomplete
            classes={{ root: `${classes.h_auto} ${classes.col_4}` }}
            disabled={isStatusDisabled}
            onInputChange={(e, name) => {
              // 更新 state
              setNewInfo(newInfo => ({ ...newInfo, name }));

              // 檢查欄位並置放錯誤訊息
              const checkField = rules.required(name, t);
              setNewInfoErrMsg(prev => ({ ...prev, name: checkField }))
            }}
            placeholder={t('signUpName')}
            required
            textFieldProps={{
              error: newInfoErrMsg.name ? true : false,
              helperText: newInfoErrMsg.name
            }}
            value={newInfo.name}
          />
        </div>

        {/* 註冊郵箱 */}
        <div className={classes.modifyFormCtrl}>
          <MuiAutocomplete
            classes={{ root: `${classes.h_auto} ${classes.col_4}` }}
            disabled={isStatusDisabled}
            onInputChange={(e, email) => {
              // 更新 state
              setNewInfo(newInfo => ({ ...newInfo, email }));

              // 檢查欄位並置放錯誤訊息
              const checkField = rules.required(email, t) || rules.emailFormat(email, t);
              setNewInfoErrMsg(prev => ({ ...prev, email: checkField }))
            }}
            placeholder={t('email')}
            required
            textFieldProps={{
              error: newInfoErrMsg.email ? true : false,
              helperText: newInfoErrMsg.email
            }}
            value={newInfo.email}
          />
        </div>

        {/* 手機號碼 */}
        <div className={classes.modifyFormCtrl}>
          <MuiAutocomplete
            classes={{ root: `${classes.h_auto} ${classes.col_4}` }}
            disabled={isStatusDisabled}
            onInputChange={(e, phone) => {
              // 更新 state
              setNewInfo(newInfo => ({ ...newInfo, phone }));

              // 檢查欄位並置放錯誤訊息
              const checkField = rules.required(phone, t) || rules.mustBeNumber(phone, t);
              setNewInfoErrMsg(prev => ({ ...prev, phone: checkField }))
            }}
            placeholder={t('mobileNumber')}
            required
            textFieldProps={{
              error: newInfoErrMsg.phone ? true : false,
              helperText: newInfoErrMsg.phone
            }}
            value={newInfo.phone}
          />
        </div>

        {/* 提交按鈕 */}
        <PrimaryButton
          children={t('save')}
          disabled={isDisabledSubmit}
          onClick={submitInfo}
        />
      </div>
    </BaseVerticalTabPanel>
  )
}

PersonalSettings.propTypes = {
  currentTabIndex: PropTypes.number,
  userInfo: PropTypes.object
};