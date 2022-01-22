import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';
import BaseModal from 'components/BaseModal';
import { DefaultButton, PrimaryButton, IconButton } from 'components/BaseButton';
import { BaseTextField } from 'components/BaseMuiInput';
import MuiDropdown from 'components/BaseMuiDropdown';

import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import styles from './modal.module.scss';

import { createXdfs } from 'utils/api';
import Context from './Context';
import GlobalContext from 'layouts/Main/GlobalContext';

const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  },
  marginTop10: {
    marginTop: 10
  },
  marginBottom20: {
    marginBottom: 20
  },
  marginBottom10: {
    marginBottom: 10
  }
}))


const addDropDownOptionKeys = optionItems => {
  return optionItems.map((item) => ({
    key: item,
    text: item,
    ...item
  }));
};

function AddXdfsDetailModal({ isOpen, onClose }) {
  const params = useParams();
  const { t } = useTranslation();
  const { getData, userList } = useContext(Context);
  const globalData = useContext(GlobalContext);
  const classes = useStyles();

  const [isGlusterfsDataCreating, setGlusterfsDataCreating] = useState(false);
  const [userPrivileges, setUserPrivileges] = useState([]);
  const [name, setName] = useState('');
  const [space, setSpace] = useState(10);
  const [selectedKey, setSelectedKey] = useState(2);
  const [owners, setOwners] = useState([]);
  const [privateUserList, setPrivateUserList] = useState([]);
  const [canWriteUsers, setCanWriteUsers] = useState([]);
  const [privateUsers, setPrivateUsers] = useState([]);
  const [privateUsersTemp, setPrivateUsersTemp] = useState([]);

  const [isNfsNameError, setIsNfsNameError] = useState('');
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

  const onSubmit = async() => {
    const formData = {
      name,
      volume: params.path,
      size: space,
      users: owners.filter(item => item !== '').map(name => name.trim()),
      canReadUsers: [],
      canWriteUsers,
      publicMode: selectedKey
    };

    if (selectedKey === 0) {
      formData.canReadUsers = privateUsers.filter(user => user.type === 'read').map(user => user.name)
      formData.canWriteUsers = privateUsers.filter(user => user.type === 'write').map(user => user.name)
    }

    setGlusterfsDataCreating(true);
    createXdfs(formData)
      .then(() => {
        toast.success(`${t('add')}${t('enSpace')}${t('success')}`);
        getData();
        onClose();
      })
      .catch(err => toast.error(err.data ? err.data.message : err.toString()))
      .finally(() => setGlusterfsDataCreating(false))
  };

  const rules = {
    required: value => (value ? '' : t('fieldRequired')),
    mustBeNumber: value => (isNaN(value) ? t('mustInputNumber') : ''),
    nameFormat(name) {
      const nameValidation = RegExp(/^[A-Za-z0-9]{1,254}$/, 'g');
      return nameValidation.test(name) ? '' : t('nameInvalid');
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

  useEffect(() => {
    const privileges = globalData.userInfo.privileges ? globalData.userInfo.privileges : [];
    setUserPrivileges(privileges)
  }, []);

  return (
    <BaseModal
      isOpen={isOpen}
      modalWidth={500}
      title={`${t('add')} GlusterFS`}
    >
      <BaseTextField
        classes={{ root: `${classes.marginBottom20} ${classes.marginTop10}` }}
        error={isNfsNameError}
        helperText={isNfsNameError === '' ? '' : isNfsNameError}
        label={t('name')}
        onChange={(e) => {
          const value = e.target.value;
          setName(value);
          const checkField = rules.required(value) || rules.nameFormat(value);
          setIsNfsNameError(checkField)
        }}
        required
        type="text"
        value={name}
      />
      <BaseTextField
        classes={{ root: `${classes.marginBottom20}` }}
        error={isSpaceError}
        helperText={isSpaceError === '' ? '' : isSpaceError}
        label={`${t('space')} ( GB )`}
        onChange={(e) => {
          const value = e.target.value;
          setSpace(value);
          const checkField = rules.required(value) || rules.mustBeNumber(value);
          setIsSpaceError(checkField)
        }}
        required
        type="text"
        value={space}
      />
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
            style={{ maxWidth: '100%', marginBottom: 20 }}
            text={t('owner')}
            value={owners}
          />
          :
          <BaseTextField
            classes={{ root: `${classes.marginBottom20}` }}
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
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <DefaultButton
          children={t('cancel')}
          classes={{ root: classes.marginRight10 }}
          disabled={isGlusterfsDataCreating}
          onClick={onClose}
        />
        {
          isGlusterfsDataCreating
            ? <CircularProgress />
            :
            <PrimaryButton
              children={t('confirm')}
              disabled={!name || !space}
              onClick={onSubmit}
            />
        }
      </div>
    </BaseModal>
  );
}

AddXdfsDetailModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default AddXdfsDetailModal;
