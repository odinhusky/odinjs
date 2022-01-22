import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import MuiDropdown from 'components/BaseMuiDropdown';
import BaseModal from 'components/BaseModal';
import { BaseTextField } from 'components/BaseMuiInput';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';

import Context from '../../../Context';
import { useTranslation } from 'react-i18next';
import { createNfsDisk } from 'utils/api';
import { toast } from 'react-toastify';

const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  },
  marginBottom20: {
    marginBottom: 20
  },
  iconClearMarginLeft: {
    marginLeft: 0
  }
}))


function CreateModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { hostList, getNfsDiskList, nfsDiskList } = useContext(Context);
  const [nfsDiskName, setNfsDiskName] = useState('');
  const [nfsDiskHost, setNfsDiskHost] = useState('');
  const [nfsDiskPath, setNfsDiskPath] = useState('');
  const [isNameError, setIsNameError] = useState('');
  const [isPathError, setIsPathError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const hosts = useMemo(
    () => hostList.map((host, index) => ({ key: index, text: host })),
    [hostList]
  );

  useEffect(
    () => {
      if (isOpen) {
        setIsCreating(false);
      }
    },
    [isOpen]
  );

  const rules = {
    required: value => (value ? '' : t('fieldRequired'))
  };

  const onCreate = useCallback(
    () => {
      setIsCreating(true);
      if (nfsDiskList.some(disk => disk.name === nfsDiskName)) {
        setIsNameError(t('duplicateName'))
        setIsCreating(false);
        return
      }
      const formData = {
        name: nfsDiskName,
        host: nfsDiskHost,
        path: nfsDiskPath
      };
      createNfsDisk(formData)
        .then(() => {
          getNfsDiskList();
          onClose();
          setIsCreating(false);
          setNfsDiskHost('');
          setNfsDiskName('');
          setNfsDiskPath('');
          toast.success(`${t('add')}${t('enSpace')}${t('success')}`);
        })
        .catch(err => {
          const msg = err.data.message ? err.data.message : err.toString();
          toast.error(msg);
          setIsCreating(false);
        });
    },
    [nfsDiskName, nfsDiskHost, nfsDiskPath]
  );

  return (
    <BaseModal
      isOpen={isOpen}
      modalWidth={500}
      onClose={onClose}
      title={`${t('add')}${t('enSpace')}${t('mount')}`}
    >
      <BaseTextField
        classes={{ root: classes.marginBottom20 }}
        error={isNameError}
        helperText={isNameError === '' ? '' : isNameError}
        label={t('name')}
        onChange={(e) => {
          const value = e.target.value;
          setNfsDiskName(value);
          const checkField = rules.required(value);
          setIsNameError(checkField)
        }}
        required
        type="text"
      />
      <MuiDropdown
        classes={{ root: classes.marginBottom20 }}
        list={hosts}
        onChange={(e) => {
          const value = e.target.value
          setNfsDiskHost(value);
        }}
        selectProps={{
          required: true
        }}
        text={t('mount')}
        value={nfsDiskHost}
      />
      <BaseTextField
        classes={{ root: classes.marginBottom20 }}
        error={isPathError}
        helperText={isPathError === '' ? '' : isPathError}
        label={t('path')}
        onChange={(e) => {
          const value = e.target.value;
          setNfsDiskPath(value);
          const checkField = rules.required(value);
          setIsPathError(checkField)
        }}
        required
        type="text"
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <DefaultButton
          children={t('cancel')}
          classes={{
            root: classes.marginRight10,
            startIcon: classes.iconClearMarginLeft
          }}
          disabled={isCreating}
          onClick={() => {
            setNfsDiskName('');
            setNfsDiskHost('');
            setNfsDiskPath('');
            onClose();
          }}
        />
        {
          isCreating
            ? <CircularProgress />
            :
            <PrimaryButton
              children={t('confirm')}
              disabled={isCreating || (!nfsDiskName || !nfsDiskHost || !nfsDiskPath)}
              onClick={onCreate}
            />
        }
      </div>
    </BaseModal>
  );
}

CreateModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default CreateModal;
