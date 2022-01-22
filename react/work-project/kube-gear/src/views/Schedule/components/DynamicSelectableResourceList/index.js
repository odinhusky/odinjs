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
import GlobalContext from 'layouts/Main/GlobalContext';

// ? Self-packed Components || Functions
import Progress from 'components/BaseProgress';

// ^ plugins
import { useTranslation } from 'react-i18next';
import {
  isEmpty,
  isNil,
  isNumber,
  has
} from 'lodash';
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/Schedule/any/DynamicSelectableResourceList
 * @prop {object} selectedVgObj -- 選定的集群物件
 * @prop {boolean} isShow -- 是否顯示的判斷
 * @prop {object} classNameObj -- 調整樣式的 class 物件
 * @prop {object} thisVgLimitedResourceObj -- 目前這個使用者之於這個集群裡面的限制資源資源
 * @prop {array} resOptions -- 選擇資源的選項
 * @prop {object} jobTaskRoles -- 包含每一個 taskrole 的配置物件
 * @prop {function} setIsOverSelectableResourceMax -- 設定是否有超過可以配置的最大資源數
 * @component DynamicSelectableResourceList
 * @description 顯示給定的集群中可以使用的資源以及數量的列表
*/
export const DynamicSelectableResourceList = ({
  selectedVgObj,
  isShow = true,
  classNameObj,
  thisVgLimitedResourceObj,
  resOptions,
  jobTaskRoles,
  setIsOverSelectableResourceMax
}) => {

  // $ init data
  const { t } = useTranslation();

  // = style
  const {
    classes,
    spacingClass,
    selfCanUseVgList,
    filteredResourceObj
  } = useContext(ScheduleContext);

  // % context
  const { resourceUnit, getResource } = useContext(GlobalContext);

  // # states
  const [selectableResourceList, setSelectableResourceList] = useState([])

  // - methods
  /**
   * @author odin
   * @description 整理出目前所有 taskrole 中選擇的資源以及數量有哪些，並回傳物件
   * @returns {object}
  */
  const getTotalDistributedResourceObj = () => {
    const jobTaskRolesArr = Object.entries(jobTaskRoles).map(([, obj]) => obj)
    const cells = jobTaskRolesArr.reduce((acc, obj) => {
      // let skuNum = null;
      const { hivedScheduler } = obj;

      const {
        vg: vg_1, // 1st
        sku: sku_3, // 3rd
        skuType: skyType_2, // 2nd
        skuNum
      } = hivedScheduler;

      const cellName = `${vg_1}.${skyType_2}.${sku_3}`

      return {
        ...acc,
        [cellName]: has(acc, cellName)
          ? acc[cellName] + skuNum
          : skuNum
      }
    }, {})

    return cells
  }

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
    if(resOptions.length > 0 && !isEmpty(selectedVgObj)) {
      const vgName = selectedVgObj.name

      const totalDistributedResourceObj = getTotalDistributedResourceObj(jobTaskRoles)

      const selectableResourceArr = resOptions.map(item => {
        const { resourceName, showName } = item
        const limitedNum = has(thisVgLimitedResourceObj, resourceName) ? +thisVgLimitedResourceObj[resourceName] : null

        const { unitStr } = getResource(vgName, resourceName, 0, selfCanUseVgList)

        const reamingNumber = filteredResourceObj[resourceName]

        const maxSelectableNum =
          (isNil(limitedNum) && !isNumber(limitedNum))
            ? reamingNumber
            // limitedNum 拿回來的數值有可能是 -2(無限制)，所以要判斷掉
            : (limitedNum >= 0) ? Math.min(limitedNum, reamingNumber) : reamingNumber

        const distributedNumber =
          has(totalDistributedResourceObj, resourceName)
            ? totalDistributedResourceObj[resourceName]
            : 0

        return {
          resourceName,
          maxSelectableNum,
          unitStr,
          distributedNumber,
          showName
        }
      })

      // 設定要顯示的資料
      setSelectableResourceList(selectableResourceArr)

      // 檢查是不是有超過可分配的最大值，有的話則不讓他到下一步
      checkMaxDistributedResourceNumber(selectableResourceArr)
    }
  }, [selectedVgObj, resOptions, jobTaskRoles])

  return (
    <>
      {
        (
          isShow &&
          !isEmpty(selectableResourceList) &&
          !isEmpty(selectedVgObj)
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
                  unitStr,
                  distributedNumber: dNum,
                  showName
                }, idx) => (
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
                        title={`${showName} ( ${unitStr} )`}
                        total={num}
                        unit={''}
                        value={dNum}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
          : null
      }
    </>
  );
};

export default DynamicSelectableResourceList;

DynamicSelectableResourceList.propTypes = {
  selectedVgObj: PropTypes.object,
  isShow: PropTypes.bool,
  classNameObj: PropTypes.object,
  thisVgLimitedResourceObj: PropTypes.object,
  resOptions: PropTypes.array,
  jobTaskRoles: PropTypes.object,
  setIsOverSelectableResourceMax: PropTypes.func
};
