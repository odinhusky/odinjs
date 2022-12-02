import React, {
  useRef,
  useState,
  useContext
} from 'react';

// # API
import { uploadNfsFile, uploadGlusterfsFile } from 'utils/api';

// ? context
import FsItemListContext from '../../../../FsItemListContext';

// ^ Material-ui Componets(Functions)
import Alert from '@material-ui/lab/Alert';

// ? Self-packed Components || Functions
import BaseModalNew from 'components/BaseModalNew';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import Progress from './Progress';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

/**
 * @author odin
 * @level views/FsItemList/DetailPage/NewFolderModal
 * @param {number} mode -- mode 0: file, 1: folder
 * @component NewFolderModal Component
 * @description DetailPage's NewFolderModal Component
*/
const UploadModal = ({
  isOpen,
  onClose,
  nfsName,
  mode,
  getFileList
}) => {

  // $ init data
  const { t } = useTranslation();
  const location = useLocation();
  const fileInput = useRef(null);

  // ? context
  const { isNFS, classes } = useContext(FsItemListContext);

  // # states
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [progressValue, setProgressValue] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);

  // - methods
  const mimeTypeFilterer = ({ types }) => {
    return file => {
      // No types => no checking ; )
      if (!types) { // E.g. ['image/png', 'image/jpeg', 'image/gif'];
        return true;
      }

      if (types.every(type => file.type !== type)) {
        const msg = file.name + ': ' + (file.type ? `${file.type} ${t('fileTypeNotSupport')}\n` : `${t('notSupportNoFileType')}\n`);
        toast.error(msg);
        return false;
      }

      return true;
    };
  };

  // File size filterer
  const maxSizeFilterer = ({ max }) => {
    // Input: file 'object'
    return file => {
      // No max => 'all' r allowed
      if (!max) {
        return true;
      }

      if (file.size > max) {
        const msg = `${file.name} ${t('fileSizeTooLarge')}...\n`;
        toast.error(msg);
        return false;
      }

      return true;
    };
  };

  // Max files filterer
  const maxFilter = ({ max }) => {
    // No max => 'all' r allowed
    return files => {
      if (max >= 0) {
        return true;
      }

      if (files.length > max) {
        const msg = t('onlyNumFileSameTime', { num: max });
        toast.warn(msg);
        return false;
      }

      return true;
    };
  };

  // Reset to initial component statuses
  const reset = event => {
    if (event) {
      event.target.value = null;
    }

    setSelectedFiles(null);
    setProgressValue(0);
    setUploadStatus(null);
  };

  // Init filters
  const filesFilters = [maxFilter({})];
  const fileFilters = [maxSizeFilterer({}), mimeTypeFilterer({})];

  const handleOnChange = (e, files) => {
    if (e) files = Array.from(e.target.files);
    // Filter by 'files' filters
    if (!filesFilters.every(filesFilter => filesFilter(files))) {
      reset(event);
      return;
    }

    // Filter by 'file' filters
    // - Got file 'objects'
    const filteredFiles = fileFilters.reduce((res, fileFilter) => {
      return res.filter(file => fileFilter(file));
    }, files);

    if (filteredFiles.length === 0) {
      reset(event);
      return;
    }

    // Set statuses here
    setSelectedFiles(files)
  }

  const handleUpload = () => {
    // Handle 'no-file-selected' case
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error(t('atLeastOneFile'), { containerId: 'uploaderToast' });
      return;
    }

    // Append files to one data
    // - due to backend api
    const data = new FormData();
    selectedFiles.forEach(f => {
      data.append('files', f);
    });

    let path = location.pathname.substring(`/${isNFS ? 'fs-item-list' : 'glusterfs-item-list'}/${nfsName}`.length)
    path = path ? path : '/'

    const onUploadProgress = progressEvent => {
      const { total, loaded } = progressEvent

      setProgressValue(Number((loaded * 100 / total).toFixed(2)));
    }

    const uploadFile = isNFS ? uploadNfsFile : uploadGlusterfsFile;

    uploadFile(nfsName, path, data, onUploadProgress)
      .then(() => {
        getFileList();
        setUploadStatus('success');
      })
      .catch(err => {
        const msg = err.data ? err.data.message : err.toString()
        toast.error(msg);
        setUploadStatus('error');
      })
  }

  const ModalTitle = () => {
    if (progressValue === 0)
      return `${t('Upload')}${t('enSpace')}${mode ? t('Folders') : t('Files')}`

    if (uploadStatus === 'error')
      return (
        <Alert severity="error">
          <span style={{ color: '#E84C3C' }}>
            {t('Upload')}{t('enSpace')}{t('fail')}
          </span>
        </Alert>
      );

    if (uploadStatus === 'success')
      return (
        <Alert severity="success">
          {t('Upload')}{t('enSpace')}{t('success')}
        </Alert>
      );

    if (progressValue !== 0)
      return (
        <div
          style={{
            textAlign: 'center',
            color: '#333',
            fontSize: 18,
            fontWeight: 'bold'
          }}
        >
          {t('Files')}{t('enSpace')}{t('uploading')}
        </div>
      )
  }

  const preventDefault = e => {
    e.stopPropagation();
    e.preventDefault();
  }

  const handleDrop = e => {
    e.stopPropagation();
    e.preventDefault();
    if (mode === 1) return;

    const dt = e.dataTransfer;
    let isValid = true;
    if (dt.items.length === 0) return;
    if (mode === 1 && dt.items.length > 1) {
      toast.error(t('folderJustOne'));
      return;
    }
    for (let i = 0; i < dt.items.length; i++) {
      const item = dt.items[0].webkitGetAsEntry();
      if (mode === 0 && item.isDirectory) {
        toast.error(t('pleaseSelectFile'));
        isValid = false;
        break;
      } else if (mode === 1 && item.isFile) {
        toast.error(t('pleaseSelectFolder'))
        isValid = false;
        break;
      }
    }

    if(!isValid) return false;
    // 把文件夾的檔案抓出來
    async function getFile(fileEntry) {
      try {
        return await new Promise((resolve, reject) => fileEntry.file(resolve, reject));
      } catch (err) {
        toast.error(err);
      }
    }
    async function traverseFileTree(item, path) {
      path = path || '';
      if (item.isFile) {
        const file = await getFile(item);
        setSelectedFiles(prev => {
          if (!prev) return [file]
          return [...prev, file];
        });
      } else if (item.isDirectory) {
        // Get folder contents
        var dirReader = item.createReader();
        dirReader.readEntries(function(entries) {
          for (var i = 0; i < entries.length; i++) {
            traverseFileTree(entries[i], path + item.name + '/');
          }
        });
      }
    }
    if (mode === 1) {
      const item = dt.items[0].webkitGetAsEntry();
      traverseFileTree(item);
      return;
    }

    handleOnChange(null, Array.from(dt.files));
  }

  return (
    <BaseModalNew
      isOpen={isOpen}
      modalFoot={
        <>
          {
            progressValue === 0 ? (
              <>
                <DefaultButton
                  children={t('cancel')}
                  classes={{ root: classes.mr_10 }}
                  onClick={() => {
                    reset();
                    onClose();
                  }}
                />
                <PrimaryButton
                  children={t('Upload')}
                  disabled={progressValue !== 0}
                  onClick={handleUpload}
                />
              </>
            ) : (
              <>
                {
                  uploadStatus === 'success' &&
                    <div className="text-center">
                      <PrimaryButton
                        children={t('confirm')}
                        onClick={() => {
                          onClose();
                          reset();
                        }}
                      />
                    </div>
                }
                {
                  uploadStatus === 'error' &&
                    <div className="text-center">
                      <DefaultButton
                        children={t('close')}
                        classes={{ root: classes.mr_10 }}
                        onClick={() => {
                          onClose();
                          reset();
                        }}
                      />
                      <PrimaryButton
                        children={t('retry')}
                        classes={{ root: { backgroundColor: '#E84C3C' } }}
                        onClick={() => {
                          reset();
                        }}
                      />
                    </div>
                }
              </>
            )
          }
        </>
      }
      title={ModalTitle()}
    >
      {
        progressValue === 0 ?
          <>
            <div
              className={`${classes.uploadModalFileContainer}`}
              onDragEnter={preventDefault}
              onDragOver={preventDefault}
              onDrop={handleDrop}
              style={{ display: progressValue === 0 ? 'flex' : 'none' }}
            >
              <input
                mozdirectory={mode === 1 ? 1 : undefined}
                multiple
                onChange={handleOnChange}
                ref={fileInput}
                type="file"
                webkitdirectory={mode === 1 ? 1 : undefined}
              />
              {
                selectedFiles && selectedFiles.length !== 0 ?
                  <div className={`${classes.uploadModalSelected}`}>
                    {
                      selectedFiles.map(file => <p key={file.name + file.fullPath}>{file.webkitRelativePath || file.name}</p>)
                    }
                  </div>
                  :
                  <>
                    <div className={`${classes.uploadModalNonSelected}`}>
                      {
                        mode === 0 &&
                        <>
                          <p>{t('dragFileHere')}</p>
                          <p>{t('or')}</p>
                        </>
                      }
                      <DefaultButton
                        children={`${t('select')}${t('enSpace')}${mode ? t('Folders') : t('Files')}`}
                        onClick={() => {
                          fileInput.current.click();
                        }}
                      />
                    </div>
                  </>
              }
            </div>
            {/* <div className={styles.buttonContainer}>
              <DefaultButton
                children={t('cancel')}
                classes={{ root: classes.mr_10 }}
                onClick={() => {
                  reset();
                  onClose();
                }}
              />
              <PrimaryButton
                children={t('Upload')}
                disabled={progressValue !== 0}
                onClick={handleUpload}
              />
            </div> */}
          </>
          :
          <div className={`${classes.uploadModalProgressContainer}`}>
            <Progress
              value={progressValue}
            />
            {/* {
              uploadStatus === 'success' &&
                <div className="text-center">
                  <PrimaryButton
                    children={t('confirm')}
                    onClick={() => {
                      onClose();
                      reset();
                    }}
                  />
                </div>
            }
            {
              uploadStatus === 'error' &&
                <div className="text-center">
                  <DefaultButton
                    children={t('close')}
                    classes={{ root: classes.mr_10 }}
                    onClick={() => {
                      onClose();
                      reset();
                    }}
                  />
                  <PrimaryButton
                    children={t('retry')}
                    classes={{ root: { backgroundColor: '#E84C3C' } }}
                    onClick={() => {
                      reset();
                    }}
                  />
                </div>
            } */}
          </div>
      }
    </BaseModalNew>
  );
};

UploadModal.propTypes = {
  isOpen: PropTypes.bool,
  nfsName: PropTypes.string,
  onClose: PropTypes.func,
  mode: PropTypes.number,
  getFileList: PropTypes.func
}

export default UploadModal;
