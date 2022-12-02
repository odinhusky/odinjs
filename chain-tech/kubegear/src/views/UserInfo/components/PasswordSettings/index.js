import React, { useState, useEffect, useContext } from 'react'

// # API
import { changeUsersPassword } from 'utils/api';

// ? context
import UserInfoContext from '../../UserInfoContext';

// ^ Material-ui Componets(Functions)
import { FormControl } from '@material-ui/core';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FormHelperText from '@material-ui/core/FormHelperText';

// ? Self-packed Components || Functions
import BaseVerticalTabPanel from 'components/BaseVerticalTabAndPanel/BaseVerticalTabPanel';
import { PrimaryButton } from 'components/BaseButton';
import rules from 'common/commonValidation'

// ^ plugins
import cookies from 'js-cookie';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

/**
 * @author odin
 * @level views/UserInfo/BaseVerticalTabPanelContainer/PasswordSettings
 * @component PasswordSettings
 * @description Password setting tab
*/
export default function PasswordSettings({ currentTabIndex, userInfo }) {

  // $ init data
  const { t } = useTranslation();
  const history = useHistory();

  const defaultPwdInfo = {
    old: '',
    new: '',
    confirm: ''
  }

  const defaultErrorMsg = {
    old: '',
    new: '',
    confirm: ''
  };

  // # states
  const [pwdInfo, setPwdInfo] = useState(defaultPwdInfo);
  const [newPwdInfoErrMsg, setNewPwdInfoErrMsg] = useState(defaultErrorMsg);
  const [isShowOldPwd, setIsShowOldPwd] = useState(false);
  const [isShowNewPwd, setIsShowNewPwd] = useState(false);
  const [isShowNewPwdAgain, setIsShowNewPwdAgain] = useState(false);


  const [isLoading, setIsLoading] = useState(false);

  // & handled data
  // userInfo.state === 1 : 已認證(verified) || userInfo.state === 0 : 驗證中(verifying) || 其他 : denied
  const isStatusDisabled = userInfo.state !== 1 ? true : false;
  // 沒有任何的錯誤訊息
  const isErrorOrLoadingDisabled = Object.values(newPwdInfoErrMsg).some(v => v !== '') || isLoading
  const isDisabledSubmit = isStatusDisabled || isErrorOrLoadingDisabled

  // = style
  const { classes } = useContext(UserInfoContext);

  // - methods
  /**
   * @author odin
   * @description 送出修改密碼的API + error handling
  */
  const submitPwd = async() => {
    setIsLoading(true)
    try {
      const { username } = userInfo;
      const data = {
        oldPassword: pwdInfo.old,
        newPassword: pwdInfo.new
      }

      await changeUsersPassword({ name: username, data })

      toast(`${t('modify')}${t('enSpace')}${t('success')} ${t('pleaseLoginAgain')}`, {
        type: 'success',
        onClose() {
          cookies.remove('token');
          cookies.remove('user');
          cookies.remove('admin');
          history.push('/');
        }
      });
    }  catch (err) {
    // } catch ({ message: msg }) {
      const msg = err.data.message
      toast.error(msg);
    }
    setIsLoading(false)
  }

  // * hooks
  /**
   * @author odin
   * @description 切換頁籤的時候消除錯誤的提示
  */
  useEffect(() => {
    setNewPwdInfoErrMsg(defaultErrorMsg);
  }, [currentTabIndex])

  return (
    <BaseVerticalTabPanel
      className={classes.tabPanelWidthLimit}
      index={1}
      value={currentTabIndex}
    >
      {/* 舊密碼 */}
      <FormControl
        className={`${classes.w_full} ${classes.mb_20} ${classes.unlimitWidthInput}`}
        error={newPwdInfoErrMsg.old ? true : false}
        variant="outlined"
      >
        <InputLabel htmlFor="outlined-adornment-password1">{t('oldPwd')}</InputLabel>
        <OutlinedInput
          classes={{ root: `${classes.passwordInput} ${classes.col_4}` }}
          disabled={isStatusDisabled}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={() => {
                  setIsShowOldPwd(!isShowOldPwd)
                }}
              >
                {isShowOldPwd ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          error={newPwdInfoErrMsg.old ? true : false}
          fullWidth
          id="outlined-adornment-password1"
          labelWidth={70}
          onChange={(e) => {
            // 設定Input的內容
            const oldPassword = e.target.value;
            setPwdInfo(prev => ({ ...prev, old: oldPassword }));

            // 檢查
            const checkRetMsg = rules.required(oldPassword, t);
            setNewPwdInfoErrMsg(prev => ({ ...prev, old: checkRetMsg }));
          }}
          type={isShowOldPwd ? 'text' : 'password'}
          value={pwdInfo.old}
        />
        {newPwdInfoErrMsg.old && (
          <FormHelperText error>
            {newPwdInfoErrMsg.old}
          </FormHelperText>
        )}
      </FormControl>
      {/* 新密碼 */}
      <FormControl
        className={`${classes.w_full} ${classes.mb_20} ${classes.unlimitWidthInput}`}
        error={newPwdInfoErrMsg.new ? true : false}
        variant="outlined"
      >
        <InputLabel htmlFor="outlined-adornment-password2">{t('newPwd')}</InputLabel>
        <OutlinedInput
          classes={{ root: `${classes.passwordInput} ${classes.col_4}` }}
          disabled={isStatusDisabled}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={() => {
                  setIsShowNewPwd(!isShowNewPwd)
                }}
              >
                {isShowNewPwd ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          // disabled={isErrorOrLoadingDisabled}
          error={newPwdInfoErrMsg.new ? true : false}
          fullWidth
          id="outlined-adornment-password2"
          labelWidth={70}
          onChange={(e) => {
            // 設定Input的內容
            const newPassword = e.target.value;
            setPwdInfo(prev => ({ ...prev, new: newPassword }));

            // 檢查
            const checkRetMsg = rules.required(newPassword, t) || rules.passwordFormat(newPassword, t);
            setNewPwdInfoErrMsg(prev => ({ ...prev, new: checkRetMsg }));
          }}
          placeholder={t('newPwd')}
          type={isShowNewPwd ? 'text' : 'password'}
          value={pwdInfo.new}
        />
        {newPwdInfoErrMsg.new && (
          <FormHelperText error>
            {newPwdInfoErrMsg.new}
          </FormHelperText>
        )}
      </FormControl>

      {/* 確認新密碼 */}
      <FormControl
        className={`${classes.w_full} ${classes.mb_20} ${classes.unlimitWidthInput}`}
        error={newPwdInfoErrMsg.confirm ? true : false}
        variant="outlined"
      >
        <InputLabel htmlFor="outlined-adornment-password3">{t('confirmPassword')}</InputLabel>
        <OutlinedInput
          classes={{ root: `${classes.passwordInput} ${classes.col_4}` }}
          disabled={isStatusDisabled}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={() => {
                  setIsShowNewPwdAgain(!isShowNewPwdAgain)
                }}
              >
                {isShowNewPwdAgain ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          // disabled={isErrorOrLoadingDisabled}
          error={newPwdInfoErrMsg.confirm ? true : false}
          fullWidth
          id="outlined-adornment-password3"
          labelWidth={70}
          onChange={(e) => {
            // 設定Input的內容
            const confirmNewPassword = e.target.value;
            setPwdInfo(prev => ({ ...prev, confirm: confirmNewPassword }));

            // 檢查
            const checkRetMsg = rules.required(confirmNewPassword, t) || rules.confirmPwd(pwdInfo.new, confirmNewPassword, t);
            setNewPwdInfoErrMsg(prev => ({ ...prev, confirm: checkRetMsg }));
          }}
          type={isShowNewPwdAgain ? 'text' : 'password'}
          value={pwdInfo.confirm}
        />
        {newPwdInfoErrMsg.confirm && (
          <FormHelperText error>
            {newPwdInfoErrMsg.confirm}
          </FormHelperText>
        )}
      </FormControl>

      {/* 提交按鈕 */}
      <PrimaryButton
        children={t('save')}
        disabled={isDisabledSubmit}
        onClick={submitPwd}
      />
    </BaseVerticalTabPanel>
  )
}

PasswordSettings.propTypes = {
  currentTabIndex: PropTypes.number,
  userInfo: PropTypes.object
};