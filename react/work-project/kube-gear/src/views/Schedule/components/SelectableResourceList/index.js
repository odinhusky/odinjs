/* eslint-disable no-unused-vars */
import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// # API
import {
  getUserAllLimitedVgResource
} from 'utils/api';

// ? context
import ScheduleContext from '../../ScheduleContext';
import GlobalContext from 'layouts/Main/GlobalContext';

// ? Self-packed Components || Functions
import {
  handleResourceString
} from 'common/commonMethods'


// ^ plugins
import { useTranslation } from 'react-i18next';
import {
  isEmpty,
  isNil,
  isNumber,
  has
} from 'lodash';
// import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/Schedule/any/SelectableResourceList
 * @prop {object} selectedVgObj -- 選定的集群物件
 * @prop {boolean} isShow -- 是否顯示的判斷
 * @prop {object} classNameObj -- 調整樣式的 class 物件
 * @prop {object} thisVgLimitedResourceObj -- 目前這個使用者之於這個集群裡面的限制資源資源
 * @prop {array} resOptions -- 選擇資源的選項
 * @component SelectableResourceList
 * @description 顯示給定的集群中可以使用的資源以及數量的列表
*/
export const SelectableResourceList = ({
  selectedVgObj,
  isShow = true,
  classNameObj,
  thisVgLimitedResourceObj,
  resOptions
}) => {

  // $ init data
  const { t } = useTranslation();

  // = style
  const { classes, selfCanUseVgList, filteredResourceObj } = useContext(ScheduleContext);

  // % context
  const { getResource } = useContext(GlobalContext);

  // # states
  const [selectableResourceList, setSelectableResourceList] = useState([])

  // * hooks
  /**
   * @author odin
   * @description 處理目前可以用得資源最大可以選擇的數量(被限制的數量 | 集群剩餘的該資源數量取比較小的)
  */
  useEffect(() => {
    if(resOptions.length > 0 && !isEmpty(selectedVgObj) && !isNil(filteredResourceObj)) {
      const vgName = selectedVgObj.name
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

        return {
          resourceName,
          maxSelectableNum,
          unitStr,
          showName
        }
      })

      // test
      // setSelectableResourceList([...selectableResourceArr, { resourceName: 'jkdsnkjfndjksnfkn', maxSelectableNum: 2, unitStr: '2 GPU, 8CPU, 58G RAM' }, { resourceName: 'jkdsnkjfndjksnfkn', maxSelectableNum: 2, unitStr: '2 GPU, 8CPU, 58G RAM' }])

      setSelectableResourceList(selectableResourceArr)
    }
  }, [selectedVgObj, resOptions, filteredResourceObj])

  return (
    <div className={`${classes['width_6/7']}`}>
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
                ${classes.pb_10}
                ${classes.stepBottomBorder}
                ${classes.flex_wrap}
                ${classNameObj?.list}
              `}
            >
              {
                selectableResourceList.map(({
                  resourceName: name,
                  maxSelectableNum: num,
                  unitStr,
                  showName
                }, idx) => (
                  <div
                    className={`
                      ${classes.flex_0_1_50}
                      ${(idx % 2 === 1) ? classes.pl_10 : classes.pr_10}
                      ${(idx >= 2 ) ? classes.mt_16 : ''}
                    `}
                    key={`${idx} - ${name} - ${num}`}
                  >
                    {`${showName} ( ${unitStr} ) - ${num}`}
                  </div>
                ))}
            </div>
          </div>
          : null
      }
    </div>
  );
};

export default SelectableResourceList;

SelectableResourceList.propTypes = {
  selectedVgObj: PropTypes.object,
  isShow: PropTypes.bool,
  classNameObj: PropTypes.object,
  thisVgLimitedResourceObj: PropTypes.object,
  resOptions: PropTypes.array
};
