import React, { useContext } from 'react';

// ? context
import Context from '../../Context';

// ? Self-packed Components || Functions
import BasePanel from 'components/BasePanel';
import StorageMount from './StorageMount';

// ^ Plugin
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/ManageTemplate/TemplateForm/StorageSetting
 * @component StorageSetting
 * @description StorageSetting component
*/
const StorageSetting = () => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const {
    nfsInfo, nfsMounts,
    glusterfsInfo, glusterfsMounts,
    setNfsMountsState, setGlusterfsMountsState,
    classes
  } = useContext(Context);

  return (
    <BasePanel
      className={`${classes.mt_20}`}
      title={
        <div className={`${classes.fz_18} ${classes.fw_bold}`}>{t('storageSetting')}</div>
      }
    >
      <div className={`${classes.manageTemplateFormContent}`}>
        {
          <>
            <StorageMount
              hint={t('toolTipsNFS')}
              keyField="name"
              keyName={t('name')}
              keyOptions={nfsInfo.map(nfs => ({ key: nfs, text: nfs }))}
              name="NFS List"
              onChange={setNfsMountsState}
              storageMounts={nfsMounts}
              title={t('NFS')}
              valueField="mountPoint"
              valueName={t('mountPoint')}
            />
            <StorageMount
              hint={t('toolTipsNFS')}
              keyField="name"
              keyName={t('name')}
              keyOptions={glusterfsInfo.map(nfs => ({ key: nfs, text: nfs }))}
              name="GlusterFS List"
              onChange={setGlusterfsMountsState}
              storageMounts={glusterfsMounts}
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