import React, { useEffect, useState, useContext } from 'react';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import { DefaultButton, PrimaryButton, IconButton } from 'components/BaseButton';
import BaseModal from 'components/BaseModal';
import MuiDropdown from 'components/BaseMuiDropdown';
import { BaseTextField } from 'components/BaseMuiInput';

import Context from './Context';
import GlobalContext from 'layouts/Main/GlobalContext';

import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import { modifyGlusterfsDetail, getModifyGlusterfsDetail } from 'utils/api';

import styles from './modal.module.scss';

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

const addDropDownOptionKeys = optionItems => {
  return optionItems.map((item) => ({
    key: item,
    text: item,
    ...item
  }));
};

function ModifyGlusterfsDetailModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { getData, userList, updateName } = useContext(Context);
  const globalData = useContext(GlobalContext);

  const [isGlusterfsDataUpdating, setGlusterfsDataUpdating] = useState(false);
  const [userPrivileges, setUserPrivileges] = useState([]);
  const [space, setSpace] = useState(10);
  const [selectedKey, setSelectedKey] = useState(false);
  const [owners, setOwners] = useState([]);
  const [privateUserList, setPrivateUserList] = useState([]);
  const [canReadUsers, setCanReadUsers] = useState([]);
  const [canWriteUsers, setCanWriteUsers] = useState([]);
  const [privateUsers, setPrivateUsers] = useState([]);
  const [privateUsersTemp, setPrivateUsersTemp] = useState([]);

  const [isSpaceError, setIsSpaceError] = useState('');

  useEffect(() => {
    setPrivateUserList(userList
      .filter(user => !privateUsers.some(item => item.name === user))
      .map(user => ({ key: user, text: user })))

  }, [privateUsers, userList])

  const handlePrivilegeChange = (value, user) => {
    setPrivateUsers(prev => prev.map(item => {
      if (item.name === user.name) return { text: user.name, name: user.name, type: value }
      return item
    }))
  }

  const handleDeletePrivilegeUser = user => {
    setPrivateUsers(prev => prev.filter(item => item.name !== user.name))
  }

  const getModifyData = () => {
    if (updateName !== undefined) {
      getModifyGlusterfsDetail(updateName)
        .then(res => {
          setSpace(res.size);
          setSelectedKey(res.publicMode)
          setOwners(res.users);
          setCanReadUsers(res.canReadUsers);
          setCanWriteUsers(res.canWriteUsers);
          const canReadUsers = [...res.canReadUsers].filter(name => (!res.canWriteUsers.includes(name)))
          setPrivateUsers([
            ...canReadUsers.map(user => ({ name: user, type: 'read' })),
            ...res.canWriteUsers.map(user => ({ name: user, type: 'write' }))
          ])
        })
        .catch(err => {
          const msg = err.data ? err.data.message : err.toString();
          toast.error('Error: ' + msg)
        });
    }
  };

  const hasUserOrAdminPrivileges = privilege => {
    switch (privilege) {
      case 'ADMIN':
        return true;
      case 'USER':
        return true;
      default:
        return false;
    }
  };

  const onSubmit = async() => {
    setGlusterfsDataUpdating(true);
    const formData = {
      name: updateName,
      size: space,
      users: owners.filter(item => item !== '').map(name => name.trim()),
      canReadUsers,
      canWriteUsers,
      publicMode: selectedKey
    }

    if (selectedKey === 0) {
      formData.canWriteUsers = privateUsers.filter(user => user.type === 'write').map(user => user.name)
      formData.canReadUsers = privateUsers.map(user => user.name)
    }

    modifyGlusterfsDetail(formData)
      .then(() => {
        onClose();
        getData();
        toast.success(`${t('modify')}${t('enSpace')}${t('success')}`)
      })
      .catch(err => toast.error(err.data ? err.data.message : err.toString()))
      .finally(() => setGlusterfsDataUpdating(false))
  };

  const rules = {
    bypass: () => null,
    required: value => (value ? '' : t('fieldRequired')),
    mustBeNumber: value => (isNaN(value) ? t('mustInputNumber') : '')
  };

  useEffect(() => {
    const privileges = globalData.userInfo.privileges ? globalData.userInfo.privileges : [];
    setUserPrivileges(privileges)
  }, []);

  useEffect(getModifyData, [isOpen]);

  return (
    <BaseModal
      isOpen={isOpen}
      modalWidth={500}
      title={`${t('modify')} ${updateName}`}
    >
      {
        userPrivileges.some(hasUserOrAdminPrivileges)
          ?
          <MuiDropdown
            list={addDropDownOptionKeys(userList)}
            multiple
            onChange={(e) => {
              const value = e.target.value;
              setOwners(value);
            }}
            style={{ maxWidth: '100%', marginBottom: 20, marginTop: 10 }}
            text={t('owner')}
            value={owners}
          />
          :
          <BaseTextField
            classes={{ root: `${classes.marginBottom20} ${classes.marginTop10}` }}
            label={t('owner')}
            onChange={(e) => {
              const value = e.target.value;
              setOwners(value.split(','));
            }}
            required
            type="text"
            value={owners.join(',')}
          />
      }
      <BaseTextField
        classes={{ root: classes.marginBottom20 }}
        error={isSpaceError}
        helperText={isSpaceError === '' ? '' : isSpaceError}
        label={`${t('space')} ( GB )`}
        onChange={(e) => {
          const value = e.target.value;
          setSpace(value);
          const checkField = rules.required(value) || rules.mustBeNumber(value);
          setIsSpaceError(checkField)
        }}
        value={space}
      />
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
                !isEmpty(userList) ?
                  <MuiDropdown
                    list={addDropDownOptionKeys(userList)}
                    multiple
                    onChange={(e) => {
                      const value = e.target.value;
                      setCanWriteUsers(value);
                    }}
                    style={{ maxWidth: '100%', marginBottom: 10 }}
                    text={t('User')}
                    value={(canWriteUsers)}
                  />
                  :
                  <BaseTextField
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
                  !isEmpty(userList) ?
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 20 }}>
        <DefaultButton
          children={t('cancel')}
          classes={{ root: classes.marginRight10 }}
          disabled={isGlusterfsDataUpdating}
          onClick={onClose}
        />
        {
          isGlusterfsDataUpdating
            ? <CircularProgress />
            :
            <PrimaryButton
              children={t('confirm')}
              disabled={!space}
              onClick={onSubmit}
            />
        }
      </div>
    </BaseModal>
  );
}

ModifyGlusterfsDetailModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default ModifyGlusterfsDetailModal;
