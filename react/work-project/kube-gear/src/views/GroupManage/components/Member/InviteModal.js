import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { BaseModal } from 'components/BaseModal';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import MuiDropdown from 'components/BaseMuiDropdown';
import { BaseTextField } from 'components/BaseMuiInput';

import { getUserList, inviteGroupMember } from 'utils/api';
import GlobalContext from 'layouts/Main/GlobalContext';

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';

const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  },
  marginTop20: {
    marginTop: 20
  }
}))

const InviteModal = ({ isOpen, onClose, groupName, members, getData }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [selectedKey, setSelectedKey] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo } = useContext(GlobalContext);

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
    if (userInfo.privileges && userInfo.privileges.some(pvg => pvg === 'ADMIN' || pvg === 'USER')) {
      getUserList()
        .then(data => {
          setUserList(data.map(item => ({ key: item.username, text: item.username })))
        })
        .catch(err => toast.error(err?.data ? err.data.message : err.message))
    }
  }, [userInfo])

  return (
    <BaseModal
      isOpen={isOpen}
      modalWidth={400}
      onClose={onClose}
      title={`${t('invite')}${t('enSpace')}${t('TeamMember')}`}
    >
      <BaseTextField
        defaultValue={groupName}
        disabled
        label={t('groupName')}
      />
      {
        userInfo.privileges && userInfo.privileges.some(hasUserOrAdminPrivileges)
          ?
          <MuiDropdown
            classes={{ root: classes.marginTop20 }}
            list={userList.filter(user => {
              return !members.some(member => member.username === user.key)
            })}
            maxWidth={'100%'}
            multiple
            onChange={(e) => {
              const value = e.target.value;
              setSelectedKey(value)
            }}
            text={t('TeamMember')}
            value={selectedKey}
          />
          :
          <BaseTextField
            classes={{ root: classes.marginTop20 }}
            label={t('TeamMember')}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedKey(value.split(','))
            }}
            required
            type="text"
          />
      }
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
        <DefaultButton
          children={t('cancel')}
          classes={{ root: classes.marginRight10 }}
          onClick={() => {
            onClose();
            setSelectedKey([]);
          }}
        />
        <PrimaryButton
          children={t('invite')}
          disabled={isLoading || isEmpty(selectedKey)}
          onClick={() => {
            setIsLoading(true)
            Promise.all(
              selectedKey.map(item => inviteGroupMember({ user: item, group: groupName, inviteState: 1 }))
            )
              .then(() => {
                toast.success(`${t('invite')}${t('enSpace')}${t('success')}`)
                getData();
                onClose();
                setSelectedKey([]);
              })
              .catch(err => toast.error('Error:' + err.data ? err.data.message : err.message))
              .finally(() => setIsLoading(false))
          }}
        />
      </div>
    </BaseModal>
  );
};

InviteModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  groupName: PropTypes.string,
  members: PropTypes.array,
  getData: PropTypes.func
};

export default InviteModal;