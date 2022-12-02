import React, {
  useState,
  useContext,
  useMemo
} from 'react';

// # API
import { updateRole } from 'utils/api';

// ? context
import RoleListContext from '../RoleListContext';

// ^ Material-ui Components(Functions)
import CircularProgress from '@material-ui/core/CircularProgress';

// ? Self-packed Components || Functions
import BaseModalNew from 'components/BaseModalNew';
import { BaseTextField } from 'components/BaseMuiInput';
import MuiDropdown from 'components/BaseMuiDropdown';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';

// ^ Plugins
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/RoleList/EditModal
 * @component EditModal
 * @description EditModal
*/
function EditModal(props) {

  // $ init data
  const { t } = useTranslation();
  const { isOpen, onClose } = props;
  const defaultRoleInfo = {
    name: '',
    privileges: []
  };

  // ? context
  const {
    designateUpdateUser,
    getData,
    rolePrivileges,
    classes
  } = useContext(RoleListContext);

  // # states
  const [userInfo, setUserInfo] = useState(defaultRoleInfo);
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
    const createRolePrivilegesInfo = {
      name: userInfo.name,
      privileges: userInfo.privileges
    };

    try {
      setIsRolePrivilegesCreating(true);
      await updateRole(userInfo.id, createRolePrivilegesInfo);
      toast.success(t('updateSuccess'));
      setIsRolePrivilegesCreating(false);
      onClose();
      getData();
    } catch (err) {
      const errorMessage = err.data ? err.data.message : err.message
      toast.error(errorMessage)
      setIsRolePrivilegesCreating(false);
    }
  };

  // & handled data
  const rules = {
    required: value => (value ? '' : t('fieldRequired'))
  };

  // * hooks
  useMemo(
    () => {
      setUserInfo(designateUpdateUser);
    },
    [designateUpdateUser]
  );

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
              setUserInfo(userInfo);
            }}
          />
          {
            isRolePrivileges
              ? <CircularProgress />
              :
              <PrimaryButton
                children={t('confirm')}
                disabled={isRolePrivileges || !userInfo.name}
                onClick={onSubmit}
              />
          }
        </>
      }
      onClose={onClose}
      title={`${t('modify')}${t('enSpace')}${t('privilege')}`}
    >
      {/* 角色 */}
      <BaseTextField
        classes={{ root: classes.mt_10 }}
        error={isNameError}
        helperText={isNameError === '' ? '' : isNameError}
        label={t('role')}
        onChange={(e) => {
          const value = e.target.value;
          setUserInfo(userInfo => ({ ...userInfo, name: value }));
          const checkField = rules.required(value)
          setIsNameError(checkField)
        }}
        required
        type="text"
        value={userInfo.name}
      />

      <MuiDropdown
        classes={{ root: classes.mt_20 }}
        disabled={designateUpdateUser.id === 1}
        list={addDropDownOptionKeys(rolePrivileges)}
        maxWidth={'100%'}
        multiple
        onChange={(e) => {
          const value = e.target.value;
          setUserInfo(prev => ({ ...prev, privileges: value }));
        }}
        selectProps={{
          MenuProps: {
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left'
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left'
            },
            getContentAnchorEl: null,
            // ! PaperProps 是 <Menu> 這個 Mui 的 component 的 props
            PaperProps: {
              style: {
                maxHeight: 200
              }
            }
          }
        }}
        text={`${t('select')}${t('enSpace')}${t('privilege')}`}
        value={userInfo.privileges}
      />
    </BaseModalNew>
  );
}

EditModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default EditModal;
