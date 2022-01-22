import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../index.module.scss';
import BasePanel from 'components/BasePanel';
import NFSMount from './NFSMount';
import Context from '../../Context';

const StorageSetting = () => {
  const { t } = useTranslation();
  const {
    isXdfsEnabled,
    nfsInfo, nfsMounts,
    glusterfsInfo, glusterfsMounts,
    xdfsInfo, xdfsMounts,
    setNfsMountsState, setGlusterfsMountsState, setXdfsMountsState
  } = useContext(Context);
  return (
    <BasePanel
      style={{ marginTop: 20 }}
      title={
        <div style={{ fontSize: 18, fontWeight: 'bold' }}>{t('storageSetting')}</div>
      }
    >
      <div className={styles.formContent}>
        {
          isXdfsEnabled
            ?
            <NFSMount
              hint={t('toolTipsNFS')}
              keyField="name"
              keyName={t('name')}
              keyOptions={xdfsInfo.map(nfs => ({ key: nfs, text: nfs }))}
              name="NFS List"
              nfsMounts={xdfsMounts}
              onChange={setXdfsMountsState}
              title={t('xdfs')}
              valueField="mountPoint"
              valueName={t('mountPoint')}
            />
            :
            <>
              <NFSMount
                hint={t('toolTipsNFS')}
                keyField="name"
                keyName={t('name')}
                keyOptions={nfsInfo.map(nfs => ({ key: nfs, text: nfs }))}
                name="NFS List"
                nfsMounts={nfsMounts}
                onChange={setNfsMountsState}
                title={t('NFS')}
                valueField="mountPoint"
                valueName={t('mountPoint')}
              />
              <NFSMount
                hint={t('toolTipsNFS')}
                keyField="name"
                keyName={t('name')}
                keyOptions={glusterfsInfo.map(nfs => ({ key: nfs, text: nfs }))}
                name="GlusterFS List"
                nfsMounts={glusterfsMounts}
                onChange={setGlusterfsMountsState}
                title={t('glusterfs')}
                valueField="mountPoint"
                valueName={t('volumeGlusterFS')}
              />
            </>
        }
      </div>
    </BasePanel>
  );
};

export default StorageSetting;