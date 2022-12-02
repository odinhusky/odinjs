import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef
} from 'react';

// # API
import {
  getNfsFilePath, getGlusterfsFilePath,
  downloadNfsFile, downloadGlusterfsFile,
  uploadNfsFile, uploadGlusterfsFile,
  copyNfsFile, copyGlusterfsFile,
  deleteNfsFile, deleteGlusterfsFile,
  unZipNfsFile, unZipGlusterFile
} from 'utils/api';

// ? context
import FsItemListContext from '../../FsItemListContext';
import GlobalContext from 'layouts/Main/GlobalContext';

// ^ Material-ui Componets(Functions)
import CircularProgress from '@material-ui/core/CircularProgress';

// ? Self-packed Components || Functions
import BaseMuiIcon from 'components/BaseMuiIcon';
import { PrimaryButton, DefaultButton, SplitButton } from 'components/BaseButton';
import ConfirmModal from 'components/ConfirmModal';
import MonacoPanel from 'components/monaco/monaco-panel';
import TopBar from './components/TopBar';
import BasePaper from 'components/BaseMuiPaper';
import LoadingDialog from 'components/LoadingDialog';
import NewFolderModal from './components/NewFolderModal';
import UploadModal from './components/UploadModal';
import PreviewImageModal from './components/PreviewImageModal';
import RenameModal from './components/RenameModal';
import DirectoryModal from './components/DirectoryModal';
import UploadRepository from './components/UploadRepository';
import RouterPrompt from 'components/BaseRouterPrompt';
import Ordering from './utils/Ordering';
import Filter from './utils/Filter';
import { formatBytes, checkUrlIsImage } from 'utils';
import { generateNewFileName } from './utils'

// - methods
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

const secondsToDhms = (seconds) => {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor(seconds % (3600 * 24) / 3600);
  var m = Math.floor(seconds % 3600 / 60);
  var s = Math.floor(seconds % 60);

  var dDisplay = d > 0 ? d + 'd ' : '';
  var hDisplay = h > 0 ? h + 'h ' : '';
  var mDisplay = m > 0 ? m + 'm ' : '';
  var sDisplay = s > 0 ? s + 's' : '';
  // return `${dDisplay !== '' ? `${dDisplay}d ` : ''}${hDisplay !== '' ? `${hDisplay}h ` : ''}${mDisplay !== '' ? `${mDisplay}m ` : ''}${sDisplay !== '' ? `${sDisplay}s ` : ''}`
  return dDisplay + hDisplay + mDisplay + sDisplay;
}

// ? styles
import { theme } from 'theme';

// ^ Plugins
import { Link, useParams, useHistory, useLocation } from 'react-router-dom';
import cookies from 'js-cookie';
// import moment from 'moment';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { WritableStream } from 'web-streams-polyfill/ponyfill';
import streamSaver from 'streamsaver';
// streamSaver.mitm = 'http://192.168.0.37:3000/assets/streamsaver/mitm.html';

