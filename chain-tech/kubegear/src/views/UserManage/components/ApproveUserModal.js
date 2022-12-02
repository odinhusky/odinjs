/* eslint-disable no-unreachable */
import React, {
  useEffect,
  useState,
  useContext,
  useMemo,
  useCallback
} from 'react';

// # API
import {
  getVg,
  updateUser,
  getRole
} from 'utils/api';

// ? context
import UserManageContext from '../UserManageContext';

// ^ Material-ui Componets(Functions)
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';

// ? Self-packed Components || Functions
import BaseModalNew from 'components/BaseModalNew';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import ConfirmModal from 'components/ConfirmModal';
import Title from './Title';
import { BaseTextField } from 'components/BaseMuiInput';
import MuiDropdown from 'components/BaseMuiDropdown';

// ^ Plugin
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

/**
 * @author odin
 * @level views/UserManage/ApproveUserModal
 * @component ApproveUserModal
 * @description ApproveUserModal component
*/
function ApproveUserModal({
  isOpen,
  onClose,
  userInfo: defaultUserInfo,
  setWhichStorageSetting,
  setIsUserCreatSuc
}) {

  // $ init data
  const { t } = useTranslation();

  const defaultUserInfoErrMsg = {
    // jobLifeHour: '',
    nfsSize: undefined
  };

  // ? context
  const {
    getUserInfoList,
    addDropDownOptionKeys,
    // rules,
    // systemParams,
    currentUser,
    classes
  } = useContext(UserManageContext);

  // # states
  const [startToSetDefault, setStartToSetDefault] = useState(false);
  const [userInfo, setUserInfo] = useState(defaultUserInfo);
  const [vgInfosExcludeTotal, setVgInfosExcludeTotal] = useState([]);
  const [roles, setRoles] = useState([]);
  const [adminExists, setAdminExists] = useState(false);
  const [isUserApproving, setIsUserApproving] = useState(false);
  const [privileges, setPrivileges] = useState([]);
  const [userInfoErrMsg, setUserInfoErrMsg] = useState(defaultUserInfoErrMsg);
  const [enableApproveUserBtn, setEnableApproveUserBtn] = useState(false);
  const [isConfirmModalShow, setIsConfirmModalShow] = useState(false);
  const [isNfsSetting, setIsNfsSetting] = useState(false);
  const [isGlusterfsSetting, setIsGlusterfsSetting] = useState(false);
  // const [limitKey, setLimitKey] = useState(2);

  // - methods
  const onAudit = async() => {
    const auditUserInfo = {
      username: userInfo.username,
      roles: userInfo.roles,
      description: userInfo.description,
      state: 1
    };

    if (!adminExists) {
      // add virtualGroups
      auditUserInfo.virtualGroups = userInfo.virtualGroups;
    }

    try {
      setIsUserApproving(true);
      await updateUser(auditUserInfo);
      setIsUserApproving(false);
      onClose();
      toast.success(`${t('User')} ${auditUserInfo.username} ${t('verified')}`);
      setWhichStorageSetting({ nfs: isNfsSetting, glusterfs: isGlusterfsSetting, name: userInfo.username })
      setIsUserCreatSuc(true)
      setUserInfoErrMsg(defaultUserInfoErrMsg);
      getUserInfoList();
    } catch (err) {
      const msg = err?.data ? err.data?.message : err.toString();
      toast.error(msg);
      setIsUserApproving(false);
    }
  };

  const onDeny = useCallback(async() => {
    const denyUserInfo = {
      username: userInfo.username,
      description: userInfo.description,
      state: -1
    };
    try {
      setIsUserApproving(true);
      await updateUser(denyUserInfo);
      setIsUserApproving(false);
      onClose();
      toast.success(`${t('User')} ${denyUserInfo.username} ${t('denied')}`);
      setUserInfoErrMsg(defaultUserInfoErrMsg);
      getUserInfoList();
    } catch (err) {
      const msg = err.data ? err.data.message : err.toString();
      toast.error('ERROR!\n' + msg);
      setIsUserApproving(false);
    }
  }, [userInfo]);

  // * hooks
  useEffect(() => {
    if (startToSetDefault) {

      const findRoleData = roles.find((item) => {
        return item.name === '普通用户'
      })

      setUserInfo((prevUserInfo) => {
        return {
          ...prevUserInfo,
          roles: findRoleData ? [findRoleData.name] : [],
          virtualGroups: vgInfosExcludeTotal.map(item => item.name).find(name => name !== 'total') ? [vgInfosExcludeTotal.map(item => item.name).find(name => name !== 'total')] : []
        }
      })
      if (findRoleData) {
        setPrivileges(findRoleData.privileges)
      }

      setStartToSetDefault(false);
    }
  }, [startToSetDefault])

  useEffect(() => {
    if (defaultUserInfo.limitResource) {
      setUserInfo({
        ...defaultUserInfo
      })
      // setLimitKey(defaultUserInfo.limitResource.enabled === null ? 1 : 0)
    }
  }, [defaultUserInfo])

  useEffect(
    () => {
      // const { limitResource } = userInfo
      // if (limitResource && limitResource.enabled) {
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
      //     setEnableApproveUserBtn(false);
      //     return
      //   }
      // }

      if (Object.values(userInfoErrMsg).some(str => !isEmpty(str))) {
        setEnableApproveUserBtn(false);
        return
      }

      setEnableApproveUserBtn(true)
    },
    [userInfoErrMsg, userInfo]
  );

  useMemo(
    () => {
      if (isOpen) {
        Promise.all([
          getVg(),
          getRole()
        ])
          .then(([vgInfos, roles]) => {
            setVgInfosExcludeTotal(vgInfos.filter(vg => vg.name !== 'total'));
            if (currentUser.admin === 'true') {
              setRoles(roles);
            } else {
              setRoles(roles.filter(item => !item.privileges.includes('ADMIN')));
            }
            setStartToSetDefault(true);
          })
          .catch(error => {
            toast.error('useMemo getVg / getRole Error => ', error);
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
    },
    [userInfo, roles]
  );

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

  return (
    <BaseModalNew
      classNameObj={{
        modalContainer: `${classes.userManageModalContainer} ${classes.h_auto}`
      }}
      isOpen={isOpen}
      modalFoot={
        <>
          <div className={`${classes.mr_auto}`}>
            {
              isUserApproving
                ? <CircularProgress />
                :
                <DefaultButton
                  children={t('Deny')}
                  classes={{ root: classes.denyButton }}
                  disabled={isUserApproving}
                  onClick={() => setIsConfirmModalShow(true)}
                />
            }
          </div>
          <div>
            <DefaultButton
              children={t('close')}
              classes={{ root: classes.mr_10 }}
              disabled={isUserApproving}
              onClick={() => {
                onClose();
                setPrivileges([]);
                setUserInfoErrMsg(defaultUserInfoErrMsg);
                // setUserInfo (defaultUserInfo);
              }}
            />
            {
              isUserApproving
                ? <CircularProgress />
                :
                <PrimaryButton
                  children={t('passed')}
                  disabled={isUserApproving || !enableApproveUserBtn}
                  onClick={onAudit}
                />
            }
          </div>
        </>
      }
      onClose={onClose}
      size="sm"
      title={`${t('Verify')}${t('enSpace')}${t('User')}`}
    >
      <div className={`${classes.flex_wrap} ${classes.flex_justify_between}`}>
        <Title
          text={
            <div className={`${classes.flex_align_center}`}>
              {t('userInfo')}
              <div className={`${classes.statusLabelStyle}`}>
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
        <BaseTextField
          className={`${classes.w_30} ${classes.mb_16}`}
          disabled
          label={`${t('jobNumber')}/${t('studentNumber')}`}
          required
          value={userInfo.userCode}
        />
        <BaseTextField
          className={`${classes.w_30} ${classes.mb_16}`}
          disabled
          label={t('fullName')}
          required
          value={userInfo.name}
        />
        <BaseTextField
          classes={{ root: `${classes.w_30}` }}
          disabled
          label={t('mobileNumber')}
          required
          value={userInfo.phone}
        />
        <BaseTextField
          classes={{ root: `${classes.w_30}` }}
          disabled
          label={t('email')}
          required
          value={userInfo.email}
        />
        <BaseTextField
          classes={{ root: `${classes.w_30}` }}
          label={t('note')}
          onChange={(e) => {
            const value = e.target.value;
            setUserInfo(userInfo => ({ ...userInfo, description: value }));
          }}
          value={userInfo.description}
        />
      </div>
      <div className={`${classes.flex_wrap} ${classes.flex_justify_between}`}>
        <Title text={`${t('resource')}${t('enSpace')}${t('setting')}`} />
        <MuiDropdown
          classes={{ root: `${classes.w_30} ${classes.mb_16}` }}
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
          classes={{ root: `${classes.w_30} ${classes.mb_16}` }}
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
        <div
          className={`${classes.w_30}`}
          style={{ width: '30%' }}
        />
        <BaseTextField
          // classes={{ root: `${classes.marginBottom16}` }}
          disabled
          label={`${t('privilege')}${t('enSpace')}${t('list')}`}
          value={privileges.join(', ')}
        />
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
                ? `( ${t('verifyContinueText', { state: t('Verify') })} )`
                : ''
            }
          </div>
        </div>
      </div>

      {/* Modal */}
      {
        isConfirmModalShow &&
        <ConfirmModal
          confrimText={t('Deny')}
          content={t('denyUserMsg', { name: userInfo.username })}
          isOpen={isConfirmModalShow}
          onClose={() => setIsConfirmModalShow(false)}
          onConfirm={onDeny}
          title={`${t('Deny')}${t('enSpace')}${t('User')}`}
        />
      }
    </BaseModalNew>
  );
}

ApproveUserModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  setUserInfo: PropTypes.func,
  userInfo: PropTypes.object,
  setWhichStorageSetting: PropTypes.func,
  setIsUserCreatSuc: PropTypes.func
};

export default ApproveUserModal;
