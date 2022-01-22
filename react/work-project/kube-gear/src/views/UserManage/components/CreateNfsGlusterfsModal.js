import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import BaseModal from 'components/BaseModal';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import MuiDropdown from 'components/BaseMuiDropdown';
import { BaseTextField } from 'components/BaseMuiInput';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Icon from '@material-ui/core/Icon';

import {
  getNfsDiskList, getGlusterfsVolume, getXdfsVolume,
  createNfs, createGlusterfs, createXdfs
} from 'utils/api';

import { toast } from 'react-toastify';

import Title from './Title';
import Context from '../utils/Context';

const useStyles = makeStyles(() => ({
  marginTop10: {
    marginTop: 10
  },
  width30: {
    width: '30%'
  },
  textField: {
    '& .MuiOutlinedInput-input' : {
      padding: 14
    }
  }
}))

const CreateNfsGlusterfsModal = ({ isOpen, onClose, whichStorageSetting }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { addDropDownOptionKeys, isXdfsEnabled } = useContext(Context);

  const [nfsDiskList, setNfsDiskList] = useState([]);
  const [glusterfsVolumes, setGlusterfsVolumes] = useState([]);
  const [xdfsVolumes, setXdfsVolumes] = useState([]);

  const [nfsMountArea, setNfsMountArea] = useState('');
  const [nfsSize, setNfsSize] = useState(0);
  const [glusterfsVolume, setGlusterfsVolume] = useState('');
  const [glusterfsSize, setGlusterfsSize] = useState(0);
  const [xdfsVolume, setXdfsVolume] = useState('');
  const [xdfsSize, setXdfsSize] = useState(0);

  const [isNfsCreating, setIsNfsCreating] = useState(false);
  const [nfsCreatSuccess, setNfsCreatSuccess] = useState(false);
  const [isGlusterfsCreating, setIsGlusterfsCreating] = useState(false);
  const [glusterfsCreatSuccess, setGlusterfsCreatSuccess] = useState(false);
  const [isXdfsCreating, setIsXdfsCreating] = useState(false);
  const [xdfsCreatSuccess, setXdfsCreatSuccess] = useState(false);

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

  const onSubmitXdfs = () => {
    setIsXdfsCreating(true)
    const { name } = whichStorageSetting
    const formData = {
      name: name,
      volume: xdfsVolume,
      size: xdfsSize,
      users: [name],
      canReadUsers: [],
      canWriteUsers: [],
      publicMode: 0
    };
    createXdfs(formData)
      .then(() => {
        setXdfsCreatSuccess(true)
        toast.success(`${t('add')}${t('enSpace')}${t('success')}`);
      })
      .catch(err => {
        toast.error(err?.data?.message ? err.data.message : err.toString());
      })
      .finally(() => setIsXdfsCreating(false))
  }

  useEffect(
    () => {
      if (isOpen) {
        Promise.all(
          isXdfsEnabled
            ? [getXdfsVolume()]
            : [getNfsDiskList(), getGlusterfsVolume()]
        )
          .then((data) => {
            if (isXdfsEnabled) {
              const [xdfsVolumes] = data
              setXdfsVolumes(xdfsVolumes)
            } else {
              const [nfsDiskList, volumes] = data
              setNfsDiskList(nfsDiskList);
              setGlusterfsVolumes(volumes);
            }
          })
          .catch(err => {
            toast.error(err?.data?.message ? err.data.message : err.toString());
          });
      }
    },
    [isOpen]
  );

  return (
    <BaseModal
      isOpen={isOpen}
      style={{ width: '500px', overflow: 'auto' }}
      title={`${t('setting')}${t('enSpace')}${t('storage')}`}
    >
      {
        whichStorageSetting.nfs &&
        <>
          <Title text={t('NFS')} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <MuiDropdown
              classes={{ root: `${classes.width30} ${classes.marginTop10}` }}
              list={addDropDownOptionKeys(nfsDiskList)}
              onChange={(e) => {
                const result = e.target.value;
                setNfsMountArea(result)
              }}
              text={`${t('mountArea')}`}
              value={nfsMountArea}
            />
            <BaseTextField
              classes={{ root: `${classes.width30} ${classes.marginTop10} ${classes.textField}` }}
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
                <div style={{ width: '30%', textAlign: 'center' }}>
                  <CircularProgress />
                </div>
                :
                nfsCreatSuccess
                  ?
                  <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', width: '30%' }}>
                    <Icon
                      color="primary"
                      component="div"
                      style={{ fontSize: '3.5rem' }}
                    >check_circle</Icon>
                  </div>
                  :
                  <PrimaryButton
                    children={t('add')}
                    classes={{ root: `${classes.width30}` }}
                    disabled={nfsMountArea === '' || nfsSize <= 0}
                    onClick={onSubmitNfs}
                  />
            }
          </div>
        </>
      }
      {
        whichStorageSetting.glusterfs &&
        <>
          <Title text={t('glusterfs')} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <MuiDropdown
              classes={{ root: `${classes.width30} ${classes.marginTop10}` }}
              list={addDropDownOptionKeys(glusterfsVolumes)}
              onChange={(e) => {
                const result = e.target.value;
                setGlusterfsVolume(result)
              }}
              text={`${t('PhysicalGlusterFS')}${t('enSpace')}${t('volumeGlusterFS')}`}
              value={glusterfsVolume}
            />
            <BaseTextField
              classes={{ root: `${classes.width30} ${classes.marginTop10} ${classes.textField}` }}
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
                <div style={{ width: '30%', textAlign: 'center' }}>
                  <CircularProgress />
                </div>
                :
                glusterfsCreatSuccess
                  ?
                  <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', width: '30%' }}>
                    <Icon
                      color="primary"
                      component="div"
                      style={{ fontSize: '3.5rem' }}
                    >check_circle</Icon>
                  </div>
                  :
                  <PrimaryButton
                    children={t('add')}
                    classes={{ root: `${classes.width30}` }}
                    disabled={glusterfsVolume === '' || glusterfsSize <= 0}
                    onClick={onSubmitGlusterfs}
                  />
            }
          </div>
        </>
      }
      {
        whichStorageSetting.xdfs &&
        <>
          <Title text={t('xdfs')} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <MuiDropdown
              classes={{ root: `${classes.width30} ${classes.marginTop10}` }}
              list={addDropDownOptionKeys(xdfsVolumes)}
              onChange={(e) => {
                const result = e.target.value;
                setXdfsVolume(result)
              }}
              text={`${t('PhysicalGlusterFS')}${t('enSpace')}${t('volumeGlusterFS')}`}
              value={xdfsVolume}
            />
            <BaseTextField
              classes={{ root: `${classes.width30} ${classes.marginTop10} ${classes.textField}` }}
              label={`${t('PhysicalGlusterFS')}${t('enSpace')}${t('volumeGlusterFS')}${t('enSpace')}${t('size')} (GB)`}
              onChange={(e) => {
                const value = e.target.value;
                setXdfsSize(value);
              }}
              type="number"
              value={xdfsSize}
            />
            {
              isXdfsCreating
                ?
                <div style={{ width: '30%', textAlign: 'center' }}>
                  <CircularProgress />
                </div>
                :
                xdfsCreatSuccess
                  ?
                  <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', width: '30%' }}>
                    <Icon
                      color="primary"
                      component="div"
                      style={{ fontSize: '3.5rem' }}
                    >check_circle</Icon>
                  </div>
                  :
                  <PrimaryButton
                    children={t('add')}
                    classes={{ root: `${classes.width30}` }}
                    disabled={xdfsVolume === '' || xdfsSize <= 0}
                    onClick={onSubmitXdfs}
                  />
            }
          </div>
        </>
      }
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
        <DefaultButton
          children={t('close')}
          disabled={isNfsCreating || isGlusterfsCreating || isXdfsCreating}
          onClick={() => {
            onClose();
          }}
        />
      </div>
    </BaseModal>
  )
}

CreateNfsGlusterfsModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  whichStorageSetting: PropTypes.object
}

export default CreateNfsGlusterfsModal

