/* eslint-disable no-unused-vars */
import React, {
  useState,
  useEffect,
  useContext,
  useMemo
} from 'react';

// ? context
import ScheduleContext from '../../ScheduleContext';

// ^ Material-ui Components(Functions)
import Radio from '@material-ui/core/Radio';

// ? Self-packed Components || Functions
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import BaseModalNew from 'components/BaseModalNew';
import BaseNoData from 'components/BaseNoData';
import BasePaper from 'components/BaseMuiPaper';

import { DebounceRestrictRangeNumberInput } from 'components/Debounce/DebounceRestrictRangeNumberInput';

// ^ plugins
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  isEmpty,
  isUndefined,
  cloneDeep,
  debounce,
  isString,
  isNaN
} from 'lodash';
import { useHistory, useLocation } from 'react-router-dom';
// import { toast } from 'react-toastify';

/**
 * @author odin
 * @level views/ScheduleCalendar/SearchPeriodModal
 * @component SearchPeriodModal
*/
const SearchPeriodModal = ({
  selectedVg,
  isOpen,
  onClose,
  availableTimePeriod
}) => {

  // $ init data
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const defaultFilterdHour = 1;

  // # states

  // BasePaper related
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // filter related
  const [showPeriods, setShowPeriods] = useState([]);
  const [filterHour, setFilterHour] = useState(defaultFilterdHour);
  const [filterCPU, setFilterCPU] = useState(0);
  const [filterGPU, setFilterGPU] = useState(0);
  const [filterGPUMemoryPercentage, setFilterGPUMemoryPercentage] = useState(100);

  const [filterMemory, setFilterMemory] = useState(0);

  const [selectedRadio, setSelectedRadio] = useState(null);
  const [selectedResourceItem, setSelectedResourceItem] = useState({});
  const [isDisabledConfirm, setIsDisabledConfirm] = useState(true);

  // ? context
  const {
    classes
  } = useContext(ScheduleContext);

  // - methods

  /**
   * @author odin
   * @description 依照目前的條件過濾 availableTimePeriod，並且顯示符合條件的內容
  */
  const filterPeriods = () => {
    let filteredPeriods = cloneDeep(availableTimePeriod);

    // console.log('filteredPeriods origin', filteredPeriods);

    // 預約時長過濾
    const filterHourStamp = filterHour * 60 * 60 * 1000; // 轉換成毫秒
    filteredPeriods = filteredPeriods.filter(({ diffStamp }) => {
      // 如果 diffStamp 是 String 代表時間段是最後一個，所以一定要讓它通過這個檢查，不然的話就依照他給的 diffStamp 進行比較檢查

      // console.log('filteredPeriods', diffStamp, filterHourStamp, diffStamp >= filterHourStamp, isNaN(diffStamp) ? true : diffStamp >= filterHourStamp);

      const isLastDiffStamp = isNaN(diffStamp) || isString(diffStamp);

      return isLastDiffStamp ? true : diffStamp >= filterHourStamp
    });

    // console.log('after filter hour', filteredPeriods);

    // 過濾資源
    filteredPeriods = filteredPeriods .filter(({ resource }) => {
      let isPass = false;
      const { cpu, gpu, memory, gpuMemoryPercentage } = resource.reduce((acc, { showName, number }) => ({
        ...acc,
        [showName]: number
      }), { cpu: 0, gpu: 0, memory: 0, gpuMemoryPercentage: 0 });

      if(
        cpu >= filterCPU
        && gpu >= filterGPU
        && memory >= filterMemory
        && gpuMemoryPercentage >= filterGPUMemoryPercentage
      ) {
        isPass = true
      }

      return isPass
    });

    // console.log('filteredPeriods', filteredPeriods);

    setShowPeriods(filteredPeriods);

    // 過濾後將之前選擇的資料清除
    setSelectedRadio(null);
  };

  /**
   * @author odin
   * @description 延遲 300 毫秒後過濾
  */
  const debounceFilterPeriods = useMemo(() => debounce(filterPeriods, 300), [filterPeriods]);

  /**
   * @author odin
   * @param {object} item -- 目前這筆資料的結構物件
   * @description reset states
  */
  const handleRadioChange = (item) => {
    // console.log('handleRadioChange resourceItem', item)
    setSelectedRadio(item.id);
    setSelectedResourceItem(item);
  }

  /**
   * @author odin
   * @param {object} item -- 目前這筆資料的結構物件
   * @description 確認資料是否有取得，如果有就記錄到 localStorage 中，並且跳頁到 Step1
  */
  const handleConfirm = () => {
    if(!isEmpty(selectedResourceItem)) {
      const path = location.pathname;
      const item = JSON.stringify({
        ...cloneDeep(selectedResourceItem),
        filterHour,
        filterCPU,
        filterGPU,
        filterMemory
      });

      localStorage.setItem('scheduleResourceItem', item);
      history.push(`${path}/create`);
      closeFn();
    }
  }

  /**
   * @author odin
   * @description reset states
  */
  const resetFn = () => {
    setFilterHour(defaultFilterdHour);
    setFilterCPU(0);
    setFilterGPU(0);
    setFilterMemory(0);
    setSelectedRadio(null);
  };

  /**
   * @author odin
   * @description 當 Modal 關閉的時候要做的事
  */
  const closeFn = () => {
    onClose();
    resetFn();
  }

  // & handled data
  // BasePaper 設定
  const columns = [
    {
      id: 'radio',
      key: 'Radio',
      activeId: selectedRadio,
      onTableCellRender: (item) => {
        const { id } = item;

        return (
          <Radio
            checked={selectedRadio === id}
            name="radio-button"
            onChange={() => handleRadioChange(item)}
            value={id}
          />
        )
      }
    },
    {
      id: 'startTime',
      key: 'startTime',
      label: t('startTime'),
      onTableCellRender: (item) => {
        return (
          <>
            <div className={`${classes.searchPeriodTd}`}>
              { item.start }
            </div>
          </>
        )
      }
    },
    {
      id: 'endTime',
      key: 'endTime',
      label: t('endTime'),
      onTableCellRender: (item) => {
        return (
          <>
            <div className={`${classes.searchPeriodTd}`}>
              { item.end }
            </div>
          </>
        )
      }
    },
    {
      id: 'resourceAndNumber',
      key: 'resourceAndNumber',
      label: t('resourceUnitWithDashCount'),
      onTableCellRender: (item) => {
        return (
          <>
            <div className={`${classes.searchPeriodTd}`}>
              {
                item.resource.map(res => (
                  <div
                    className={`${classes.resourceLine}`}
                    key={`${item.start}-${item.end}-${res.showName}-${res.number}`}
                  >
                    { `${res.showName} - ${res.number}` }
                  </div>
                ))
              }
            </div>
          </>
        )
      }
    }
  ];

  // * hooks
  /**
   * @author odin
   * @description 當第一次 render 或是 打開 Modal 的時候套用過濾
  */
  useEffect(() => {
    if(isOpen) {
      filterPeriods();
    }
  }, [availableTimePeriod, isOpen]);

  /**
   * @author odin
   * @description filterHour, filterCPU, filterGPU, filterMemory 任一過濾條件變動的時候，會延遲 300 毫秒後進行過濾
  */
  useEffect(() => {
    debounceFilterPeriods();
  }, [filterHour, filterCPU, filterGPU, filterMemory, filterGPUMemoryPercentage]);

  /**
   * @author odin
   * @description 決定確定按鈕是否要 disabled
  */
  useEffect(() => {
    setIsDisabledConfirm(selectedRadio ? false : true);
  }, [selectedRadio])

  return (
    <>
      {/* 查詢時段的燈箱 */}
      <BaseModalNew
        classNameObj={{
          modalContainer: `${classes.searchPeriodModalContainer}`,
          modalBody: `${classes.searchPeriodModalBody}`
        }}
        isOpen={isOpen}
        modalFoot={
          <>
            <DefaultButton
              children={t('close')}
              onClick={closeFn}
            />

            <PrimaryButton
              children={t('confirm')}
              classNameProps={`${classes.ml_20}`}
              disabled={isDisabledConfirm}
              onClick={handleConfirm}
            />
          </>
        }
        onClose={closeFn}
        title={`${t('searchPeriod')}`}
      >
        <div className={`${classes.h_full}`}>
          {/* 說明文字 */}
          {/* <h5 className={`${classes.fw_normal} ${classes.mt_0} ${classes.mb_16}`}>
            {t('availableTimeSlotsAndResources')}
          </h5> */}

          <div className={`${classes.filterBarContainer}`}>
            {/* 預約時長 (時數) */}
            <div className={`${classes.filterInputWidthCtrl} ${classes.mr_20}`}>
              <DebounceRestrictRangeNumberInput
                classNameProps={`${classes.unlimitWidthInput}`}
                min={0}
                onChange={(hour) => {
                  setFilterHour(hour)
                }}
                textInputProps={{
                  label: `${t('reserve')}${t('enSpace')}${t('timeLong')}(${t('jobHour')})`
                }}
                value={filterHour}
              />
            </div>

            {/* CPU */}
            <div className={`${classes.filterInputWidthCtrl} ${classes.mr_20}`}>
              <DebounceRestrictRangeNumberInput
                classNameProps={`${classes.unlimitWidthInput}`}
                min={0}
                onChange={(value) => {
                  setFilterCPU(value)
                }}
                textInputProps={{
                  variant: 'outlined',
                  label: 'CPU'
                }}
                value={filterCPU}
              />
            </div>

            {/* GPU */}
            <div className={`${classes.filterInputWidthCtrl} ${classes.mr_20}`}>
              <DebounceRestrictRangeNumberInput
                classNameProps={`${classes.unlimitWidthInput}`}
                min={0}
                onChange={(value) => {
                  setFilterGPU(value)
                }}
                textInputProps={{
                  variant: 'outlined',
                  label: `GPU(${t('Chip')})`
                }}
                value={filterGPU}
              />
            </div>

            {/* GPU Memory Percentage */}
            <div className={`${classes.filterInputWidthCtrl} ${classes.mr_20}`}>
              <DebounceRestrictRangeNumberInput
                classNameProps={`${classes.unlimitWidthInput}`}
                min={0}
                onChange={(value) => {
                  setFilterGPUMemoryPercentage(value)
                }}
                textInputProps={{
                  variant: 'outlined',
                  label: `${t('GPU Percentage')}`
                }}
                value={filterGPUMemoryPercentage}
              />
            </div>

            {/* Memory */}
            <div className={`${classes.filterInputWidthCtrl}`}>
              <DebounceRestrictRangeNumberInput
                classNameProps={`${classes.unlimitWidthInput}`}
                min={0}
                onChange={(value) => {
                  setFilterMemory(value)
                }}
                textInputProps={{
                  variant: 'outlined',
                  label: `${t('Memory')}(MB)`
                }}
                value={filterMemory}
              />
            </div>
          </div>

          {/* 表格或是無內容 */}
          {
            <div className={`${classes.availablePeriodContainer}`}>
              {
                (!isEmpty(showPeriods) && !isUndefined(selectedVg)) ? (
                  <BasePaper
                    classNameObj={{
                      th: `${classes.bg_white} ${classes.fw_normal}`,
                      tbody: `${classes.searchPeriodTbody}`
                    }}
                    columns={columns}
                    labelRowsPerPage={t('labelRowsPerPage')}
                    page={page}
                    rows={showPeriods}
                    rowsPerPage={rowsPerPage}
                    setPage={setPage}
                    setRowsPerPage={setRowsPerPage}
                  />
                ) : (
                  <BaseNoData
                    text={`${t('thereIsNo', { name: t('data') })}`}
                  />
                )
              }
            </div>
          }
        </div>
      </BaseModalNew>
    </>
  );
};

export default SearchPeriodModal;

SearchPeriodModal.propTypes = {
  selectedVg: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  availableTimePeriod: PropTypes.array
};
