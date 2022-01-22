import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import BaseModal from 'components/BaseModal';
import { BaseTextField } from 'components/BaseMuiInput';
import { makeStyles } from '@material-ui/core/styles';
import Context from './Context';

import { setJobLifeHour } from 'utils/api';

import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  },
  marginTop20: {
    marginTop: 20
  }
}))

function TimeModal({ isOpen, onClose, job }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { refreshJobs } = useContext(Context);
  const [lifeHour, setLifeHour] = useState();
  const [isDisabled, setIsDisables] = useState(true);
  const [isLifeHourError, setIsLifeHourError] = useState('');

  const rules = {
    required: value => (value ? '' : t('fieldRequired')),
    mustBeNumber: value => (isNaN(value) ? t('mustInputNumber') : '')
  };

  useEffect(() => {
    setLifeHour(job.lifeHour === '-' ? -1 : job.lifeHour);
  }, [job]);

  useEffect(() => {
    let { lifeHour: defaultValue } = job

    defaultValue = defaultValue === '-' ? -1 : defaultValue

    setIsDisables(parseInt(lifeHour) === defaultValue);
  }, [lifeHour])

  const handleSubmit = () => {
    setIsDisables(true);
    setJobLifeHour({ name: job.name, lifeHour }).then(() => {
      setIsDisables(false);
      refreshJobs();
      onClose();
      toast.success(`${t('setLifeHour')}${t('enSpace')}${t('success')}`);
    }).catch(err => {
      toast.error(err.data.message);
      setIsDisables(false);
    });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      modalWidth={350}
      title={t('setLifeHour')}
    >
      <BaseTextField
        classes={{ root: classes.marginTop20 }}
        error={isLifeHourError}
        helperText={isLifeHourError === '' ? '' : isLifeHourError}
        label={`${t('jobUseTime')}(${t('hour')})`}
        onChange={(e) => {
          const value = e.target.value;
          setLifeHour(value);
          const checkField = rules.required(value) || rules.mustBeNumber(value);
          setIsLifeHourError(checkField)
        }}
        required
        value={lifeHour}
      />
      <div style={{ display:'flex', justifyContent:'flex-end', paddingTop: '15px' }}>
        <DefaultButton
          children={t('cancel')}
          classes={{ root: classes.marginRight10 }}
          onClick={() => onClose()}
        />
        <PrimaryButton
          children={t('confirm')}
          disabled={isDisabled || isLifeHourError}
          onClick={() => handleSubmit()}
        />
      </div>
    </BaseModal>
  );
}

TimeModal.propTypes = {
  isOpen: PropTypes.bool,
  job: PropTypes.object,
  onClose: PropTypes.func
};

export default TimeModal;
