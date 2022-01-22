import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import { BaseTextField } from 'components/BaseMuiInput';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import BaseModal from 'components/BaseModal';

import Footer from 'views/SignUp/Footer';

/* css */
import indexStyle from './index.module.scss';

import { useTranslation } from 'react-i18next';
import { checkChangePasswordToken, changeUserPasswordByToken } from 'utils/api';
import { toast } from 'react-toastify';
import cookies from 'js-cookie';
import { isEmpty } from 'lodash';

import GlobalContext from 'layouts/Minimal/GlobalContext';

const useStyles = makeStyles(() => ({
  sendButtonStyle: {
    backgroundColor: '#fff',
    fontSize: '16px',
    height: '40px',
    width: '40%',
    border: '1px solid #dddddd',
    borderRadius: '3px',
    '&:hover': {
      border: '1px solid #adadad',
      backgroundColor: '#e7e7e7e'
    }
  },
  backButtonStyle: {
    fontSize: '16px',
    height: '40px',
    width: '40%',
    borderRadius: '3px'
  }
}))

const ChangePassword = () => {
  const { t } = useTranslation();
  const { asyncIsFileExist } = useContext(GlobalContext);
  const history = useHistory();
  const classes = useStyles();
  const query = new URLSearchParams(window.location.search);

  const submitPasswordInfoErrMsg = {
    newPwd: '',
    confirmPassword: '',
    error: false
  };

  const [userInfo, setUserInfo] = useState({
    newPwd: '',
    confirmPassword: ''
  });

  const [getErrorMsg, setGetErrorMsg] = useState(submitPasswordInfoErrMsg);
  const [lock, setLock] = useState(false);
  const [isCompeleteModalOpen, setIsCompeleteModalOpen] = useState(false);
  const [message, setMessage] = useState({
    type: 'success',
    title: t('setUp'),
    message: t('pleaseLoginAgain')
  });

  const [newPwdError, setNewPwdError] = useState('');
  const [confirmPwdError, setConfirmPwdError] = useState('');

  const [svgExist, setSvgExist] = useState(false);

  useEffect(() => {
    asyncIsFileExist('/assets/img/trademark/LoginRegister.svg')
      .then(res => setSvgExist(res))
  }, [])

  const rules = {
    required: value => (value ? '' : t('fieldRequired')),
    passwordFormat(password) {
      const passwordValidation = RegExp(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,20}$/,
        'g'
      );
      return passwordValidation.test(password)
        ? ''
        : t('passwordInvalid');
    },
    matchPassword: (password, confirmPassword) => {
      return confirmPassword === password ? '' : t('confirmPasswordInvalid');
    }
  };

  async function rulesCheck(userInfo, checkpassword, rules) {
    const errorInfo = {
      newPwd: '',
      confirmPassword: '',
      error: false
    };

    errorInfo.newPwd = rules.required(userInfo.newPwd) || rules.passwordFormat(userInfo.newPwd);
    errorInfo.confirmPassword = rules.required(checkpassword) || rules.matchPassword(userInfo.newPwd, checkpassword);

    if (errorInfo.newPwd || errorInfo.confirmPassword) {
      errorInfo.error = true;
      return errorInfo;
    } else {
      errorInfo.error = false;
      return errorInfo;
    }
  }

  const onSubmit = async e => {
    e.preventDefault();
    setLock(true);
    const checkpassword = userInfo.confirmPassword;
    const submitUserInfoErr = await rulesCheck(userInfo, checkpassword, rules);

    if (submitUserInfoErr.error) {
      setGetErrorMsg(submitUserInfoErr);
      setLock(false);
      return;
    }

    const data = {
      password: userInfo.newPwd,
      token: query.get('token')
    }

    changeUserPasswordByToken(data)
      .then(() => {
        setIsCompeleteModalOpen(true)
        setMessage({
          type: 'success',
          title: t('setUp'),
          message: t('pleaseLoginAgain'),
          callback: () => {
            history.push('/');
          }
        });
        setLock(false);
      })
      .catch(() => {
        setLock(false);
      })
  };

  useEffect(() => {
    if (cookies.get('token'))
      history.push('entry');
  }, [])

  useEffect(() => {
    const token = query.get('token');
    checkChangePasswordToken(token)
      .catch(err => {
        toast.error(err?.data ? err?.data?.message : err?.message);
        history.push('/');
      })
  }, [])

  return (
    <>
      <div className={indexStyle.container}>
        <div className={indexStyle.block}>
          <div className={indexStyle.innerBlock}>
            <div
              className={indexStyle.left}
              style={{ marginRight: !svgExist && '540px' }}
            >
              {
                svgExist &&
                <img
                  alt="icon"
                  src="/assets/img/trademark/LoginRegister.svg"
                />
              }
            </div>
            <form onSubmit={onSubmit}>
              <div className={indexStyle.resetPasswordContainerStack}>
                <div className={indexStyle.blockTitleText}>{t('setNewPassword')}</div>
                <div className={indexStyle.marginBottom10}>
                  {t('passwordInvalid')}
                </div>
                {
                  !isEmpty(getErrorMsg.error) &&
                  <div className={indexStyle.fieldBlock}>
                    <MuiAlert
                      children={<>{getErrorMsg.error}</>}
                      elevation={6}
                      severity="error"
                      variant="filled"
                    />
                  </div>
                }
                <div className={indexStyle.fieldBlock}>
                  <BaseTextField
                    error={newPwdError}
                    helperText={newPwdError === '' ? '' : newPwdError}
                    label={t('newPwd')}
                    onChange={(e) => {
                      const value = e.target.value;
                      setUserInfo(userInfo => ({ ...userInfo, newPwd: value }))
                      const checkField = rules.required(value);
                      setNewPwdError(checkField)
                    }}
                    type="password"
                  />
                </div>
                <div className={indexStyle.fieldBlock}>
                  <BaseTextField
                    error={confirmPwdError}
                    helperText={confirmPwdError === '' ? '' : confirmPwdError}
                    label={t('newPwdAgain')}
                    onChange={(e) => {
                      const value = e.target.value;
                      setUserInfo(userInfo => ({ ...userInfo, confirmPassword: value }))
                      const checkField = rules.required(value) || rules.matchPassword(userInfo.newPwd, value);
                      setConfirmPwdError(checkField)
                    }}
                    type="password"
                  />
                </div>
                <div className={`${indexStyle.fieldBlock} ${indexStyle.buttonStackStyle}`}>
                  <DefaultButton
                    children={t('back')}
                    classes={{ root: classes.sendButtonStyle }}
                    disabled={lock}
                    onClick={() => {
                      history.push('/')
                    }}
                  />
                  <PrimaryButton
                    children={t('confirm')}
                    classes={{ root: classes.backButtonStyle }}
                    disabled={lock}
                    onClick={onSubmit}
                    toggle
                    type="submit"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <BaseModal
          children={
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
              <PrimaryButton
                children={t('close')}
                onClick={() => {
                  setIsCompeleteModalOpen(false)
                  if (message.callback) {
                    message.callback()
                  }
                }}
              />
            </div>
          }
          classes={classes.modal}
          isOpen={isCompeleteModalOpen}
          modalWidth={300}
          onClose={() => setIsCompeleteModalOpen(false)}
          subTitle={message.message}
          title={message.title}
        />
      </div>
      <Footer />
    </>
  );
};

ChangePassword.propTypes = {
  history: PropTypes.object
};

export default ChangePassword;
