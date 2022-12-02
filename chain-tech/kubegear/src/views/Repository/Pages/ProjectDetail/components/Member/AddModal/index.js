import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

import BaseModal from 'components/BaseModal';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import MuiDropdown from 'components/BaseMuiDropdown';
import { BaseTextField } from 'components/BaseMuiInput';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import { makeStyles } from '@material-ui/core/styles';

import RepositoryContext from '../../../../../RepositoryContext';
import GlobalContext from 'layouts/Main/GlobalContext';


import { addProjectMember, getUserList } from 'utils/api';

import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';

const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  },
  marginBottom10: {
    marginBottom: 10
  },
  marginTop10: {
    marginTop: 10
  }
}))

const index = ({ memberList, getMemberList, isOpen, onClose }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const { currentProject } = useContext(RepositoryContext)
  const { userInfo } = useContext(GlobalContext);
  const [userList, setUserList] = useState([]);
  const [userName, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState(1);

  useEffect(() => {
    if (userInfo.privileges && userInfo.privileges.some(pvg => pvg === 'ADMIN' || pvg === 'USER')) {
      getUserList()
        .then(data => setUserList(data));
    }
  }, [userInfo])

  const memberOption = userList.filter(item => (
    !memberList.some(projectMember => projectMember.entity_name === item.username)
  )).map((item, key) => ({
    key: key,
    text: item.username
  }));

  const handleSubmit = () => {
    if (!userName) return;

    setIsLoading(true);
    addProjectMember(currentProject.project_id, userName.trim(), role)
      .then(() => {
        setUsername('');
        onClose();
        getMemberList();
      })
      .catch(err => toast.error(err.data ? err.data.message : err.message))
      .finally(() => setIsLoading(false))
  }

  return (
    <BaseModal
      isOpen={isOpen}
      modalWidth={300}
      title={`${t('add')}${t('enSpace')}${t('member')}`}
    >
      {
        isEmpty(memberOption) ?
          <BaseTextField
            classes={{ root: `${classes.marginBottom10} ${classes.marginTop10}` }}
            label={t('User')}
            onChange={(e) => {
              const value = e.target.value;
              setUsername(value);
            }}
            required
            type="text"
            value={userName}
          />
          :
          <MuiDropdown
            classes={{ root: `${classes.marginBottom10} ${classes.marginTop10}` }}
            list={memberOption}
            maxWidth={'100%'}
            onChange={(e) => {
              const result = e.target.value
              setUsername(result);
            }}
            text={t('User')}
            value={userName}
          />
      }
      <FormControl>
        <FormLabel>{t('role')}</FormLabel>
        <RadioGroup
          aria-label="role"
          name="role"
          onChange={(e) => {
            const value = e.target.value;
            setRole(Number(value))
          }}
          value={role}
        >
          <FormControlLabel
            control={<Radio />}
            label={`${t('project')}${t('enSpace')}${t('admin')}`}
            value={1}
          />
          <FormControlLabel
            control={<Radio />}
            label={t('maintainer')}
            value={2}
          />
          <FormControlLabel
            control={<Radio />}
            label={t('Guest')}
            value={3}
          />
        </RadioGroup>
      </FormControl>
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 20 }}>
        <DefaultButton
          children={t('cancel')}
          classes={{ root: classes.marginRight10 }}
          onClick={onClose}
        />
        <PrimaryButton
          children={t('add')}
          disabled={!userName || isLoading}
          onClick={handleSubmit}
        />
      </div>
    </BaseModal>
  );
};

index.propTypes = {
  getMemberList: PropTypes.func,
  isOpen: PropTypes.bool,
  memberList: PropTypes.array,
  onClose: PropTypes.func
};

export default index;
