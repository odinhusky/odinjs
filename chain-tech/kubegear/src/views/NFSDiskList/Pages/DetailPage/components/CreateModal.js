import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// ? context
import NFSDiskListContext from '../../../NFSDiskListContext';
import GlobalContext from 'layouts/Main/GlobalContext';

// ^ Material-ui Components(Functions)
import CircularProgress from '@material-ui/core/CircularProgress';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Icon from '@material-ui/core/Icon';

// ? Self-packed Components || Functions
import BaseModalNew from 'components/BaseModalNew';
import { DefaultButton, PrimaryButton, IconButton } from 'components/BaseButton';
import { BaseTextField } from 'components/BaseMuiInput';
import MuiDropdown from 'components/BaseMuiDropdown';


// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { createNfs } from 'utils/api';
import { toast } from 'react-toastify';

/**
 * @author odin
 * @level views/NFSDiskList/DetailPage/CreateNfsModal
 * @component CreateNfsModal
 * @description CreateNfsModal
*/
function CreateNfsModal({
  isOpen,
  onClose,
  userList: rawUserList
}) {

  // $ init data
  const { t } = useTranslation();
  const rules = {
    required: value => (value ? '' : t('fieldRequired')),
    nameFormat(name) {
      const nameValidation = RegExp(/^[A-Za-z0-9]{1,254}$/, 'g');
      return nameValidation.test(name) ? '' : t('nameInvalid');
    },
    mustBeNumber: value => (isNaN(value) ? t('mustInputNumber') : '')
  };

  // ? context
  const {
    nfsDisk,
    getNfsList,
    classes
  } = useContext(NFSDiskListContext);
  const { userInfo } = useContext(GlobalContext);

  // & handled data
  const userList = rawUserList.map(user => ({ key: user.username, text: user.username }))

  // # states
  const [nfsName, setNfsName] = useState('');
  const [nfsSize, setNfsSize] = useState();
  const [isNfsCreating, setIsNfsCreating] = useState(false);
  const [selectedKey, setSelectedKey] = useState(2);
  const [owners, setOwners] = useState([]);
  const [privateUserList, setPrivateUserList] = useState([]);
  const [canWriteUsers, setCanWriteUsers] = useState([]);
  const [privateUsers, setPrivateUsers] = useState([]);
  const [privateUsersTemp, setPrivateUsersTemp] = useState([]);
  const [isNfsNameError, setIsNfsNameError] = useState('');
  const [isNfsSizeError, setIsNfsSizeError] = useState('');
  const [errorMsg, setErrorMsg] = useState({
    nfsName: '',
    nfsDiskName: '',
    nfsSize: ''
  });

  // - methods
  const canGetUserList = userInfo.privileges && userInfo.privileges.some(pvg => pvg === 'ADMIN' || pvg === 'USER')

  const handlePrivilegeChange = (value, user) => {
    setPrivateUsers(prev => prev.map(item => {
      if (item.name === user.name) return { text: user.name, name: user.name, type: value }
      return item
    }))
  }

  const handleDeletePrivilegeUser = user => {
    setPrivateUsers(prev => prev.filter(item => item.name !== user.name))
  }

  const validField = () => {
    if (!nfsName) {
      setErrorMsg({
        ...errorMsg,
        nfsName: `${t('name')} ${t('noEmpty')}`
      });
      return false;
    }
    if (!nfsSize) {
      setErrorMsg({
        ...errorMsg,
        nfsSize: `${t('space')} ${t('noEmpty')}`
      });
      return false;
    }
    return true;
  };

  const handleClick =
    () => {
      if (!validField()) return;
      if (isNfsNameError !== '' || isNfsSizeError !== '') return;
      setIsNfsCreating(true);
      const formData = {
        name: nfsName,
        nfsDisk: nfsDisk.name,
        size: nfsSize,
        users: owners.filter(item => item !== '').map(name => name.trim()),
        canReadUsers: [],
        canWriteUsers,
        publicMode: selectedKey
      };

      if (selectedKey === 0) {
        formData.canReadUsers = privateUsers.filter(user => user.type === 'read').map(user => user.name)
        formData.canWriteUsers = privateUsers.filter(user => user.type === 'write').map(user => user.name)
      }

      createNfs(formData)
        .then(() => {
          getNfsList();
          onClose();
          toast.success(`${t('add')}${t('enSpace')}${t('success')}`);
        })
        .catch(err => {
          const msg = err.data.message ? err.data.message : err.toString();
          toast.error(msg);
          setIsNfsCreating(false);
        });
    }

  // * hooks
  useEffect(() => {
    setPrivateUserList(userList
      .filter(user => !privateUsers.some(item => item.name === user.key))
      .map(user => ({ key: user.key, text: user.key })))

  }, [privateUsers, rawUserList])

  return (
    <BaseModalNew
      isOpen={isOpen}
      modalFoot={
        <>
          <DefaultButton
            children={t('close')}
            classes={{ root: classes.mr_10 }}
            disabled={isNfsCreating}
            onClick={onClose}
          />
          {
            isNfsCreating
              ? <CircularProgress />
              :
              <PrimaryButton
                children={t('confirm')}
                disabled={isNfsCreating || !nfsSize}
                onClick={handleClick}
              />
          }
        </>
      }
      size="sm"
      title={`${t('add')} NFS`}
    >
      <BaseTextField
        classes={{ root: `${classes.mb_20} ${classes.mt_10}` }}
        error={isNfsNameError}
        helperText={isNfsNameError === '' ? '' : isNfsNameError}
        label={t('name')}
        onChange={(e) => {
          const value = e.target.value;
          setNfsName(value);
          const checkField = rules.required(value) || rules.nameFormat(value);
          setIsNfsNameError(checkField)
        }}
        required
        type="text"
        value={nfsName}
      />
      <BaseTextField
        classes={{ root: classes.mb_20 }}
        error={isNfsSizeError}
        helperText={isNfsSizeError === '' ? '' : isNfsSizeError}
        label={`${t('space')} (GB)`}
        onChange={(e) => {
          const value = e.target.value;
          setNfsSize(value);
          const checkField = rules.required(value) || rules.mustBeNumber(value);
          setIsNfsSizeError(checkField)
        }}
        required
        type="text"
        value={nfsSize}
      />
      {
        canGetUserList
          ?
          <MuiDropdown
            list={userList}
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
            classes={{ root: `${classes.mb_20}` }}
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
                    classes={{ root: classes.mb_20 }}
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
                    classes={{ root: classes.mb_20 }}
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


CreateNfsModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  userList: PropTypes.array
};

export default CreateNfsModal;
