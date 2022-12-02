import React, {
  useState,
  useEffect,
  useContext,
  useCallback
} from 'react';

// ^ Redux
import { getUserInfo } from 'layouts/Main/features/userinfo/userinfoSlice';

// # API
import { getUserList, createGroup } from 'utils/api';

// ? context
import GroupManageContext from '../../GroupManageContext';
import GlobalContext from 'layouts/Main/GlobalContext';

// ? Self-packed Components || Functions
import { BaseModalNew } from 'components/BaseModalNew';
import MuiDropdown from 'components/BaseMuiDropdown';
import { BaseTextField } from 'components/BaseMuiInput';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';

// ^ Plugins
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/GroupManage/SubGroup/CreateModal
 * @component CreateModal
 * @description CreateModal component
*/
const CreateModal = ({
  isOpen,
  onClose,
  groupName
}) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const { getMenuData, classes, userInfo } = useContext(GroupManageContext);
  const { dispatch } = useContext(GlobalContext);

  // # states
  const [subGroupName, setSubGroupName] = useState('');
  const [selectedLeaders, setSelectedLeaders] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // - methods
  const reset = useCallback(() => {
    setSubGroupName('');
    setSelectedLeaders([]);
    setSelectedMembers([]);
  }, [setSubGroupName, setSelectedLeaders, setSelectedMembers]);

  const handleCreate = useCallback(() => {
    setIsLoading(true);

    const formData = {
      parent: groupName,
      name: subGroupName,
      leaders: selectedLeaders,
      users: selectedMembers
    }
    const { username } = userInfo;

    createGroup(formData)
      .then(() => {
        setIsLoading(false);
        dispatch(getUserInfo(username))
        reset();
        getMenuData();
        toast.success(`${t('add')}${t('enSpace')}${t('success')}`)
        onClose();
      })
      .catch(err => toast.error(err?.data ? err.data?.message : err?.message))
      .finally(() => setIsLoading(false))
  }, [
    groupName,
    subGroupName,
    selectedLeaders,
    selectedMembers,
    userInfo,
    createGroup,
    dispatch,
    getUserInfo,
    getMenuData
  ]);

  // * hooks
  useEffect(() => {
    if (userInfo.privileges && userInfo.privileges.some(pvg => pvg === 'ADMIN' || pvg === 'USER')) {
      getUserList()
        .then(data => setUserList(
          data.map(item => ({
            key: item.username,
            text: item.username
          })))
        )
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
            className={classes.mr_10}
            onClick={() => {
              onClose();
              reset();
            }}
          />
          <PrimaryButton
            children={t('confirm')}
            disabled={isLoading || isEmpty(subGroupName) || isEmpty(selectedLeaders)}
            onClick={handleCreate}
          />
        </>
      }
      onClose={onClose}
      title={`${t('add')}${t('enSpace')}${t('SubTeam')}`}
    >
      <BaseTextField
        className={classes.mt_10}
        label={t('groupName')}
        onChange={(e) => {
          const value = e.target.value;
          setSubGroupName(value)
        }}
        required
        value={subGroupName}
      />
      {
        isEmpty(userList)
          ?
          <BaseTextField
            className={`${classes.mt_20} ${classes.mr_10} ${classes.w_50_5}`}
            label={t('TeamLeader')}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedLeaders(value.split(','))
            }}
            required
            value={selectedLeaders}
          />
          :
          <MuiDropdown
            className={`${classes.mt_20} ${classes.mr_10} ${classes.w_50_5}`}
            list={userList.filter(user => !selectedMembers.includes(user.key))}
            maxWidth={'100%'}
            multiple
            onChange={(e) => {
              const value = e.target.value;
              setSelectedLeaders(value)
            }}
            required
            text={t('TeamLeader')}
            value={selectedLeaders}
          />
      }
      {
        isEmpty(userList)
          ?
          <BaseTextField
            className={`${classes.mt_20} ${classes.w_50_5}`}
            label={`${t('invite')}${t('enSpace')}${t('TeamMember')}`}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedMembers(value.split(','))
            }}
            required
            value={selectedMembers}
          />
          :
          <MuiDropdown
            className={`${classes.mt_20} ${classes.w_50_5}`}
            list={userList.filter(user => !selectedLeaders.includes(user.key))}
            maxWidth={'100%'}
            multiple
            onChange={(e) => {
              const value = e.target.value;
              setSelectedMembers(value)
            }}
            text={`${t('invite')}${t('enSpace')}${t('TeamMember')}`}
            value={selectedMembers}
          />
      }
    </BaseModalNew>
  );
};

CreateModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  groupName: PropTypes.string
};

export default CreateModal;