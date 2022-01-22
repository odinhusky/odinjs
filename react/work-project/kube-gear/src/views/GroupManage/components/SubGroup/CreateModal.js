import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { BaseModal } from 'components/BaseModal';
import MuiDropdown from 'components/BaseMuiDropdown';
import { BaseTextField } from 'components/BaseMuiInput';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import { getUserList, createGroup } from 'utils/api';
import GlobalContext from 'layouts/Main//GlobalContext';
import Context from '../../Context';
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

const CreateModal = ({ isOpen, onClose, groupName }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { userInfo } = useContext(GlobalContext);
  const { getMenuData } = useContext(Context);
  const [subGroupName, setSubGroupName] = useState('');
  const [selectedLeaders, setSelectedLeaders] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const reset = () => {
    setSubGroupName('')
    setSelectedLeaders([])
    setSelectedMembers([])
  }

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

  return (
    <BaseModal
      isOpen={isOpen}
      modalWidth={400}
      onClose={onClose}
      title={`${t('add')}${t('enSpace')}${t('SubTeam')}`}
    >
      <BaseTextField
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
            classes={{ root: classes.marginTop20 }}
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
            classes={{ root: classes.marginTop20 }}
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
            classes={{ root: classes.marginTop20 }}
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
            classes={{ root: classes.marginTop20 }}
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
        <DefaultButton
          children={t('cancel')}
          classes={{ root: classes.marginRight10 }}
          onClick={() => {
            onClose()
            reset()
          }}
        />
        <PrimaryButton
          children={t('add')}
          disabled={isLoading || isEmpty(subGroupName) || isEmpty(selectedLeaders)}
          onClick={() => {
            const formData = {
              parent: groupName,
              name: subGroupName,
              leaders: selectedLeaders,
              users: selectedMembers
            }
            setIsLoading(true)
            createGroup(formData)
              .then(() => {
                setIsLoading(false);
                reset();
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
  groupName: PropTypes.string
};

export default CreateModal;