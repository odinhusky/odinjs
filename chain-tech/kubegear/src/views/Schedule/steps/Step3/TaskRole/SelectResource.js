/* eslint-disable no-unused-vars */
import React, {
  // useState,
  useEffect,
  useContext,
  // useRef,
  memo
} from 'react';

// ? context
import ScheduleContext from '../../../ScheduleContext';
import Step3Context from '../../Step3Context';

// ? Self-packed Components || Functions
import BaseResource from 'components/BaseResource';

// ^ plugins
import { useTranslation } from 'react-i18next';
import {
  isEqual
} from 'lodash';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

/**
 * @author odin
 * @prop {object} currentTaskRole -- 目前的 taskRole 物件
 * @level views/Schedule/any/SelectResource
 * @component SelectResource
 * @description Schedule Calendar Page
*/
export const SelectResource = memo(({
  currentTaskRole,
  classNameObj,
  handleResourceUpdate,
  selectedIdx
}) => {

  // $ init data
  const { t } = useTranslation();
  // const skipRunFirst = useRef(true);

  // % context
  const {
    // classes,
    canSplitGPU
  } = useContext(ScheduleContext);

  const {
    maxObj,
    remainObj,
    resourceJobRef
  } = useContext(Step3Context);

  // # states

  // - methods
  /**
   * @author odin
   * @param {string} cellName -- 系統用的資源 keyName
   * @description 根據 目前選擇的叢集物件 | 資源型別 | 可使用得子資源詳細列表 計算出目前可使用的資源數量，進一步控制選擇資源分配的數量上限，以及 "選擇資源" 最後面可分配資源的數量顯示
  */

  // * hooks
  /**
   * @author odin
   * @description 切換多個 taskRole tab 的時候同時也更新 <BaseResource> 裏面的值
  */
  useEffect(() => {
    // 避免第一次更新
    // if(skipRunFirst.current) {
    //   skipRunFirst.current = false;
    //   return;
    // }

    const {
      cpu,
      gpu,
      memoryMB,
      gpuMemoryPercentage
    } = currentTaskRole.k8sResource;

    const {
      setCPU,
      setGPU,
      setMemory,
      setGPUMemoryPercentage
    } = resourceJobRef.current;

    // 權限判斷的提示
    if(!canSplitGPU && gpuMemoryPercentage !== 100) toast.error(`${t('cantSplitGPU')}`);

    // 上下限判斷的提示
    if(gpuMemoryPercentage > 100 || gpuMemoryPercentage < 0) toast.error(`${t('overGPUPercentageLimit')}`);

    setCPU(cpu);
    setGPU(gpu);
    setGPUMemoryPercentage(gpuMemoryPercentage);
    setMemory(memoryMB);
  }, [selectedIdx, currentTaskRole.k8sResource])

  return (
    <BaseResource
      canSplitGPU={canSplitGPU}
      classNameObj={classNameObj}
      handleUpdate={handleResourceUpdate}
      maxObj={maxObj}
      ref={resourceJobRef}
      remainObj={remainObj}
      value={currentTaskRole.k8sResource}
    />
  );
}, (prevProps, nextProps) => isEqual(prevProps, nextProps));

export default SelectResource;

SelectResource.propTypes = {
  currentTaskRole: PropTypes.object,
  handleResourceUpdate: PropTypes.func,
  classNameObj: PropTypes.object,
  selectedIdx: PropTypes.number
  // dataId: PropTypes.number,
  // activeStep: PropTypes.number.isRequired,
  // selectedVgObj: PropTypes.object,
};
