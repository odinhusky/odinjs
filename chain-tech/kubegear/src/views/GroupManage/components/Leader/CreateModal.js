import React, { useState, useEffect, useContext } from 'react';

// ^ plugins
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

// ^ Material-ui Componets(Functions)
import { makeStyles } from '@material-ui/core/styles';

// ? Self-packed Components || Functions
import { BaseModalNew } from 'components/BaseModalNew';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import MuiDropdown from 'components/BaseMuiDropdown';
import { BaseTextField } from 'components/BaseMuiInput';

// ? API
import { getUserList, updateGroup } from 'utils/api';

// ? context
import GroupManageContext from '../../GroupManageContext';
import GlobalContext from 'layouts/Main/GlobalContext';

// ? styles
import commonStyle from 'common/commonStyles';

const useStyles = makeStyles((theme) => ({ ...commonStyle(theme) }))

const CreateModal = ({ isOpen, onClose, groupName, leaders, getData }) => {

  // ? context
  const { useSelector } = useContext(GlobalContext);
  const { getMenuData, isMenuLoading } = useContext(GroupManageContext);

  // ^ Redux
  const userInfo = useSelector(state => state.userinfo.data);

  // $ init data
  const { t } = useTranslation();

  // = styles
  const classes = useStyles();

  // # states
  const [selectedKey, setSelectedKey] = useState([]);
  const [originLeaders, setOriginLeaders] = useState([]);
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

  const handleCreate = () => {
    const data = {
      name: groupName,
      leaders: [...originLeaders, ...selectedKey]
        .filter((element, index, arr) => {
          return arr.indexOf(element) === index;
        })
    }
    setIsLoading(true)
    updateGroup(data)
      .then(() => {
        getData();
        getMenuData();
        onClose();
      })
      .catch(err => toast.error(err?.data ? err.data?.message : err?.message))
      .finally(() => setIsLoading(false))
  }

  // * hooks
  useEffect(() => {
    setOriginLeaders(leaders.map(item => item.username))
  }, [leaders])

  useEffect(() => {
    if (userInfo.privileges && userInfo.privileges.some(pvg => pvg === 'ADMIN' || pvg === 'USER')) {
      getUserList()
        .then(data => setUserList(
          data.map(item => ({
            key: item.username,
            text: item.username
          })
          )))
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
            onClick={onClose}
          />
          <PrimaryButton
            children={t('confirm')}
            disabled={isLoading || isMenuLoading}
            onClick={handleCreate}
          />
        </>
      }
      onClose={onClose}
      title={`${t('Assign')}${t('enSpace')}${t('TeamLeader')}`}
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
              container: `${classes.mt_20} ${classes.w_full}`
            }}
            list={userList.filter(user => {
              return !leaders.some(member => member.username === user.key)
            })}
            maxWidth={'100%'}
            multiple
            onChange={(e) => {
              const value = e.target.value;
              setSelectedKey(value)
            }}
            text={t('TeamLeader')}
            value={selectedKey}
          />
          :
          <BaseTextField
            label={t('TeamLeader')}
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

CreateModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  groupName: PropTypes.string,
  leaders: PropTypes.array,
  getData: PropTypes.func
};

export default CreateModal;