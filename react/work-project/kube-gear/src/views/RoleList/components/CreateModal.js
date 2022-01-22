import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Context from '../Context';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { BaseTextField } from 'components/BaseMuiInput';
import { BaseModal } from 'components/BaseModal';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import MuiDropdown from 'components/BaseMuiDropdown';

import { createRole } from 'utils/api';

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

const addDropDownOptionKeys = optionItems => {
  return optionItems.map((item, index) => ({
    key: index,
    text: item.name,
    ...item
  }));
};

function CreateRoleModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const classes = useStyles();

  const defaultUserInfo = {
    username: '',
    rolePrivileges: []
  };

  const { getData, rolePrivileges } = useContext(Context);
  const [userInfo, setUserInfo] = useState(defaultUserInfo);
  const [isRolePrivileges, setIsRolePrivilegesCreating] = useState(false);
  const [isNameError, setIsNameError] = useState('');

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

  const rules = {
    bypass: () => null,
    required: value => (value ? null : t('fieldRequired'))
  };

  return (
    <BaseModal
      isOpen={isOpen}
      modalWidth={400}
      onClose={onClose}
      title={`${t('add')}${t('enSpace')}${t('role')}`}
    >
      <BaseTextField
        classes={{ root: classes.marginTop10 }}
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
        classes={{ root: classes.marginTop20 }}
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 20 }}>
        <DefaultButton
          children={t('cancel')}
          classes={{ root: classes.marginRight10 }}
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
      </div>
    </BaseModal>
  );
}

CreateRoleModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default CreateRoleModal;