/**
 * @author odin
 * @level views/FsItemList/DetailPage
 * @component DetailPage Component
 * @description DetailPage to show the detail of specific nfs item
*/
const DetailPage = ({ match }) => {

  // $ init data
  const { t } = useTranslation();
  const { path } = useParams();
  const history = useHistory();
  const location = useLocation();

  // ? context
  const {
    isNFS,
    fsList,
    pathTemp,
    setPathTemp,
    classes
  } = useContext(FsItemListContext);
  const { userInfo } = useContext(GlobalContext);
  let urlPath = location.pathname.split(`/${isNFS ? 'fs-item-list' : 'glusterfs-item-list'}/${path}`)[1]
  urlPath = urlPath ? urlPath : '/';

  // # states
  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [filter, setFilter] = useState(new Filter());
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadModalMode, setUploadModalMode] = useState(0);
  const [selectionDetail, setSelectionDetail] = useState([]);
  const [isWritable, setIsWritable] = useState(false);
  const [isUploadable, setIsUploadable] = useState(false);


  const [selfControllerArray, setSelfControllerArray] = useState([]);
  const [logProgressObject, setLogProgressObject] = useState({});

  const [fileResultsObject, setFileResultsObject] = useState({});

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [ordering, setOrdering] = useState(new Ordering());

  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoadingImg, setIsLoadingImg] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [imgName, setImgName] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [imgUrlCache, setImgUrlCache] = useState({});
  const [editorContent, setEditorContent] = useState('');
  const [currentFileInfo, setCurrentFileInfo] = useState({});
  const monaco = useRef(null);

  const [isBlocking, setIsBlocking] = useState(false);

  // columns id action state
  const [selectedItem, setSelectedItem] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUnzipModal, setShowUnzipModal] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDirectoryModalOpen, setIsDirectoryModalOpen] = useState(false);
  const [isUploadRepositoryModalOpen, setIsUploadRepositoryModalOpen] = useState(false);

  // - methods
  const create = ([name, result]) => {
    const newLink = document.createElement('a');
    const url = window.URL.createObjectURL(new Blob([result]));
    newLink.href = url;
    newLink.download = name;
    newLink.click();
    window.URL.revokeObjectURL(url);
  }

  // custom hook
  function useFetch(rootUrl, token, name, size) {
    let loading = false;
    let progress = 0;

    let chunks = [];
    let results = {};
    let errors = [];

    // let writer = null;

    let controller = null;

    if (!window.WritableStream) {
      streamSaver.WritableStream = WritableStream;
    }

    async function getData(options) {
      return _fetch('get', options);
    }

    async function _fetch(method, options) {
      _resetLocals();
      controller = new AbortController();
      const signal = controller.signal;
      loading = true;

      setSelfControllerArray((prev) => ([...prev, { name, controller }]))

      try {
        results = await fetchData();
      } catch (error) {
        errors.push(error);
      } finally {
        loading = false;
      }

      async function fetchData() {
        const response = await fetch(
          `${rootUrl}`,
          {
            method,
            signal,
            headers: {
              Authorization: `Bearer ${token}`
            },
            ...options
          }
        );
        const { status } = response;
        if (status >= 200 && status < 300) {
          const result = await _readBody(response);
          setFileResultsObject(prev => ({ ...prev, [name]: result }))
          setSelfControllerArray(prev => ([...prev.filter(item => item.name !== name)]))
          setLogProgressObject(prev => {
            const result = { ...prev }
            delete result[name]
            return result
          })
          // create(result)
          // const newLink = document.createElement('a');
          // const url = window.URL.createObjectURL(new Blob([result]));
          // newLink.href = url;
          // newLink.download = name;
          // newLink.click();
          // window.URL.revokeObjectURL(url);
        } else {
          setSelfControllerArray(prev => ([...prev.filter(item => item.name !== name)]))
          setLogProgressObject(prev => {
            const result = { ...prev }
            delete result[name]
            return result
          })
          throw new Error(await _readBody(response));
        }
      }
    }

    const _readBody = async (response) => {
      const reader = response.body.getReader();
      const contentLength = _getContentLength();
      // const contentDisposition = response.headers.get('Content-Disposition');
      // const fileName = contentDisposition.substring(contentDisposition.lastIndexOf('=') + 1);
      // const fileStream = createWriteStream(fileName);
      // writer = fileStream.getWriter();

      let received = 0;
      let lastProgressPercentage = 0;
      let lastStartDate = +new Date();

      // init
      setLogProgressObject((prev) => ({
        ...prev,
        [name]: {
          progress: 0,
          time: t('estimatedTimeOfCompletion')
        }
      }))

      // Loop through the response stream and extract data chunks
      while (loading === true) {
        const { done, value: dataChunk } = await reader.read();
        if (done) {
          _finishLoading();
          // writer.close()
        } else {
          _handleLoadingProgress(dataChunk);
          // writer.write(dataChunk)
        }
      }

      const body = _assembleResponseBody(received);
      // Decode the response and return it
      return body;

      function _getContentLength() {
        const hasContentLengthHeaders = response.headers.has('content-length');
        if (!hasContentLengthHeaders) {
          // console.warn(
          //   'Cannot calculate serverside payload size. To use the progress indicator, you must configure the "content-length" header on your serverside'
          // );
          // 從一開始打的 API getFile 來的
          return size;
        }
        return +response.headers.get('content-length');
      }

      function _finishLoading() {
        loading = false;
      }

      function _changeTimeTextByChunk(progress, lastProgressPercentage, nowDate, lastStartDate) {
        if (progress === 0) return t('estimatedTimeOfCompletion');
        const downloadPercentagePreSecond = ((progress - lastProgressPercentage) / (nowDate - lastStartDate)) * 1000
        const second = (( 1 - (progress.toFixed(2) / 100) ) * 100) / downloadPercentagePreSecond
        return `${t('remainTime')} ${secondsToDhms(Math.ceil(second))}`
      }

      function _handleLoadingProgress(dataChunk) {
        chunks.push(dataChunk);
        received += dataChunk.length;
        progress = (received * 100) / contentLength;

        const nowDate = +new Date;
        if ((nowDate - lastStartDate) > 1000) {
          setLogProgressObject((prev) => ({
            ...prev,
            [name]: {
              progress: contentLength === 0 ? 0 : progress.toFixed(2),
              time: _changeTimeTextByChunk(progress, lastProgressPercentage, nowDate, lastStartDate)
            }
          }))
          lastStartDate = nowDate
          lastProgressPercentage = progress.toFixed(2)
        }
      }

      function _assembleResponseBody(received) {
        const body = new Uint8Array(received);
        let position = 0;

        // Order the chunks by their respective position
        for (const chunk of chunks) {
          body.set(chunk, position);
          position += chunk.length;
        }
        return body;
      }
    }

    function _resetLocals() {
      loading = false;
      progress = 0;

      chunks = [];
      results = {};
      errors = [];

      controller = null;
    }

    function cancelRequest() {
      if (!controller) {
        throw new Error('Cannot cancel request - no AbortController was assigned');
      }
      controller.abort();
      return _resetLocals();
    }

    return { results, progress, errors, getData, cancelRequest }
  }

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
    let pathUrl = location.pathname.split(`/fs-item-list/${path}`)[1]
    pathUrl = pathUrl ? pathUrl : '/'
    formData.append('files', file)
    const uploadFile = (isNFS ? uploadNfsFile : uploadGlusterfsFile);
    uploadFile(path, pathUrl, formData)
      .then(() => {
        toast.success(`${t('save')}${t('success')}`)
        setIsEditorOpen(false);
      })
      .catch(err => toast.error(err.data ? err.data.message : err.message))
      .finally(() => setIsUploading(false))
  }

  const unZip = () => {
    setIsLoading(true);
    const fsItemNodePath = selectedItem.path;
    const unZipFile = (isNFS ? unZipNfsFile : unZipGlusterFile);
    unZipFile(path, fsItemNodePath)
      .then(() => {
        getFileList();
      })
      .catch(err => toast.error(err.data.message))
      .finally(() => setIsLoading(false))
  };

  const onDelete = () => {
    const fsItemNodePath = selectedItem.path;
    const { name } = selectedItem
    const deleteFile = (isNFS ? deleteNfsFile : deleteGlusterfsFile);

    deleteFile(path, fsItemNodePath)
      .then(() => {
        toast.success(`${t('delete')}${t('enSpace')}${t('success')}`);
        setFileList(data => data.filter(item => item.name !== name));
      })
      .catch(err => toast.error(err.data.message));
  };

  const applySortProps = column => {
    column.isSorted = ordering.field === column.id;
    column.isSortedDescending = ordering.descending;
    column.onColumnClick = (event, column) => {
      const { field, descending } = ordering;
      if (field === column) {
        if (descending) {
          setOrdering(new Ordering());
        } else {
          setOrdering(new Ordering(field, true));
        }
      } else {
        setOrdering(new Ordering(column));
      }
    }
    return column;
  }

  const getFileList = useCallback(() => {
    const name = path.includes('/') ? path.split('/')[0] : path;
    const filePath = location.pathname.substring(`/${isNFS ? 'fs-item-list' : 'glusterfs-item-list'}/${name}`.length + 1)

    setIsLoading(true);
    const getFilePath = isNFS ? getNfsFilePath : getGlusterfsFilePath

    getFilePath(name, filePath)
      .then(data => {
        setFileList(data.children)
        if (pathTemp) {
          setPathTemp(null);
        }
      })
      .catch(err => {
        if (err.data && err.data.code === 'ForbiddenUserError')
          history.push('/not-found')

        toast.error(err.data ? err.data.message : err.message)
      })
      .finally(() => setIsLoading(false))
  }, [path, location.pathname])

  const renderPath = () => {
    const fullLink = urlPath.split('/').slice(1).reduce((acc, curr) => {
      return [...acc, acc.length === 0 ? `/${curr}` : `${acc[acc.length - 1]}/${curr}`]
    }, [])

    return urlPath.split('/').slice(1).map((subPath, idx) => {
      return location.pathname === `${match.url}${fullLink[idx]}` ?
        <a
          className={`${classes.detailPageLinkStyle}`}
          key={idx}
          onClick={e => e.preventDefault}
        >
          /{subPath}
        </a>
        :
        <Link
          className={`${classes.detailPageLinkStyle}`}
          key={idx}
          to={`${match.url}${fullLink[idx]}`}
        >
          /{subPath}
        </Link>
    })
  }

  // * hooks
  useEffect(() => {
    const name = path.includes('/') ? path.split('/')[0] : path;
    if (!userInfo.username) return;

    const find = fsList.find(item => item.name === name);

    setIsUploadable(() => {
      if(!find) return false;

      return find.publicMode === 2 ||
        find.publicMode === 3 ||
        find.canUploadUsers.some(user => user === userInfo.username) ||
        find.canWriteUsers.some(user => user === userInfo.username)
    });

    setIsWritable(() => {
      if(!find) return false;

      return find.publicMode === 2 ||
        find.canWriteUsers.some(user => user === userInfo.username) ||
        find.users.some(user => user === userInfo.username)
    })
  }, [fsList, userInfo])

  useEffect(() => {
    getFileList()
  }, [location.pathname])

  useEffect(() => {
    if (isEmpty(fileResultsObject) || isBlocking) return
    if (Object.keys(fileResultsObject).length > 0 && !isBlocking) {
      const namesArray = [];
      for (let i = 0; i < Object.keys(fileResultsObject).length; i++) {
        create(Object.entries(fileResultsObject)[i])
        namesArray.push(Object.entries(fileResultsObject)[i][0])
      }
      setFileResultsObject(prev => {
        const result = { ...prev }
        for (let i = 0; i < namesArray.length ; i++) {
          delete result[namesArray[i]]
        }
        return result
      })
    }
  }, [isBlocking, fileResultsObject])

  return (
    <>
      <p className={`${classes.detailPageBreadCrumb}`}>
        {
          location.pathname === `/${(isNFS ? 'fs-item-list' : 'glusterfs-item-list')}/${path}`
            ?
            <a
              className={`${classes.detailPageLinkStyle}`}
              onClick={e => e.preventDefault}
            >
              {path}
            </a>
            :
            <Link
              className={`${classes.detailPageLinkStyle}`}
              to={`/${(isNFS ? 'fs-item-list' : 'glusterfs-item-list')}/${path}`}
            >
              {path}
            </Link>
        }
        {renderPath()}
      </p>
      <TopBar
        filter={filter}
        getFileList={getFileList}
        isLoading={isLoading}
        isUploadable={isUploadable}
        isWritable={isWritable}
        nfsName={path}
        selectionDetail={selectionDetail}
        setFileList={setFileList}
        setFilter={setFilter}
        setIsFolderModalOpen={setIsFolderModalOpen}
        setIsLoading={setIsLoading}
        setIsUploadModalOpen={setIsUploadModalOpen}
        setPage={setPage}
        setSelectionDetail={setSelectionDetail}
        setUploadModalMode={setUploadModalMode}
      />
      <div className={`${classes.flexGrow1} ${classes.overflowHidden}`}>
        <BasePaper
          columns={[
            applySortProps({
              id: 'name',
              key: 'name',
              label: t('name'),
              onTableCellRender: (fsItemNode) => {
                const fsItemNodePath = fsItemNode.path;
                const { name, type, mime } = fsItemNode;
                const downloadFile = isNFS ? downloadNfsFile : downloadGlusterfsFile

                const generateColor = (mime) => {
                  const mimeType = mime.split(';')[0]
                  if (mimeType.includes('inode/directory')) {
                    return '#006eb8'
                  } else if (mimeType.includes('application/x-tar') || mimeType.includes('application/zip') || mimeType.includes('vnd.debian.binary-package')) {
                    return '#de372b'
                  } else if (mimeType.includes('application/x-sh')) {
                    return '#39b54a'
                  } else if (mimeType.includes('audio')) {
                    return '#2cb5e9'
                  } else if (mimeType.includes('image')) {
                    return '#762671'
                  } else if (mimeType.includes('text')) {
                    return theme.themePrimary
                  } else {
                    return '#333333'
                  }
                }

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
                  downloadFile(path, fsItemNodePath)
                    .then(res => {
                      const reader = new FileReader();
                      reader.onload = () => {
                        setEditorContent(reader.result)
                      }
                      reader.readAsText(new Blob([res]))
                      setIsEditorOpen(true);
                      setCurrentFileInfo({ fsItemNodePath, name })
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
                  setPage(0)

                  history.push(`${destination}/${name}`);
                }

                // Unregistered case
                if (['file', 'directory', 'link'].indexOf(type) < 0) {
                  return (null);
                }

                const handleClick = (type === 'file')
                  ? onClickFile
                  : (type === 'link') ? onClickFile : onClickDir;

                const showIcon = (type) => {
                  const style = { marginRight: 10 }
                  const customImgStyle = { marginRight: 10, width: '1.5rem', height: '1.5rem' }
                  if (type === 'file') {
                    return (<BaseMuiIcon style={style}>description</BaseMuiIcon>)
                  } else if (type === 'folder') {
                    return (<BaseMuiIcon style={style}>folder</BaseMuiIcon>)
                  } else if (type === 'link') {
                    return (
                      <img
                        src="/assets/img/file_shortcut.svg"
                        style={customImgStyle}
                      />
                    )
                  } else {
                    return
                  }
                }

                // TODO: check file can edit
                const buttonStyle = {
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: generateColor(mime)
                };

                const handlePreview = () => {
                  if (imgUrlCache[name]) {
                    setImgUrl(imgUrlCache[name])
                    setImgName(name)
                  } else {
                    setIsLoadingImg(true)
                    downloadFile(path, fsItemNodePath)
                      .then(data => {
                        const url = window.URL.createObjectURL(data)
                        setImgUrl(url)
                        setImgName(name)
                        setImgUrlCache(prev => ({ ...prev, [name]: url }))
                      })
                      .catch(err => toast.error(err?.data ? err?.data?.message : err?.message))
                      .finally(() => setIsLoadingImg(false))
                  }

                  setIsPreviewModalOpen(true)
                }

                // TODO: https://en.wikipedia.org/wiki/ANSI_escape_code#Colors
                // #006eb8 Blue Directory
                // #39b54a Green Executable or recognized data file
                // #2cb5e9 Cyan Symbolic link file / Audio File
                // #ffc706 Yellow Device
                // #762671 Magenta Graphic image file
                // #de372b Red Archive file

                return (
                  <a
                    href={null}
                    onClick={handleClick}
                    style={buttonStyle}
                  >
                    {showIcon(type)}
                    {name}
                  </a>
                );
              }
            }),
            applySortProps({
              id: 'size',
              key: 'size',
              label: `${t('size')}`,
              onTableCellRender: (fsItemNode) => formatBytes(fsItemNode.size)
            }),
            {
              id: 'action',
              key: 'action',
              label: t('Operations'),
              onTableCellRender: (fsItemNode) => {
                const fsItemNodePath = fsItemNode.path;
                const { type, name, mime, size } = fsItemNode;
                const isDownloadable = type === 'file';
                const isLink = type === 'link';

                const downloadFileReq = isNFS ? downloadNfsFile : downloadGlusterfsFile

                const downloadFileTest = async () => {
                  const token = cookies.get('token');
                  const { getData } = useFetch(`${window.ENV.restServerUri}/api/v2${`/${isNFS ? 'nfs' : 'glusterfs'}/${path}/file${fsItemNodePath}?download=true`}`, token, name, size)
                  await getData()
                }

                const editFile = () => {
                  setIsDownloading(true)
                  downloadFileReq(path, fsItemNodePath)
                    .then(res => {
                      const reader = new FileReader();
                      reader.onload = () => {
                        setEditorContent(reader.result)
                      }
                      reader.readAsText(new Blob([res]))
                      setIsEditorOpen(true);
                      setCurrentFileInfo({ fsItemNodePath, name })
                    })
                    .catch(err => toast.error(err.data ? err.data.message : err.message))
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
                  const newFileName = generateNewFileName(fsItemNodePath, fileList, type)
                  const copyFileReq = (isNFS ? copyNfsFile : copyGlusterfsFile);

                  copyFileReq(path, fsItemNodePath, { targetPath: newFileName })
                    .then(() => {
                      getFileList();
                      toast.success(`${t('clone')}${t('enSpace')}${t('success')}`)
                    })
                    .catch(err => toast.error(err.data ? err.data.message : err.message))
                    .finally(() => setIsDownloading(false));
                }

                return (
                  isDownloading
                    ? <CircularProgress />
                    :
                    <>
                      {
                        isWritable ?
                          <SplitButton
                            classNameObj={{
                              left: classes.text_transform_none
                            }}
                            disabled={!isDownloadable}
                            onClick={() => {
                              if (selfControllerArray.find(item => item.name === name)) {
                                selfControllerArray.find(item => item.name === name).controller.abort()
                                setSelfControllerArray(prev => ([...prev.filter(item => item.name !== name)]))
                                setLogProgressObject(prev => {
                                  const result = { ...prev }
                                  delete result[name]
                                  return result
                                })
                              } else {
                                downloadFileTest()
                              }
                            }}
                            options={[
                              {
                                id: 'rename',
                                label: t('rename'),
                                handleItemclick: () => {
                                  setSelectedItem(fsItemNode);
                                  setIsRenameModalOpen(true);
                                },
                                disabled: logProgressObject[name] !== undefined,
                                style: isLink ? { display: 'none' } : {},
                                icon: <BaseMuiIcon style={{ marginRight: '10px' }}>auto_fix_high</BaseMuiIcon>
                              },
                              {
                                id: 'move',
                                label: t('move'),
                                handleItemclick: () => {
                                  setSelectedItem(fsItemNode)
                                  setIsDirectoryModalOpen(true)
                                },
                                disabled: logProgressObject[name] !== undefined,
                                style: isLink ? { display: 'none' } : {},
                                icon: <BaseMuiIcon style={{ marginRight: '10px' }}>drive_file_move</BaseMuiIcon>
                              },
                              {
                                id: 'copy',
                                label: t('clone'),
                                handleItemclick: copyFile,
                                disabled: logProgressObject[name] !== undefined,
                                style: isLink ? { display: 'none' } : {},
                                icon: <BaseMuiIcon style={{ marginRight: '10px' }}>content_copy</BaseMuiIcon>
                              },
                              {
                                id: 'edit',
                                label: t('edit'),
                                disabled: !isDownloadable || (logProgressObject[name] !== undefined),
                                handleItemclick: editFile,
                                style: !isDownloadable ? { display: 'none' } : {},
                                icon: <BaseMuiIcon style={{ marginRight: '10px' }}>edit</BaseMuiIcon>
                              },
                              {
                                disabled: !isXtar(mime) || (logProgressObject[name] !== undefined),
                                id: 'UploadRepositories',
                                label: t('UploadRepositories'),
                                handleItemclick: () => {
                                  setSelectedItem(fsItemNode)
                                  setIsUploadRepositoryModalOpen(true)
                                },
                                style: !isXtar(mime) ? { display: 'none' } : {},
                                icon: <BaseMuiIcon style={{ marginRight: '10px' }}>publish</BaseMuiIcon>
                              },
                              {
                                id: 'delete',
                                label: t('delete'),
                                disabled: logProgressObject[name] !== undefined,
                                iconProps: { iconName: 'Delete', styles: { root: { color: '#333333' } } },
                                icon: <BaseMuiIcon style={{ marginRight: '10px' }}>delete</BaseMuiIcon>,
                                handleItemclick: deleteFile
                              },
                              {
                                disabled: !canUnzip(name),
                                id: 'unzip',
                                label: t('unzip'),
                                iconProps: { iconName: 'ZipFolder', styles: { root: { color: '#333333' } } },
                                handleItemclick: unZipFile,
                                style: !canUnzip(name) ? { display: 'none' } : {},
                                icon: <BaseMuiIcon style={{ marginRight: '10px' }}>outbox</BaseMuiIcon>
                              }
                            ]}
                            // split
                            startIcon={
                              selfControllerArray.find(item => item.name === name)
                                ? <BaseMuiIcon>cancel</BaseMuiIcon>
                                : <BaseMuiIcon>file_download</BaseMuiIcon>
                            }
                            text={
                              selfControllerArray.find(item => item.name === name)
                                ?
                                logProgressObject[name] === undefined ? t('cancel') : `${t('cancel')} ${logProgressObject[name].progress} % ${logProgressObject[name].time}`
                                : t('download')
                            }
                          />
                          :
                          <DefaultButton
                            children={
                              selfControllerArray.find(item => item.name === name)
                                ?
                                logProgressObject[name] === undefined ? t('cancel') : `${t('cancel')} ${logProgressObject[name].progress} % ${logProgressObject[name].time}`
                                : t('download')
                            }
                            disabled={!isDownloadable}
                            onClick={() => {
                              if (selfControllerArray.find(item => item.name === name)) {
                                selfControllerArray.find(item => item.name === name).controller.abort()
                                setSelfControllerArray(prev => ([...prev.filter(item => item.name !== name)]))
                                setLogProgressObject(prev => {
                                  const result = { ...prev }
                                  delete result[name]
                                  return result
                                })
                              } else {
                                downloadFileTest()
                              }
                            }}
                            startIcon={
                              selfControllerArray.find(item => item.name === name)
                                ? <BaseMuiIcon>cancel</BaseMuiIcon>
                                : <BaseMuiIcon>file_download</BaseMuiIcon>
                            }
                          />
                      }
                    </>
                )
              }
            }
          ]}
          itemChecked
          itemCheckedAllChange={(e, checked, rows) => {
            if (checked) {
              setSelectionDetail(rows)
            } else {
              setSelectionDetail([])
            }
          }}
          itemCheckedChange={(e, checked, row) => {
            if (checked) {
              setSelectionDetail(prev => ([...prev, row]))
            } else {
              setSelectionDetail(prev => ([...prev].filter(selected => selected.name !== row.name)))
            }
          }}
          itemCheckedData={selectionDetail}
          labelRowsPerPage={t('labelRowsPerPage')}
          ordering={ordering}
          page={page}
          rows={filter.apply(ordering.apply(fileList))}
          rowsPerPage={rowsPerPage}
          selectionMode={0}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>
      {
        isFolderModalOpen &&
        <NewFolderModal
          fileList={fileList}
          isOpen={isFolderModalOpen}
          nfsName={path}
          onClose={() => setIsFolderModalOpen(false)}
          setFileList={setFileList}
        />
      }

      {
        isUploadModalOpen &&
        <UploadModal
          getFileList={getFileList}
          isOpen={isUploadModalOpen}
          mode={uploadModalMode}
          nfsName={path}
          onClose={() => setIsUploadModalOpen(false)}
          setFileList={setFileList}
        />
      }

      {
        isEditorOpen &&
        <MonacoPanel
          customFooterRightNode={
            isWritable &&
            <PrimaryButton
              children={t('save')}
              disabled={isUploading}
              onClick={handleFileSave}
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
      }

      {
        isPreviewModalOpen &&
        <PreviewImageModal
          isLoading={isLoadingImg}
          isOpen={isPreviewModalOpen}
          name={imgName}
          onClose={() => setIsPreviewModalOpen(false)}
          url={imgUrl}
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
      {
        isRenameModalOpen &&
        <RenameModal
          fileList={fileList}
          getFileList={getFileList}
          isOpen={isRenameModalOpen}
          nfsName={path}
          onClose={() => setIsRenameModalOpen(false)}
          selectedItem={selectedItem}
        />
      }
      <DirectoryModal
        fileList={fileList}
        getFileList={getFileList}
        isOpen={isDirectoryModalOpen}
        nfsName={path}
        onClose={() => setIsDirectoryModalOpen(false)}
        selectedItem={selectedItem}
      />
      {
        isUploadRepositoryModalOpen &&
        <UploadRepository
          isOpen={isUploadRepositoryModalOpen}
          nfsName={path}
          onClose={() => {
            setIsUploadRepositoryModalOpen(false)
          }}
          selectedItem={selectedItem}
        />
      }

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

      <LoadingDialog
        isOpen={isDownloading}
        subText={t('wait')}
        title={'Loading'}
      />

      <RouterPrompt
        content={t('promptStopFileDownloadMessage')}
        isBlockCondition={() => {
          if (selfControllerArray.length !== 0) {
            return true
          } else {
            return false
          }
        }}
        isOpen={isBlocking}
        onCancel={() => {
          setIsBlocking(false)
        }}
        onOK={() => {
          selfControllerArray.forEach(item => {
            item.controller.abort()
          })
          return true
        }}
        setIsBlocking={setIsBlocking}
      />
      {/* <Prompt
        message={(location, action) =>{
          console.log(location, action)
          return `${t('promptStopFileDownloadMessage')}`
        }}
        when={isBlocking}
      /> */}

    </>
  )
}

DetailPage.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}


export default DetailPage