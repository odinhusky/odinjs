
import React, {
  useState,
  useContext,
  useEffect
} from 'react';

// # API
import {
  // downloadNfsFile, downloadGlusterfsFile,
  deleteNfsFile, deleteGlusterfsFile
} from 'utils/api';

// ? context
import FsItemListContext from '../../../FsItemListContext';

// ^ Material-ui Componets(Functions)
import { Refresh } from '@material-ui/icons';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

// ? Self-packed Components || Functions
import BaseMuiIcon from 'components/BaseMuiIcon';
import { DefaultButton, SplitButton } from 'components/BaseButton';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import MuiDropdown from 'components/BaseMuiDropdown';
import ConfirmModal from 'components/ConfirmModal';
import LoadingDialog from 'components/LoadingDialog';
import BaseLink from 'components/BaseLink';
import Filter from '../utils/Filter';

// ^ Plugins
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { last } from 'lodash';
import clsx from 'clsx';

/**
 * @author odin
 * @level views/FsItemList/DetailPage/TopBar
 * @component TopBar Component
 * @description DetailPage's TopBar Component
*/
function TopBar({
  filter,
  setFilter,
  getFileList,
  setIsFolderModalOpen,
  setIsUploadModalOpen,
  setUploadModalMode,
  setSelectionDetail,
  selectionDetail,
  nfsName,
  isLoading,
  setIsLoading,
  setFileList,
  isUploadable,
  isWritable,
  setPage
}) {

  // $ init data
  const { t } = useTranslation();
  const location = useLocation();
  const selectionLength = selectionDetail ? selectionDetail.length : 0;
  const options = [
    { key: 0, text: t('allShow'), optionkey: 0 },
    { key: 1, text: t('Files'), data: { icon: 'Document' }, optionkey: 1 },
    { key: 2, text: t('Folders'), data: { icon: 'FolderHorizontal' }, optionkey: 2 }
  ]

  // ? context
  const {
    isNFS,
    setPathTemp,
    classes
  } = useContext(FsItemListContext);

  // # states
  const [selectedValue, setSelectedValue] = useState(0)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isShowHiddenFile, setIsShowHiddenFile] = useState(false);

  // - methods
  const handleDelete = () => {
    setIsLoading(true)

    const deleteFile = isNFS ? deleteNfsFile : deleteGlusterfsFile

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

  // * hooks
  useEffect(() => {
    // 換頁清空關鍵字
    const { types, checked } = filter;
    setFilter(new Filter('', types, checked));
  }, [location.pathname])

  return (
    <React.Fragment>
      <div className={`${classes.flex_center} ${classes.mb_10}`}>
        <div className={`${classes.d_flex}`}>
          {
            (isUploadable || isWritable) &&
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
                  icon: (
                    <BaseMuiIcon
                      children="drive_folder_upload"
                      className={`${classes.mr_10}`}
                    />
                  )
                },
                {
                  disabled: !isWritable,
                  id: 'createFolder',
                  label: `${t('add')}${t('enSpace')}${t('Folders')}`,
                  onClick: () => {
                    if (isLoading) return;
                    setIsFolderModalOpen(true)
                  },
                  icon: (
                    <BaseMuiIcon
                      children="create_new_folder"
                      className={`${classes.mr_10}`}
                    />
                  )
                }
              ]}
              startIcon={
                <BaseMuiIcon
                  children="upload_file"
                  className={`${classes.mr_10}`}
                />
              }
              text={`${t('Upload')}${t('enSpace')}${t('Files')}`}
            />
          }
          <DefaultButton
            children={t('refresh')}
            classes={{ root:
              clsx(classes.mr_10, {
                [classes.ml_10]: isUploadable
              })
            }}
            disabled={isLoading}
            onClick={getFileList}
            startIcon={<Refresh />}
          />
          {/* <DefaultButton
            children={t('download')}
            classes={{ root: classes.mr_10 }}
            disabled={isLoading || !canDownload}
            onClick={handleDownload}
            startIcon={<Icon>file_download</Icon>}
          /> */}
          {
            isWritable &&
            <DefaultButton
              children={t('delete')}
              classes={{ root: `${classes.mr_10} ${classes.ml_10}` }}
              disabled={isLoading || (selectionLength === 0)}
              onClick={() => setShowDeleteModal(true)}
              startIcon={<BaseMuiIcon children="delete_outline" />}
            />
          }

          <BaseLink
            className={`${classes.p_0}`}
            to="/job-submit"
          >
            <DefaultButton
              children={`${t('submit')}${t('enSpace')}${t('job')}`}
              disabled={isLoading}
              startIcon={<BaseMuiIcon children="add_circle" />}
            />
          </BaseLink>
        </div>
        <div className={`${classes.d_flex} ${classes.ml_auto}`}>
          <BaseLink
            style={{ padding: 0 }}
            to={location.pathname.split('/').slice(0, -1).join('/')}
          >
            <DefaultButton
              children={t('back')}
              onClick={() => {
                if (
                  location.pathname.split('/').slice(0, -1).join('/') !== '/fs-item-list'
                ) {
                  setPage(0)
                }
                setPathTemp(last(location.pathname.split('/')))
              }}
              startIcon={<BaseMuiIcon children="arrow_back" />}
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
      <div className={`${classes.flex_center} ${classes.mb_10}`}>
        <div className={`${classes.d_flex}`}>
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
        <div className={`${classes.d_flex} ${classes.ml_auto}`}>
          <MuiAutocomplete
            classes={{ root: `${classes.mr_10} ${classes.h_auto}` }}
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
  isUploadable: PropTypes.bool,
  isWritable: PropTypes.bool,
  setPathTemp: PropTypes.func,
  setSelectionDetail: PropTypes.func,
  setPage: PropTypes.func
}

export default TopBar;
