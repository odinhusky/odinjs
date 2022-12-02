/* eslint-disable react/no-multi-comp */
import React, { useState, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PrimaryButton, CommandBarButton, DefaultButton } from 'components/BaseButton';
import { Label, Spinner, SpinnerSize, mergeStyles, Icon, Link } from 'office-ui-fabric-react';
import { downloadNfsFile, deleteNfsFile, unZipNfsFile, uploadNfsFile, copyNfsFile,
  downloadGlusterfsFile, deleteGlusterfsFile, unZipGlusterFile, uploadGlusterfsFile, copyGlusterfsFile } from 'utils/api';
import { toast } from 'react-toastify';
import Ordering from '../utils/Ordering';
import { formatBytes, checkUrlIsImage } from 'utils';
import { generateNewFileName } from '../utils'
import { theme } from 'theme';

import BaseTable from 'components/BaseTable'
import ConfirmModal from 'components/ConfirmModal';
import PreviewImageModal from './PreviewImageModal';
import RenameModal from './RenameModal';
import DirectoryModal from './DirectoryModal';
import UploadRepository from './UploadRepository';
import MonacoPanel from 'components/monaco/monaco-panel';
import { isEqual } from 'lodash';
import FsItemListContext from '../../../FsItemListContext';
import LoadingDialog from 'components/LoadingDialog';

const canUnzip = path => {
  return (
    path.endsWith('.tar.gz') ||
    path.endsWith('.tgz') ||
    path.endsWith('.tar.bz2') ||
    path.endsWith('.tar') ||
    path.endsWith('.zip')
  );
};

const isXtar = path => {
  return (
    path.includes('application/x-tar')
  )
}

