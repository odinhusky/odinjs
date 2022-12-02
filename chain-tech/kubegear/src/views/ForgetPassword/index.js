import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// # API
import { sendChangePasswordEmail } from 'utils/api';

// ? context
import GlobalContext from 'layouts/Minimal/GlobalContext';

// ^ Material-ui Components(Functions)
import MuiAlert from '@material-ui/lab/Alert';

// ? Self-packed Components || Functions
import { BaseTextField } from 'components/BaseMuiInput';
import BaseModal from 'components/BaseModal';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import TokenModal from './TokenModal';
import Footer from './Footer';

// ? styles
import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles';
import forgetPasswordStyles from './forgetPasswordStyles';
import { theme } from 'theme';

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme),
  ...forgetPasswordStyles(theme)
}))

// ^ Plugins
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import cookies from 'js-cookie';
import { isEmpty } from 'lodash';

/**
 * @author odin
 * @level views/Entry
 * @component Entry
 * @description Entry page
*/
const ForgetPassword = () => {

  // $ init data
  const { t } = useTranslation();
  const history = useHistory();
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
  const defaultErrorMsg = {
    username: '',
    email: '',
    error: ''
  };

  // ? context
  const { svgExist, backgroundImageExist } = useContext(GlobalContext);

  // = styles
  const classes = useStyles();

  // # states
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: ''
  });
  const [lock, setLock] = useState(false);
  const [getErrorMsg, setGetErrorMsg] = useState(defaultErrorMsg);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmailSend, setIsEmailSend] = useState(false);
  const [countdownTime, setCountDownTime] = useState(0);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  const [isUsernameError, setIsUsernameError] = useState('');
  const [isEmailError, setIsEmailError] = useState('');

  // - methods
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

  // * hooks
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
      <div
        className={`${classes.forgetPwdContainer}`}
        style={{
          background: theme.themePrimaryDarker ? theme.themePrimaryDarker : '',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: backgroundImageExist ? 'url(/assets/img/bg.png)' : ''
        }}
      >
        <div className={`${classes.forgetPwdBlock}`}>
          <div className={`${classes.forgetPwdInnerBlock}`}>
            <div
              className={`${classes.forgetPwdInnerBlockLeft}`}
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
              <div className={`${classes.forgetPwdResetPasswordContainerStack}`}>
                <div>
                  <div className={`${classes.forgetPwdBlockTitleText}`}>{t('forgetPassword')}</div>
                </div>
                <div className={`${classes.mb_10}`}>
                  {t('resetNarrative')}
                </div>
                {
                  !isEmpty(getErrorMsg.error) &&
                  <div className={`${classes.py_10}`}>
                    <MuiAlert
                      children={<>{getErrorMsg.error}</>}
                      elevation={6}
                      severity="error"
                      variant="filled"
                    />
                  </div>
                }
                <div className={`${classes.py_10}`}>
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
                <div className={`${classes.py_10}`}>
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
                <div className={`${classes.py_10} ${classes.pt_15} ${classes.flex_justify_between}`}>
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
                <div className={`${classes.flex_justify_end}`}>
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
