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
import { isEmpty, isNil } from 'lodash';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/Schedule/any/CanUseResourceList
 * @component CanUseResourceList
 * @description 顯示給定的集群中可以使用的資源以及數量的列表
*/
export const CanUseResourceList = ({
  selectedVgObj,
  userName,
  isShow = true,
  classNameObj
}) => {

  // $ init data
  const { t } = useTranslation();

  // = style
  const { classes } = useContext(ScheduleContext);

  // % context
  const { resourceUnit } = useContext(GlobalContext);

  // # states
  const [limitResourceObj, setLimitResourceObj] = useState({});

  // * hooks
  /**
   * @author odin
   * @description 取得 特定集群 特定成員 的可用資源內容
  */
  useEffect(() => {
    // 等 props 拿到 selectedVgObj | userName 的時候才去做要打 API 的處理
    const vgName = selectedVgObj?.name

    if(vgName && userName) {

      getUserAllLimitedVgResource(userName)
        .then(res => {

          let resourceCells = {}

          if(!isNil(res[vgName])) {
            resourceCells  = res[vgName].resourceCells
          }

          setLimitResourceObj(resourceCells)
        })
        .catch(err => {
          // .catch(({ message: msg }) => {
          const msg = err.data.message
          toast.error(msg)
        });
    }

  }, [selectedVgObj, userName])

  return (
    <>
      {
        (
          isShow &&
          !isEmpty(limitResourceObj) &&
          !isEmpty(selectedVgObj)
        ) ?
          <div className={`${classes.canUseVgListContainer} ${classNameObj?.container}`}>
            <div
              className={`
                ${classes.stepRow}
                ${classes.mt_16}
                ${classes.pb_10}
                ${classNameObj?.title}
              `}
            >
              {/* 可用單位 - 數量 */}
              {`${t('allocatable')}${t('enSpace')}${t('unit')} - ${t('amount')}`}
            </div>

            <div
              className={`
                ${classes.stepRow}
                ${classes.pb_10}
                ${classes.stepBottomBorder}
                ${classNameObj?.list}
              `}
            >
              {
                Object.entries(limitResourceObj).map(([key, value]) => (
                  <div
                    className={`${classes.stepWidth_30}`}
                    key={`${key} - ${value}`}
                  >
                    {`${key}(${!isEmpty(selectedVgObj) ? handleResourceString(key, selectedVgObj.cells, resourceUnit) : ''}) - ${value}`}
                  </div>
                ))}
            </div>
          </div>
          : null
      }
    </>
  );
};

export default CanUseResourceList;

CanUseResourceList.propTypes = {
  selectedVgObj: PropTypes.object,
  userName: PropTypes.string,
  isShow: PropTypes.bool,
  classNameObj: PropTypes.object
};
