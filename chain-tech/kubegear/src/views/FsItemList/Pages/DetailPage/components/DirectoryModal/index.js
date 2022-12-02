import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// # API
import {
  getNfsFilePath, getGlusterfsFilePath,
  moveNfsFile, moveGlusterfsFile
} from 'utils/api';

// ? context
import FsItemListContext from '../../../../FsItemListContext';

// ^ Material-ui Componets(Functions)
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';

// ? Self-packed Components || Functions
import BaseModalNew from 'components/BaseModalNew';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { last } from 'lodash';
import { toast } from 'react-toastify';

/**
 * @author odin
 * @level views/FsItemList/DetailPage/DirectoryModal
 * @component DirectoryModal Component
 * @description DirectoryModal
*/
const DirectoryModal = ({
  isOpen,
  onClose,
  selectedItem,
  nfsName,
  getFileList
}) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const { isNFS, classes } = useContext(FsItemListContext);

  // # states
  const [currentPath, setCurrentPath] = useState([]);
  const [currentDir, setCurrentDir] = useState([]);
  const [selectedDir, setSelectedDir] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // - methods
  const handleMove = () => {
    let targetPath = '';
    if (!selectedDir) {
      targetPath = `/${currentPath.join('/')}/${selectedItem.name}`
    } else {
      targetPath = `/${currentPath.join('/')}/${selectedDir}/${selectedItem.name}`
    }
    setIsLoading(true)
    const moveFile = isNFS ? moveNfsFile : moveGlusterfsFile;

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

  // * hooks
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
    const getFilePath = isNFS ? getNfsFilePath : getGlusterfsFilePath;

    getFilePath(nfsName, filePath)
      .then(res => {
        setCurrentDir(res.children.filter(item => item.type === 'directory' && item.name !== selectedItem.name))
      })
      .catch(err => toast.error('Error: ' + err?.data ? err.data?.message : err?.message))
      .finally(() => setIsLoading(false))
  }, [currentPath])

  return (
    <BaseModalNew
      isOpen={isOpen}
      modalFoot={
        <>
          <DefaultButton
            children={t('close')}
            className={`${classes.mr_10}`}
            onClick={onClose}
          />
          <PrimaryButton
            children={t('move')}
            disabled={isDisabled() || isLoading}
            onClick={handleMove}
          />
        </>
      }
      onClose={onClose}
      title={`${t('move')} ${selectedItem.name}`}
    >
      <div className={`${classes.directoryModalContainer}`}>
        <p className={`${classes.directoryModalBreadCrumb}`}>
          {nfsName}/{currentPath.length === 1 ? `${currentPath[0]}/` : currentPath.join('/')}
        </p>
        <div className={`${classes.directoryModalDirectory}`}>
          {
            isLoading ?
              <div className={`${classes.directoryModalLoading}`}>
                <h3>{t('loadingDirectory')}</h3>
                <p>{t('wait')}</p>
                <CircularProgress />
              </div>
              :
              <>
                {
                  currentPath.length > 0 &&
                  <div
                    className={`${classes.directoryModalDirectoryItem}`}
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
                      className={`
                        ${classes.directoryModalDirectoryItem}
                        ${selectedDir === dir.name && 'active'}
                      `}
                      key={dir.name}
                      onClick={() => setSelectedDir(dir.name)}
                      onDoubleClick={() => {
                        setCurrentPath(prev => [...prev, dir.name])
                        setSelectedDir('');
                      }}
                    >
                      <Icon className={`${classes.mr_10}`}>folder</Icon>
                      {dir.name}
                    </div>
                  ))
                }
              </>
          }
        </div>
      </div>
    </BaseModalNew>
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