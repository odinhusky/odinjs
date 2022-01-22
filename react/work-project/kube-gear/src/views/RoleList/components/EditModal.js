import React, { useState, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import BaseModal from 'components/BaseModal';
import { BaseTextField } from 'components/BaseMuiInput';
import MuiDropdown from 'components/BaseMuiDropdown';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import CircularProgress from '@material-ui/core/CircularProgress';

import Context from '../Context';

import { toast } from 'react-toastify';
import { makeStyles } from '@material-ui/core/styles';

import { updateRole } from 'utils/api';

const addDropDownOptionKeys = optionItems => {
  return optionItems.map((item, index) => ({
    key: index,
    text: item.name,
    ...item
  }));
};

const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  },
  marginTop10: {
    marginTop: 10
  },
  marginTop20: {
    marginTop: 20
  }
}))

function EditModal(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { isOpen, onClose } = props;

  const defaultRoleInfo = {
    name: '',
    privileges: []
  };

  const {
    designateUpdateUser,
    getData,
    rolePrivileges
  } = useContext(Context);
  const [userInfo, setUserInfo] = useState(defaultRoleInfo);
  const [isRolePrivileges, setIsRolePrivilegesCreating] = useState(false);

  const [isNameError, setIsNameError] = useState('');

  useMemo(
    () => {
      setUserInfo(designateUpdateUser);
    },
    [designateUpdateUser]
  );

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

  const rules = {
    required: value => (value ? '' : t('fieldRequired'))
  };

  return (
    <BaseModal
      isOpen={isOpen}
      modalWidth={400}
      title={`${t('Edit')}${t('enSpace')}${t('privilege')}`}
    >
      {/* 角色 */}
      <BaseTextField
        classes={{ root: classes.marginTop10 }}
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
        classes={{ root: classes.marginTop20 }}
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 20 }}>
        <DefaultButton
          children={t('cancel')}
          classes={{ root: classes.marginRight10 }}
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
      </div>
    </BaseModal>
  );
}

EditModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default EditModal;
