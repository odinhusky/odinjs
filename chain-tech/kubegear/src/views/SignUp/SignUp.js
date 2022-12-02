import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// # API
import { userSignUp } from 'utils/api';

// ? context
import GlobalContext from 'layouts/Minimal/GlobalContext';

// ^ Material-ui Componets(Functions)
import { makeStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

// ? Self-packed Components || Functions
import { BaseTextField } from 'components/BaseMuiInput';
import { PrimaryButton } from 'components/BaseButton';
import BaseModalNew from 'components/BaseModalNew';

// ? styles
import commonStyle from 'common/commonStyles';
import signUpStyles from './signUpStyles.js';

import { theme } from 'theme';

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme),
  ...signUpStyles(theme),
  modal: {
    width: 300
  }
}))

// ^ Plugins
import { useTranslation } from 'react-i18next';
import cookies from 'js-cookie';
import Footer from './Footer';
import { isUndefined } from 'lodash';
import { Link, useHistory } from 'react-router-dom';

/**
 * @author odin
 * @level views/SignUp Route
 * @component SignUp Route
 * @description SignUp Route page
*/
const SignUp = () => {

  // $ init data
  const history = useHistory();
  const { t } = useTranslation();
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

  // = styles
  const classes = useStyles();

  // ? context
  const { isAllowRegister, svgExist, backgroundImageExist } = useContext(GlobalContext);

  // # states
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

  // - methods
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

  // * hooks
  useEffect(() => {
    if (cookies.get('token'))
      history.push('entry');
  }, [])

  useEffect(() => {
    if (isUndefined(isAllowRegister)) return;
    if (!isAllowRegister) history.push('/');
  }, [isAllowRegister])

  return (
    <>
      <div
        className={`${classes.signUpContainer}`}
        style={{
          background: theme.themePrimaryDarker ? theme.themePrimaryDarker : '',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: backgroundImageExist ? 'url(/assets/img/bg.png)' : ''
        }}
      >
        <div
          className={`${classes.signUpLeftBlock}`}
          style={{ marginRight: !svgExist && '540px' }}
        >
          {
            svgExist &&
            <img
              className={`${classes.signUpLeftBlockIconBlock}`}
              src="/assets/img/trademark/LoginRegister.svg"
            />
          }
        </div>
        <div className={`${classes.signUpRightBlock}`}>
          <form
            className={`${classes.signUpRightBlockForm}`}
            onSubmit={onSubmit}
          >
            <div className={`${classes.signUpRightBlockSubTitle} ${classes.mt_15}`}>
              <div className={`${classes.signUpRightBlockTitleText}`}>{t('register')}</div>
              <div className={`${classes.signUpRightBlockSubTitle} ${classes.mt_10}`}>{t('DontHaveAnAccount')}
                <Link
                  className={`${classes.signUpRightBlockSubTitleHref}`}
                  to="/"
                > {t('login')}</Link>
              </div>
            </div>
            <div className={`${classes.py_10}`}>
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
            <div className={`${classes.py_10}`}>
              <FormControl
                className={`${classes.passwordStyle} ${classes.unlimitWidthInput}`}
                variant="outlined"
              >
                <InputLabel
                  htmlFor="outlined-adornment-password"
                  required
                >{`${t('Password')}`}</InputLabel>

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
            <div className={`${classes.py_10}`}>
              <FormControl
                className={`${classes.passwordStyle} ${classes.unlimitWidthInput}`}
                variant="outlined"
              >
                <InputLabel
                  htmlFor="outlined-adornment-confirmPassword"
                  required
                >{t('confirmPassword')}</InputLabel>
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
            <div className={`${classes.py_10}`}>
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
            <div className={`${classes.py_10}`}>
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
            <div className={`${classes.py_10}`}>
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
            <div className={`${classes.py_10}`}>
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
            <div className={`${classes.py_10}`}>
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
          <BaseModalNew
            isOpen={isMessageModalShow}
            modalFoot={
              <>
                <PrimaryButton
                  children={t('close')}
                  onClick={() => {
                    setIsMessageModalShow(false)
                    if (message.callback) {
                      message.callback()
                    }
                  }}
                />
              </>
            }
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
