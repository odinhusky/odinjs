import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import cookies from 'js-cookie';

/* UI components */
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import BaseModal from 'components/BaseModal';

/* css */
import indexStyle from './SignIn.module.scss';
import { theme } from 'theme';

import Footer from './Footer';
import GlobalContext from 'layouts/Minimal/GlobalContext';

import { BaseTextField } from 'components/BaseMuiInput';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { userLogin, getCurrentUserInfo } from 'utils/api';

const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  },
  loginButtonStyle: {
    fontSize: '16px',
    height: '40px',
    width: '40%',
    borderRadius: '3px'
  },
  loginButtonStyleOnly: {
    fontSize: '16px',
    height: '40px',
    width: '100%',
    borderRadius: '3px'
  },
  registerButtonStyle: {
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
  passwordStyle: {
    width: '100%'
  },
  passwordInput: {
    '& #outlined-adornment-password': {
      boxSizing: 'initial'
    }
  },
  textFiled: {
    '& .MuiInputBase-root': {
      height: 40
    },
    '& .MuiInputLabel-outlined': {
      transform: 'translate(14px, 14px) scale(1)'
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
      transform: 'translate(14px, -6px) scale(0.75)'
    }
  }
}))

const Home = () => {
  const { t } = useTranslation();
  const { isAllowRegister, asyncIsFileExist } = useContext(GlobalContext);
  const classes = useStyles();

  const [userInfo, setUserInfo] = useState({ username: '', password: '' });
  const defaultErrorMsg = { error: '' };

  const [getErrorMsg, setGetErrorMsg] = useState(defaultErrorMsg);
  const [lock, setLock] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const history = useHistory();

  const [svgExist, setSvgExist] = useState(false);

  useEffect(() => {
    asyncIsFileExist('/assets/img/trademark/LoginRegister.svg')
      .then(res => setSvgExist(res))
  }, [])

  useEffect(() => {
    if (cookies.get('token'))
      history.push('entry');
  }, [])

  useEffect(() => {
    if (navigator.userAgent.indexOf('Chrome') === -1)
      setIsModalOpen(true);
  }, []);

  const handleRedirect = (username) => {
    getCurrentUserInfo(username)
      .then(res => {
        switch (res.state) {
          case -1:
            history.push('/user-info');
            break;
          case 0:
            history.push('/user-info');
            break;
          case 1:
            history.push('/entry');
            break;
        }
      })
  }

  const onSubmit = async e => {
    e.preventDefault();
    setLock(true);
    if (userInfo.username === '' || userInfo.password === '') {
      setGetErrorMsg(defaultErrorMsg => {
        defaultErrorMsg.error = t('pleaseEnterUsernameAndPassword');
        return { ...defaultErrorMsg };
      });
      setLock(false);
      return;
    }
    userLogin(userInfo)
      .then(res => {
        cookies.set('user', userInfo.username, { 'expires': 7 });
        cookies.set('token', res.token, { 'expires': 7 });
        cookies.set('admin', res.admin, { 'expires': 7 });
        handleRedirect(userInfo.username);
      })
      .catch(() => {
        setGetErrorMsg(defaultErrorMsg => {
          defaultErrorMsg.error = t('errorUsernameOrPassword');
          return { ...defaultErrorMsg };
        });
      })
      .finally(() => setLock(false));
  };

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
                  src="/assets/img/trademark/LoginRegister.svg" //350
                />
              }
            </div>
            <form onSubmit={onSubmit}>
              <div className={indexStyle.loginContainerStack}>
                <div className={indexStyle.blockTitleText}>{t('login')}</div>
                <div className={indexStyle.fieldBlock}>
                  {
                    getErrorMsg.error &&
                    <MuiAlert
                      children={<>{getErrorMsg.error}</>}
                      elevation={6}
                      severity="error"
                      variant="filled"
                    />
                  }
                </div>
                <div className={indexStyle.fieldBlock}>
                  <BaseTextField
                    fullWidth
                    inputProps={{ tabIndex: 1 }}
                    label={t('Username')}
                    onChange={(e) => {
                      const value = e.target.value;
                      setUserInfo(userInfo => ({ ...userInfo, username: value }));
                    }}
                    type="username"
                  />
                </div>
                <div className={indexStyle.fieldBlock}>
                  <FormControl
                    className={`${classes.passwordStyle} ${classes.textFiled}`}
                    variant="outlined"
                  >
                    <InputLabel htmlFor="outlined-adornment-password">{t('Password')}</InputLabel>
                    <OutlinedInput
                      classes={{ root: classes.passwordInput }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            edge="end"
                            onClick={() => {
                              setIsShowPassword(!isShowPassword)
                            }}
                          >
                            {isShowPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      fullWidth
                      id="outlined-adornment-password"
                      inputProps={{ tabIndex: 2 }}
                      labelWidth={70}
                      onChange={(e) => {
                        const value = e.target.value
                        setUserInfo(userInfo => ({ ...userInfo, password: value }));
                      }}
                      type={isShowPassword ? 'text' : 'password'}
                      value={userInfo.password}
                    />
                  </FormControl>
                </div>
                <div className={indexStyle.forgetLink}>
                  <Link
                    style={{ color: theme.themePrimary }}
                    to="/forget-password"
                  >{t('forgetPassword')}</Link>
                </div>
                <div className={indexStyle.buttonStackStyle}>
                  {
                    isAllowRegister ?
                      <>
                        <DefaultButton
                          children={t('register')}
                          classes={{ root: classes.registerButtonStyle }}
                          disabled={lock}
                          onClick={() => {
                            history.push('/sign-up')
                          }}
                          tabIndex={4}
                        />
                        <PrimaryButton
                          children={t('login')}
                          classes={{ root: classes.loginButtonStyle }}
                          disabled={lock}
                          onClick={onSubmit}
                          tabIndex={3}
                          type="submit"
                        />
                      </>
                      :
                      <PrimaryButton
                        children={t('login')}
                        classes={{ root: classes.loginButtonStyleOnly }}
                        disabled={lock}
                        onClick={onSubmit}
                        tabIndex={3}
                        type="submit"
                      />
                  }
                </div>
              </div>
            </form>
          </div>
          <BaseModal
            children={
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                <PrimaryButton
                  children={t('close')}
                  onClick={() => setIsModalOpen(false)}
                  tabIndex={4}
                />
              </div>
            }
            isCloseIcon
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            subTitle={`${t('browserHint')}`}
            title={`${t('hint')}`}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

Home.propTypes = {
  history: PropTypes.object
};

export default Home;
