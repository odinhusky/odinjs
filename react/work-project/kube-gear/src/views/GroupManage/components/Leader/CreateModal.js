import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { BaseModal } from 'components/BaseModal';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import MuiDropdown from 'components/BaseMuiDropdown';
import { BaseTextField } from 'components/BaseMuiInput';

import GlobalContext from 'layouts/Main/GlobalContext';
import { getUserList, updateGroup } from 'utils/api';
import Context from '../../Context';

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  },
  heightAuto: {
    height: 'auto'
  },
  iconClearMarginLeft: {
    marginLeft: 0
  },
  marginTop20 : {
    marginTop: 20
  }
}))

const CreateModal = ({ isOpen, onClose, groupName, leaders, getData }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [selectedKey, setSelectedKey] = useState([]);
  const [originLeaders, setOriginLeaders] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo } = useContext(GlobalContext);
  const { getMenuData, isMenuLoading } = useContext(Context);

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
        .catch(err => toast.error('Error:' + err.data ? err.data.message : err.message))
    }
  }, [userInfo])

  return (
    <BaseModal
      isOpen={isOpen}
      modalWidth={400}
      onClose={onClose}
      title={`${t('Assign')}${t('enSpace')}${t('TeamLeader')}`}
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
        <DefaultButton
          children={t('cancel')}
          classes={{ root: classes.marginRight10 }}
          onClick={onClose}
        />
        <PrimaryButton
          children={t('add')}
          disabled={isLoading || isMenuLoading}
          onClick={() => {
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
              .catch(err => toast.error(err.data ? err.data.message : err.message))
              .finally(() => setIsLoading(false))
          }}
        />
      </div>
    </BaseModal>
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