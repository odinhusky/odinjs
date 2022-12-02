import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// ^ Redux
import { getUserInfo } from 'layouts/Main/features/userinfo/userinfoSlice';

// # API
import { getUserList, updateGroup } from 'utils/api';

// ? context
import GroupManageContext from '../../GroupManageContext';
import GlobalContext from 'layouts/Main/GlobalContext';

// ? Self-packed Components || Functions
import { BaseModalNew } from 'components/BaseModalNew';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import MuiDropdown from 'components/BaseMuiDropdown';
import { BaseTextField } from 'components/BaseMuiInput';

// ^ plugins
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';

/**
 * @author odin
 * @level views/GroupManage/SubGroup/EditModal
 * @component EditModal
 * @description EditModal component
*/
const EditModal = ({
  group,
  isOpen,
  onClose
}) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const {
    getMenuData,
    isLoadingMenu,
    classes
  } = useContext(GroupManageContext);
  const { dispatch, useSelector } = useContext(GlobalContext);

  // ^ Redux
  const userInfo = useSelector(state => state.userinfo.data);

  // # states
  const [isLoading, setIsLoading] = useState(false);
  const [subGroupName, setSubGroupName] = useState('');
  const [selectedLeaders, setSelectedLeaders] = useState([]);
  const [userList, setUserList] = useState([]);

  // * hooks
  useEffect(() => {
    if (userInfo.privileges && userInfo.privileges.some(pvg => pvg === 'ADMIN' || pvg === 'USER')) {
      getUserList()
        .then(data => setUserList(
          data.map(item => ({
            key: item.username,
            text: item.username
          })
          )))
        .catch(err => toast.error(err.data ? err.data.message : err.message))
    }
  }, [userInfo])

  useEffect(() => {
    setSubGroupName(group.name)
    setSelectedLeaders(group.leaders)
  }, [group])

  return (
    <BaseModalNew
      isOpen={isOpen}
      modalFoot={
        <>
          <DefaultButton
            children={t('close')}
            className={classes.mr_10}
            onClick={onClose}
          />
          <PrimaryButton
            children={t('confirm')}
            disabled={isEmpty(subGroupName) || isEmpty(selectedLeaders) || isLoading || isLoadingMenu}
            onClick={() => {
              setIsLoading(true)
              const { username } = userInfo;
              const formData = {
                name: subGroupName,
                leaders: selectedLeaders
              }
              updateGroup(formData, group.name)
                .then(() => {
                  setIsLoading(false)
                  dispatch(getUserInfo(username))
                  getMenuData()
                  toast.success(`${t('edit')}${t('enSpace')}${t('success')}`)
                  onClose();
                })
                .catch(err => toast.error(err?.data ? err.data?.message : err?.message))
                .finally(() => setIsLoading(false))
            }}
          />
        </>
      }
      onClose={onClose}
      title={`${t('modify')}${t('enSpace')}${t('SubTeam')}`}
    >
      <BaseTextField
        className={classes.mt_10}
        label={t('groupName')}
        onChange={(e) => {
          const value = e.target.value;
          setSubGroupName(value)
        }}
        value={subGroupName}
      />
      {
        isEmpty(userList)
          ?
          <BaseTextField
            className={classes.mt_20}
            label={t('TeamLeader')}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedLeaders(value.split(','))
            }}
            value={selectedLeaders.join(',')}
          />
          :
          <MuiDropdown
            classNameObj={{ container: classes.mt_20 }}
            list={userList}
            maxWidth={'100%'}
            multiple
            onChange={(e) => {
              const value = e.target.value;
              setSelectedLeaders(value)
            }}
            text={t('TeamLeader')}
            value={selectedLeaders}
          />
      }
    </BaseModalNew>
  );
};

EditModal.propTypes = {
  group: PropTypes.object,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default EditModal;