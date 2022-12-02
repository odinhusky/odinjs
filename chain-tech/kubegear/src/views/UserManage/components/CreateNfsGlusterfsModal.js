import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// # API
import {
  getNfsDiskList, getGlusterfsVolume,
  createNfs, createGlusterfs
} from 'utils/api';

// ? context
import UserManageContext from '../UserManageContext';

// ^ Material-ui Componets(Functions)
import CircularProgress from '@material-ui/core/CircularProgress';
import Icon from '@material-ui/core/Icon';

// ? Self-packed Components || Functions
// import BaseModal from 'components/BaseModal';
import BaseModalNew from 'components/BaseModalNew';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import MuiDropdown from 'components/BaseMuiDropdown';
import { BaseTextField } from 'components/BaseMuiInput';
import Title from './Title';

// ^ Plugin
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

/**
 * @author odin
 * @level views/UserManage/CreateNfsGlusterfsModal
 * @component CreateNfsGlusterfsModal
 * @description CreateNfsGlusterfsModal component
*/
const CreateNfsGlusterfsModal = ({
  isOpen,
  onClose,
  whichStorageSetting
}) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const { addDropDownOptionKeys, classes } = useContext(UserManageContext);

  // # states
  const [nfsDiskList, setNfsDiskList] = useState([]);
  const [glusterfsVolumes, setGlusterfsVolumes] = useState([]);

  const [nfsMountArea, setNfsMountArea] = useState('');
  const [nfsSize, setNfsSize] = useState(0);
  const [glusterfsVolume, setGlusterfsVolume] = useState('');
  const [glusterfsSize, setGlusterfsSize] = useState(0);

  const [isNfsCreating, setIsNfsCreating] = useState(false);
  const [nfsCreatSuccess, setNfsCreatSuccess] = useState(false);
  const [isGlusterfsCreating, setIsGlusterfsCreating] = useState(false);
  const [glusterfsCreatSuccess, setGlusterfsCreatSuccess] = useState(false);

  // - methods
  const onSubmitNfs = () => {
    setIsNfsCreating(true)
    const { name } = whichStorageSetting
    const formData = {
      name: name,
      nfsDisk: nfsMountArea,
      size: nfsSize,
      users: [name],
      canReadUsers: [],
      canWriteUsers: [],
      publicMode: 0
    };
    createNfs(formData)
      .then(() => {
        setNfsCreatSuccess(true)
        toast.success(`${t('add')}${t('enSpace')}${t('success')}`);
      })
      .catch(err => {
        toast.error(err?.data?.message ? err.data.message : err.toString());
      })
      .finally(() => setIsNfsCreating(false))
  }

  const onSubmitGlusterfs = () => {
    setIsGlusterfsCreating(true)
    const { name } = whichStorageSetting
    const formData = {
      name: name,
      volume: glusterfsVolume,
      size: glusterfsSize,
      users: [name],
      canReadUsers: [],
      canWriteUsers: [],
      publicMode: 0
    };
    createGlusterfs(formData)
      .then(() => {
        setGlusterfsCreatSuccess(true)
        toast.success(`${t('add')}${t('enSpace')}${t('success')}`);
      })
      .catch(err => {
        toast.error(err?.data?.message ? err.data.message : err.toString());
      })
      .finally(() => setIsGlusterfsCreating(false))
  }

  // * hooks
  useEffect(
    () => {
      if (isOpen) {
        Promise.all([getNfsDiskList(), getGlusterfsVolume()])
          .then((data) => {
            const [nfsDiskList, volumes] = data
            setNfsDiskList(nfsDiskList);
            setGlusterfsVolumes(volumes);
          })
          .catch(err => {
            toast.error(err?.data?.message ? err.data.message : err.toString());
          });
      }
    },
    [isOpen]
  );

  return (
    <BaseModalNew
      classNameObj={{
        modalContainer: `${classes.userManageModalContainer} ${classes.h_auto}`
      }}
      isOpen={isOpen}
      modalFoot={
        <>
          <DefaultButton
            children={t('close')}
            disabled={isNfsCreating || isGlusterfsCreating}
            onClick={() => {
              onClose();
            }}
          />
          {
            (whichStorageSetting.nfs
              && isNfsCreating === false
              && nfsCreatSuccess === false) && (
              <PrimaryButton
                children={t('add')}
                classes={{ root: `${classes.width30}` }}
                classNameProps={`${classes.ml_10}`}
                disabled={nfsMountArea === '' || nfsSize <= 0}
                onClick={onSubmitNfs}
              />
            )
          }

          {
            (whichStorageSetting.glusterfs
              && isGlusterfsCreating === false
              && glusterfsCreatSuccess === false) && (
              <PrimaryButton
                children={t('add')}
                classes={{ root: `${classes.width30}` }}
                classNameProps={`${classes.ml_10}`}
                disabled={glusterfsVolume === '' || glusterfsSize <= 0}
                onClick={onSubmitGlusterfs}
              />
            )
          }
        </>
      }
      onClose={onClose}
      size="sm"
      title={`${t('setting')}${t('enSpace')}${t('storage')}`}
    >
      {
        whichStorageSetting.nfs &&
        <>
          <Title text={t('NFS')} />
          <div className={`${classes.flex_wrap} ${classes.flex_justify_between}`}>
            <MuiDropdown
              classes={{ root: `${classes.width30}` }}
              list={addDropDownOptionKeys(nfsDiskList)}
              onChange={(e) => {
                const result = e.target.value;
                setNfsMountArea(result)
              }}
              text={`${t('mountArea')}`}
              value={nfsMountArea}
            />
            <BaseTextField
              classes={{ root: `${classes.width30} ${classes.mt_24} ${classes.createNfsGlusterfsModalTextField}` }}
              label={`${t('mountArea')}${t('size')} (GB)`}
              onChange={(e) => {
                const value = e.target.value;
                setNfsSize(value);
              }}
              type="number"
              value={nfsSize}
            />
            {
              isNfsCreating
                ?
                <div className={`${classes.w_30} ${classes.text_center} ${classes.mt_10}`}>
                  <CircularProgress />
                </div>
                :
                nfsCreatSuccess
                  ?
                  <div className={`${classes.flex_align_center} ${classes.w_30} ${classes.text_center} ${classes.mt_10}`}>
                    <Icon
                      color="primary"
                      component="div"
                      style={{ fontSize: '3.5rem' }}
                    >check_circle</Icon>
                  </div>
                  :
                  null
            }
          </div>
        </>
      }
      {
        whichStorageSetting.glusterfs &&
        <>
          <Title text={t('glusterfs')} />
          <div className={`${classes.flex_wrap} ${classes.flex_justify_between}`}>
            <MuiDropdown
              classes={{ root: `${classes.width30}` }}
              list={addDropDownOptionKeys(glusterfsVolumes)}
              onChange={(e) => {
                const result = e.target.value;
                setGlusterfsVolume(result)
              }}
              text={`${t('PhysicalGlusterFS')}${t('enSpace')}${t('volumeGlusterFS')}`}
              value={glusterfsVolume}
            />
            <BaseTextField
              classes={{ root: `${classes.width30} ${classes.mt_24} ${classes.textField}` }}
              label={`${t('PhysicalGlusterFS')}${t('enSpace')}${t('volumeGlusterFS')}${t('enSpace')}${t('size')} (GB)`}
              onChange={(e) => {
                const value = e.target.value;
                setGlusterfsSize(value);
              }}
              type="number"
              value={glusterfsSize}
            />
            {
              isGlusterfsCreating
                ?
                <div className={`${classes.w_30} ${classes.text_center} ${classes.mt_10}`}>
                  <CircularProgress />
                </div>
                :
                glusterfsCreatSuccess
                  ?
                  <div className={`${classes.flex_align_center} ${classes.w_30} ${classes.text_center} ${classes.mt_10}`}>
                    <Icon
                      color="primary"
                      component="div"
                      style={{ fontSize: '3.5rem' }}
                    >check_circle</Icon>
                  </div>
                  :
                  null
            }
          </div>
        </>
      }
    </BaseModalNew>
  )
}

CreateNfsGlusterfsModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  whichStorageSetting: PropTypes.object
}

export default CreateNfsGlusterfsModal

