import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  memo
} from 'react';

// ? context
import Context from '../../Context';
import ManageTemplateContext from '../../../../Context';

// ^ Material-ui Components(Functions)
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import FormLabel from '@material-ui/core/FormLabel';

// ? Self-packed Components || Functions
import BaseResource from 'components/BaseResource'

import {
  getRemainObj
} from 'common/commonMethods';

// ^ Plugins
import { isEmpty, isEqual, isNil } from 'lodash';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

/**
 * @author odin
 * @prop {object} k8sResource -- 一開始的三個欄位要顯示的資源數量
 * @prop {function} onChange -- 非必要，用於更新外界的 state 的 function
 * @prop {object} selectedIdx -- 選定的 tab 的 index
 * @level views/ManageTemplate/TemplateForm/TaskRole/Content/SelectResource
 * @component SelectResource
 * @description Select resource component
*/
export const SelectResource = memo(({
  k8sResource,
  onChange,
  selectedIdx
}) => {

  // $ init data
  const { t } = useTranslation();
  const skipRunFirst = useRef(true);
  const isTablet = useMediaQuery('(max-width: 1280px)');

  // ? context
  const {
    classes,
    vgInfos,
    jobInformation,
    resourceRef,
    remainObj,
    setRemainObj,
    resourceUnValidObj,
    canSplitGPU
  } = useContext(Context);

  const { selfLimitResourceObj } = useContext(ManageTemplateContext);

  // & handled data
  // ! 已經選擇的叢集名稱，但一開始可能是空的
  const selectedVgName = jobInformation?.virtualCluster;

  // # states
  const [maxObj, setMaxObj] = useState({
    cpu: 9007199254740991,
    gpu: 9007199254740991,
    memoryMB: 9007199254740991
  });

  // * hooks
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
   * @description 如果 remainObj 都為 0 的話，則不套用其為 maxObj(為了能夠同時在 編輯Json 以及 匯入檔案 時，設定資源)
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
  }, [selectedIdx]);

  return (
    <>
      <Grid
        container
        item
      >
        <Grid
          className={`${classes.mr_10} ${classes.justify_end} ${classes.mt_12}`}
          container
          item
          lg={3}
          md={3}
          sm={3}
          xl={3}
          xs={3}
        >
          <FormLabel className={classes.formLabel}>{`${t('Select')}${t('enSpace')}${t('resource')}`}</FormLabel>
        </Grid>
        <Grid
          container
          item
          lg={9}
          md={9}
          sm={9}
          spacing={3}
          xl={9}
          xs={9}
        >
          <Grid
            item
            lg={isTablet ? 6 : 4}
            md={isTablet ? 6 : 4}
            sm={isTablet ? 6 : 4}
            xl={isTablet ? 6 : 4}
            xs={isTablet ? 6 : 4}
          >
            <BaseResource
              canSplitGPU={canSplitGPU}
              errorStatusObj={resourceUnValidObj}
              handleUpdate={(obj) => onChange('k8sResource', obj)}
              maxObj={maxObj}
              ref={resourceRef}
              remainObj={remainObj}
              value={k8sResource}
            />
          </Grid>

          <Grid
            item
            lg={isTablet ? 6 : 4}
            md={isTablet ? 6 : 4}
            sm={isTablet ? 6 : 4}
            xl={isTablet ? 6 : 4}
            xs={isTablet ? 6 : 4}
          />
        </Grid>
      </Grid>
    </>
  );
}, (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps)
});

SelectResource.propTypes = {
  onChange: PropTypes.func,
  k8sResource: PropTypes.object,
  selectedIdx: PropTypes.number
};

export default SelectResource;
