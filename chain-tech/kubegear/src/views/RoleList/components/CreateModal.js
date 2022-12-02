import React, {
  useState,
  useContext
} from 'react';

// # API
import { createRole } from 'utils/api';

// ? context
import RoleListContext from '../RoleListContext';

// ^ Material-ui Components(Functions)
import CircularProgress from '@material-ui/core/CircularProgress';

// ? Self-packed Components || Functions
import { BaseTextField } from 'components/BaseMuiInput';
import { BaseModalNew } from 'components/BaseModalNew';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import MuiDropdown from 'components/BaseMuiDropdown';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

/**
 * @author odin
 * @level views/RoleList/CreateRoleModal
 * @component CreateRoleModal
 * @description CreateRoleModal
*/
function CreateRoleModal({ isOpen, onClose }) {

  // $ init data
  const { t } = useTranslation();
  const defaultUserInfo = {
    username: '',
    rolePrivileges: []
  };
  const rules = {
    bypass: () => null,
    required: value => (value ? null : t('fieldRequired'))
  };

  // ? context
  const {
    getData,
    rolePrivileges,
    classes
  } = useContext(RoleListContext);

  // # state
  const [userInfo, setUserInfo] = useState(defaultUserInfo);
  const [isRolePrivileges, setIsRolePrivilegesCreating] = useState(false);
  const [isNameError, setIsNameError] = useState('');

  // - methods
  const addDropDownOptionKeys = optionItems => {
    return optionItems.map((item, index) => ({
      key: index,
      text: item.name,
      ...item
    }));
  };

  const onSubmit = async() => {
    const getCreateRolePrivilegesInfo = {
      name: userInfo.username,
      privileges: userInfo.rolePrivileges
    };

    try {
      setIsRolePrivilegesCreating(true);
      await createRole(getCreateRolePrivilegesInfo);
      toast.success(`${t('add')}${t('enSpace')}${t('success')}`);
      setIsRolePrivilegesCreating(false);
      onClose();
      getData();
      setUserInfo(defaultUserInfo);
    } catch (err) {
      setIsRolePrivilegesCreating(false);
      toast.error(err.data ? err.data.message : err.message)
    }
  };

  return (
    <BaseModalNew
      isOpen={isOpen}
      modalFoot={
        <>
          <DefaultButton
            children={t('close')}
            classes={{ root: classes.mr_10 }}
            disabled={isRolePrivileges}
            onClick={() => {
              onClose();
              setUserInfo(defaultUserInfo);
            }}
          />
          {
            isRolePrivileges
              ? <CircularProgress />
              :
              <PrimaryButton
                children={t('confirm')}
                disabled={!userInfo.username}
                onClick={onSubmit}
              />
          }
        </>
      }
      onClose={onClose}
      title={`${t('add')}${t('enSpace')}${t('role')}`}
    >
      <BaseTextField
        classes={{ root: classes.mt_10 }}
        error={isNameError}
        helperText={isNameError === '' ? '' : isNameError}
        label={t('role')}
        onChange={(e) => {
          const value = e.target.value;
          setUserInfo(userInfo => ({ ...userInfo, username: value }));
          const checkField = rules.required(value);
          setIsNameError(checkField);
        }}
        required
        type="text"
      />
      <MuiDropdown
        classes={{ root: classes.mt_20 }}
        list={addDropDownOptionKeys(rolePrivileges)}
        maxWidth={'100%'}
        multiple
        onChange={(e) => {
          const value = e.target.value;
          setUserInfo(prev => ({ ...prev, rolePrivileges: value }));
        }}
        selectProps={{
          MenuProps: {
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left'
            },
            getContentAnchorEl: null
          }
        }}
        text={`${t('select')}${t('enSpace')}${t('privilege')}`}
        value={userInfo.rolePrivileges}
      />
    </BaseModalNew>
  );
}

CreateRoleModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default CreateRoleModal;
