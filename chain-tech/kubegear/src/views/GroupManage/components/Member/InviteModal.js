import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// # API
import { getUserList, inviteGroupMember } from 'utils/api';

// ^ Redux
import { useSelector } from 'react-redux';

// ? context
import GroupManageContext from 'views/GroupManage/GroupManageContext';

// ? Self-packed Components || Functions
import { BaseModalNew } from 'components/BaseModalNew';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import MuiDropdown from 'components/BaseMuiDropdown';
import { BaseTextField } from 'components/BaseMuiInput';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';

/**
 * @author odin
 * @level views/GroupManage/Member/InviteModal
 * @component InviteModal
 * @description InviteModal Modal
*/
const InviteModal = ({
  isOpen,
  onClose,
  groupName,
  members,
  getData,
  isAdmin
}) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const { classes } = useContext(GroupManageContext);

  // ^ Redux
  const userInfo = useSelector(state => state.userinfo.data);

  // # states
  const [selectedKey, setSelectedKey] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // - methods
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

  // * hooks
  useEffect(() => {
    if (userInfo.privileges && userInfo.privileges.some(pvg => pvg === 'ADMIN' || pvg === 'USER')) {
      getUserList()
        .then(data => {
          setUserList(data.map(item => ({ key: item.username, text: item.username })))
        })
        .catch(err => toast.error(err?.data ? err.data?.message : err?.message))
    }
  }, [userInfo])

  return (
    <BaseModalNew
      isOpen={isOpen}
      modalFoot={
        <>
          <DefaultButton
            children={t('close')}
            className={classes.mr_10}
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
                selectedKey.map(item => inviteGroupMember({ user: item, group: groupName, inviteState: 1 }, isAdmin))
              )
                .then(() => {
                  toast.success(`${t('invite')}${t('enSpace')}${t('success')}`)
                  getData();
                  onClose();
                  setSelectedKey([]);
                })
                .catch(err => toast.error(err?.data ? err.data?.message : err?.message))
                .finally(() => setIsLoading(false))
            }}
          />
        </>
      }
      onClose={onClose}
      title={`${t('invite')}${t('enSpace')}${t('TeamMember')}`}
    >
      <BaseTextField
        className={classes.mt_10}
        defaultValue={groupName}
        disabled
        label={t('groupName')}
      />
      {
        userInfo.privileges && userInfo.privileges.some(hasUserOrAdminPrivileges)
          ?
          <MuiDropdown
            classNameObj={{
              container: classes.mt_20
            }}
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
            className={classes.mt_20}
            label={t('TeamMember')}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedKey(value.split(','))
            }}
            required
            type="text"
          />
      }
    </BaseModalNew>
  );
};

InviteModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  groupName: PropTypes.string,
  members: PropTypes.array,
  getData: PropTypes.func,
  isAdmin: PropTypes.bool
};

export default InviteModal;