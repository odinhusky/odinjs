import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { BaseModal } from 'components/BaseModal';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import MuiDropdown from 'components/BaseMuiDropdown';
import { BaseTextField } from 'components/BaseMuiInput';
import GlobalContext from 'layouts/Main/GlobalContext';
import Context from '../../Context';
import { getUserList, updateGroup } from 'utils/api';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';

const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  },
  marginTop20 : {
    marginTop: 20
  }
}))

const EditModal = ({ group, isOpen, onClose }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { userInfo, setUserInfo } = useContext(GlobalContext);
  const { getMenuData, isLoadingMenu } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const [subGroupName, setSubGroupName] = useState('');
  const [selectedLeaders, setSelectedLeaders] = useState([]);
  const [userList, setUserList] = useState([]);

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
    <BaseModal
      isOpen={isOpen}
      modalWidth={400}
      onClose={onClose}
      title={`${t('Edit')}${t('enSpace')}${t('SubTeam')}`}
    >
      <BaseTextField
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
            label={t('TeamLeader')}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedLeaders(value.split(','))
            }}
            value={selectedLeaders.join(',')}
          />
          :
          <MuiDropdown
            classes={{ root: classes.marginTop20 }}
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
        <DefaultButton
          children={t('cancel')}
          classes={{ root: classes.marginRight10 }}
          onClick={onClose}
        />
        <PrimaryButton
          children={t('modify')}
          disabled={isEmpty(subGroupName) || isEmpty(selectedLeaders) || isLoading || isLoadingMenu}
          onClick={() => {
            setIsLoading(true)
            const formData = {
              name: subGroupName,
              leaders: selectedLeaders
            }
            updateGroup(formData, group.name)
              .then(() => {
                if (userInfo.leaderGroups && userInfo.leaderGroups.includes(group.name)) {
                  setUserInfo(prev => ({ ...prev, leaderGroups: prev.leaderGroups.filter(item => item !== group.name) }))
                } else {
                  getMenuData();
                }
                setIsLoading(false);
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

EditModal.propTypes = {
  group: PropTypes.object,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default EditModal;