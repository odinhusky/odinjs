import React, {
  useState,
  useContext,
  useMemo,
  useEffect
} from 'react';

// # API
import { getVg, createUser, getRole } from 'utils/api';

// ? context
import UserManageContext from '../UserManageContext';

// ^ Material-ui Componets(Functions)
import CircularProgress from '@material-ui/core/CircularProgress';
import { BaseTextField } from 'components/BaseMuiInput';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Checkbox from '@material-ui/core/Checkbox';

// ? Self-packed Components || Functions
import Title from './Title';
// import BaseModal from 'components/BaseModal';
import BaseModalNew from 'components/BaseModalNew';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import MuiDropdown from 'components/BaseMuiDropdown';
// import Radio from '@material-ui/core/Radio';
// import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';

/**
 * @author odin
 * @level views/UserManage/CreateUserModal
 * @component CreateUserModal
 * @description CreateUserModal component
*/
function CreateUserModal({
  isOpen,
  onClose,
  setUserCreatSucName,
  setIsUserCreatSuc,
  setWhichStorageSetting
}) {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const {
    getUserInfoList,
    addDropDownOptionKeys,
    rules,
    // systemParams,
    currentUser,
    classes
  } = useContext(UserManageContext);

  const defaultUserInfoErrMsg = {
    username: undefined,
    password: undefined,
    confirmPassword: undefined,
    userCode: undefined,
    name: undefined,
    phone: undefined,
    email: undefined,
    // jobLifeHour: '',
    nfsSize: undefined,
    glusterfsSize: undefined,
    cpu: undefined,
    memory: undefined,
    storage: undefined,
    gpu: undefined
  };

  // # states
  const [defaultUserInfo] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    userCode: undefined,
    name: '',
    phone: '',
    email: '',
    description: '',
    // jobLifeHour: '',
    roles: [],
    nfsDisk: '',
    nfsSize: 0,
    glusterfsVolume: '',
    glusterfsSize: 0,
    virtualGroups: [],
    limitResource: {
      cpu: 0,
      memory: 0,
      storage: 0
    }
  });

  const [startToSetDefault, setStartToSetDefault] = useState(false);
  const [, setVgInfos] = useState([]);
  const [vgInfosExcludeTotal, setVgInfosExcludeTotal] = useState([]);
  const [roles, setRoles] = useState([]);
  const [adminExists, setAdminExists] = useState(false);
  const [userInfo, setUserInfo] = useState(defaultUserInfo);
  const [isUserCreating, setIsUserCreating] = useState(false);
  const [userInfoErrMsg, setUserInfoErrMsg] = useState(defaultUserInfoErrMsg);
  const [enableCreateUserBtn, setEnableCreateUserBtn] = useState(false);
  // const [limitKey, setLimitKey] = useState(1);

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const [isNfsSetting, setIsNfsSetting] = useState(false);
  const [isGlusterfsSetting, setIsGlusterfsSetting] = useState(false);

  // * hooks
  useEffect(() => {
    if (startToSetDefault) {
      setUserInfo((prevUserInfo) => {
        return {
          ...prevUserInfo,
          roles: roles.map(item => item.name).filter(name => name === '普通用户'),
          virtualGroups: vgInfosExcludeTotal.map(item => item.name).find(name => name !== 'total') ? [vgInfosExcludeTotal.map(item => item.name).find(name => name !== 'total')] : []
        }
      })
      setStartToSetDefault(false);
    }
  }, [startToSetDefault])

  useEffect(
    () => {
      // limitResource from userInfo
      const { username, password, confirmPassword, userCode, name, phone, email } = userInfo
      if (
        isEmpty(username) || isEmpty(password) || isEmpty(confirmPassword) || isEmpty(userCode) || isEmpty(name) || isEmpty(phone) || isEmpty(email) || isEmpty(email)
      ) {
        setEnableCreateUserBtn(false)
        return;
      }

      // if (limitResource && (limitKey === 2)) {
      //   let flag = false
      //   if (isEmpty(limitResource.cpu) || isEmpty(limitResource.storage) || isEmpty(limitResource.memory)) {
      //     flag = true
      //   }

      //   !isEmpty(limitResource.gpu) && Object.values(limitResource.gpu).forEach(gpu => {
      //     if (isEmpty(gpu)) {
      //       flag = true
      //     }
      //   })

      //   if (flag) {
      //     setEnableCreateUserBtn(false);
      //     return
      //   }
      // }

      if (Object.values(userInfoErrMsg).some(str => !isEmpty(str))) {
        setEnableCreateUserBtn(false);
        return
      }

      setEnableCreateUserBtn(true);
    },
    // [userInfoErrMsg, userInfo, limitKey]
    [userInfoErrMsg, userInfo]
  );

  // useEffect(() => {
  //   if (!vgInfos.find(vg => vg.name === 'total')) return;
  //   const gpuList = vgInfos.find(vg => vg.name === 'total').gpuTotal.reduce((acc, curr) => {
  //     acc[curr.name] = undefined;
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
      if (isOpen) {
        Promise.all([
          getVg(),
          getRole()
        ])
          .then(([vgInfos, roles]) => {
            setVgInfos(vgInfos);
            setVgInfosExcludeTotal(vgInfos.filter(vg => vg.name !== 'total'));
            if (currentUser.admin === 'true') {
              setRoles(roles);
            } else {
              setRoles(roles.filter(item => !item.privileges.includes('ADMIN')));
            }
            setStartToSetDefault(true)
          })
          .catch(err => {
            const msg = err.data.message ? err.data.message : err.status;
            toast.error(msg)
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
    },
    [userInfo, roles]
  );

  // - methods
  const onSubmit = async() => {
    const createUserInfo = {
      username: userInfo.username,
      password: userInfo.password,
      userCode: userInfo.userCode,
      name: userInfo.name,
      phone: userInfo.phone,
      email: userInfo.email,
      roles: userInfo.roles,
      description: userInfo.description,
      // jobLifeHour: userInfo.jobLifeHour,
      state: 1
    };

    // switch(limitKey) {
    //   case 2: {
    //     const { cpu, memory, storage, gpu } = userInfo.limitResource;

    //     createUserInfo.limitResource = {
    //       enabled: true,
    //       cpu, memory, storage, gpu
    //     }
    //     break;
    //   }
    //   case 0:
    //     createUserInfo.limitResource = { enabled: false }
    //     break;
    // }

    if (!adminExists) {
      if (userInfo.nfsDisk !== '' && userInfo.nfsSize) {
        // add nfs
        createUserInfo.nfs = {
          name: userInfo.username,
          nfsDisk: userInfo.nfsDisk ? userInfo.nfsDisk : null,
          size: Number(userInfo.nfsSize),
          isPublic: false
        };
      }
      if (userInfo.glusterfsVolume !== '' && userInfo.glusterfsSize) {
        // add glusterfs
        createUserInfo.glusterfs = {
          name: userInfo.username,
          volume: userInfo.glusterfsVolume,
          size: Number(userInfo.glusterfsSize),
          isPublic: false
        }
      }
      // add virtualGroups
      createUserInfo.virtualGroups = userInfo.virtualGroups;
    }

    try {
      setIsUserCreating(true);
      await createUser(createUserInfo);
      toast.success(`${t('create')}${t('enSpace')}${t('success')}`);
      setIsUserCreating(false);
      setAdminExists(false);
      setUserCreatSucName(createUserInfo.name)
      setWhichStorageSetting({ nfs: isNfsSetting, glusterfs: isGlusterfsSetting, name: userInfo.username })
      setIsUserCreatSuc(true)
      onClose();
      setStartToSetDefault(false);
      setUserInfoErrMsg(defaultUserInfoErrMsg);
      setUserInfo(defaultUserInfo);
      getUserInfoList();
      // location.href = `${location.origin}/user-view.html`;
    } catch (err) {
      setIsUserCreating(false);
      if (err.data && err.data.message === '用戶名已被使用')
        setUserInfoErrMsg(userInfoErrMsg => {
          userInfoErrMsg.username = err.data.message;
          return { ...userInfoErrMsg };
        });
      else {
        toast.error(`Error:
          ${err.data.message || 'Please Try again'}`);
      }
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
            children={t('close')}
            classes={{ root: classes.mr_20 }}
            disabled={isUserCreating}
            onClick={() => {
              onClose();
              setUserInfoErrMsg(defaultUserInfoErrMsg);
              setUserInfo(defaultUserInfo);
              setStartToSetDefault(false);
            }}
          />
          {
            isUserCreating
              ? <CircularProgress />
              :
              <PrimaryButton
                children={t('add')}
                disabled={isUserCreating || !enableCreateUserBtn}
                onClick={onSubmit}
              />
          }
        </>
      }
      onClose={onClose}
      size="sm"
      title={`${t('add')}${t('enSpace')}${t('User')}`}
    >
      <div className={`${classes.flex_wrap} ${classes.flex_justify_between}`}>
        <Title text={t('userInfo')} />
        <BaseTextField
          className={`${classes.w_30} ${classes.mb_16}`}
          error={userInfoErrMsg.username}
          helperText={userInfoErrMsg.username === '' ? '' : userInfoErrMsg.username}
          label={t('Username')}
          onChange={(e) => {
            const value = e.target.value;
            setUserInfo(userInfo => ({ ...userInfo, username: value }));
            const checkField = rules.required(value) || rules.userNameFormat(value);
            setUserInfoErrMsg(userInfoErrMsg => ({ ...userInfoErrMsg, username: checkField }));
          }}
          required
          type="text"
          value={userInfo.username}
        />
        <FormControl
          className={`${classes.w_30} ${classes.mb_16} ${classes.unlimitWidthInput}`}
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
          classes={{ root: `${classes.w_30}` }}
          // inputLabelProps={{ classes: {} }}
          list={addDropDownOptionKeys(roles)}
          multiple
          onChange={(e) => {
            const result = e.target.value;
            setUserInfo(userInfo => ({ ...userInfo, roles: result }));
          }}
          // selectProps={{
          //   SelectDisplayProps: { style: { paddingTop: 17, paddingBottom: 13, fontSize: 16 } }
          // }}
          text={`${t('select')}${t('enSpace')}${t('role')}`}
          value={userInfo.roles}
        />
        <MuiDropdown
          classes={{ root: `${classes.w_30}` }}
          disabled={adminExists}
          // inputLabelProps={{ classes: {} }}
          list={addDropDownOptionKeys(vgInfosExcludeTotal)}
          multiple
          onChange={(e) => {
            const result = e.target.value;
            setUserInfo(userInfo => ({ ...userInfo, virtualGroups: result }));
          }}
          // selectProps={{
          //   SelectDisplayProps: { style: { paddingTop: 17, paddingBottom: 13, fontSize: 16 } }
          // }}
          text={`${t('select')}${t('enSpace')}${t('group')}`}
          value={userInfo.virtualGroups}
        />
        <div className={`${classes.w_30}`} />
        <div className={`${classes.d_flex} ${classes.mt_10}`}>
          {
            <>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isNfsSetting}
                    color="primary"
                    name="nfs"
                    onChange={(e, value) => setIsNfsSetting(value)}
                  />
                }
                label={`${t('setting')}${t('enSpace')}${t('NFS')}`}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isGlusterfsSetting}
                    color="primary"
                    name="glusterfs"
                    onChange={(e, value) => setIsGlusterfsSetting(value)}
                  />
                }
                label={`${t('setting')}${t('enSpace')}${t('glusterfs')}`}
              />
            </>

          }
          <div className={`${classes.flex_align_center} ${classes.pb_6}`}>
            {
              (isNfsSetting || isGlusterfsSetting)
                ? `( ${t('verifyContinueText', { state: t('adding') })} )`
                : ''
            }
          </div>
        </div>
      </div>
      {/* <div className={`${classes.flex_justify_end} ${classes.mt_20}`}>
        <DefaultButton
          children={t('cancel')}
          classes={{ root: classes.mr_20 }}
          disabled={isUserCreating}
          onClick={() => {
            onClose();
            setUserInfoErrMsg(defaultUserInfoErrMsg);
            setUserInfo(defaultUserInfo);
            setStartToSetDefault(false);
          }}
        />
        {
          isUserCreating
            ? <CircularProgress />
            :
            <PrimaryButton
              children={t('add')}
              disabled={isUserCreating || !enableCreateUserBtn}
              onClick={onSubmit}
            />
        }
      </div> */}
    </BaseModalNew>
  );
}

CreateUserModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  setUserCreatSucName: PropTypes.func,
  setIsUserCreatSuc: PropTypes.func,
  setWhichStorageSetting: PropTypes.func
};

export default CreateUserModal;
