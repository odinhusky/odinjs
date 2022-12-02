import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// ^ Redux
import { selectIs401error, selectErrorMsg401, reset401 } from 'layouts/Main/features/userinfo/userinfoSlice';

// # API
import { userLogin, getCurrentUserInfo } from 'utils/api';

// ? context
import GlobalContext from 'layouts/Minimal/GlobalContext';

// ^ Material-ui Componets(Functions)
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

// ? Self-packed Components || Functions
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import BaseModal from 'components/BaseModal';
import Footer from './Footer';
import { BaseTextField } from 'components/BaseMuiInput';

// ? styled
import commonStyle from 'common/commonStyles';
import signInStyles from './signInStyles';
import { theme } from 'theme';

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme),
  ...signInStyles(theme)
}))

// ^ Plugins
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import cookies from 'js-cookie';
import { toast } from 'react-toastify';

const SignIn = () => {

  // $ init data
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();

  // ? context
  const {
    svgExist,
    backgroundImageExist,
    isAllowRegister,
    dispatch,
    useSelector
  } = useContext(GlobalContext);

  // ^ Redux
  const { is401error, errorMsg401 } = useSelector((state) => ({
    is401error: selectIs401error(state),
    errorMsg401: selectErrorMsg401(state)
  }));

  // = style
  const classes = useStyles();

  // # states
  const [userInfo, setUserInfo] = useState({ username: '', password: '' });
  const defaultErrorMsg = { error: '' };

  const [getErrorMsg, setGetErrorMsg] = useState(defaultErrorMsg);
  const [lock, setLock] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);

  // - methods
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
      .catch((err) => {
        const { data } = err;
        const { message } = data;
        setGetErrorMsg(defaultErrorMsg => {
          defaultErrorMsg.error = message;
          return { ...defaultErrorMsg };
        });
      })
      .finally(() => setLock(false));
  };

  // * hooks
  useEffect(() => {
    if (cookies.get('token'))
      history.push('entry');
  }, [])

  useEffect(() => {
    if (navigator.userAgent.indexOf('Chrome') === -1)
      setIsModalOpen(true);
  }, []);

  useEffect(() => {
    if (is401error && location.pathname === '/') {
      toast.error(errorMsg401)
      dispatch(reset401())
    }
  }, [is401error])

  return (
    <>
      <div
        className={`${classes.signInContainer}`}
        style={{
          background: theme.themePrimaryDarker ? theme.themePrimaryDarker : '',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: backgroundImageExist ? 'url(/assets/img/bg.png)' : ''
        }}
      >
        <div className={`${classes.signInBlock}`}>
          <div className={`${classes.d_flex}`}>
            <div
              className={`${classes.signInBlockLeft}`}
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
              <div className={`${classes.signInLogInContainerStack}`}>
                <div className={`${classes.fz_24} ${classes.text_center}`}>{t('login')}</div>
                <div className={`${classes.py_10}`}>
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
                <div className={`${classes.py_10}`}>
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
                <div className={`${classes.py_10}`}>
                  <FormControl
                    className={`${classes.passwordStyle} ${classes.unlimitWidthInput}`}
                    variant="outlined"
                  >
                    <InputLabel htmlFor="outlined-adornment-password">{t('Password')}</InputLabel>
                    <OutlinedInput
                      classes={{ root: classes.passwordInput }}
                      className={`${classes.boxSizing_initial}`}
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
                <div className={`${classes.flex_justify_end}`}>
                  <Link
                    style={{ color: theme.themePrimary }}
                    to="/forget-password"
                  >{t('forgetPassword')}</Link>
                </div>
                <div className={`${classes.flex_justify_between} ${classes.pt_15}`}>
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

SignIn.propTypes = {
  history: PropTypes.object
};

export default SignIn;
