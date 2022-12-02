import React from 'react';

// ? Self-packed Components || Functions
import BaseModal from 'components/BaseModal';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import Disk from './Disk';
import GPU from './GPU';
import CPU from './CPU';
import RAM from './Memory/Ram';
import SHM from './Memory/Shm';

// ? styles
import { makeStyles } from '@material-ui/core/styles'
import commonStyle from 'common/commonStyles'

const useStyles = makeStyles((theme) => {
  return {
    ...commonStyle(theme)
  }});

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const Preview = ({
  data = {},
  isOpen,
  onClose,
  onSubmit
}) => {

  // $ init data
  const { t } = useTranslation()

  // = styles
  const classes = useStyles();

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${t('submit')}${t('job')}`}
    >
      <>
        <div
          className={`${classes.step5PreviewModalBox}`}
        >
          <div className={`${classes.step5PreviewModalContainer}`}>
            <div className={`${classes.step5PreviewModalCell}`}>
              <Disk data={data.disk} />
            </div>
            <div className={`${classes.step5PreviewModalCell} ${classes.step5PreviewModalSmall}`}>
              <div
                className={`${classes.step5PreviewModalNormal} ${classes.step5PreviewModalNFSBorderColor}`}
              >
                <p className={`${classes.step5PreviewModalNFSBorderColor}`}>NFS</p>

                <p><b>{data.nfs.toFixed(2)}</b>GB</p>
              </div>
            </div>
            <div
              className={`${classes.step5PreviewModalCell} ${classes.step5PreviewModalSmall}`}
            >
              <div
                className={`${classes.step5PreviewModalNormal} ${classes.step5PreviewModalGlusterFSBorderColor}`}
              >
                <p className={`${classes.step5PreviewModalGlusterFSBorderColor}`}>Gluster FS</p>
                <p><b>{data.glusterfs.toFixed(2)}</b>GB</p>
              </div>
            </div>
            <div
              className={`${classes.step5PreviewModalCell} ${classes.step5PreviewModalSmall}`}
            >
              <div
                className={`${classes.step5PreviewModalNormal} ${
                  data.rdma
                    ? classes.step5PreviewModalRDMABorderColor
                    : classes.step5PreviewModalWithoutRDMABorderColor
                }`}
              >
                <p
                  className={`${
                    data.rdma
                      ? classes.step5PreviewModalRDMABorderColor
                      : classes.step5PreviewModalWithoutRDMABorderColor
                  }`}
                >
                  RDMA
                </p>
                <i
                  className={`fa fa-${data.rdma ? 'check' : 'times'} ${
                    data.rdma
                      ? classes.step5PreviewModalRDMAColor
                      : classes.step5PreviewModalWithoutRDMAColor
                  }`}
                />
              </div>
            </div>
            <div className={`${classes.step5PreviewModalCell} ${classes.step5PreviewModalSmall}`}>
              <CPU data={data.cpu} />
            </div>
            <div className={`${classes.step5PreviewModalCell} ${classes.step5PreviewModalGPU}`}>
              <GPU data={data.gpu} />
            </div>
          </div>
          <RAM data={data.ram} />
          <SHM data={data.shm} />
        </div>
        <div
          className={`${classes.pt_20} ${classes.flex_justify_end}`}
        >
          <DefaultButton
            children={t('close')}
            className={`${classes.mr_20}`}
            onClick={onClose}
          />
          <PrimaryButton
            children={t('submit')}
            onClick={onSubmit}
          />
        </div>
      </>
    </BaseModal>
  );
};

Preview.propTypes = {
  data: PropTypes.object,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  nfs: PropTypes.number,
  glusterfs: PropTypes.number
}

export default Preview;