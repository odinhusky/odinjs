
import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import { BaseTextField } from 'components/BaseMuiInput';
import BaseModal from 'components/BaseModal';
import { toast } from 'react-toastify';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { createNfsFolder, createGlusterfsFolder, createXdfsFolder } from 'utils/api';

import Context from '../../../Context';

const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  },
  marginTop20: {
    marginTop: 20
  }
}));

function NewFolderModal({ isOpen, onClose, nfsName, fileList, setFileList }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const location = useLocation();
  const { isNFS, isXdfsEnabled } = useContext(Context);

  const [dirInCreation, setDirInCreation] = useState(null);

  const createDir = () => {
    if (fileList.find(n => n.name === dirInCreation && n.type === 'directory')) {
      toast.error(t('folderIsExist'));
      return;
    }

    let path = location.pathname.split(`/${isXdfsEnabled ? 'xdfs-item-list' : isNFS ? 'fs-item-list' : 'glusterfs-item-list'}/${nfsName}`)[1]
    path = path ? path : '/'

    const createFolder = isXdfsEnabled ? createXdfsFolder : (isNFS ? createNfsFolder : createGlusterfsFolder);

    createFolder(nfsName, path, `/${dirInCreation}`)
      .then(() => {
        toast.success(`${t('Folders')} ${dirInCreation} ${t('add')}${t('enSpace')}${t('success')}`);
        const itemNodes = {
          name: dirInCreation,
          size: 0,
          type: 'directory',
          path: `${path}/${dirInCreation}`,
          children: [],
          mime: 'inode/directory; charset=binary'
        };

        setFileList(data => [...data, itemNodes]);
        setDirInCreation('');
        onClose();
      }).catch(() => {
        toast.error(`${t('Folders')} ${dirInCreation} ${t('add')}${t('enSpace')}${t('fail')}`);
      }).then(() => {
        // Reset dirInCreation
        setDirInCreation('');
        onClose();
      });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      modalWidth={400}
      onClose={onClose}
      title={`${t('add')}${t('enSpace')}${t('Folders')}`}
    >
      <BaseTextField
        classes={{ root: classes.marginTop20 }}
        label={t('name')}
        onChange={(e) => {
          const value = e.target.value;
          setDirInCreation(value);
        }}
        required
        type="text"
        value={dirInCreation}
      />
      <div style={{ paddingTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
        <DefaultButton
          children={t('cancel')}
          classes={{ root: classes.marginRight10 }}
          onClick={() => {
            setDirInCreation('');
            onClose();
          }}
        />
        <PrimaryButton
          children={t('add')}
          disabled={!dirInCreation}
          onClick={()=>{
            createDir();
          }}
        />
      </div>
    </BaseModal>
  );
}

NewFolderModal.propTypes = {
  fileList: PropTypes.array,
  isOpen: PropTypes.bool,
  nfsName: PropTypes.string,
  onClose: PropTypes.func,
  setFileList: PropTypes.func
}

export default NewFolderModal;
