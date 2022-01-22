/* eslint-disable no-unreachable */
import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react';
import { mergeStyles } from 'office-ui-fabric-react';
import BaseModal from 'components/BaseModal';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import { getVg, updateUser, getRole } from 'utils/api';
import PropTypes from 'prop-types';
import Context from '../utils/Context';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import ConfirmModal from 'components/ConfirmModal';
import Title from './Title';
import { isEmpty } from 'lodash';

import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import { BaseTextField } from 'components/BaseMuiInput';
import MuiDropdown from 'components/BaseMuiDropdown';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
  marginRight10: {
    marginRight: 10
  },
  marginLeft10: {
    marginLeft: 10
  },
  marginTop10: {
    marginTop: 10
  },
  marginBottom16: {
    marginBottom: 16
  },
  heightAuto: {
    height: 'auto'
  },
  width30: {
    width: '30%'
  },
  width65: {
    width: '65%'
  },
  passwordInput: {
    '& #outlined-adornment-password': {
      boxSizing: 'initial'
    },
    '& #outlined-adornment-confirmPassword': {
      boxSizing: 'initial'
    }
  },
  denyButton: {
    backgroundColor: theme.palette.customColor.themeDenyDefaultBackgroundColor,
    color: theme.palette.white,
    border: 'transparent',
    '&:hover': {
      backgroundColor: theme.palette.customColor.themeDenyDefaultBackgroundColorHover
    }
  }
}))

function ApproveUserModal({ isOpen, onClose, userInfo: defaultUserInfo, setWhichStorageSetting, setIsUserCreatSuc }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const {
    getUserInfoList,
    addDropDownOptionKeys,
    // rules,
    // systemParams,
    currentUser,
    isXdfsEnabled
  } = useContext(Context);

  const defaultUserInfoErrMsg = {
    // jobLifeHour: '',
    nfsSize: undefined
  };

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
  const [isXdfsSetting, setIsXdfsSetting] = useState(false);
  // const [limitKey, setLimitKey] = useState(2);

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
            alert(error);
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
      setWhichStorageSetting({ nfs: isNfsSetting, glusterfs: isGlusterfsSetting, xdfs: isXdfsSetting, name: userInfo.username })
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

  const statusLabelStyle = () => {
    return mergeStyles({
      color: 'orange',
      background: '#FFF8EA',
      padding: '5px 10px',
      marginLeft: 10
    })
  }

  return (
    <BaseModal
      isOpen={isOpen}
      modalWidth={650}
      title={`${t('Verify')}${t('enSpace')}${t('User')}`}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <Title
          text={
            <div className={mergeStyles({ display: 'flex', alignItems: 'center' })}>
              {t('userInfo')}
              <div className={statusLabelStyle(userInfo.state)}>
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
          classes={{ root: `${classes.width30} ${classes.marginBottom16}` }}
          disabled
          label={t('Username')}
          required
          value={userInfo.username}
        />
        <BaseTextField
          classes={{ root: `${classes.width30} ${classes.marginBottom16}` }}
          disabled
          label={`${t('jobNumber')}/${t('studentNumber')}`}
          required
          value={userInfo.userCode}
        />
        <BaseTextField
          classes={{ root: `${classes.width30} ${classes.marginBottom16}` }}
          disabled
          label={t('fullName')}
          required
          value={userInfo.name}
        />
        <BaseTextField
          classes={{ root: `${classes.width30}` }}
          disabled
          label={t('mobileNumber')}
          required
          value={userInfo.phone}
        />
        <BaseTextField
          classes={{ root: `${classes.width30}` }}
          disabled
          label={t('email')}
          required
          value={userInfo.email}
        />
        <BaseTextField
          classes={{ root: `${classes.width30}` }}
          label={t('note')}
          onChange={(e) => {
            const value = e.target.value;
            setUserInfo(userInfo => ({ ...userInfo, description: value }));
          }}
          value={userInfo.description}
        />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <Title text={`${t('resource')}${t('enSpace')}${t('setting')}`} />
        <MuiDropdown
          classes={{ root: `${classes.width30} ${classes.marginBottom16}` }}
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
          classes={{ root: `${classes.width30} ${classes.marginBottom16}` }}
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
        <div style={{ width: '30%' }} />
        <BaseTextField
          // classes={{ root: `${classes.marginBottom16}` }}
          disabled
          label={`${t('privilege')}${t('enSpace')}${t('list')}`}
          value={privileges.join(', ')}
        />
        <div style={{ display: 'flex', marginTop: 10 }}>
          {
            !isXdfsEnabled
              ?
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
              :
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isXdfsSetting}
                    color="primary"
                    name="xdfs"
                    onChange={(e, value) => setIsXdfsSetting(value)}
                  />
                }
                label={`${t('setting')}${t('enSpace')}${t('xdfs')}`}
              />
          }
          <div style={{ display: 'flex', alignItems: 'center', paddingBottom: 6 }}>{isNfsSetting || isGlusterfsSetting || isXdfsSetting ? `( ${t('verifyContinueText', { state: t('Verify') })} )` : ''}</div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <div>
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
            children={t('cancel')}
            classes={{ root: classes.marginRight10 }}
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
      </div>
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
    </BaseModal>
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
