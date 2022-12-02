
import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// # API
import { moveNfsFile, moveGlusterfsFile } from 'utils/api'

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

/**
 * @author odin
 * @level views/FsItemList/DetailPage/RenameModal
 * @component RenameModal Component
 * @description RenameModal to rename...
*/
function RenameModal({
  isOpen,
  onClose,
  selectedItem,
  fileList,
  nfsName,
  getFileList
}) {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const { isNFS, classes } = useContext(FsItemListContext);

  // # states
  const [newFileName, setNewFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // & handled data
  const isDisabled = !newFileName || errorMessage;

  // - methods
  const rename = () => {
    setIsLoading(true);
    const newPath = selectedItem.path.replace(selectedItem.name, newFileName)

    const moveFile = (isNFS ? moveNfsFile : moveGlusterfsFile)

    moveFile(nfsName, selectedItem.path, { targetPath: newPath })
      .then(() => {
        toast.success(`${t('rename')}${t('enSpace')}${t('success')}`);
        getFileList();
        onClose();
      })
      .catch(err => toast.error(err?.data ? err?.data?.message : err?.message))
      .finally(() => setIsLoading(false))
  };

  // * hooks
  useEffect(() => {
    setNewFileName(selectedItem.name)
  }, [selectedItem]);

  useEffect(() => {
    if (fileList.some(item => item.name === newFileName)) {
      setErrorMessage(t('duplicateName'))
    } else {
      setErrorMessage('');
    }
  }, [newFileName]);

  return (
    <BaseModalNew
      isOpen={isOpen}
      modalFoot={
        <>
          <DefaultButton
            children={t('close')}
            classes={{ root: classes.mr_10 }}
            onClick={onClose}
          />

          <PrimaryButton
            children={t('confirm')}
            disabled={isDisabled || isLoading}
            onClick={rename}
          />
        </>
      }
      onClose={onClose}
      title={t('rename')}
    >
      <BaseTextField
        className={`${classes.mt_20}`}
        error={errorMessage}
        helperText={errorMessage === '' ? '' : errorMessage}
        label={t('name')}
        onChange={(e) => {
          const value = e.target.value;
          setNewFileName(value);
        }}
        placeholder="example"
        required
        value={newFileName}
      />
    </BaseModalNew>
  );
}

RenameModal.propTypes = {
  fileList: PropTypes.array,
  isOpen: PropTypes.bool,
  nfsName: PropTypes.string,
  onClose: PropTypes.func,
  setFileList: PropTypes.func,
  selectedItem: PropTypes.object,
  getFileList: PropTypes.func
}

export default RenameModal;
