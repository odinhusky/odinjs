
import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import { DefaultButton, SplitButton } from 'components/BaseButton';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import MuiDropdown from 'components/BaseMuiDropdown';
import ConfirmModal from 'components/ConfirmModal';
import LoadingDialog from 'components/LoadingDialog';
import BaseLink from 'components/BaseLink';

import {
  // downloadNfsFile, downloadGlusterfsFile, downloadXdfsFile,
  deleteNfsFile, deleteGlusterfsFile, deleteXdfsFile
} from 'utils/api';

import Context from '../../../Context';
import Filter from '../utils/Filter';

import styles from './TopBar.module.scss';

import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { last } from 'lodash';
import clsx from 'clsx';

const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  },
  marginLeft10: {
    marginLeft: 10
  },
  heightAuto: {
    height: 'auto'
  }
}))

function TopBar({ filter, setFilter, getFileList, setIsFolderModalOpen, setIsUploadModalOpen, setUploadModalMode, setSelectionDetail, selectionDetail, nfsName, isLoading, setIsLoading, setFileList, isWritable }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const location = useLocation();
  const { isNFS, isXdfsEnabled, setPathTemp } = useContext(Context);
  const [selectedValue, setSelectedValue] = useState(0)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isShowHiddenFile, setIsShowHiddenFile] = useState(false);

  const options = [
    { key: 0, text: t('allShow'), optionkey: 0 },
    { key: 1, text: t('Files'), data: { icon: 'Document' }, optionkey: 1 },
    { key: 2, text: t('Folders'), data: { icon: 'FolderHorizontal' }, optionkey: 2 }
  ]

  const selectionLength = selectionDetail ? selectionDetail.length : 0
  // const canDownload = selectionLength > 0 && !selectionDetail.some(item => item.type !== 'file')

  // const handleDownload = () => {
  //   setIsLoading(true)
  //   const downloadFile = isXdfsEnabled ? downloadXdfsFile : (isNFS ? downloadNfsFile : downloadGlusterfsFile)

  //   Promise.all(
  //     selectionDetail.map(item => downloadFile(nfsName, item.path))
  //   )
  //     .then(res => {
  //       res.forEach((item, idx) => {
  //         const newLink = document.createElement('a');
  //         const url = window.URL.createObjectURL(new Blob([item]));
  //         newLink.href = url;
  //         newLink.download = selectionDetail[idx] ? selectionDetail[idx].name : 'file';
  //         newLink.click();
  //       })
  //     })
  //     .catch(err => toast.error('Error:' + err.data ? err.data : err.message))
  //     .finally(() => setIsLoading(false))
  // }

  const handleDelete = () => {
    setIsLoading(true)

    const deleteFile = isXdfsEnabled ? deleteXdfsFile : isNFS ? deleteNfsFile : deleteGlusterfsFile

    Promise.all(
      selectionDetail.map(item => deleteFile(nfsName, item.path))
    )
      .then(() => {
        toast.success(`${t('delete')}${t('enSpace')}${t('success')}`);
        setFileList(list => list.filter(item => !selectionDetail.some(el => el.name === item.name)))
        setSelectionDetail([])
      })
      .catch(err => toast.error('Error:' + err.data ? err.data : err.message))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    // 換頁清空關鍵字
    const { types, checked } = filter;
    setFilter(new Filter('', types, checked));
  }, [location.pathname])

  return (
    <React.Fragment>
      <div className={styles.container}>
        <div className={styles.left}>
          {
            isWritable &&
            <SplitButton
              onClick={() => {
                if (isLoading) return;
                setIsUploadModalOpen(true)
                setUploadModalMode(0)
              }}
              options={[
                {
                  id: 'uploadFolder',
                  label: `${t('Upload')}${t('enSpace')}${t('Folders')}`,
                  onClick: () => {
                    if (isLoading) return;
                    setIsUploadModalOpen(true)
                    setUploadModalMode(1)
                  },
                  icon: <Icon style={{ marginRight: '10px' }}>drive_folder_upload</Icon>
                },
                {
                  id: 'createFolder',
                  label: `${t('add')}${t('enSpace')}${t('Folders')}`,
                  onClick: () => {
                    if (isLoading) return;
                    setIsFolderModalOpen(true)
                  },
                  icon: <Icon style={{ marginRight: '10px' }}>create_new_folder</Icon>
                }
              ]}
              startIcon={<Icon>upload_file</Icon>}
              text={`${t('Upload')}${t('enSpace')}${t('Files')}`}
            />
          }
          <DefaultButton
            children={t('refresh')}
            classes={{ root:
              clsx(classes.marginRight10, {
                [classes.marginLeft10]: isWritable
              })
            }}
            disabled={isLoading}
            onClick={getFileList}
            startIcon={<Refresh />}
          />
          {/* <DefaultButton
            children={t('download')}
            classes={{ root: classes.marginRight10 }}
            disabled={isLoading || !canDownload}
            onClick={handleDownload}
            startIcon={<Icon>file_download</Icon>}
          /> */}
          {
            isWritable &&
            <DefaultButton
              children={t('delete')}
              classes={{ root: `${classes.marginRight10} ${classes.marginLeft10}` }}
              disabled={isLoading || (selectionLength === 0)}
              onClick={() => setShowDeleteModal(true)}
              startIcon={<Icon>delete_outline</Icon>}
            />
          }
          <BaseLink
            style={{ padding: 0 }}
            to="/job-submit"
          >
            <DefaultButton
              children={`${t('submit')}${t('enSpace')}${t('job')}`}
              disabled={isLoading}
              startIcon={<Icon>add_circle</Icon>}
            />
          </BaseLink>
        </div>
        <div className={styles.right}>
          <BaseLink
            style={{ padding: 0 }}
            to={location.pathname.split('/').slice(0, -1).join('/')}
          >
            <DefaultButton
              children={t('back')}
              onClick={() => setPathTemp(last(location.pathname.split('/')))}
              startIcon={<Icon>arrow_back</Icon>}
            />
          </BaseLink>
        </div>
      </div>
      {
        showDeleteModal &&
        <ConfirmModal
          confrimText={t('delete')}
          content={t('sureDelete', { name: selectionDetail.map(item => item.name).join(', ') })}
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title={`${t('delete')}${t('enSpace')}${t('file')}`}
        />
      }
      <div className={styles.container}>
        <div className={styles.left}>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={isShowHiddenFile}
                  name="checkedFiles"
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const { keyword, types } = filter;
                    setIsShowHiddenFile(checked)
                    setFilter(new Filter(keyword, types, checked));
                  }}
                />
              }
              label={t('showHiddenFile')}
            />
          </FormGroup>
        </div>
        <div className={styles.right}>
          <MuiAutocomplete
            classes={{ root: `${classes.marginRight10} ${classes.heightAuto}` }}
            onInputChange={(e, value) => {
              const { types } = filter;

              setFilter(new Filter(value, types, isShowHiddenFile));
            }}
            placeholder={`${t('search')}${t('enSpace')}${t('name')}`}
            value={filter.keyword}
          />
          <MuiDropdown
            list={options}
            maxWidth={150}
            onChange={(e, child) => {
              setSelectedValue(child.props.optionkey);
              const { keyword } = filter;
              let newSet;
              switch (child.props.optionkey) {
                case 0:
                default:
                  newSet = new Set(['file', 'directory']);
                  break;
                case 1:
                  newSet = new Set(['file']);
                  break;
                case 2:
                  newSet = new Set(['directory']);
                  break;
              }
              setFilter(new Filter(keyword, newSet, isShowHiddenFile));
            }}
            selectProps={{
              defaultValue: {}
            }}
            text={`${t('select')}${t('enSpace')}${t('type')}`}
            value={options.find(item => item.optionkey === selectedValue).text}
          />
        </div>
      </div>
      <LoadingDialog
        isOpen={isLoading}
        title={'Loading'}
      />
    </React.Fragment>
  );
}

TopBar.propTypes = {
  filter: PropTypes.object,
  getFileList: PropTypes.func,
  setFilter: PropTypes.func,
  setIsFolderModalOpen: PropTypes.func,
  setIsUploadModalOpen: PropTypes.func,
  setUploadModalMode: PropTypes.func,
  selectionDetail: PropTypes.array,
  nfsName: PropTypes.string,
  isLoading: PropTypes.bool,
  setIsLoading: PropTypes.func,
  setFileList: PropTypes.func,
  isWritable: PropTypes.bool,
  setPathTemp: PropTypes.func,
  setSelectionDetail: PropTypes.func
}

export default TopBar;
