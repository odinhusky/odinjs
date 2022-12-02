import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext
} from 'react';

// # API
import { createNfsDisk } from 'utils/api';

// ? context
import NFSDiskListContext from '../../../NFSDiskListContext';

// ^ Material-ui Components(Functions)
import CircularProgress from '@material-ui/core/CircularProgress';

// ? Self-packed Components || Functions
import MuiDropdown from 'components/BaseMuiDropdown';
import BaseModalNew from 'components/BaseModalNew';
import { BaseTextField } from 'components/BaseMuiInput';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

/**
 * @author odin
 * @level views/NFSDiskList/IndexPage/CreateModal
 * @component CreateModal
 * @description CreateModal modal
*/
function CreateModal({ isOpen, onClose }) {

  // $ init data
  const { t } = useTranslation();
  const rules = {
    required: value => (value ? '' : t('fieldRequired'))
  };

  // ? context
  const {
    hostList,
    getNfsDiskList,
    nfsDiskList,
    classes
  } = useContext(NFSDiskListContext);

  // # states
  const [nfsDiskName, setNfsDiskName] = useState('');
  const [nfsDiskHost, setNfsDiskHost] = useState('');
  const [nfsDiskPath, setNfsDiskPath] = useState('');
  const [isNameError, setIsNameError] = useState('');
  const [isPathError, setIsPathError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // - methods
  const hosts = useMemo(
    () => hostList.map((host, index) => ({ key: index, text: host })),
    [hostList]
  );

  const onCreate = useCallback(
    () => {
      setIsCreating(true);
      if (nfsDiskList.some(disk => disk.name === nfsDiskName)) {
        setIsNameError(t('duplicateName'))
        setIsCreating(false);
        return
      }
      const formData = {
        name: nfsDiskName,
        host: nfsDiskHost,
        path: nfsDiskPath
      };
      createNfsDisk(formData)
        .then(() => {
          getNfsDiskList();
          onClose();
          setIsCreating(false);
          setNfsDiskHost('');
          setNfsDiskName('');
          setNfsDiskPath('');
          toast.success(`${t('add')}${t('enSpace')}${t('success')}`);
        })
        .catch(err => {
          const msg = err.data.message ? err.data.message : err.toString();
          toast.error(msg);
          setIsCreating(false);
        });
    },
    [nfsDiskName, nfsDiskHost, nfsDiskPath]
  );

  // * hooks
  useEffect(
    () => {
      if (isOpen) {
        setIsCreating(false);
      }
    },
    [isOpen]
  );

  return (
    <BaseModalNew
      isOpen={isOpen}
      modalFoot={
        <>
          <DefaultButton
            children={t('close')}
            classes={{
              root: classes.mr_10,
              startIcon: classes.ml_0
            }}
            disabled={isCreating}
            onClick={() => {
              setNfsDiskName('');
              setNfsDiskHost('');
              setNfsDiskPath('');
              onClose();
            }}
          />
          {
            isCreating
              ? <CircularProgress />
              :
              <PrimaryButton
                children={t('confirm')}
                disabled={isCreating || (!nfsDiskName || !nfsDiskHost || !nfsDiskPath)}
                onClick={onCreate}
              />
          }
        </>
      }
      onClose={onClose}
      size="sm"
      title={`${t('add')}${t('enSpace')}${t('mount')}`}
    >
      <BaseTextField
        classes={{ root: classes.mb_20 }}
        error={isNameError}
        helperText={isNameError === '' ? '' : isNameError}
        label={t('name')}
        onChange={(e) => {
          const value = e.target.value;
          setNfsDiskName(value);
          const checkField = rules.required(value);
          setIsNameError(checkField)
        }}
        required
        type="text"
      />
      <MuiDropdown
        classes={{ root: classes.mb_20 }}
        list={hosts}
        onChange={(e) => {
          const value = e.target.value
          setNfsDiskHost(value);
        }}
        selectProps={{
          required: true
        }}
        text={t('mount')}
        value={nfsDiskHost}
      />
      <BaseTextField
        classes={{ root: classes.mb_20 }}
        error={isPathError}
        helperText={isPathError === '' ? '' : isPathError}
        label={t('path')}
        onChange={(e) => {
          const value = e.target.value;
          setNfsDiskPath(value);
          const checkField = rules.required(value);
          setIsPathError(checkField)
        }}
        required
        type="text"
      />
    </BaseModalNew>
  );
}

CreateModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default CreateModal;
