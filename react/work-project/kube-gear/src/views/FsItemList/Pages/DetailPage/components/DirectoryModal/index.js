import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';
import BaseModal from 'components/BaseModal';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';

import { useTranslation } from 'react-i18next';
import { last } from 'lodash';
import classnames from 'classnames';
import { toast } from 'react-toastify';

import styles from './index.module.scss';

import {
  getNfsFilePath, getGlusterfsFilePath, getXdfsFilePath,
  moveNfsFile, moveGlusterfsFile, moveXdfsFile
} from 'utils/api';

import Context from '../../../../Context';

const DirectoryModal = ({ isOpen, onClose, selectedItem, nfsName, getFileList }) => {
  const { t } = useTranslation();
  const { isNFS, isXdfsEnabled } = useContext(Context);

  const [currentPath, setCurrentPath] = useState([]);
  const [currentDir, setCurrentDir] = useState([]);
  const [selectedDir, setSelectedDir] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedItem.path || !isOpen) return;
    const routeArr = selectedItem.path.split('/').slice(1);
    routeArr.pop();
    setCurrentPath(routeArr);
    setSelectedDir('');
  }, [selectedItem, isOpen])

  useEffect(() => {
    setIsLoading(true);
    const filePath = last(currentPath) ?
      currentPath.join('/') :
      ''
    const getFilePath = isXdfsEnabled
      ? getXdfsFilePath
      : isNFS ? getNfsFilePath : getGlusterfsFilePath;

    getFilePath(nfsName, filePath)
      .then(res => {
        setCurrentDir(res.children.filter(item => item.type === 'directory' && item.name !== selectedItem.name))
      })
      .catch(err => toast.error('Error: ' + err?.data ? err.data?.message : err?.message))
      .finally(() => setIsLoading(false))
  }, [currentPath])

  const handleMove = () => {
    let targetPath = '';
    if (!selectedDir) {
      targetPath = `/${currentPath.join('/')}/${selectedItem.name}`
    } else {
      targetPath = `/${currentPath.join('/')}/${selectedDir}/${selectedItem.name}`
    }
    setIsLoading(true)
    const moveFile = isXdfsEnabled
      ? moveXdfsFile
      : isNFS ? moveNfsFile : moveGlusterfsFile;

    moveFile(nfsName, selectedItem.path, { targetPath })
      .then(() => {
        toast.success(`${t('move')}${t('enSpace')}${t('success')}`);
        getFileList();
        onClose();
      })
      .catch(err => toast.error('Error: ' + err.data ? err.data.message : err.message))
      .finally(() => setIsLoading(false))
  }

  const isDisabled = () => {
    if (!selectedItem.path) return false
    if (!selectedDir) {
      if (!last(currentPath)) {
        return selectedItem.path.replace(selectedItem.name, '') === '/';
      }
      if (last(currentPath) && last(currentPath) === last(selectedItem.path.replace(`/${selectedItem.name}`, '').split('/'))) {
        return true
      }
      return false
    }
    if (selectedDir === last(selectedItem.path.replace(`/${selectedItem.name}`, '').split('/'))) {
      return true
    }
    return false
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${t('move')} ${selectedItem.name}`}
    >
      <div className={styles.container}>
        <p className={styles.breadcrumbs}>
          {nfsName}/{currentPath.length === 1 ? `${currentPath[0]}/` : currentPath.join('/')}
        </p>
        <div className={styles.directory}>
          {
            isLoading ?
              <div className={styles.loading}>
                <h3>{t('loadingDirectory')}</h3>
                <p>{t('wait')}</p>
                <CircularProgress />
              </div>
              :
              <>
                {
                  currentPath.length > 0 &&
                  <div
                    className={styles.directoryItem}
                    onDoubleClick={() => setCurrentPath(prev => {
                      const arr = [...prev];
                      arr.pop();
                      return arr;
                    })}
                  >
                    <Icon style={{ marginRight: '10px' }}>folder</Icon>
                    ..
                  </div>
                }
                {
                  currentDir.map(dir => (
                    <div
                      className={classnames(styles.directoryItem, { [styles.active]: selectedDir === dir.name })}
                      key={dir.name}
                      onClick={() => setSelectedDir(dir.name)}
                      onDoubleClick={() => {
                        setCurrentPath(prev => [...prev, dir.name])
                        setSelectedDir('');
                      }}
                    >
                      <Icon style={{ marginRight: '10px' }}>folder</Icon>
                      {dir.name}
                    </div>
                  ))
                }
              </>
          }
        </div>
        <div className={styles.footer}>
          <DefaultButton
            children={t('cancel')}
            onClick={onClose}
          />
          <PrimaryButton
            children={t('move')}
            disabled={isDisabled() || isLoading}
            onClick={handleMove}
          />
        </div>
      </div>
    </BaseModal>
  );
};

DirectoryModal.propTypes = {
  fileList: PropTypes.array,
  isOpen: PropTypes.bool,
  nfsName: PropTypes.string,
  onClose: PropTypes.func,
  setFileList: PropTypes.func,
  selectedItem: PropTypes.object,
  getFileList: PropTypes.func
};

export default DirectoryModal;