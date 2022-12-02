/* eslint-disable no-unreachable */
import React, {
  useEffect,
  useState,
  useContext,
  useMemo,
  memo
} from 'react';

// # API
import {
  getNfsList,
  getVg,
  updateUser,
  getRole,
  getGlusterfsDetails
} from 'utils/api';

// ? context
import UserManageContext from '../UserManageContext';

// ^ Material-ui Componets(Functions)
import FormControl from '@material-ui/core/FormControl';
// import Radio from '@material-ui/core/Radio';
// import RadioGroup from '@material-ui/core/RadioGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FormHelperText from '@material-ui/core/FormHelperText';
import CircularProgress from '@material-ui/core/CircularProgress';

// ? Self-packed Components || Functions
import Title from './Title';
import BaseModalNew from 'components/BaseModalNew';
import { DefaultButton, PrimaryButton, IconButton } from 'components/BaseButton';
import { BaseTextField } from 'components/BaseMuiInput';
import MuiDropdown from 'components/BaseMuiDropdown';

// ^ Plugins
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { isEmpty, isEqual } from 'lodash';
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/UserManage/EditUserModal
 * @component EditUserModal
 * @description EditUserModal container to edit this user's data
*/
const EditUserModal = memo(({
// const EditUserModal = ({
  isOpen,
  onClose,
  userInfo: defaultUserInfo
}) => {

  // $ init data
  const { t } = useTranslation();

  const defaultUserInfoErrMsg = {
    userCode: undefined,
    name: undefined,
    phone: undefined,
    email: undefined
    // jobLifeHour: ''
  };

  // ? context
  const {
    setUserInfoList,
    rules,
    // systemParams,
    currentUser,
    classes
  } = useContext(UserManageContext);

  // # states
  const [userInfo, setUserInfo] = useState(defaultUserInfo);
  const [vgInfosExcludeTotal, setVgInfosExcludeTotal] = useState([]);
  const [roles, setRoles] = useState([]);
  const [nfsList, setNfsList] = useState([]);
  const [glusterfsList, setGlusterfsList] = useState([]);
  const [adminExists, setAdminExists] = useState(false);
  const [isUserEditing, setIsUserEditing] = useState(false);
  const [userInfoErrMsg, setUserInfoErrMsg] = useState(defaultUserInfoErrMsg);
  const [enableEditUserBtn, setEnableEditUserBtn] = useState(false);
  // const [limitKey, setLimitKey] = useState(2); // true false null
  const [privileges, setPrivileges] = useState([]);

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  // - methods
  const addDropDownOptionKeys = options => options.map(option => ({
    ...option,
    key: option.name,
    text: option.name
  }))

  // const formatTimeString = mseconds => {
  //   const totalSeconds = mseconds / 1000;
  //   const hours = Math.floor(totalSeconds / 3600);
  //   const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
  //   const seconds = Math.floor(totalSeconds - hours * 3600 - minutes * 60);
  //   const timeString =
  //     hours.toString().padStart(2, '0') +
  //     ':' +
  //     minutes.toString().padStart(2, '0') +
  //     ':' +
  //     seconds.toString().padStart(2, '0');
  //   return timeString;
  // };

  // * hooks
  useEffect(() => {
    if (defaultUserInfo.limitResource) {
      setUserInfo({
        ...defaultUserInfo
      })
      // setLimitKey(
      //   defaultUserInfo.limitResource.enabled === true
      //     ? 2
      //     : defaultUserInfo.limitResource.enabled === null ? 1 : 0
      // )
    }
  }, [defaultUserInfo])

  // useEffect(() => {
  //   if (!vgInfos.find(vg => vg.name === 'total')) return;
  //   const gpuList = vgInfos.find(vg => vg.name === 'total').gpuTotal.reduce((acc, curr) => {
  //     acc[curr.name] = userInfo.limitResource.gpu && userInfo.limitResource.gpu[curr.name] ? userInfo.limitResource.gpu[curr.name] : undefined;
  //     return acc
  //   }, {})
  //   if (limitKey === 2) {
  //     setUserInfo(prev => ({
  //       ...prev,
  //       limitResource: {
  //         ...prev.limitResource,
  //         gpu: gpuList
  //       }
  //     }))
  //   }
  // }, [limitKey, vgInfos])

  useEffect(
    () => {
      // limitResource
      const { username, userCode, name, phone, email } = userInfo
      // if (!limitResource) return;
      if (
        isEmpty(username) || isEmpty(userCode) || isEmpty(name) || isEmpty(phone) || isEmpty(email) || isEmpty(email)
      ) {
        setEnableEditUserBtn(false)
        return;
      }
      // if (limitKey === 2) {
      //   let flag = false;
      //   if (isEmpty(String(limitResource.cpu)) || isEmpty(String(limitResource.storage)) || isEmpty(String(limitResource.memory))) {
      //     flag = true
      //   }

      //   !isEmpty(limitResource.gpu) && Object.values(limitResource.gpu).forEach(gpu => {
      //     if (gpu === undefined || isEmpty(String(gpu))) {
      //       flag = true
      //     }
      //   })

      //   if (flag) {
      //     setEnableEditUserBtn(false);
      //     return
      //   }
      // }

      if (Object.values(userInfoErrMsg).some(str => !isEmpty(str))) {
        setEnableEditUserBtn(false);
        return
      }

      setEnableEditUserBtn(true);
    },
    // [userInfoErrMsg, userInfo, limitKey]
    [userInfoErrMsg, userInfo]
  );

  useMemo(
    () => {
      if (isOpen) {
        Promise.all([getNfsList(), getGlusterfsDetails(), getVg(), getRole()])
          .then((data) => {
            const [nfsList, glusterfs, vgInfos, roles] = data
            setVgInfosExcludeTotal(vgInfos.filter(vg => vg.name !== 'total'));
            if (currentUser.admin === 'true') {
              setRoles(roles);
            } else {
              setRoles(roles.filter(item => !item.privileges.includes('ADMIN')));
            }
            setNfsList(nfsList);
            setGlusterfsList(glusterfs)
          })
          .catch(error => {
            toast.error('useMemo getNfsList / getGlusterfsDetails Error => ', error);
          });
      }
    },
    [isOpen]
  );

  useMemo(
    () => {
      setAdminExists(
        userInfo.roles.some(str => {
          const ret = roles.find(obj => obj.name === str);
          if (ret) {
            return ret.privileges.includes('ADMIN');
          } else {
            return false;
          }
        })
      );
      if (!isEmpty(roles)) {
        setPrivileges(() => {
          const result = []
          userInfo.roles.some(role => {
            const roleData = roles.find(item => item.name === role)
            roleData.privileges.forEach(privi => {
              if (!result.includes(privi)) {
                result.push(privi)
              }
            })
          })
          return result
        })
      }
    },
    [userInfo, roles]
  );

  const onEdit =
    async() => {
      const updateUserInfo = {
        username: userInfo.username,
        password: userInfo.password,
        userCode: userInfo.userCode,
        name: userInfo.name,
        phone: userInfo.phone,
        email: userInfo.email,
        roles: userInfo.roles,
        description: userInfo.description
      };

      // update nfs list
      updateUserInfo.nfsList = userInfo.nfsList.filter(nfs =>
        nfsList.map(obj => obj.name).includes(nfs)
      );

      updateUserInfo.glusterfsList = userInfo.glusterfsList.filter(glusterfs =>
        glusterfsList.map(obj => obj.name).includes(glusterfs)
      );

      if (userInfo.password === '') {
        delete updateUserInfo.password;
      }

      if (!adminExists) {
        // add virtualGroups
        updateUserInfo.virtualGroups = userInfo.virtualGroups;
      }

      try {
        setIsUserEditing(true);
        const updateUserFromAPI = await updateUser(updateUserInfo);
        setIsUserEditing(false);
        setUserInfoErrMsg(defaultUserInfoErrMsg);
        setUserInfoList(prev => {
          const result = [...prev];
          const updatedResult = result.map(item => {
            if(item.username === updateUserFromAPI.username) {
              return updateUserFromAPI;
            } else {
              return item;
            }
          });
          return updatedResult;
        })
        onClose();
        toast.success(`${t('edit')}${t('enSpace')}${t('success')}`);
      } catch (err) {
        const msg = err?.data ? err.data.message : err.message
        toast.error(msg);
        setIsUserEditing(false);
      }
    }

  return (
    <BaseModalNew
      classNameObj={{
        modalContainer: `${classes.userManageModalContainer}`
      }}
      isOpen={isOpen}
      modalFoot={
        <>
          <DefaultButton
            children={t('cancel')}
            classes={{ root: classes.mr_10 }}
            disabled={isUserEditing}
            onClick={() => {
              onClose();
              setUserInfoErrMsg(defaultUserInfoErrMsg);
            }}
          />
          {
            isUserEditing
              ? <CircularProgress />
              :
              <PrimaryButton
                children={t('confirm')}
                disabled={isUserEditing || !enableEditUserBtn}
                onClick={onEdit}
              />
          }
        </>
      }
      onClose={onClose}
      size="sm"
      title={`${t('modify')}${t('enSpace')}${t('User')}`}
    >
      <div className={`${classes.flex_wrap} ${classes.flex_justify_between}`}>
        <Title
          text={
            <div className={`${classes.flex_align_center}`}>
              {t('userInfo')}
              <div
                className={`
                  ${classes.textGreen}
                  ${classes.userManageEditUserModalStatusBadgeBackgroundColor}
                  ${classes.py_5}
                  ${classes.px_10}
                  ${classes.ml_10}
                `}
              >
                {
                  userInfo.state === 1
                    ? t('verified')
                    : userInfo.state === 0 ? t('verifying') : t('denied')
                }
              </div>
            </div>
          }
        />
        <BaseTextField
          className={`${classes.w_30} ${classes.mb_16}`}
          disabled
          label={t('Username')}
          required
          value={userInfo.username}
        />
        <FormControl
          className={`${classes.w_30} ${classes.mb_16} ${classes.unlimitWidthInput}`}
          variant="outlined"
        >
          <InputLabel htmlFor="outlined-adornment-password">{t('Password')}</InputLabel>
          <OutlinedInput
            classes={{ root: classes.passwordInput }}
            className={`${!isShowPassword && classes.passwordStyle}`}
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
            error={userInfoErrMsg.password}
            fullWidth
            id="outlined-adornment-password"
            labelWidth={70}
            onChange={(e) => {
              const value = e.target.value
              setUserInfo(userInfo => ({ ...userInfo, password: value }));
              const checkField = rules.required(value) || rules.passwordFormat(value);
              setUserInfoErrMsg(userInfoErrMsg => ({ ...userInfoErrMsg, password: checkField }));
            }}
            type={isShowPassword ? 'text' : 'password'}
            value={userInfo.password}
          />
          {userInfoErrMsg.password && (
            <FormHelperText error>
              {userInfoErrMsg.password}
            </FormHelperText>
          )}
        </FormControl>
        <FormControl
          className={`${classes.w_30} ${classes.mb_16} ${classes.unlimitWidthInput}`}
          variant="outlined"
        >
          <InputLabel htmlFor="outlined-adornment-confirmPassword">{t('confirmPassword')}</InputLabel>
          <OutlinedInput
            classes={{ root: classes.passwordInput }}
            className={`${!isShowConfirmPassword && classes.passwordStyle}`}
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
            error={userInfoErrMsg.confirmPassword}
            fullWidth
            id="outlined-adornment-confirmPassword"
            labelWidth={70}
            onChange={(e) => {
              const value = e.target.value
              setUserInfo(userInfo => ({ ...userInfo, confirmPassword: value }));
              const checkField = rules.required(value) || rules.matchPassword(userInfo.password, value);
              setUserInfoErrMsg(userInfoErrMsg => ({ ...userInfoErrMsg, confirmPassword: checkField }))
            }}
            type={isShowConfirmPassword ? 'text' : 'password'}
            value={userInfo.confirmPassword}
          />
          {userInfoErrMsg.confirmPassword && (
            <FormHelperText error>
              {userInfoErrMsg.confirmPassword}
            </FormHelperText>
          )}
        </FormControl>
        <BaseTextField
          className={`${classes.w_30} ${classes.mb_16}`}
          error={userInfoErrMsg.userCode}
          helperText={userInfoErrMsg.userCode === '' ? '' : userInfoErrMsg.userCode}
          label={`${t('jobNumber')}/${t('studentNumber')}`}
          onChange={(e) => {
            const value = e.target.value;
            setUserInfo(userInfo => ({ ...userInfo, userCode: value }));
            const checkField = rules.required(value);
            setUserInfoErrMsg(userInfoErrMsg => ({ ...userInfoErrMsg, userCode: checkField }));
          }}
          required
          type="text"
          value={userInfo.userCode}
        />
        <BaseTextField
          className={`${classes.w_30} ${classes.mb_16}`}
          error={userInfoErrMsg.name}
          helperText={userInfoErrMsg.name === '' ? '' : userInfoErrMsg.name}
          label={t('fullName')}
          onChange={(e) => {
            const value = e.target.value;
            setUserInfo(userInfo => ({ ...userInfo, name: value }));
            const checkField = rules.required(value) || rules.mustBeText(value);
            setUserInfoErrMsg(userInfoErrMsg => ({ ...userInfoErrMsg, name: checkField }));
          }}
          required
          type="text"
          value={userInfo.name}
        />
        <BaseTextField
          className={`${classes.w_30} ${classes.mb_16}`}
          error={userInfoErrMsg.phone}
          helperText={userInfoErrMsg.phone === '' ? '' : userInfoErrMsg.phone}
          label={t('mobileNumber')}
          onChange={(e) => {
            const value = e.target.value;
            setUserInfo(userInfo => ({ ...userInfo, phone: value }));
            const checkField = rules.required(value) || rules.mustBeNumber(value);
            setUserInfoErrMsg(userInfoErrMsg => ({ ...userInfoErrMsg, phone: checkField }));
          }}
          required
          type="text"
          value={userInfo.phone}
        />
        <BaseTextField
          className={`${classes.w_30}`}
          error={userInfoErrMsg.email}
          helperText={userInfoErrMsg.email === '' ? '' : userInfoErrMsg.email}
          label={t('email')}
          onChange={(e) => {
            const value = e.target.value;
            setUserInfo(userInfo => ({ ...userInfo, email: value }));
            const checkField = rules.emailFormat(value);
            setUserInfoErrMsg(userInfoErrMsg => ({ ...userInfoErrMsg, email: checkField }));
          }}
          required
          type="text"
          value={userInfo.email}
        />
        <BaseTextField
          className={`${classes.w_65}`}
          label={t('note')}
          onChange={(e) => {
            const value = e.target.value;
            setUserInfo(userInfo => ({ ...userInfo, description: value }));
          }}
          type="text"
          value={userInfo.description}
        />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <Title text={`${t('resource')}${t('enSpace')}${t('setting')}`} />
        <MuiDropdown
          classes={{ root: `${classes.w_30} ${classes.mb_16}` }}
          list={addDropDownOptionKeys(roles)}
          multiple
          onChange={(e) => {
            const result = e.target.value;
            setUserInfo(userInfo => ({ ...userInfo, roles: result }));
          }}
          text={`${t('select')}${t('enSpace')}${t('role')}`}
          value={userInfo.roles}
        />
        <BaseTextField
          classes={{ root: `${classes.w_65} ${classes.mb_16}` }}
          disabled
          label={`${t('privilege')}${t('enSpace')}${t('list')}`}
          value={privileges.join(', ')}
        />
        <MuiDropdown
          classes={{ root: `${classes.w_30}` }}
          disabled={adminExists}
          list={addDropDownOptionKeys(vgInfosExcludeTotal)}
          multiple
          onChange={(e) => {
            const result = e.target.value;
            setUserInfo(userInfo => ({ ...userInfo, virtualGroups: result }));
          }}
          text={`${t('select')}${t('enSpace')}${t('group')}`}
          value={userInfo.virtualGroups}
        />
        {
          <>
            <MuiDropdown
              classes={{ root: `${classes.w_30}` }}
              list={addDropDownOptionKeys(nfsList)}
              multiple
              onChange={(e) => {
                const result = e.target.value;
                setUserInfo(userInfo => ({ ...userInfo, nfsList: result }));
              }}
              text={`${t('NFS')}`}
              value={userInfo.nfsList}
            />
            <MuiDropdown
              classes={{ root: `${classes.w_30}` }}
              list={addDropDownOptionKeys(glusterfsList)}
              multiple
              onChange={(e) => {
                const result = e.target.value;
                setUserInfo(userInfo => ({ ...userInfo, glusterfsList: result }));
              }}
              text={`${t('glusterfs')}`}
              value={userInfo.glusterfsList}
            />
          </>
        }
      </div>
    </BaseModalNew>
  );
// };
}, (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps)
});

EditUserModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  setUserInfo: PropTypes.func,
  userInfo: PropTypes.object
};

export default EditUserModal;
