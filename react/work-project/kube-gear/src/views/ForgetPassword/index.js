import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import MuiAlert from '@material-ui/lab/Alert';
import { BaseTextField } from 'components/BaseMuiInput';
import { makeStyles } from '@material-ui/core/styles';

import BaseModal from 'components/BaseModal';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';

import TokenModal from './TokenModal';
import Footer from './Footer';

/* css */
import indexStyle from './index.module.scss';
import { theme } from 'theme';

import { useTranslation } from 'react-i18next';
import { sendChangePasswordEmail } from 'utils/api';
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
  },
  modal: {
    width: 300
  }
}))

const ForgetPassword = () => {
  const { t } = useTranslation();
  const { asyncIsFileExist } = useContext(GlobalContext);
  const history = useHistory();
  const classes = useStyles();
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: ''
  });

  const defaultErrorMsg = {
    username: '',
    email: '',
    error: ''
  };

  const [lock, setLock] = useState(false);
  const [getErrorMsg, setGetErrorMsg] = useState(defaultErrorMsg);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmailSend, setIsEmailSend] = useState(false);
  const [countdownTime, setCountDownTime] = useState(0);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  const [isUsernameError, setIsUsernameError] = useState('');
  const [isEmailError, setIsEmailError] = useState('');

  const [svgExist, setSvgExist] = useState(false);

  useEffect(() => {
    asyncIsFileExist('/assets/img/trademark/LoginRegister.svg')
      .then(res => setSvgExist(res))
  }, [])

  const rules = {
    required: value => (value ? '' : t('fieldRequired')),
    emailFormat(email) {
      const emailValidation = RegExp(
        /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/,
        'g'
      );
      return emailValidation.test(email) ? '' : t('emailInValid');
    }
  };

  async function rulesCheck(userInfo, rules) {
    const errorInfo = {
      username: '',
      email: '',
      error: false
    };

    errorInfo.username = rules.required(userInfo.username);
    errorInfo.email = rules.required(userInfo.email) || rules.emailFormat(userInfo.email);

    if (errorInfo.username || errorInfo.email) {
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

    const submitUserInfoErr = await rulesCheck(userInfo, rules);

    if (submitUserInfoErr.error) {
      setGetErrorMsg(submitUserInfoErr);
      setLock(false)
      return;
    }

    setIsEmailSend(true);
    setCountDownTime(60);

    sendChangePasswordEmail(userInfo)
      .catch((err) => {
        setIsEmailSend(false)
        setGetErrorMsg(defaultErrorMsg => {
          defaultErrorMsg.error = err.data.message
          return { ...defaultErrorMsg };
        });
        setCountDownTime(0)
      })
      .finally(() => setLock(false));
  };

  useEffect(() => {
    setTimeout(() => {
      if (countdownTime > 0) {
        setCountDownTime(count => {
          count = count - 1
          return count
        })
      } else {
        setIsEmailSend(false)
      }
    }, 1000)
  }, [countdownTime])

  useEffect(() => {
    if (cookies.get('token'))
      history.push('entry');
  }, [])

  useEffect(() => {
    if (navigator.userAgent.indexOf('Chrome') === -1)
      setIsModalOpen(true);
  }, []);

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
                <div>
                  <div className={indexStyle.blockTitleText}>{t('forgetPassword')}</div>
                </div>
                <div className={indexStyle.narrativeBlock}>
                  {t('resetNarrative')}
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
                    error={isUsernameError}
                    helperText={isUsernameError === '' ? '' : isUsernameError}
                    label={t('Username')}
                    onChange={(e) => {
                      const value = e.target.value;
                      setUserInfo(userInfo => ({ ...userInfo, username: value }));
                      const checkField = rules.required(value);
                      setIsUsernameError(checkField)
                    }}
                  />
                </div>
                <div className={indexStyle.fieldBlock}>
                  <BaseTextField
                    error={isEmailError}
                    helperText={isEmailError === '' ? '' : isEmailError}
                    label={t('email')}
                    onChange={(e) => {
                      const value = e.target.value;
                      setUserInfo(userInfo => ({ ...userInfo, email: value }));
                      const checkField = rules.required(value) || rules.emailFormat(value);
                      setIsEmailError(checkField)
                    }}
                    type="email"
                  />
                </div>
                <div className={`${indexStyle.fieldBlock} ${indexStyle.paddingTop15} ${indexStyle.buttonStackStyle}`}>
                  <DefaultButton
                    children={t('back')}
                    classes={{ root: classes.sendButtonStyle }}
                    disabled={lock}
                    onClick={() => {
                      history.push('/')
                    }}
                  />
                  <PrimaryButton
                    children={<div>{t('confirm')} {countdownTime > 0 && countdownTime}</div>}
                    classes={{ root: classes.backButtonStyle }}
                    disabled={lock || isEmailSend}
                    onClick={onSubmit}
                    type="submit"
                  />
                </div>
                <div className={indexStyle.token}>
                  <a
                    onClick={() => setIsTokenModalOpen(true)}
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginTop: 10,
                      cursor: 'pointer',
                      color: theme.themePrimary
                    }}
                  >{t('tokenAuth')}</a>
                </div>
              </div>
            </form>
          </div>
        </div>
        {
          isTokenModalOpen &&
          <TokenModal
            isOpen={isTokenModalOpen}
            onClose={() => setIsTokenModalOpen(false)}
          />
        }
        <BaseModal
          children={
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
              <PrimaryButton
                children={t('close')}
                onClick={() => setIsModalOpen(false)}
              />
            </div>
          }
          isCloseIcon
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          subTitle={t('browserHint')}
          title={t('hint')}
        />
      </div>
      <Footer />
    </>
  );
};

ForgetPassword.propTypes = {
  history: PropTypes.object
};

export default ForgetPassword;
