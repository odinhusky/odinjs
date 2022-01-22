import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import BaseModal from 'components/BaseModal';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import Disk from './Disk';
import GPU from './GPU';
import CPU from './CPU';
import RAM from './Memory/Ram';
import SHM from './Memory/Shm';

import styles from './index.module.scss';

const Preview = ({ data = {}, isOpen, onClose, onSubmit, isXdfsEnabled }) => {

  // $ init data
  const { t } = useTranslation()

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${t('submit')}${t('job')}`}
    >
      <>
        <div
          style={{
            width: 580,
            display: 'flex',
            paddingBottom: 20
          }}
        >
          <div className={styles.container1}>
            <div className={styles.cell}>
              <Disk data={data.disk} />
            </div>
            <div className={classNames(styles.cell, styles.small)}>
              <div
                className={styles.normal}
                style={{ borderColor: '#B55108' }}
              >
                <p style={{ color: '#B55108' }}>NFS</p>
                <p><b>{isXdfsEnabled ? data.xdfs.toFixed(2) : data.nfs.toFixed(2)}</b>GB</p>
              </div>
            </div>
            <div
              className={classNames(styles.cell, styles.small)}
            >
              <div
                className={styles.normal}
                style={{ borderColor: '#FF7C43' }}
              >
                <p style={{ color: '#FF7C43' }}>Gluster FS</p>
                {
                  isXdfsEnabled
                    ?
                    <i
                      className={'fa fa-times'}
                      style={{ color: '#A19F9D' }}
                    />
                    :
                    <p><b>{data.glusterfs.toFixed(2)}</b>GB</p>
                }
              </div>
            </div>
            <div
              className={classNames(styles.cell, styles.small)}
            >
              <div
                className={styles.normal}
                style={{ borderColor: data.rdma ? '#0793D1' : '#A19F9D' }}
              >
                <p style={{ color: data.rdma ? '#0793D1' : '#A19F9D' }}>RDMA</p>
                <i
                  className={`fa fa-${data.rdma ? 'check' : 'times'}`}
                  style={{ color: data.rdma ? '#0793D1' : '#A19F9D' }}
                />
              </div>
            </div>
            <div className={classNames(styles.cell, styles.small)}>
              <CPU data={data.cpu} />
            </div>
            <div className={classNames(styles.cell, styles.gpu)}>
              <GPU data={data.gpu} />
            </div>
          </div>
          <RAM data={data.ram} />
          <SHM data={data.shm} />
        </div>
        <div
          style={{
            paddingTop: 20,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <DefaultButton
            children={t('cancel')}
            onClick={onClose}
            style={{ marginRight: 20 }}
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
  glusterfs: PropTypes.number,
  isXdfsEnabled: PropTypes.bool
}

export default Preview;