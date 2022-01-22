import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Icon from '@material-ui/core/Icon';

import BaseModal from 'components/BaseModal';
import { DefaultButton, PrimaryButton, IconButton } from 'components/BaseButton';
import MuiDropdown from 'components/BaseMuiDropdown';
import { BaseTextField } from 'components/BaseMuiInput';

import { updateNfsPrivilege, updateGlusterfsPrivilege, updateXdfsPrivilege, getUserList } from 'utils/api';

import { toast } from 'react-toastify';
import { uniq, isEmpty } from 'lodash';

import Context from '../../../Context';
import GlobalContext from 'layouts/Main/GlobalContext';

import styles from './EditModal.module.scss';

const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  },
  marginTop10: {
    marginTop: 10
  },
  marginBottom10: {
    marginBottom: 10
  },
  marginBottom20: {
    marginBottom: 20
  },
  iconClearMarginLeft: {
    marginLeft: 0
  }
}))

const EditModal = ({ isOpen, onClose, nfs }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const { userInfo } = useContext(GlobalContext);
  const { isNFS, isXdfsEnabled, getFsList } = useContext(Context);
  const [selectedKey, setSelectedKey] = useState(false);
  const [userList, setUserList] = useState([]);
  const [privateUserList, setPrivateUserList] = useState([]);
  const [canReadUsers, setCanReadUsers] = useState([]);
  const [canWriteUsers, setCanWriteUsers] = useState([]);
  const [privateUsers, setPrivateUsers] = useState([]);
  const [privateUsersTemp, setPrivateUsersTemp] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const canGetUserList = userInfo.privileges && userInfo.privileges.some(pvg => pvg === 'ADMIN' || pvg === 'USER')

  useEffect(() => {
    if (!nfs.canReadUsers) return;
    setCanReadUsers(nfs.canReadUsers)
    setCanWriteUsers(nfs.canWriteUsers)
    setSelectedKey(nfs.publicMode)
    const canReadUsers = [...nfs.canReadUsers].filter(name => (!nfs.canWriteUsers.includes(name)))
    setPrivateUsers([
      ...canReadUsers.map(user => ({ name: user, type: 'read' })),
      ...nfs.canWriteUsers.map(user => ({ name: user, type: 'write' }))
    ])
  }, [nfs])

  useEffect(() => {
    const selectedUser = uniq(canReadUsers.concat(canWriteUsers))
    if (!isEmpty(userList)) {
      setPrivateUserList(userList
        .filter(user => !selectedUser.some(item => item === user.key) && !privateUsers.some(item => item.name === user.key))
        .map(user => ({ key: user.key, text: user.key })))
    }
  }, [canReadUsers, canWriteUsers, privateUsers, userList])

  useEffect(() => {
    if (canGetUserList) {
      getUserList()
        .then(res => setUserList(res.map(item => ({ key: item.username, text: item.username }))))
        .catch(err => toast.error(err.data ? err.data.message : err.message))
    }
  }, [userInfo])

  const handlePrivilegeChange = (value, user) => {
    setPrivateUsers(prev => prev.map(item => {
      if (item.name === user.name) return { name: user.name, type: value }
      return item
    }))
  }

  const handleDeletePrivilegeUser = user => {
    setPrivateUsers(prev => prev.filter(item => item.name !== user.name))
  }

  const onSubmit = () => {
    const formData = {
      publicMode: selectedKey,
      canReadUsers,
      canWriteUsers: canWriteUsers.filter(item => item !== '').map(name => name.trim())
    }

    if (selectedKey === 0) {
      formData.canWriteUsers = privateUsers.filter(user => user.type === 'write').map(user => user.name)
      formData.canReadUsers = privateUsers.map(user => user.name)
    }

    setIsLoading(true);
    const request = isXdfsEnabled
      ? updateXdfsPrivilege
      : isNFS ? updateNfsPrivilege : updateGlusterfsPrivilege
    request(nfs.name, formData)
      .then(() => {
        toast.success(`${t('edit')}${t('enSpace')}${t('success')}`)
        getFsList();
        onClose();
      })
      .catch(err => toast.error(err.data ? err.data.message : err.message))
      .finally(() => setIsLoading(false));
  }

  return (
    <BaseModal
      isOpen={isOpen}
      modalWidth={400}
      onClose={onClose}
      title={`${t('edit')} ${nfs.name}`}
    >
      <FormControl>
        <FormLabel>{t('Permission')}</FormLabel>
        <RadioGroup
          aria-label="permission"
          name="permission"
          onChange={(e) => {
            const value = e.target.value;
            setSelectedKey(Number(value))
          }}
          value={selectedKey}
        >
          <FormControlLabel
            control={<Radio />}
            label={t('allUserCanEdit')}
            value={2}
          />
          <FormControlLabel
            control={<Radio />}
            label={t('AllUsersCanViewSpecificUsersCanEdit')}
            value={1}
          />
          {
            selectedKey === 1 &&
            <>
              {
                canGetUserList ?
                  <MuiDropdown
                    list={userList}
                    multiple
                    onChange={(e) => {
                      const value = e.target.value;
                      setCanWriteUsers(value);
                    }}
                    style={{ maxWidth: '100%', marginBottom: 10 }}
                    text={t('User')}
                    value={canWriteUsers}
                  />
                  :
                  <BaseTextField
                    classes={{ root: classes.marginBottom10 }}
                    label={t('User')}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCanWriteUsers(value.split(','));
                    }}
                    required
                    type="text"
                    value={canWriteUsers.join(',')}
                  />
              }
            </>
          }
          <FormControlLabel
            control={<Radio />}
            label={t('PrivateSpecificUsersCanViewAndEdit')}
            value={0}
          />
          {
            selectedKey === 0 &&
            <>
              <div className={styles.addUserBar}>
                {
                  canGetUserList ?
                    <MuiDropdown
                      list={privateUserList}
                      multiple
                      onChange={(e) => {
                        const value = e.target.value;
                        setPrivateUsersTemp(value);
                      }}
                      style={{ maxWidth: '100%' }}
                      text={t('User')}
                      value={privateUsersTemp}
                    />
                    :
                    <BaseTextField
                      label={t('User')}
                      onChange={(e) => {
                        const value = e.target.value;
                        setPrivateUsersTemp(value.split(','));
                      }}
                      required
                      type="text"
                      value={privateUsersTemp.join(',')}
                    />
                }
                <PrimaryButton
                  children={t('add')}
                  onClick={() => {
                    setPrivateUsers(prev => [...prev, ...privateUsersTemp.filter(item => item !== '').map(user => ({ name: user.trim(), type: 'read' }))])
                    setPrivateUsersTemp([]);
                  }}
                />
              </div>
              <div className={styles.userBox}>
                {
                  privateUsers.map(user => (
                    <div
                      className={styles.userBoxItem}
                      key={user.name}
                    >
                      <span className={styles.name}>{user.name}</span>
                      <FormControl>
                        <RadioGroup
                          aria-label={user.name}
                          name={user.name}
                          onChange={(e) => {
                            const value = e.target.value;
                            handlePrivilegeChange(value, user)
                          }}
                          row
                          value={privateUsers.find(item => item.name === user.name).type}
                        >
                          <FormControlLabel
                            control={<Radio />}
                            label={t('view')}
                            value={'read'}
                          />
                          <FormControlLabel
                            control={<Radio />}
                            label={t('edit')}
                            value={'write'}
                          />
                        </RadioGroup>
                      </FormControl>
                      <IconButton
                        children={<Icon>close</Icon>}
                        onClick={() => handleDeletePrivilegeUser(user)}
                      />
                    </div>
                  ))
                }
              </div>
            </>
          }
        </RadioGroup>
      </FormControl>
      <div className={styles.footer}>
        <DefaultButton
          children={t('cancel')}
          classes={{ root: classes.marginRight10 }}
          onClick={onClose}
        />
        <PrimaryButton
          children={t('confirm')}
          disabled={isLoading}
          onClick={onSubmit}
        />
      </div>
    </BaseModal>
  );
};

EditModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  nfs: PropTypes.object
};

export default EditModal;