import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import BaseModal from 'components/BaseModal';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import { makeStyles } from '@material-ui/core/styles';

import Context from '../../../../../Context';

import styles from './index.module.scss';

import { updateProjectMember } from 'utils/api';


const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  },
  heightAuto: {
    height: 'auto'
  }
}))

const index = ({ memberList, getMemberList, isOpen, onClose }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const { currentProject } = useContext(Context)
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState(1);

  const handleSubmit = () => {
    setIsLoading(true);
    Promise.all(
      memberList.map(member => {
        return updateProjectMember(currentProject.project_id, member.id, role);
      })
    )
      .then(() => {
        toast.success(t('success'))
        getMemberList();
        onClose(false);
      })
      .catch(err => toast.error(err.data ? err.data.message : err.message))
      .finally(() => setIsLoading(false))
  }

  return (
    <BaseModal
      isOpen={isOpen}
      modalWidth={300}
      title={`${t('edit')}${t('enSpace')}${t('member')}`}
    >
      <ul className={styles.selectedMemberList}>
        <li>{t('member')}</li>
        {
          memberList.map((member, index) => {
            return (
              <li key={index}>
                {member.entity_name}
              </li>
            )
          })
        }
      </ul>
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
          children={t('confirm')}
          disabled={isLoading}
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
