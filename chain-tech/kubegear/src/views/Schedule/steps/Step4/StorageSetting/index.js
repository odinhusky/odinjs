import React, { useContext } from 'react';

// % context
// import GlobalContext from 'layouts/Main/GlobalContext';
import ScheduleContext from '../../../ScheduleContext';

// ? Self-packed Components || Functions
import StorageMount from './StorageMount';
import Step4Title from '../Step4Title';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/Schedule/{CreateSchedule | EditSchedule}/Step4/StorageSetting
 * @prop {function} setErrorMessage -- 紀錄錯誤訊息的函式
 * @component StorageSetting
 * @description 包含大道 | 集中式 | 分散式存儲的設定區塊
*/
const StorageSetting = ({
  nfsInfo,
  glusterfsInfo,
  nfsMounts,
  setNfsMountsState,
  setGlusterfsMountsState,
  glusterfsMounts,
  setErrorMessage
}) => {

  // $ init data
  const { t } = useTranslation();

  // // % context
  // const {
  // } = useContext(GlobalContext);

  // = styles
  const { classes } = useContext(ScheduleContext);

  return (
    <div className={`${classes.flexInputTotal}`}>

      <Step4Title
        title={t('storageSetting')}
      />

      {
        <>
          <div className={`${classes.w_full} ${classes.mb_30}`}>
            {/* 集中式存儲 */}
            <StorageMount
              keyField="name"
              keyName={t('name')}
              keyOptions={nfsInfo.map(nfs => ({ key: nfs.name, text: nfs.name }))}
              mounts={nfsMounts}
              name="NFS List"
              onChange={setNfsMountsState}
              setErrorMessage={setErrorMessage}
              title={t('NFS')}
              valueField="mountPoint"
              valueName={t('mountPoint')}
            />
          </div>
          <div className={`${classes.w_full} ${classes.mb_30}`}>
            {/* 分散式存儲 */}
            <StorageMount
              keyField="name"
              keyName={t('name')}
              keyOptions={glusterfsInfo.map(glusterfs => ({ key: glusterfs.name, text: glusterfs.name }))}
              mounts={glusterfsMounts}
              name="GlusterFS List"
              onChange={setGlusterfsMountsState}
              setErrorMessage={setErrorMessage}
              title={t('glusterfs')}
              valueField="mountPoint"
              valueName={t('volumeGlusterFS')}
            />
          </div>
        </>
      }
    </div>
  );
};

StorageSetting.propTypes = {
  nfsInfo: PropTypes.array,
  glusterfsInfo: PropTypes.array,
  nfsMounts: PropTypes.array,
  setNfsMountsState: PropTypes.func,
  setGlusterfsMountsState: PropTypes.func,
  glusterfsMounts: PropTypes.array,
  setErrorMessage: PropTypes.func
}


export default StorageSetting;