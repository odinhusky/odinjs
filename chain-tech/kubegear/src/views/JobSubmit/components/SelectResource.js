import React, {
  memo,
  useState,
  useEffect,
  useContext,
  // useMemo,
  useRef
} from 'react';

// ? context
import Context from './context'

// ^ Material-ui Componets(Functions)
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// ? Self-packed Components || Functions
import { BasicSection } from './basic-section';
import BaseResource from 'components/BaseResource'
import NodeResourceDetailModal from 'reuseContainers/NodeResourceDetailModal';
import { maxSafeNumber } from 'common/commonConstant';

import {
  getRemainObj
} from 'common/commonMethods';

// ^ Plugins
import {
  isEmpty,
  isNil,
  isEqual
} from 'lodash';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

/**
 * @author odin
 * @prop {function} onChange -- 內容變動時觸發的 function
 * @prop {object} k8sResource -- 當前的 taskRole 物件中的 k8sResource，包含 cpu、gpu、memoryMB
 * @level views/JobSubmit/TaskRoles/Content/SelectResource
 * @component SelectResource
 * @description SelectResource component
*/
export const SelectResource = memo(({
  onChange,
  k8sResource
}) => {

  // $ init data
  const { t } = useTranslation();
  const isTablet = useMediaQuery('(max-width: 1280px)');
  const optionsGrid = isTablet ? {} : { xs: 9, sm: 9, md: 9, lg: 9, xl: 9 };
  const skipRunFirst = useRef(true);

  // ? context
  const {
    selectedIdx,
    classes,
    vgInfos,
    jobInformation,
    selfLimitResourceObj,
    resourceRef,
    remainObj,
    setRemainObj,
    resourceUnValidObj,
    showNodes,
    canSplitGPU,
    resourceOtherLimit
  } = useContext(Context);

  // & handled data
  // ! 已經選擇的叢集名稱，但一開始可能是空的
  const selectedVgName = jobInformation?.virtualCluster;

  // # states
  const [maxObj, setMaxObj] = useState({
    cpu: maxSafeNumber,
    gpu: maxSafeNumber,
    memoryMB: maxSafeNumber,
    gpuMemoryPercentage: maxSafeNumber
  });
  const [isOpenNodeResourceDetailModal, setIsOpenNodeResourceDetailModal] = useState(false);

  // * hook
  /**
   * @author odin
   * @description 1. 選擇了集群
   *  2. 集群列表不為空的話
   *  -> 計算出 CP GPU Memory 個別可以使用的數值為多少
  */
  useEffect(() => {
    if(selectedVgName === '' || isEmpty(vgInfos) || isEmpty(selfLimitResourceObj)) return;
    const selectedVgLimitResourceObj = selfLimitResourceObj[selectedVgName]?.resourceCells;
    const remainNumObj = getRemainObj(selectedVgName, vgInfos, selectedVgLimitResourceObj);

    setRemainObj(remainNumObj);
  }, [jobInformation.virtualCluster, vgInfos, selfLimitResourceObj]);

  /**
   * @author odin
   * @description 設定 maxObj
  */
  useEffect(() => {
    if(isNil(remainObj)) return;

    setMaxObj({ ...remainObj });
  }, [remainObj]);

  /**
   * @author odin
   * @description 切換多個 taskRole tab 的時候同時也更新 <BaseResource> 裏面的值
  */
  useEffect(() => {
    // 避免第一次更新
    if(skipRunFirst.current) {
      skipRunFirst.current = false;
      return;
    }

    const { cpu, gpu, memoryMB, gpuMemoryPercentage } = k8sResource;
    const { setCPU, setGPU, setMemory, setGPUMemoryPercentage } = resourceRef.current;

    // 權限判斷的提示
    if(!canSplitGPU && gpuMemoryPercentage !== 100) toast.error(`${t('cantSplitGPU')}`);

    // 上下限判斷的提示
    if(gpuMemoryPercentage > 100 || gpuMemoryPercentage < 0) toast.error(`${t('overGPUPercentageLimit')}`);

    setCPU(cpu);
    setGPU(gpu);
    setGPUMemoryPercentage(gpuMemoryPercentage);
    setMemory(memoryMB);
  }, [selectedIdx, k8sResource]);

  return (
    <>
      <BasicSection
        classNameObj={{
          container: `
            ${isTablet ? `${classes.pt_8}` : `${classes.pt_20}`}
            ${classes.pb_24}
          `,
          labelSection: `${classes.alignItemsStart} ${isTablet && `${classes.mb_6}`}`,
          formlabeGrid: `${classes.pt_16}`,
          toolTip: `${classes.pt_16}`
        }}
        containerItem
        customChildren
        onIconClick={() => setIsOpenNodeResourceDetailModal(true)}
        sectionLabel={`${t('Select')}${t('enSpace')}${t('resource')}`}
        sectionTooltip={`${t('clickToCheckDetail')}`}
        titleGrid={isTablet ? 12 : 3}
        titleOptions={isTablet ? { justify: 'flex-start' } : { justify: 'flex-end', alignItems: 'center' }}
      >
        <Grid
          container
          item
          {...optionsGrid}
          lg={isTablet ? 12 : 9}
          md={isTablet ? 12 : 9}
          sm={isTablet ? 12 : 9}
          spacing={3}
          xl={isTablet ? 12 : 9}
          xs={isTablet ? 12 : 9}
        >
          <Grid
            className={`${classes.selectResourceFirstInput}`}
            item
            lg={isTablet ? 5 : 4}
            md={isTablet ? 5 : 4}
            sm={isTablet ? 5 : 4}
            xl={isTablet ? 5 : 4}
            xs={isTablet ? 5 : 4}
          >
            <BaseResource
              canSplitGPU={canSplitGPU}
              errorStatusObj={resourceUnValidObj}
              handleUpdate={onChange}
              limitObj={resourceOtherLimit}
              maxObj={maxObj}
              ref={resourceRef}
              remainObj={remainObj}
              value={k8sResource}
            />
          </Grid>

          <Grid
            item
            lg={isTablet ? 5 : 4}
            md={isTablet ? 5 : 4}
            sm={isTablet ? 5 : 4}
            xl={isTablet ? 5 : 4}
            xs={isTablet ? 5 : 4}
          />
        </Grid>
      </BasicSection>

      {/* Modal */}
      <NodeResourceDetailModal
        isOpen={isOpenNodeResourceDetailModal}
        onClose={() => setIsOpenNodeResourceDetailModal(false)}
        showNodes={showNodes}
      />
    </>
  );
}, (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps);
});

SelectResource.propTypes = {
  onChange: PropTypes.func,
  k8sResource: PropTypes.object
};
