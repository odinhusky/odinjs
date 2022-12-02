
import React, {
  useState,
  useContext
} from 'react';

// # API
import { createNfsFolder, createGlusterfsFolder } from 'utils/api';

// ? context
import FsItemListContext from '../../../FsItemListContext';

// ? Self-packed Components || Functions
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import { BaseTextField } from 'components/BaseMuiInput';
import BaseModalNew from 'components/BaseModalNew';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

/**
 * @author odin
 * @level views/FsItemList/DetailPage/NewFolderModal
 * @component NewFolderModal Component
 * @description DetailPage's NewFolderModal Component
*/
function NewFolderModal({
  isOpen,
  onClose,
  nfsName,
  fileList,
  setFileList
}) {

  // $ init data
  const { t } = useTranslation();
  const location = useLocation();

  // ? context
  const { isNFS, classes } = useContext(FsItemListContext);

  // # states
  const [dirInCreation, setDirInCreation] = useState(null);

  // - methods
  const createDir = () => {
    if (fileList.find(n => n.name === dirInCreation && n.type === 'directory')) {
      toast.error(t('folderIsExist'));
      return;
    }

    let path = location.pathname.split(`/${isNFS ? 'fs-item-list' : 'glusterfs-item-list'}/${nfsName}`)[1]
    path = path ? path : '/'

    const createFolder = (isNFS ? createNfsFolder : createGlusterfsFolder);

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
    <BaseModalNew
      isOpen={isOpen}
      modalFoot={
        <>
          <DefaultButton
            children={t('close')}
            classes={{ root: classes.mr_10 }}
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
        </>
      }
      onClose={onClose}
      title={`${t('add')}${t('enSpace')}${t('Folders')}`}
    >
      <BaseTextField
        classes={{ root: classes.mt_20 }}
        label={t('name')}
        onChange={(e) => {
          const value = e.target.value;
          setDirInCreation(value);
        }}
        required
        type="text"
        value={dirInCreation}
      />
    </BaseModalNew>
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
