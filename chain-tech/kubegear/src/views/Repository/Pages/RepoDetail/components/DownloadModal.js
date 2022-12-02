import React, {
  useState,
  useEffect,
  useCallback,
  useContext
} from 'react';

// # API
import {
  getUserNfs, getUsersGlusterfs,
  getNfsFilePath, getGlusterfsFilePath,
  saveTagToNFS, saveTagToGlusterfs
} from 'utils/api';

// ? context
import GlobalContext from 'layouts/Main/GlobalContext';
import RepositoryContext from '../../../RepositoryContext'

// ^ Material-ui Componets(Functions)
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

// ? Self-packed Components || Functions
import BaseModal from 'components/BaseModal';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import { BaseTextField } from 'components/BaseMuiInput';
import MuiDropdown from 'components/BaseMuiDropdown';
import LoadingDialog from 'components/LoadingDialog';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isNull, last, isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import cookies from 'js-cookie';

const DownloadModalOpen = ({
  isOpen,
  onClose,
  filename
}) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const { userInfo } = useContext(GlobalContext);
  const { classes } = useContext(RepositoryContext);

  // # states
  const [selectedStorageKey, setSelectedStorageKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownLoading, setIsDownLoading] = useState(false);

  const [NFSGlusterList, setNFSGlusterList] = useState([]);
  const [canWriteNFSGlusterList, setCanWriteNFSGlusterList] = useState([]);

  const [selectedNFSGluster, setSelectedNFSGluster] = useState();

  const [currentPath, setCurrentPath] = useState([]);
  const [currentDir, setCurrentDir] = useState([]);
  const [selectedDir, setSelectedDir] = useState('');

  // - methods
  const resetSelectedStoragePathDir = () => {
    setSelectedNFSGluster();
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
      const getData = (selectedStorageKey === 2 ? getUserNfs : getUsersGlusterfs)
      const nfsData = await getData(cookies.get('user'));
      setIsLoading(false);
      setNFSGlusterList(nfsData);
    } catch (err) {
      toast.error(err?.data ? err.data?.message : err?.message)
    }
  }, [selectedStorageKey])

  const handleDownload = () => {
    let targetPath = '';
    if (!selectedDir) {
      targetPath = `${currentPath.join('/')}/`
    } else {
      targetPath = `${currentPath.join('/')}/${selectedDir}/`
    }
    setIsDownLoading(true)
    const saveFile = selectedStorageKey === 2 ? saveTagToNFS : saveTagToGlusterfs;

    const data = {
      name: selectedNFSGluster,
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

  // * hooks
  useEffect(() => {
    if (!isNull(selectedStorageKey)) {
      resetSelectedStoragePathDir()
      setNFSGlusterList([]);
      setCanWriteNFSGlusterList([]);
      getFsList()
    }
  }, [selectedStorageKey])

  useEffect(() => {
    if (!selectedNFSGluster) return;
    setIsLoading(true);
    const filePath = last(currentPath) ? currentPath.join('/') : '';
    const getFilePath = selectedStorageKey === 2 ? getNfsFilePath : getGlusterfsFilePath;

    getFilePath(selectedNFSGluster, filePath)
      .then(res => {
        setCurrentDir(res.children.filter(item => item.type === 'directory'))
      })
      .catch(err => toast.error(err?.data ? err.data?.message : err?.message))
      .finally(() => setIsLoading(false))
  }, [selectedNFSGluster, currentPath])

  useEffect(() => {
    if (!userInfo.username) return;
    if (isEmpty(NFSGlusterList)) return;
    setCanWriteNFSGlusterList(
      NFSGlusterList.filter(item => {
        if (item.isPublic) return true;
        if (item.canWriteUsers.some(user => user === userInfo.username)) return true;
        if (item.users.some(user => user === userInfo.username)) return true;
        return false
      })
    )
  }, [NFSGlusterList, userInfo])

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
          <div className={`${classes.downloadModalContainer}`}>
            <BaseTextField
              classes={{ root: classes.mt_10 }}
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
                <FormControlLabel
                  control={<Radio />}
                  label={t('NFS')}
                  value={2}
                />
              </RadioGroup>
            </FormControl>

            <MuiDropdown
              list={addDropDownOptionKeys(canWriteNFSGlusterList)}
              maxWidth={'100%'}
              onChange={(e) => {
                const result = e.target.value
                setSelectedNFSGluster(result);
              }}
              value={selectedNFSGluster}
            />

            <div className={`${classes.downloadModalBreadCrumbs}`}>
              {t('download')}{t('enSpace')}{t('path')}  {selectedNFSGluster && selectedNFSGluster + '/'}{currentPath.length === 1 ? `${currentPath[0]}/` : currentPath.join('/')}
            </div>
            <div className={`${classes.downloadModalDirectory}`}>
              {
                isLoading ?
                  <div className={`${classes.downloadModalLoading}`}>
                    <h3>{t('loadingDirectory')}</h3>
                    <p>{t('wait')}</p>
                    <CircularProgress />
                  </div>
                  :
                  <>
                    {
                      currentPath.length > 0 &&
                  <div
                    className={`${classes.downloadModalLoading}`}
                    onDoubleClick={() => setCurrentPath(prev => {
                      const arr = [...prev];
                      arr.pop();
                      return arr;
                    })}
                  >
                    <Icon>folder</Icon>
                    ..
                  </div>
                    }
                    {
                      currentDir.map(dir => (
                        <div
                          className={`${classes.downloadModalDirectoryItem} ${selectedDir === dir.name && classes.downloadModalDirectoryItemActive}`}
                          key={dir.name}
                          onClick={() => setSelectedDir(dir.name)}
                          onDoubleClick={() => {
                            setCurrentPath(prev => [...prev, dir.name])
                            setSelectedDir('');
                          }}
                        >
                          <Icon>folder</Icon>
                          {dir.name}
                        </div>
                      ))
                    }
                  </>
              }
            </div>
            <div className={`${classes.downloadModalFooter}`}>
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