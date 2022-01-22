import React, { useState, useEffect, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isNull, last, isEmpty } from 'lodash';
import classnames from 'classnames';
import { toast } from 'react-toastify';
import cookies from 'js-cookie';

import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import BaseModal from 'components/BaseModal';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import { BaseTextField } from 'components/BaseMuiInput';
import MuiDropdown from 'components/BaseMuiDropdown';
import LoadingDialog from 'components/LoadingDialog';

import {
  getUserNfs, getUsersGlusterfs, getUsersXdfs,
  getNfsFilePath, getGlusterfsFilePath, getXdfsFilePath,
  saveTagToNFS, saveTagToGlusterfs, saveTagToXdfs
} from 'utils/api';
import GlobalContext from 'layouts/Main/GlobalContext';
import styles from './DownloadModal.module.scss';

const useStyles = makeStyles(() => ({
  marginTop10: {
    marginTop: 10
  },
  heightAuto: {
    height: 'auto'
  }
}))

const DownloadModalOpen = ({ isOpen, onClose, filename }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { userInfo, isXdfsEnabled } = useContext(GlobalContext);
  const [selectedStorageKey, setSelectedStorageKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownLoading, setIsDownLoading] = useState(false);

  const [NFSGlusterXdfsList, setNFSGlusterXdfsList] = useState([]);
  const [canWriteNFSGlusterXdfsList, setCanWriteNFSGlusterXdfsList] = useState([]);

  const [selectedNFSGlusterXdfs, setSelectedNFSGlusterXdfs] = useState();

  const [currentPath, setCurrentPath] = useState([]);
  const [currentDir, setCurrentDir] = useState([]);
  const [selectedDir, setSelectedDir] = useState('');

  const resetSelectedStoragePathDir = () => {
    setSelectedNFSGlusterXdfs();
    setCurrentPath([]);
    setCurrentDir([]);
  }

  const addDropDownOptionKeys = optionItems => {
    return optionItems.map((item) => ({
      key: item.name,
      text: item.name,
      ...item
    }));
  };

  const getFsList = useCallback(async() => {
    setIsLoading(true);
    try {
      const getData = selectedStorageKey === 3 ? getUsersXdfs : (selectedStorageKey === 2 ? getUserNfs : getUsersGlusterfs)
      const nfsData = await getData(cookies.get('user'));
      setIsLoading(false);
      setNFSGlusterXdfsList(nfsData);
    } catch (err) {
      toast.error(err?.data ? err.data?.message : err?.message)
    }
  }, [selectedStorageKey])

  useEffect(() => {
    if (!isNull(selectedStorageKey)) {
      resetSelectedStoragePathDir()
      setNFSGlusterXdfsList([]);
      setCanWriteNFSGlusterXdfsList([]);
      getFsList()
    }
  }, [selectedStorageKey])

  useEffect(() => {
    if (!selectedNFSGlusterXdfs) return;
    setIsLoading(true);
    const filePath = last(currentPath) ? currentPath.join('/') : '';
    const getFilePath = selectedStorageKey === 3 ? getXdfsFilePath : selectedStorageKey === 2 ? getNfsFilePath : getGlusterfsFilePath;

    getFilePath(selectedNFSGlusterXdfs, filePath)
      .then(res => {
        setCurrentDir(res.children.filter(item => item.type === 'directory'))
      })
      .catch(err => toast.error(err?.data ? err.data?.message : err?.message))
      .finally(() => setIsLoading(false))
  }, [selectedNFSGlusterXdfs, currentPath])

  const handleDownload = () => {
    let targetPath = '';
    if (!selectedDir) {
      targetPath = `${currentPath.join('/')}/`
    } else {
      targetPath = `${currentPath.join('/')}/${selectedDir}/`
    }
    setIsDownLoading(true)
    const saveFile = selectedStorageKey === 3 ? saveTagToXdfs : selectedStorageKey === 2 ? saveTagToNFS : saveTagToGlusterfs;

    const data = {
      name: selectedNFSGlusterXdfs,
      path: targetPath,
      image: filename
    }

    saveFile(data)
      .then(() => {
        toast.success(`${t('download')}${t('enSpace')}${t('success')}`);
        onClose();
      })
      .catch(err => toast.error(err.data ? err.data.message : err.message))
      .finally(() => setIsDownLoading(false))
  }

  useEffect(() => {
    if (!userInfo.username) return;
    if (isEmpty(NFSGlusterXdfsList)) return;
    setCanWriteNFSGlusterXdfsList(
      NFSGlusterXdfsList.filter(item => {
        if (item.isPublic) return true;
        if (item.canWriteUsers.some(user => user === userInfo.username)) return true;
        if (item.users.some(user => user === userInfo.username)) return true;
        return false
      })
    )
  }, [NFSGlusterXdfsList, userInfo])

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${t('DownloadToNFSGlusterFS')}`}
    >
      {
        isDownLoading
          ?
          <LoadingDialog
            isOpen={isDownLoading}
            subText={t('wait')}
            title={'Loading'}
          />
          :
          <div className={styles.container}>
            <BaseTextField
              classes={{ root: classes.marginTop10 }}
              disabled
              label={t('name')}
              type="text"
              value={filename}
            />

            <FormControl>
              <RadioGroup
                aria-label="role"
                name="role"
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedStorageKey(Number(value))
                }}
                row
                value={selectedStorageKey}
              >
                {
                  isXdfsEnabled
                    ?
                    <FormControlLabel
                      control={<Radio />}
                      label={t('xdfs')}
                      value={3}
                    />
                    :
                    <>
                      <FormControlLabel
                        control={<Radio />}
                        label={t('glusterfs')}
                        value={1}
                      />
                      <FormControlLabel
                        control={<Radio />}
                        label={t('NFS')}
                        value={2}
                      />
                    </>
                }
              </RadioGroup>
            </FormControl>

            <MuiDropdown
              list={addDropDownOptionKeys(canWriteNFSGlusterXdfsList)}
              maxWidth={'100%'}
              onChange={(e) => {
                const result = e.target.value
                setSelectedNFSGlusterXdfs(result);
              }}
              value={selectedNFSGlusterXdfs}
            />

            <div className={styles.breadcrumbs}>
              {t('download')}{t('enSpace')}{t('path')}  {selectedNFSGlusterXdfs && selectedNFSGlusterXdfs + '/'}{currentPath.length === 1 ? `${currentPath[0]}/` : currentPath.join('/')}
            </div>
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
                children={t('download')}
                disabled={isLoading}
                onClick={handleDownload}
              />
            </div>
          </div>
      }
    </BaseModal>
  );
};

DownloadModalOpen.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  filename: PropTypes.string
};

export default DownloadModalOpen;