const Table = React.memo(({ nfsName, isLoading, fileList, setFileList, setIsLoading, getFileList, selection, isWritable }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { isNFS } = useContext(FsItemListContext);
  const [isDownloading, setIsDownloading] = useState(false);
  const [ordering, setOrdering] = useState(new Ordering());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUnzipModal, setShowUnzipModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [imgName, setImgName] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [imgUrlCache, setImgUrlCache] = useState({});
  const [isLoadingImg, setIsLoadingImg] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [currentFileInfo, setCurrentFileInfo] = useState({});
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDiretoryModalOpen, setIsDiretoryModalOpen] = useState(false);
  const [isUploadRepositoryModalOpen, setIsUploadRepositoryModalOpen] = useState(false);
  const monaco = useRef(null);

  const _closeEditor = () => {
    setIsEditorOpen(false);

    // Change to the default theme
    monaco.current.editor.setTheme('vs');
  };

  const handleFileSave = () => {
    setIsUploading(true);
    const blob = new Blob([editorContent], {
      type : 'text/plain'
    });
    const file = new File([blob], currentFileInfo.name, { type: 'text/plain' })
    const formData = new FormData();
    let path = location.pathname.split(`/fs-item-list/${nfsName}`)[1]
    path = path ? path : '/'
    formData.append('files', file)
    const uploadFile = isNFS ? uploadNfsFile : uploadGlusterfsFile;
    uploadFile(nfsName, path, formData)
      .then(() => {
        toast.success(`${t('save')}${t('success')}`)
        setIsEditorOpen(false);
      })
      .catch(err => toast.error(err.data ? err.data.message : err.message))
      .finally(() => setIsUploading(false))
  }

  function applySortProps(column) {
    column.isSorted = ordering.field === column.key;
    column.isSortedDescending = ordering.descending;
    column.onColumnClick = (event, column) => {
      const { field, descending } = ordering;
      if (field === column.key) {
        if (descending) {
          setOrdering(new Ordering());
        } else {
          setOrdering(new Ordering(field, true));
        }
      } else {
        setOrdering(new Ordering(column.key));
      }
    };
    return column;
  }

  const unZip = () => {
    setIsLoading(true);
    const { path } = selectedItem
    const unZipFile = isNFS ? unZipNfsFile : unZipGlusterFile;
    unZipFile(nfsName, path)
      .then(() => {
        getFileList();
      })
      .catch(err => toast.error(err.data.message))
      .finally(() => setIsLoading(false))
  };

  const onDelete = () => {
    const { name, path } = selectedItem
    const deleteFile = isNFS ? deleteNfsFile : deleteGlusterfsFile;

    deleteFile(nfsName, path)
      .then(() => {
        toast.success(`${t('delete')}${t('enSpace')}${t('success')}`);
        setFileList(data => data.filter(item => item.name !== name));
      })
      .catch(err => toast.error(err.data.message));
  };

  /* May view XXColumn as React Component
   * by replacing return (...) with onRender(..){return ...}
   */
  const nameColumn = applySortProps({
    key: 'name',
    name: t('name'),
    isResizable: true,
    minWidth: 300,
    maxWidth: 500,
    onRender(fsItemNode) {
      const { name, type, path, mime } = fsItemNode;
      const downloadFile = isNFS ? downloadNfsFile : downloadGlusterfsFile
      /**
       * @param {React.MouseEvent} event
       */
      function onClickFile(event) {
        event.stopPropagation();
        if (checkUrlIsImage(name)) {
          handlePreview();
          return;
        }
        if (!mime.includes('text')) {
          return;
        }

        // TODOS: check file can edit
        setIsDownloading(true);

        downloadFile(nfsName, path)
          .then(res => {
            const reader = new FileReader();
            reader.onload = () => {
              setEditorContent(reader.result)
            }
            reader.readAsText(new Blob([res]))
            setIsEditorOpen(true);
            setCurrentFileInfo({ path, name })
          })
          .finally(() => setIsDownloading(false));

        return;
      }

      /**
       * @param {React.MouseEvent} event
       */
      function onClickDir(event) {
        event.stopPropagation();
        const destination = history.location.pathname;

        history.push(`${destination}/${name}`);
      }

      // Unregistered case
      if (['file', 'directory'].indexOf(type) < 0) {
        return (null);
      }

      const disabled = false;
      const handleClick = (type === 'file') ? onClickFile : onClickDir;
      const iconName = (type === 'file') ? 'Document' : 'FabricFolderFill';

      // TODOS: check file can edit
      const buttonStyle = {
        display: 'flex',
        alignItems: 'center',
        color: (type === 'file' && (!checkUrlIsImage(name) && !mime.includes('text'))) ? '#333333' : theme.themePrimary
      };

      const handlePreview = () => {
        if (imgUrlCache[name]) {
          setImgUrl(imgUrlCache[name])
          setImgName(name)
        } else {
          setIsLoadingImg(true)

          downloadFile(nfsName, path)
            .then(data => {
              const url = window.URL.createObjectURL(data)
              setImgUrl(url)
              setImgName(name)
              setImgUrlCache(prev => ({ ...prev, [name]: url }))
            })
            .catch(err => toast.error('Error' + err.data ? err.data.message : err.message))
            .finally(() => setIsLoadingImg(false))
        }

        setIsPreviewModalOpen(true)
      }
      return (
        <>
          <Link
            disabled={disabled}
            href={null}
            onClick={handleClick}
            style={buttonStyle}
          >
            <Icon
              iconName={iconName}
              style={{ marginRight: 10, fontSize: 16 }}
            />
            {name}
          </Link>
        </>
      );
    }
  });

  const sizeColumn = applySortProps({
    key: 'size',
    minWidth: 200,
    maxWidth: 200,
    name: `${t('size')}`,
    fieldName: 'size',
    isResizable: true,
    onRender(fsItemNode) {
      return <Label>{formatBytes(fsItemNode.size)}</Label>;
    }
  });

  const actionColumn = {
    key: 'action',
    name: t('Operations'),
    onRender(fsItemNode) {
      const { type, path, name, mime } = fsItemNode
      const isDownloadable = type === 'file';
      const downloadFileReq = isNFS ? downloadNfsFile : downloadGlusterfsFile

      const downloadFile = () => {
        setIsDownloading(true)
        downloadFileReq(nfsName, path)
          .then(res => {
            const newLink = document.createElement('a');
            const url = window.URL.createObjectURL(new Blob([res]));
            newLink.href = url;
            newLink.download = name;
            newLink.click();
            window.URL.revokeObjectURL(url);
          })
          .catch(err => toast.error('Error:' + err.data ? err.data.message : err.message))
          .finally(() => setIsDownloading(false));
      }

      const editFile = () => {
        setIsDownloading(true)
        downloadFileReq(nfsName, path)
          .then(res => {
            const reader = new FileReader();
            reader.onload = () => {
              setEditorContent(reader.result)
            }
            reader.readAsText(new Blob([res]))
            setIsEditorOpen(true);
            setCurrentFileInfo({ path, name })
          })
          .catch(err => toast.error('Error:' + err.data ? err.data.message : err.message))
          .finally(() => setIsDownloading(false));
      }

      const deleteFile = () => {
        setSelectedItem(fsItemNode);
        setShowDeleteModal(true);
      }

      const unZipFile = () => {
        setSelectedItem(fsItemNode);
        setShowUnzipModal(true);
      }

      const copyFile = () => {
        setIsDownloading(true)
        const newFileName = generateNewFileName(path, fileList, type)
        const copyFileReq = isNFS ? copyNfsFile : copyGlusterfsFile;

        copyFileReq(nfsName, path, { targetPath: newFileName })
          .then(() => {
            getFileList();
            toast.success(`${t('clone')}${t('enSpace')}${t('success')}`)
          })
          .catch(err => toast.error('Error:' + err.data ? err.data.message : err.message))
          .finally(() => setIsDownloading(false));
      }

      return (
        isDownloading ?
          <Spinner
            className={mergeStyles({ alignItems: 'flex-start' })}
            size={SpinnerSize.small}
          />
          :
          <>
            {
              isWritable ?
                <CommandBarButton
                  disabled={isDownloading}
                  iconProps={{
                    iconName: 'Download'
                  }}
                  menuProps={{
                    items: [
                      {
                        key: 'rename',
                        text: t('rename'),
                        iconProps: { iconName: 'Rename', styles: { root: { color: '#333333' } } },
                        onClick() {
                          setSelectedItem(fsItemNode);
                          setIsRenameModalOpen(true);
                        }
                      },
                      {
                        key: 'move',
                        text: t('move'),
                        iconProps: { iconName: 'MoveToFolder', styles: { root: { color: '#333333' } } },
                        onClick() {
                          setSelectedItem(fsItemNode)
                          setIsDiretoryModalOpen(true)
                        }
                      },
                      {
                        key: 'copy',
                        text: t('clone'),
                        iconProps: { iconName: 'Copy', styles: { root: { color: '#333333' } } },
                        onClick: copyFile
                      },
                      {
                        key: 'edit',
                        text: t('edit'),
                        disabled: !isDownloadable,
                        iconProps: { iconName: 'Edit', styles: { root: { color: '#333333' } } },
                        onClick: editFile,
                        style: !isDownloadable ? { display: 'none' } : {}
                      },
                      {
                        disabled: !isXtar(mime),
                        key: 'UploadRepositories',
                        text: t('UploadRepositories'),
                        iconProps: { iconName: 'Upload', styles: { root: { color: '#333333' } } },
                        onClick: () => {
                          setSelectedItem(fsItemNode)
                          setIsUploadRepositoryModalOpen(true)
                        },
                        style: !isXtar(mime) ? { display: 'none' } : {}
                      },
                      {
                        key: 'delete',
                        text: t('delete'),
                        iconProps: { iconName: 'Delete', styles: { root: { color: '#333333' } } },
                        onClick: deleteFile
                      },
                      {
                        disabled: !canUnzip(name),
                        key: 'unzip',
                        text: t('unzip'),
                        iconProps: { iconName: 'ZipFolder', styles: { root: { color: '#333333' } } },
                        onClick: unZipFile,
                        style: !canUnzip(name) ? { display: 'none' } : {}
                      }
                    ]
                  }}
                  onClick={downloadFile}
                  primaryDisabled={!isDownloadable}
                  split
                  text={t('download')}
                />
                :
                <DefaultButton
                  iconProps={{
                    iconName: 'Download'
                  }}
                  onClick={downloadFile}
                  text={t('download')}
                />
            }
          </>
      )
    }
  }

  const columns = [
    nameColumn,
    sizeColumn,
    actionColumn
  ]

  return (
    <>
      <BaseTable
        checkboxVisibility={1}
        columns={columns}
        enableShimmer={isLoading}
        items={ordering.apply(fileList)}
        key={'set'}
        selection={selection}
        selectionMode={2}
        selectionPreservedOnEmptyClick
      />
      {
        showDeleteModal &&
        <ConfirmModal
          confrimText={t('delete')}
          content={t('sureDelete', { name: selectedItem.name })}
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={onDelete}
          title={`${t('delete')}${t('enSpace')}${t('file')}`}
        />
      }
      {
        showUnzipModal &&
        <ConfirmModal
          confrimText={t('unzip')}
          content={t('unzipWillOverwriteFile')}
          isOpen={showUnzipModal}
          onClose={() => setShowUnzipModal(false)}
          onConfirm={unZip}
          title={t('unzip')}
        />
      }
      <PreviewImageModal
        isLoading={isLoadingImg}
        isOpen={isPreviewModalOpen}
        name={imgName}
        onClose={() => setIsPreviewModalOpen(false)}
        url={imgUrl}
      />
      {
        isRenameModalOpen &&
        <RenameModal
          fileList={fileList}
          getFileList={getFileList}
          isOpen={isRenameModalOpen}
          nfsName={nfsName}
          onClose={() => setIsRenameModalOpen(false)}
          selectedItem={selectedItem}
        />
      }
      <DirectoryModal
        fileList={fileList}
        getFileList={getFileList}
        isOpen={isDiretoryModalOpen}
        nfsName={nfsName}
        onClose={() => setIsDiretoryModalOpen(false)}
        selectedItem={selectedItem}
      />
      {
        isUploadRepositoryModalOpen &&
        <UploadRepository
          isOpen={isUploadRepositoryModalOpen}
          nfsName={nfsName}
          onClose={() => {
            setIsUploadRepositoryModalOpen(false)
          }}
          selectedItem={selectedItem}
        />
      }
      <MonacoPanel
        customFooterRightNode={
          isWritable &&
          <PrimaryButton
            disabled={isUploading}
            onClick={handleFileSave}
            text={t('save')}
          />
        }
        isOpen={isEditorOpen}
        monacoProps={{
          language: 'markdown',
          options: { wordWrap: 'on', readOnly: false },
          value: editorContent,
          onChange(text) {
            setEditorContent(text);
          }
        }}
        monacoRef={monaco}
        onDismiss={_closeEditor}
        title="File Editor"
      />
      <LoadingDialog
        isOpen={isDownloading}
        subText={t('wait')}
        title={'Loading'}
      />
    </>
  )
}, (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps)
})

Table.propTypes = {
  fileList: PropTypes.array,
  getFileList: PropTypes.func,
  isLoading: PropTypes.bool,
  nfsName: PropTypes.string,
  setFileList: PropTypes.func,
  setIsLoading: PropTypes.func,
  selection: PropTypes.object,
  isWritable: PropTypes.bool
}

export default Table