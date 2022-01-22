
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import { BaseTextField } from 'components/BaseMuiInput';
import BaseModal from 'components/BaseModal';

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { moveNfsFile, moveGlusterfsFile, moveXdfsFile } from 'utils/api'

import Context from '../../../Context';

function RenameModal({ isOpen, onClose, selectedItem, fileList, nfsName, getFileList }) {
  const { t } = useTranslation();
  const { isNFS, isXdfsEnabled } = useContext(Context);

  const [newFileName, setNewFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setNewFileName(selectedItem.name)
  }, [selectedItem])

  useEffect(() => {
    if (fileList.some(item => item.name === newFileName)) {
      setErrorMessage(t('duplicateName'))
    } else {
      setErrorMessage('');
    }
  }, [newFileName])

  const isDisabled = !newFileName || errorMessage

  const rename = () => {
    setIsLoading(true);
    const newPath = selectedItem.path.replace(selectedItem.name, newFileName)

    const moveFile = isXdfsEnabled ? moveXdfsFile : (isNFS ? moveNfsFile : moveGlusterfsFile)

    moveFile(nfsName, selectedItem.path, { targetPath: newPath })
      .then(() => {
        toast.success(`${t('rename')}${t('enSpace')}${t('success')}`);
        getFileList();
        onClose();
      })
      .catch(err => toast.error(err?.data ? err?.data?.message : err?.message))
      .finally(() => setIsLoading(false))
  }

  return (
    <BaseModal
      isOpen={isOpen}
      modalWidth={400}
      onClose={onClose}
      title={t('rename')}
    >
      <BaseTextField
        error={errorMessage}
        helperText={errorMessage === '' ? '' : errorMessage}
        label={t('name')}
        onChange={(e) => {
          const value = e.target.value;
          setNewFileName(value);
        }}
        placeholder="example"
        required
        style={{ marginTop: 20 }}
        value={newFileName}
      />
      <div style={{ paddingTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
        <DefaultButton
          children={t('cancel')}
          onClick={onClose}
          style={{ marginRight: 10 }}
        />
        <PrimaryButton
          children={t('confirm')}
          disabled={isDisabled || isLoading}
          onClick={rename}
        />
      </div>
    </BaseModal>
  );
}

RenameModal.propTypes = {
  fileList: PropTypes.array,
  isOpen: PropTypes.bool,
  nfsName: PropTypes.string,
  onClose: PropTypes.func,
  setFileList: PropTypes.func,
  selectedItem: PropTypes.object,
  getFileList: PropTypes.func
}

export default RenameModal;
