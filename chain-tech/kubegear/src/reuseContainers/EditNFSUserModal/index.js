import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// # API
import {
  getUserList
} from 'utils/api';

// ? context
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
import {
  isEmpty,
  difference,
  differenceWith,
  isNil,
  union
} from 'lodash';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level reuseContainer/EditNFSUserModal
 * @param {boolean} isOpen - Modal是否開啟
 * @param {function} onClose - Modal 關閉自己的方法
 * @param {object} nfs - 關於這個儲存的相關資訊
 * @param {string} type - 是哪一個地方使用的 Modal
 *  集中式儲存 -> nfs
 *  分散式儲存 -> glusterfs
 *  集中式儲存管理 -> nfsM
 *  分散式儲存管理) -> glusterfsM
 * @param {function} getData - 更新完以後要重新取得 data 的 callback function
 * @param {object} classes - css className 樣式集
 * @param {Promise Function} submitAPI - 要送出的API
 * @component EditNFSUserModal
 * @description 給集中式儲存、分散式儲存、集中式儲存管理、分散式儲存管理，編輯 user 權限用的 Modal
*/
function EditNFSUserModal({
  isOpen,
  onClose,
  nfs,
  type,
  getData,
  classes,
  submitAPI
}) {

  // $ init data
  const { t } = useTranslation();
  const rules = {
    bypass: () => null,
    required: value => (value ? '' : t('fieldRequired')),
    mustBeNumber: value => (isNaN(value) ? t('mustInputNumber') : '')
  };

  // ? context
  const { userInfo } = useContext(GlobalContext);

  // # states
  // 狀態
  const [isUpdating, setIsUpdating] = useState(false);
  const [isManage, setIsManage] = useState(false);

  // 擁有者
  const [owners, setOwners] = useState([]);

  // 容量相關
  const [canEditSize, setCanEditSize] = useState(false);
  const [size, setSize] = useState(10);
  const [isSizeError, setIsSizeError] = useState('');

  // ! publicMode description
  // - 0 => 不公開
  // - 1 => 特定使用者可以編輯(所以人都可以看，特定使用者可以更新，包含上傳) canWriteUser
  // - 2 => 使用者皆可編輯(所以人都可以看，所有使用者可以更新，包含上傳)
  // - 3 => 使用者皆可上傳(所有人可以看，不能更新，但都可以上傳)
  const [publicMode, setPublicMode] = useState(0);

  // 使用者列表 [{key: username, text: username}, ...]
  const [userList, setUserList] = useState([]);

  // 權限管理
  const [canReadUsers, setCanReadUsers] = useState([]);
  const [canUploadUsers, setCanUploadUsers] = useState([]);
  const [canWriteUsers, setCanWriteUsers] = useState([]);

  // 特定使用者顯示相關
  const [specificUserList, setSpecificUserList] = useState([]);
  const [specificUsers, setSpecificUsers] = useState([]);
  const [specificUsersTemp, setSpecificUsersTemp] = useState([]);

  // 不公開使用者顯示相關
  const [privateUserList, setPrivateUserList] = useState([]);
  const [privateUsers, setPrivateUsers] = useState([]);
  const [privateUsersTemp, setPrivateUsersTemp] = useState([]);

  // & handled data
  const canGetUserList = userInfo.privileges && userInfo.privileges.some(pvg => pvg === 'ADMIN' || pvg === 'USER');

  // - methods
  const handlePrivilegeChange = (value, user) => {
    setPrivateUsers(prev => prev.map(item => {
      if (item.name === user.name) return { text: user.name, name: user.name, type: value }
      return item
    }))
  };

  const handleDeletePrivilegeUser = user => {
    setPrivateUsers(prev => prev.filter(item => item.name !== user.name))
  };

  const handleSpecificPrivilegeChange = (value, user) => {
    setSpecificUsers(prev => prev.map(item => {
      if (item.name === user.name) return { text: user.name, name: user.name, type: value }
      return item
    }))
  };

  /**
   * @author odin
   * @description
   * 1. 從聯集的陣列中，取出單一權限的使用者物件
   * 2. 轉換成只有使用者的名稱的陣列
   * @returns {array}
  */
  const getPureNamesArr = (type, arr) => {
    return arr
      .filter(user => user.type === type)
      .map(user => user.name);
  };

  const handleSpecificDeletePrivilegeUser = user => {
    setSpecificUsers(prev => prev.filter(item => item.name !== user.name))
  };

  const handleSubmit = () => {
    setIsUpdating(true);

    const formData = {
      name: nfs.name,
      publicMode,
      canReadUsers,
      canUploadUsers,
      canWriteUsers
    };

    if(isManage) {
      formData.name = nfs.name;
      formData.size = canEditSize ? size : null;
      formData.users = owners.filter(item => item !== '').map(name => name.trim());
    }

    if (publicMode === 0) {
      const pureWriteUserNames = getPureNamesArr('write', privateUsers);

      const pureUploadUserNames = getPureNamesArr('upload', privateUsers);

      const pureReadUserNames = getPureNamesArr('read', privateUsers);

      // 可以編輯的一定可以上傳，所以取純編輯跟純上傳的聯集
      const uploadUserNames = union(pureWriteUserNames, pureUploadUserNames);

      // 可以編輯跟可以上傳的一定都可以檢視，所以剛剛連擊過的上傳跟純檢視的聯集
      const readUserNames = union(uploadUserNames, pureReadUserNames);

      formData.canWriteUsers = pureWriteUserNames;
      formData.canUploadUsers = uploadUserNames;
      formData.canReadUsers = readUserNames;
    }

    if (publicMode === 1) {
      const pureWriteUserNames = getPureNamesArr('write', specificUsers);

      const pureUploadUserNames = getPureNamesArr('upload', specificUsers);

      // 可以編輯的一定可以上傳，所以取純編輯跟純上傳的聯集
      const uploadUserNames = union(pureWriteUserNames, pureUploadUserNames);

      formData.canWriteUsers = pureWriteUserNames;
      formData.canUploadUsers = uploadUserNames;
      formData.canReadUsers = uploadUserNames;
    }

    submitAPI(formData)
      .then(() => {
        getData();
        onClose();
        toast.success(`${t('setting')}${t('enSpace')}${t('success')}`);
      })
      .catch(err => toast.error('Error:' + err.data ? err.data.message : err.toString()))
      .finally(setIsUpdating(false));
  };

  // * hooks
  /**
   * @author odin
   * @description 判斷是否為管理層級
  */
  useEffect(() => {
    if(isNil(type)) return;
    let bool = false;

    switch (type) {
      case 'nfs':
      case 'glusterfs':
        bool = false;
        break;
      case 'nfsM':
      case 'glusterfsM':
        bool = false;
        break;
    }

    setIsManage(bool);
  }, [type]);

  /**
   * @author odin
   * @description 取得所有使用者列表
  */
  useEffect(() => {
    if (canGetUserList) {
      getUserList()
        .then(res => setUserList(res.map(item => ({ key: item.username, text: item.username }))))
        .catch(err => toast.error(err.data ? err.data.message : err.message))
    }
  }, [userInfo]);

  /**
   * @author odin
   * @description 資料預設帶入
  */
  useEffect(() => {
    if (isEmpty(nfs)) return;

    setOwners(nfs.users);

    if(isManage) {
      setSize(nfs.size);
      setCanEditSize(nfs.type === 1);
    }

    setPublicMode(nfs.publicMode)
    setCanReadUsers(nfs.canReadUsers);
    setCanUploadUsers(nfs.canUploadUsers);
    setCanWriteUsers(nfs.canWriteUsers);
  }, [nfs]);

  /**
   * @author odin
   * @description 建立 特定使用者 的方框名單
  */
  useEffect(() => {
    const pureUploadUsers = difference(canUploadUsers, canWriteUsers);
    const pureWriteUsers = [...canWriteUsers];

    const users = [
      ...pureUploadUsers.map(user => ({ text: user, name: user, type: 'upload' })),
      ...pureWriteUsers.map(user => ({ text: user, name: user, type: 'write' }))
    ];

    setSpecificUsers(users);
  }, [canUploadUsers, canWriteUsers]);

  /**
   * @author odin
   * @description 建立 特定使用者 的多選使用者名單
   * 所有的使用者減去方框名單的內容
  */
  useEffect(() => {
    const list = differenceWith(
      userList,
      specificUsers,
      (user, pUser) => (user.key === pUser.name)
    ).map(user => ({ key: user.key, text: user.key }));

    setSpecificUserList(list);
  }, [specificUsers, userList]);

  /**
   * @author odin
   * @description 建立 不公開使用者 的方框名單
  */
  useEffect(() => {
    const pureReadUsers = difference(difference(canReadUsers, canWriteUsers), canUploadUsers);
    const pureUploadUsers = difference(canUploadUsers, canWriteUsers);
    const pureWriteUsers = [...canWriteUsers];

    const users = [
      ...pureReadUsers.map(user => ({ text: user, name: user, type: 'read' })),
      ...pureUploadUsers.map(user => ({ text: user, name: user, type: 'upload' })),
      ...pureWriteUsers.map(user => ({ text: user, name: user, type: 'write' }))
    ];

    setPrivateUsers(users);
  }, [canReadUsers, canUploadUsers, canWriteUsers]);

  /**
   * @author odin
   * @description 建立 不公開使用者 的多選使用者名單
   * 所有的使用者減去方框名單的內容
  */
  useEffect(() => {
    const list = differenceWith(
      userList,
      privateUsers,
      (user, pUser) => (user.key === pUser.name)
    ).map(user => ({ key: user.key, text: user.key }));

    setPrivateUserList(list);
  }, [privateUsers, userList]);

  return (
    <BaseModalNew
      isOpen={isOpen}
      modalFoot={
        <>
          <DefaultButton
            children={t('close')}
            classes={{ root: classes.mr_10 }}
            disabled={isUpdating}
            onClick={onClose}
          />
          {
            isUpdating
              ? <CircularProgress />
              :
              <PrimaryButton
                children={t('confirm')}
                disabled={isUpdating}
                onClick={handleSubmit}
              />
          }
        </>
      }
      onClose={onClose}
      size="sm"
      title={`${t('modify')} ${nfs.name}`}
    >
      {/* 編輯所有者 以及 容量 */}
      {
        isManage && (
          <>
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
          error={isSizeError}
          helperText={isSizeError === '' ? '' : isSizeError}
          label={`${t('space')} ( GB )`}
          onChange={(e) => {
            const value = e.target.value;
            setSize(value);
            const checkField = rules.required(value) || rules.mustBeNumber(value);
            setIsSizeError(checkField)
          }}
          value={size}
        />
            }
          </>
        )
      }

      <FormControl className={`${classes.w_80}`}>
        <FormLabel>{t('Permission')}</FormLabel>
        <RadioGroup
          aria-label="permission"
          name="permission"
          onChange={(e) => {
            const value = e.target.value;
            setPublicMode(Number(value))
          }}
          value={publicMode}
        >
          {/* 所有使用者皆可編輯 */}
          <FormControlLabel
            control={<Radio />}
            label={t('allUserCanEdit')}
            value={2}
          />

          {/* 所有使用者皆可上傳 */}
          <FormControlLabel
            control={<Radio />}
            label={t('allUserCanUpload')}
            value={3}
          />

          {/* 特定使用者可 上傳 or 編輯 */}
          <FormControlLabel
            control={<Radio />}
            label={t('AllUsersCanViewSpecificUsersCanEdit')}
            value={1}
          />
          {
            publicMode === 1 &&
            <>
              <div className={`${classes.detailPageCreateModalAddUserBar}`}>
                {
                  canGetUserList ?
                    <MuiDropdown
                      list={specificUserList}
                      multiple
                      onChange={(e) => {
                        const value = e.target.value;
                        setSpecificUsersTemp(value);
                      }}
                      style={{ maxWidth: '100%', margin: '10px 0 15px 0' }}
                      text={t('User')}
                      value={specificUsersTemp}
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
                      value={specificUsersTemp.join(',')}
                    />
                }
                <PrimaryButton
                  children={t('add')}
                  onClick={() => {
                    setSpecificUsers(prev => {
                      return [...prev, ...specificUsersTemp.filter(item => item !== '').map(user => ({ text: user.trim(), name: user.trim(), type: 'upload' }))]
                    })
                    setSpecificUsersTemp([]);
                  }}
                />
              </div>
              <div className={`${classes.detailPageCreateModalUserBox}`}>
                {
                  specificUsers.map(user => (
                    <div
                      className={`${classes.detailPageCreateModalUserBoxItem}`}
                      key={`${user.name} - specific`}
                    >
                      <span className={`${classes.detailPageCreateModalName}`}>{user.name}</span>
                      <FormControl>
                        <RadioGroup
                          aria-label={user.name}
                          name={user.name}
                          onChange={(e) => {
                            const value = e.target.value;
                            handleSpecificPrivilegeChange(value, user)
                          }}
                          row
                          value={specificUsers.find(item => item.name === user.name)?.type}
                        >
                          <FormControlLabel
                            control={<Radio />}
                            label={t('Upload')}
                            value={'upload'}
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
                        onClick={() => handleSpecificDeletePrivilegeUser(user)}
                      />
                    </div>
                  ))
                }
              </div>
            </>
          }

          {/* 不公開使用者可 查看 or 上傳 or 編輯 */}
          <FormControlLabel
            control={<Radio />}
            label={t('PrivateSpecificUsersCanViewAndEdit')}
            value={0}
          />
          {
            publicMode === 0 &&
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
                    key={`${user.name} - private`}
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
                          label={t('Upload')}
                          value={'upload'}
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
EditNFSUserModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  nfs: PropTypes.object,
  type: PropTypes.string,
  getData: PropTypes.func,
  classes: PropTypes.object,
  submitAPI: PropTypes.func
};

export default EditNFSUserModal;
