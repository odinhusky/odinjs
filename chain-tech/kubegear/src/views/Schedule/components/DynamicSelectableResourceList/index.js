/* eslint-disable no-unused-vars */
import React, {
  useState,
  useEffect,
  useContext
} from 'react';

//^ Redux
import { nanoid } from '@reduxjs/toolkit'

// ? context
import ScheduleContext from '../../ScheduleContext';

// ? Self-packed Components || Functions
import Progress from 'components/BaseProgress';
import { handleK8sResourceName } from 'common/commonMethods';
import { theme } from 'theme';

// ^ plugins
import { useTranslation } from 'react-i18next';
import {
  isEmpty,
  isNil
} from 'lodash';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';

/**
 * @author odin
 * @level views/Schedule/any/DynamicSelectableResourceList
 * @prop {boolean} isShow -- 是否顯示的判斷
 * @prop {object} classNameObj -- 調整樣式的 class 物件
 * @prop {object} jobTaskRoles -- 包含每一個 taskrole 的配置物件
 * @prop {function} setIsOverSelectableResourceMax -- 設定是否有超過可以配置的最大資源數
 * @component DynamicSelectableResourceList
 * @description 顯示給定的集群中可以使用的資源以及數量的列表
*/
export const DynamicSelectableResourceList = ({
  isShow = true,
  classNameObj,
  jobTaskRoles,
  setIsOverSelectableResourceMax
}) => {

  // $ init data
  const { t } = useTranslation();

  // = style
  const {
    classes,
    spacingClass,
    maxObj
  } = useContext(ScheduleContext);

  // # states
  const [selectableResourceList, setSelectableResourceList] = useState([])

  // - methods
  /**
   * @author odin
   * @param {object} jobTaskRoles -- 所有的 jobTaskRoles 物件
   * @description 整理出目前所有 jobTaskRoles 中所有的 CPU GPU MemoryMB的總和
   * @returns {object}
  */
  const getTotalDistributedResourceObj = (jobTaskRoles) => {
    const resultObj = {
      cpu: 0,
      gpu: 0,
      memoryMB: 0,
      gpuMemoryPercentage: 0
    };

    const jobTaskRolesArr = Object.entries(jobTaskRoles).map(([, obj]) => obj)

    jobTaskRolesArr.forEach(item => {
      const { cpu, gpu, memoryMB, gpuMemoryPercentage } = item.k8sResource;

      resultObj.cpu += cpu;
      resultObj.gpu += gpu;
      resultObj.memoryMB += memoryMB;
      resultObj.gpuMemoryPercentage += gpu * gpuMemoryPercentage;
    })

    return resultObj;
  }

  const getProgressColor = name => {
    switch (name) {
      case 'CPU':
        return theme.progressCPU;
      case 'GPU':
        return theme.progressGPU;
      case 'Memory':
        return theme.progressMemory;
      case 'GPU Percentage':
        return theme.progressGPUMemoryPercentage
    }
  };

  /**
   * @author odin
   * @param {array} selectableResourceArr -- 組出來要呈現在畫面上的陣列
   * @description 檢查是不是有超過可分配的最大值，有的話則不讓他到下一步
  */
  const checkMaxDistributedResourceNumber = (selectableResourceArr) => {
    const foundErr = selectableResourceArr.find(item => {
      const { maxSelectableNum: num, distributedNumber: dNum } = item
      return dNum > num
    })

    if(!isNil(foundErr)) {
      setIsOverSelectableResourceMax(true)
    } else {
      setIsOverSelectableResourceMax(false)
    }
  }

  // * hooks
  /**
   * @author odin
   * @description 處理目前可以用得資源最大可以選擇的數量(被限制的數量 | 集群剩餘的該資源數量取比較小的)
  */
  useEffect(() => {
    if(!isEmpty(maxObj)) {
      const totalDistributedResourceObj = getTotalDistributedResourceObj(jobTaskRoles);

      const selectableResourceArr = Object.entries({ ...maxObj }).map(([keyName, limitedNumber]) => {

        // 決定顯示名稱
        const resourceName = handleK8sResourceName(keyName);

        // 決定分子
        const distributedNumber = totalDistributedResourceObj[keyName];

        return {
          resourceName,
          maxSelectableNum: limitedNumber, // 分母
          distributedNumber
        }
      });

      const orderedArr = cloneDeep(selectableResourceArr).sort((a, b) => String(a.resourceName).localeCompare(b.resourceName));

      // 設定要顯示的資料
      setSelectableResourceList(orderedArr);

      // 檢查是不是有超過可分配的最大值，有的話則不讓他到下一步
      checkMaxDistributedResourceNumber(selectableResourceArr);
    }
  }, [jobTaskRoles, maxObj])

  return (
    <>
      {
        (
          isShow &&
          !isEmpty(selectableResourceList)
        ) ?
          <div className={`${classes.canUseVgListContainer} ${classNameObj?.container}`}>
            <div
              className={`
                ${classes.d_flex}
                ${spacingClass ? spacingClass : classes.mt_24}
                ${classes.pb_10}
                ${classNameObj?.title}
              `}
            >
              {/* 可用單位 - 數量 */}
              {`${t('allocatable')}${t('enSpace')}${t('unit')} - ${t('amount')}`}
            </div>

            <div
              className={`
                ${classes.d_flex}
                ${classes.flex_wrap}
                ${classes.pb_16}
                ${classNameObj?.list}
              `}
            >
              {
                selectableResourceList.map(({
                  resourceName: name,
                  maxSelectableNum: num,
                  distributedNumber: dNum
                }, idx) => {
                  const unit = name === 'Memory' ? 'MB' : '';

                  return (
                    <div
                      className={`
                      ${classes.flex_0_1_33}
                      ${(idx % 3 === 0) && classes.pr_16}
                      ${(idx % 3 === 1) && classes.px_8}
                      ${(idx % 3 === 2) && classes.pl_16}
                      ${(idx >= 3 ) ? classes.mt_16 : ''}
                    `}
                      key={`${idx} - ${name} - ${num}`}
                    >
                      <div className={`${classes.w_full}`}>
                        <Progress
                          classNameObj={{
                            container: `${classes.w_full}`,
                            header: `${dNum > num && classes.textRed}`,
                            progess: `${dNum > num && classes.bg_red_imp}`
                          }}
                          key={`${name}${nanoid()}`}
                          keys={idx}
                          percentage={(dNum / num) * 100}
                          progressColor={getProgressColor(name)}
                          title={`${name}`}
                          total={num}
                          unit={unit}
                          value={dNum}
                        />
                      </div>
                    </div>
                  )
                }
                )}
            </div>
          </div>
          : null
      }
    </>
  );
};

export default DynamicSelectableResourceList;

DynamicSelectableResourceList.propTypes = {
  isShow: PropTypes.bool,
  classNameObj: PropTypes.object,
  jobTaskRoles: PropTypes.object,
  setIsOverSelectableResourceMax: PropTypes.func
};
