import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles } from '@material-ui/core/styles';
import { PrimaryButton } from 'components/BaseButton';

import Context from '../../../../Context';

import { updateProject } from 'utils/api';

import styles from './index.module.scss';

const useStyles = makeStyles(() => ({
  formControl: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  formLabel: {
    margin: '0 20px'
  },
  controlLabel: {
    marginBottom: 0
  }
}))

const Setting = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { currentProject, getProjectList } = useContext(Context);
  const [selectedPublicModeKey, setSelectedPublicModeKey] = useState(null);

  useEffect(() => {
    const { metadata } = currentProject
    if (!metadata) return;
    const { public: pb } = metadata
    setSelectedPublicModeKey(pb === 'true' ? 2 : 1)
  }, [currentProject])

  const handleSubmit = () => {
    const isPublic = selectedPublicModeKey === 2 ? true : false
    updateProject(currentProject.project_id, isPublic)
      .then(() => {
        toast.success(t('updateSuccess'));
        getProjectList();
      })
      .catch(err => toast.error(err.data ? err.data.message : err.message));
  };
  return (
    <div style={{ backgroundColor: '#fff', flex: 1 }}>
      <FormControl classes={{ root: classes.formControl }}>
        <FormLabel classes={{ root: classes.formLabel }}>{t('repositoryPrivacy')}</FormLabel>
        <RadioGroup
          aria-label="repositoryPrivacy"
          name="repositoryPrivacy"
          onChange={(e) => {
            const value = e.target.value;
            setSelectedPublicModeKey(Number(value))
          }}
          row
          value={selectedPublicModeKey}
        >
          <FormControlLabel
            classes={{ root: classes.controlLabel }}
            control={<Radio />}
            label={t('public')}
            value={2}
          />
          <FormControlLabel
            classes={{ root: classes.controlLabel }}
            control={<Radio />}
            label={t('private')}
            value={1}
          />
        </RadioGroup>
      </FormControl>
      <div className={styles.formGroup}>
        <PrimaryButton
          children={t('submit')}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Setting;