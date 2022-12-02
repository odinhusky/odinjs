import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// # API
import { updateNfs } from 'utils/api';

// ? context
import NFSDiskListContext from '../../../NFSDiskListContext';
import GlobalContext from 'layouts/Main/GlobalContext';

// ? Self-packed Components || Functions
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

// ? Self-packed Components || Functions
import BaseModalNew from 'components/BaseModalNew';
import MuiDropdown from 'components/BaseMuiDropdown';
import { BaseTextField } from 'components/BaseMuiInput';
import Icon from '@material-ui/core/Icon';
import { DefaultButton, PrimaryButton, IconButton } from 'components/BaseButton';
import CircularProgress from '@material-ui/core/CircularProgress';

// ^ Plugins
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/NFSDiskList/DetailPage/SetNfsUserModal
 * @component SetNfsUserModal
 * @description SetNfsUserModal
*/
function SetNfsUserModal({
  isOpen,
  onClose,
  userList: rawUserList
}) {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const { nfs, getNfsList, classes } = useContext(NFSDiskListContext);
  const { userInfo } = useContext(GlobalContext);

  // & handled data
  const userList = rawUserList.map(user => ({ key: user.username, text: user.username }))

  // # states
  const [isNfsUserSetting, setIsNfsUserSetting] = useState(false);
  const [selectedKey, setSelectedKey] = useState(0);
  const [owners, setOwners] = useState([]);
  const [privateUserList, setPrivateUserList] = useState([]);
  const [canReadUsers, setCanReadUsers] = useState([]);
  const [canWriteUsers, setCanWriteUsers] = useState([]);
  const [privateUsers, setPrivateUsers] = useState([]);
  const [privateUsersTemp, setPrivateUsersTemp] = useState([]);
  const [space, setSpace] = useState(10);
  const [isSpaceError, setIsSpaceError] = useState('');
  const [canEditSize, setCanEditSize] = useState(false);
  const canGetUserList = userInfo.privileges && userInfo.privileges.some(pvg => pvg === 'ADMIN' || pvg === 'USER')

  // - methods
  const handlePrivilegeChange = (value, user) => {
    setPrivateUsers(prev => prev.map(item => {
      if (item.name === user.name) return { text: user.name, name: user.name, type: value }
      return item
    }))
  }

  const handleDeletePrivilegeUser = user => {
    setPrivateUsers(prev => prev.filter(item => item.name !== user.name))
  }

  const rules = {
    bypass: () => null,
    required: value => (value ? '' : t('fieldRequired')),
    mustBeNumber: value => (isNaN(value) ? t('mustInputNumber') : '')
  };

  useEffect(() => {
    setPrivateUserList(userList
      .filter(user => !privateUsers.some(item => item.name === user.key))
      .map(user => ({ key: user.key, text: user.key })))

  }, [privateUsers, rawUserList])

  const handleSetNfsUser =
    () => {
      setIsNfsUserSetting(true);
      const formData = {
        name: nfs.name,
        size: canEditSize ? space : null,
        users: owners.filter(item => item !== '').map(name => name.trim()),
        canReadUsers,
        canWriteUsers,
        publicMode: selectedKey
      }

      if (selectedKey === 0) {
        formData.canWriteUsers = privateUsers.filter(user => user.type === 'write').map(user => user.name)
        formData.canReadUsers = privateUsers.map(user => user.name)
      }

      updateNfs(formData)
        .then(() => {
          getNfsList();
          onClose();
          toast.success(`${t('setting')}${t('enSpace')}${t('success')}`);
        })
        .catch(err => toast.error('Error:' + err.data ? err.data.message : err.toString()))
        .finally(setIsNfsUserSetting(false));
    }

  // * hooks
  useEffect(
    () => {
      if (isEmpty(nfs)) return;
      setOwners(nfs.users);
      setSpace(nfs.size)
      setCanEditSize(nfs.type === 1)
      setSelectedKey(nfs.publicMode)
      setCanReadUsers(nfs.canReadUsers);
      setCanWriteUsers(nfs.canWriteUsers);
      const canReadUsers = [...nfs.canReadUsers].filter(name => (!nfs.canWriteUsers.includes(name)))
      setPrivateUsers([
        ...canReadUsers.map(user => ({ text: user, name: user, type: 'read' })),
        ...nfs.canWriteUsers.map(user => ({ text: user, name: user, type: 'write' }))
      ])
    },
    [nfs]
  );

  return (
    <BaseModalNew
      isOpen={isOpen}
      modalFoot={
        <>
          <DefaultButton
            children={t('close')}
            classes={{ root: classes.mr_10 }}
            disabled={isNfsUserSetting}
            onClick={onClose}
          />
          {
            isNfsUserSetting
              ? <CircularProgress />
              :
              <PrimaryButton
                children={t('confirm')}
                disabled={isNfsUserSetting}
                onClick={handleSetNfsUser}
              />
          }
        </>
      }
      onClose={onClose}
      size="sm"
      title={`${t('setting')} ${nfs.name}`}
    >
      {
        canGetUserList
          ?
          <MuiDropdown
            className={`${classes.maxW_100} ${classes.mt_10} ${classes.mb_20}`}
            list={userList}
            multiple
            onChange={(e) => {
              const value = e.target.value;
              setOwners(value);
            }}
            text={t('owner')}
            value={owners}
          />
          :
          <BaseTextField
            classes={{ root: `${classes.mb_20} ${classes.marginTop10}` }}
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
      {
        canEditSize &&
        <BaseTextField
          classes={{ root: classes.mb_20 }}
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
                canGetUserList ?
                  <MuiDropdown
                    list={userList}
                    multiple
                    onChange={(e) => {
                      const value = e.target.value;
                      setCanWriteUsers(value);
                    }}
                    style={{ maxWidth: '100%', margin: '10px 0 15px 0' }}
                    text={t('User')}
                    value={canWriteUsers}
                  />
                  :
                  <BaseTextField
                    classes={{ root: classes.mb_10 }}
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
            <div className={`${classes.detailPageCreateModalAddUserBar}`}>
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
                    classes={{ root: classes.mb_10 }}
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
                  setPrivateUsers(prev => [...prev, ...privateUsersTemp.filter(item => item !== '').map(user => ({ text: user.trim(), name: user.trim(), type: 'read' }))])
                  setPrivateUsersTemp([]);
                }}
              />
            </div>
            <div className={`${classes.detailPageCreateModalUserBox}`}>
              {
                privateUsers.map(user => (
                  <div
                    className={`${classes.detailPageCreateModalUserBoxItem}`}
                    key={user.name}
                  >
                    <span className={`${classes.detailPageCreateModalName}`}>{user.name}</span>
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
    </BaseModalNew>
  );
}
SetNfsUserModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  userList: PropTypes.array
};

export default SetNfsUserModal;
