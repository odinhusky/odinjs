import React, {
  useState,
  useContext,
  useEffect
} from 'react';

// # API
import {
  updateNfsPrivilege,
  updateGlusterfsPrivilege,
  getUserList
} from 'utils/api';

// ? context
import FsItemListContext from '../../../FsItemListContext';
import GlobalContext from 'layouts/Main/GlobalContext';

// ^ Material-ui Componets(Functions)
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Icon from '@material-ui/core/Icon';

// ? Self-packed Components || Functions
import BaseModalNew from 'components/BaseModalNew';
import { DefaultButton, PrimaryButton, IconButton } from 'components/BaseButton';
import MuiDropdown from 'components/BaseMuiDropdown';
import { BaseTextField } from 'components/BaseMuiInput';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { uniq, isEmpty } from 'lodash';

/**
 * @author odin
 * @level views/FsItemList/IndexPage/EditModal
 * @component EditModal Component
 * @description EditModal to edit nfs data
*/
const EditModal = ({
  isOpen,
  onClose,
  nfs
}) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const { userInfo } = useContext(GlobalContext);
  const {
    isNFS,
    getFsList,
    classes
  } = useContext(FsItemListContext);

  // # states
  // selectedKey 就是 public mode
  // - 0 => 不公開
  // - 1 => 特定使用者可以編輯(所以人都可以看，特定使用者可以更新，包含上傳) canWriteUser
  // - 2 => 使用者皆可編輯(所以人都可以看，所有使用者可以更新，包含上傳)
  // - 3 => 使用者皆可上傳(所有人可以看，不能更新，但都可以上傳)
  const [selectedKey, setSelectedKey] = useState(false);

  const [userList, setUserList] = useState([]);

  const [canReadUsers, setCanReadUsers] = useState([]);
  const [canUploadUsers, setCanUploadUsers] = useState([]);
  const [canWriteUsers, setCanWriteUsers] = useState([]);

  const [specificUserList, setSpecificUserList] = useState([]);
  const [specificUsers, setSpecificUsers] = useState([]);
  const [specificUsersTemp, setSpecificUsersTemp] = useState([]);

  const [privateUserList, setPrivateUserList] = useState([]);
  const [privateUsers, setPrivateUsers] = useState([]);
  const [privateUsersTemp, setPrivateUsersTemp] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  // & handled data
  const canGetUserList = userInfo.privileges && userInfo.privileges.some(pvg => pvg === 'ADMIN' || pvg === 'USER')

  // - methods
  const handlePrivilegeChange = (value, user) => {
    setPrivateUsers(prev => prev.map(item => {
      if (item.name === user.name) return { name: user.name, type: value }
      return item
    }))
  };

  const handleDeletePrivilegeUser = user => {
    setPrivateUsers(prev => prev.filter(item => item.name !== user.name))
  };

  const onSubmit = () => {
    const formData = {
      publicMode: selectedKey,
      canReadUsers,
      canUploadUsers,
      canWriteUsers: canWriteUsers.filter(item => item !== '').map(name => name.trim())
    }

    if (selectedKey === 0) {
      formData.canWriteUsers = privateUsers.filter(user => user.type === 'write').map(user => user.name)
      formData.canReadUsers = privateUsers.map(user => user.name)
    }

    setIsLoading(true);
    const request = isNFS ? updateNfsPrivilege : updateGlusterfsPrivilege
    request(nfs.name, formData)
      .then(() => {
        toast.success(`${t('edit')}${t('enSpace')}${t('success')}`)
        getFsList();
        onClose();
      })
      .catch(err => toast.error(err.data ? err.data.message : err.message))
      .finally(() => setIsLoading(false));
  };

  // * hooks
  /**
   * @author odin
   * @description 將拿到的資料取出來分別設定到各自的 state 中
  */
  useEffect(() => {
    if (!nfs.canReadUsers) return;

    setCanReadUsers(nfs.canReadUsers);
    setCanUploadUsers(nfs.canUploadUsers);
    setCanWriteUsers(nfs.canWriteUsers);

    setSelectedKey(nfs.publicMode);

    const canReadUsers = [...nfs.canReadUsers].filter(name => (!nfs.canWriteUsers.includes(name)));

    setPrivateUsers([
      ...canReadUsers.map(user => ({ name: user, type: 'read' })),
      ...nfs.canWriteUsers.map(user => ({ name: user, type: 'write' }))
    ]);
  }, [nfs])

  /**
   * @author odin
   * @description 產生特定使用者的使用者選項
  */
  useEffect(() => {
    const selectedUser = uniq([...canReadUsers, ...canWriteUsers])
    if (!isEmpty(userList)) {
      setSpecificUserList(userList
        .filter(user => !selectedUser.some(item => item === user.key) && !privateUsers.some(item => item.name === user.key))
        .map(user => ({ key: user.key, text: user.key })))
    }
  }, [canReadUsers, canUploadUsers, canWriteUsers, specificUsers, userList])

  /**
   * @author odin
   * @description 產生不公開的使用者選項
  */
  useEffect(() => {
    const selectedUser = uniq([...canReadUsers, ...canWriteUsers])
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

  return (
    <BaseModalNew
      isOpen={isOpen}
      modalFoot={
        <>
          <DefaultButton
            children={t('close')}
            classes={{ root: classes.mr_10 }}
            onClick={onClose}
          />
          <PrimaryButton
            children={t('confirm')}
            disabled={isLoading}
            onClick={onSubmit}
          />
        </>
      }
      onClose={onClose}
      title={`${t('modify')} ${nfs.name}`}
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
              <div className={`${classes.indexEditModalAddUserBar}`}>

                {
                  canGetUserList ?
                    <MuiDropdown
                      className={`${classes.mb_10} ${classes.maxW_100}`}
                      list={specificUserList}
                      multiple
                      onChange={(e) => {
                        const value = e.target.value;
                        setSpecificUsersTemp(value);
                      }}
                      text={t('User')}
                      value={canWriteUsers}
                    />
                    :
                    <BaseTextField
                      classes={{ root: classes.mb_10 }}
                      label={t('User')}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSpecificUsersTemp(value.split(','));
                      }}
                      required
                      type="text"
                      value={canWriteUsers.join(',')}
                    />
                }
                <PrimaryButton
                  children={t('add')}
                  onClick={() => {
                    setSpecificUsers(prev => [...prev, ...specificUsersTemp.filter(item => item !== '').map(user => ({ name: user.trim(), type: 'read' }))])
                    setSpecificUsersTemp([]);
                  }}
                />

              </div>
              <div className={`${classes.indexEditModalUserBox}`}>
                {
                  specificUsers.map(user => (
                    <div
                      className={`${classes.indexEditModalUserBoxItem}`}
                      key={user.name}
                    >
                      <span className={`${classes.indexEditModalName}`}>{user.name}</span>
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
          <FormControlLabel
            control={<Radio />}
            label={t('PrivateSpecificUsersCanViewAndEdit')}
            value={0}
          />
          {
            selectedKey === 0 &&
            <>
              <div className={`${classes.indexEditModalAddUserBar}`}>
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
              <div className={`${classes.indexEditModalUserBox}`}>
                {
                  privateUsers.map(user => (
                    <div
                      className={`${classes.indexEditModalUserBoxItem}`}
                      key={user.name}
                    >
                      <span className={`${classes.indexEditModalName}`}>{user.name}</span>
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
};

EditModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  nfs: PropTypes.object
};

export default EditModal;