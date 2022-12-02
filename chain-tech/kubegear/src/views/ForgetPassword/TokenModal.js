import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import BaseModal from 'components/BaseModal';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import { BaseTextField } from 'components/BaseMuiInput';

import { useTranslation } from 'react-i18next';
import { checkChangePasswordToken } from 'utils/api';

const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  }
}))

const TokenModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const [getErrorMsg, setGetErrorMsg] = useState('');
  const [token, setToken] = useState();
  const [sendingToken, setSendingToken] = useState(false);

  const onSubmit = () => {
    setSendingToken(true)
    checkChangePasswordToken(token)
      .then(() => {
        setSendingToken(false);
        onClose();
        setToken();
        setGetErrorMsg();
        history.push(`/changePassword?token=${token}`)
      })
      .catch(err => {
        setGetErrorMsg(err.data.message)
      })
      .finally(() => setSendingToken(false))
  }

  return (
    <BaseModal
      isOpen={isOpen}
      modalWidth={350}
      title={t('token')}
    >
      <BaseTextField
        error={getErrorMsg}
        helperText={getErrorMsg === '' ? '' : t('tokenInValid')}
        label={`${t('token')}${t('enSpace')}${t('verification')}`}
        onChange={(e) => {
          const value = e.target.value;
          if (getErrorMsg) setGetErrorMsg();
          setToken(value);
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
        <DefaultButton
          children={t('cancel')}
          classes={{ root: classes.marginRight10 }}
          onClick={() => {
            onClose();
            setToken();
            setGetErrorMsg();
          }}
        />
        {
          sendingToken
            ? <CircularProgress />
            :
            <PrimaryButton
              children={t('confirm')}
              onClick={onSubmit}
            />
        }
      </div>
    </BaseModal>
  );
};

TokenModal.propTypes = {
  isOpen: PropTypes.boolean,
  onClose: PropTypes.func
};

export default TokenModal;