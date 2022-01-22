import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

/* Fluent UI components */
import { BaseTextField } from 'components/BaseMuiInput';
import { PrimaryButton } from 'components/BaseButton';
import BaseModal from 'components/BaseModal';

/* css */
import signUpStyle from './SignUp.module.scss';

import { useTranslation } from 'react-i18next';
import { userSignUp } from 'utils/api';
import cookies from 'js-cookie';
import Footer from './Footer';
import { isUndefined } from 'lodash';

import GlobalContext from 'layouts/Minimal/GlobalContext';

import { makeStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const useStyles = makeStyles(() => ({
  passwordStyle: {
    width: '100%'
  },
  passwordInput: {
    '& #outlined-adornment-password': {
      boxSizing: 'initial'
    },
    '& #outlined-adornment-confirmPassword': {
      boxSizing: 'initial'
    }
  },
  modal: {
    width: 300
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

const SignUp = () => {
  const history = useHistory();
  const classes = useStyles();
  const { isAllowRegister, asyncIsFileExist } = useContext(GlobalContext);
  const { t } = useTranslation();

  useEffect(() => {
    if (cookies.get('token'))
      history.push('entry');
  }, [])

  useEffect(() => {
    if (isUndefined(isAllowRegister)) return;
    if (!isAllowRegister) history.push('/');
  }, [isAllowRegister])

  const [userInfo, setUserInfo] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    userCode: '',
    name: '',
    phone: '',
    email: '',
    description: ''
  });

  const [isUserInfoCreating, setIsUserInfoCreating] = useState(false);
  const [isMessageModalShow, setIsMessageModalShow] = useState(false);
  const [message, setMessage] = useState({
    type: 'success',
    title: '註冊成功',
    message: '請重新登入'
  });

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const [isUsernameError, setIsUsernameError] = useState('');
  const [isPasswordError, setIsPasswordError] = useState('');
  const [isConfirmPasswordError, setIsConfirmPasswordError] = useState('');
  const [isUserCodeError, setIsUserCodeError] = useState('');
  const [isNameError, setIsNameError] = useState('');
  const [isPhoneError, setIsPhoneError] = useState('');
  const [isEmailError, setIsEmailError] = useState('');

  const [svgExist, setSvgExist] = useState(false);

  useEffect(() => {
    asyncIsFileExist('/assets/img/trademark/LoginRegister.svg')
      .then(res => setSvgExist(res))
  }, [])

  const rules = {
    required: value => (value ? '' : t('fieldRequired')),
    usernameFormat(username) {
      const usernameValidation = RegExp(/^[a-z][a-z0-9]{1,254}$/, 'g');
      return usernameValidation.test(username) ? '' : t('userNameInvalid');
    },
    passwordFormat(password) {
      const passwordValidation = RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,20}$/, 'g');
      return passwordValidation.test(password) ? '' : t('passwordInvalid');
    },
    matchPassword: (password, confirmPassword) => (confirmPassword === password ? '' : t('confirmPasswordInvalid')),
    mustBeText: value => (!isNaN(value) ? t('mustInputText') : ''),
    mustBeNumber: value => (isNaN(value) ? t('mustInputNumber') : ''),
    emailFormat(email) {
      const emailValidation = RegExp(
        /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/,
        'g'
      );
      return emailValidation.test(email) ? '' : t('emailInValid');
    }
  };

  function rulesCheck(userInfo, checkPassword, rules) {
    const errorInfo = {
      username: '',
      password: '',
      confirmPassword: '',
      userCode: '',
      name: '',
      phone: '',
      email: '',
      description: '',
      error: false
    };
    errorInfo.username = rules.required(userInfo.username) || rules.usernameFormat(userInfo.username);
    errorInfo.password = rules.required(userInfo.password) || rules.passwordFormat(userInfo.password);
    errorInfo.confirmPassword = rules.required(checkPassword) || rules.matchPassword(userInfo.password, checkPassword);
    errorInfo.userCode = rules.required(userInfo.userCode);
    errorInfo.name = rules.required(userInfo.name) || rules.mustBeText(userInfo.name);
    errorInfo.phone = rules.required(userInfo.phone) || rules.mustBeNumber(userInfo.phone);
    errorInfo.email = rules.required(userInfo.email) || rules.emailFormat(userInfo.email);

    if (errorInfo.username || errorInfo.password || errorInfo.confirmPassword || errorInfo.userCode || errorInfo.name || errorInfo.phone || errorInfo.email) {
      errorInfo.error = true;
      return errorInfo;
    } else {
      errorInfo.error = false;
      return errorInfo;
    }
  }

  const onSubmit = async e => {
    e.preventDefault();
    const createUserInfo = {
      username: userInfo.username,
      password: userInfo.password,
      userCode: userInfo.userCode,
      name: userInfo.name,
      phone: userInfo.phone,
      email: userInfo.email,
      description: userInfo.description
    };
    const checkPassword = userInfo.confirmPassword;
    const submitUserInfoErr = rulesCheck(createUserInfo, checkPassword, rules);

    if (submitUserInfoErr.error) {
      setIsUsernameError(submitUserInfoErr.username)
      setIsPasswordError(submitUserInfoErr.password)
      setIsConfirmPasswordError(submitUserInfoErr.confirmPassword)
      setIsUserCodeError(submitUserInfoErr.userCode)
      setIsNameError(submitUserInfoErr.name)
      setIsPhoneError(submitUserInfoErr.phone)
      setIsEmailError(submitUserInfoErr.email)
      return;
    }

    try {
      setIsUserInfoCreating(true);
      const userInfoCreationResp = await userSignUp(createUserInfo);
      if (userInfoCreationResp.err) throw new Error(userInfoCreationResp.err);
      setIsUserInfoCreating(false);
      setIsMessageModalShow(true);
      setMessage({
        type: 'success',
        title: `${t('register')}${t('enSpace')}${t('success')}`,
        message: t('pleaseLoginAgain'),
        callback: () => {
          history.push('/');
        }
      });
    } catch (err) {
      setIsMessageModalShow(true);
      setMessage({
        type: 'error',
        title: t('error'),
        message: err.data.message
      });
      setIsUserInfoCreating(false);
    }
  };

  return (
    <>
      <div className={signUpStyle.container}>
        <div
          className={signUpStyle.leftBlock}
          style={{ marginRight: !svgExist && '540px' }}
        >
          {
            svgExist &&
            <img
              className={signUpStyle.leftBlockTitleIcon}
              src="/assets/img/trademark/LoginRegister.svg"
            />
          }
        </div>
        <div className={signUpStyle.rightBlock}>
          <form
            className={signUpStyle.rightBlockForm}
            onSubmit={onSubmit}
          >
            <div className={`${signUpStyle.rightBlockTitle} ${signUpStyle.marginTop15}`}>
              <div className={signUpStyle.rightBlockTitleText}>{t('register')}</div>
              <div className={`${signUpStyle.rightBlockSubTitle} ${signUpStyle.marginTop10}`}>{t('DontHaveAnAccount')}
                <Link
                  className={signUpStyle.rightBlockSubTitleHref}
                  to="/"
                > {t('login')}</Link>
              </div>
            </div>
            <div className={signUpStyle.fieldBlock}>
              <BaseTextField
                error={isUsernameError}
                helperText={isUsernameError === '' ? '' : isUsernameError}
                inputProps={{ tabIndex: 1 }}
                label={t('Username')}
                onChange={(e) => {
                  const value = e.target.value;
                  setUserInfo(userInfo => ({ ...userInfo, username: value }));
                  const checkField = rules.required(value) || rules.usernameFormat(value);
                  setIsUsernameError(checkField)
                }}
                placeholder="example"
                required
              />
            </div>
            <div className={signUpStyle.fieldBlock}>
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
                        edge="end"
                        onClick={() => {
                          setIsShowPassword(!isShowPassword)
                        }}
                      >
                        {isShowPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  error={isPasswordError}
                  fullWidth
                  id="outlined-adornment-password"
                  inputProps={{ tabIndex: 2 }}
                  labelWidth={70}
                  onChange={(e) => {
                    const value = e.target.value
                    setUserInfo(userInfo => ({ ...userInfo, password: value }));
                    const checkField = rules.required(value) || rules.passwordFormat(value);
                    setIsPasswordError(checkField)
                  }}
                  type={isShowPassword ? 'text' : 'password'}
                  value={userInfo.password}
                />
                {isPasswordError && (
                  <FormHelperText error>
                    {isPasswordError}
                  </FormHelperText>
                )}
              </FormControl>
            </div>
            <div className={signUpStyle.fieldBlock}>
              <FormControl
                className={`${classes.passwordStyle} ${classes.textFiled}`}
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-confirmPassword">{t('confirmPassword')}</InputLabel>
                <OutlinedInput
                  classes={{ root: classes.passwordInput }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => {
                          setIsShowConfirmPassword(!isShowConfirmPassword)
                        }}
                      >
                        {isShowConfirmPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  error={isConfirmPasswordError}
                  fullWidth
                  id="outlined-adornment-confirmPassword"
                  inputProps={{ tabIndex: 3 }}
                  labelWidth={70}
                  onChange={(e) => {
                    const value = e.target.value
                    setUserInfo(userInfo => ({ ...userInfo, confirmPassword: value }));
                    const checkField = rules.required(value) || rules.matchPassword(userInfo.password, value);
                    setIsConfirmPasswordError(checkField)
                  }}
                  type={isShowConfirmPassword ? 'text' : 'password'}
                  value={userInfo.confirmPassword}
                />
                {isConfirmPasswordError && (
                  <FormHelperText error>
                    {isConfirmPasswordError}
                  </FormHelperText>
                )}
              </FormControl>
            </div>
            <div className={signUpStyle.fieldBlock}>
              <BaseTextField
                error={isUserCodeError}
                helperText={isUserCodeError === '' ? '' : isUserCodeError}
                inputProps={{ tabIndex: 4 }}
                label={t('jobNumberSlashStudentID')}
                onChange={(e) => {
                  const value = e.target.value;
                  setUserInfo(userInfo => ({ ...userInfo, userCode: value }));
                  const checkField = rules.required(value);
                  setIsUserCodeError(checkField)
                }}
                required
                type="text"
              />
            </div>
            <div className={signUpStyle.fieldBlock}>
              <BaseTextField
                error={isNameError}
                helperText={isNameError === '' ? '' : isNameError}
                inputProps={{ tabIndex: 5 }}
                label={t('signUpName')}
                onChange={(e) => {
                  const value = e.target.value;
                  setUserInfo(userInfo => ({ ...userInfo, name: value }));
                  const checkField = rules.required(value) || rules.mustBeText(value);
                  setIsNameError(checkField)
                }}
                required
                type="text"
              />
            </div>
            <div className={signUpStyle.fieldBlock}>
              <BaseTextField
                error={isPhoneError}
                helperText={isPhoneError === '' ? '' : isPhoneError}
                inputProps={{ tabIndex: 6 }}
                label={t('mobileNumber')}
                onChange={(e) => {
                  const value = e.target.value;
                  setUserInfo(userInfo => ({ ...userInfo, phone: value }));
                  const checkField = rules.required(value) || rules.mustBeNumber(value);
                  setIsPhoneError(checkField)
                }}
                required
                type="text"
              />
            </div>
            <div className={signUpStyle.fieldBlock}>
              <BaseTextField
                error={isEmailError}
                helperText={isEmailError === '' ? '' : isEmailError}
                inputProps={{ tabIndex: 7 }}
                label={t('email')}
                onChange={(e) => {
                  const value = e.target.value;
                  setUserInfo(userInfo => ({ ...userInfo, email: value }));
                  const checkField = rules.required(value) || rules.emailFormat(value);
                  setIsEmailError(checkField)
                }}
                placeholder="example@gmail.com"
                required
                type="text"
              />
            </div>
            <div className={signUpStyle.fieldBlock}>
              <BaseTextField
                inputProps={{ tabIndex: 8 }}
                label={t('note')}
                onChange={(e) => {
                  const value = e.target.value;
                  setUserInfo(userInfo => ({ ...userInfo, description: value }))
                }}
                type="text"
              />
            </div>
            <PrimaryButton
              children={t('register')}
              disabled={isUserInfoCreating}
              fullWidth
              onClick={onSubmit}
              type="submit"
            />
          </form>
          <BaseModal
            children={
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                <PrimaryButton
                  children={t('close')}
                  onClick={() => {
                    setIsMessageModalShow(false)
                    if (message.callback) {
                      message.callback()
                    }
                  }}
                />
              </div>
            }
            classes={classes.modal}
            isOpen={isMessageModalShow}
            modalWidth={300}
            onClose={() => setIsMessageModalShow(false)}
            subTitle={message.message}
            title={message.title}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignUp;
