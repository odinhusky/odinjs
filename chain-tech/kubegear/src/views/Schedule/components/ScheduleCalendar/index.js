/* eslint-disable no-unused-vars */
import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// ? context
import ScheduleContext from '../../ScheduleContext';
import GlobalContext from 'layouts/Main/GlobalContext';

// ^ Material-ui Components(Functions)
import Icon from '@material-ui/core/Icon';

// ? Self-packed Components || Functions
import BreadCrumbs from 'components/BreadCrumbs';
import BaseCalendar from 'components/BaseCalendar';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import MuiDropdown from 'components/BaseMuiDropdown';
import { addDropDownOptionKeys } from 'common/commonMethods'
import { BaseTooltip } from 'components/BaseTooltip';
import SearchPeriodModal from '../SearchPeriodModal'
import { formatDateTimeStr, getTimeSec } from 'common/commonMethods'

// ^ plugins
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { isEmpty, isUndefined, cloneDeep } from 'lodash';
// import { toast } from 'react-toastify';

/**
 * @author odin
 * @level views/ScheduleCalendar
 * @prop {object} matchProps -- 由 route 產生的物件
 * @prop {function} refreshEvent -- 點擊 '重新整理' 按鈕的時候觸發的事件
 * @prop {object} calendarProps -- 跟 <BaseCalendar> 相關的 props
 * @prop {object} filterDropdownProps -- 右方的 filter dorpdown 要用到的 state 以及 setState
 * @prop {object} vgDropdownProps -- 左方的 vg dorpdown 要用到的 state 以及 change 事件
 * @component ScheduleCalendar
 * @description Schedule Calendar Page
*/
const ScheduleCalendar = ({
  matchProps,
  refreshEvent,
  calendarProps,
  vgDropdownProps,
  filterDropdownProps,
  searchModalProps,
  isLoading
}) => {

  // $ init data
  const { t } = useTranslation();

  const {
    dayMaxEventRows,
    dayCellClassNames,
    eventContent,
    eventDisplay,
    events,
    handleDateClick,
    handleEventClick
  } = calendarProps;

  // Vg dropdown related
  const {
    canUseVg,
    selectedVg,
    handleVgDropdownChange
  } = vgDropdownProps;

  // Status dropdown related
  const {
    dropdownSelectedText,
    setDropdownSelectedText,
    setDropdownSelectedKey
  } = filterDropdownProps;

  // Search Modal related
  const {
    usedTimePeriod,
    totalResourceObj,
    getTimePeriod
  } = searchModalProps;

  // # states
  const [isOpenSearchPeriodModal, setIsOpenSearchPeriodModal] = useState(false);

  // 資料
  const [availableTimePeriod, setAvailableTimePeriod] = useState([]);

  // Admin 或是 組長限制該使用者的資源上限
  const [thisVgLimitedResourceObj, setThisVgLimitedResourceObj] = useState({});

  // ? context
  const {
    classes
  } = useContext(ScheduleContext);

  const {
    selfLimitResourceObj
  } = useContext(GlobalContext);

  // - methods
  /**
   * @author odin
   * @param {object} thisCells -- 包含當前使用的資源以及數量的物件
   * @param {object} totalCells -- 此集群中所有的資源以及其名稱、數量、單位名稱
   * @description 組出可以使用的資源時段，並且過濾
   * @return {array}
  */
  const handleResource = (thisCells, totalCells) => {
    let resourceArr = [];

    if(isEmpty(thisCells)) {
      // 如果是空的代表這個時間段所有的資源都沒有被使用，轉換資料型態
      resourceArr = Object.entries(totalCells).reduce((acc, [keyName,  { name, number }]) => {
        return [
          ...acc,
          {
            showName: name,
            number,
            keyName
          }
        ]
      }, [])
    } else {
      // 不是空的話就一個一個相減推算出
      resourceArr = Object.entries(totalCells).reduce((acc, [keyName,  { name, number }]) => {
        const usedNumber = thisCells[keyName] ? thisCells[keyName] : 0;
        const leftNumber = number - usedNumber;

        // 過濾掉剩餘單位不為 0 的資源
        if(leftNumber > 0) {
          return [
            ...acc,
            {
              showName: name,
              number: number - usedNumber,
              keyName
            }
          ];
        } else if(leftNumber <= 0) {
          return [ ...acc ];
        }
      }, [])
    }

    return resourceArr;
  }

  /**
   * @author odin
   * @description 組出可以使用的資源時段
   * @return {array}}
  */
  const getAvailableResourcePeriod = () => {
    // console.log('getAvailableResourcePeriod usedTimePeriod', usedTimePeriod);

    const buffer = getTimeSec(5, 'm');
    const nowTimeStampPlusBuffer = new Date().getTime() + buffer;

    if(isEmpty(usedTimePeriod)) {
      // 如果 usedTimePeriod 是空的代表目前沒有任何排程有預約，顯示一比開始時間為現在，結束時間為 -，資源內容則依照目前這個 totalResourceObj 的內容來直接處理

      const end = '-';
      const resource = handleResource({}, totalResourceObj);

      return [{
        id: `${Number.MAX_SAFE_INTEGER}`,
        start: formatDateTimeStr(nowTimeStampPlusBuffer),
        startTimeStamp: nowTimeStampPlusBuffer,
        end,
        resource,
        diffStamp: `${Number.MAX_SAFE_INTEGER} - ${end}`
      }]

    } else {
      const timeArr = Object.keys(usedTimePeriod);

      // 為了檢查第一個使用的時間
      const firstTimeStamp = timeArr[0];

      // 如果第一個使用的時間點小於現在的話，要多補一個從現在開始的時間段給他
      let handledUsedTime = {};

      if(firstTimeStamp > nowTimeStampPlusBuffer) {
        handledUsedTime = {
          [nowTimeStampPlusBuffer]: {
            cells: {}
          },
          ...cloneDeep(usedTimePeriod)
        }
      } else {
        handledUsedTime = cloneDeep(usedTimePeriod);
      }

      // console.log('firstTimeStamp', firstTimeStamp);
      // console.log('firstTimeStamp > nowTimeStampPlusBuffer', firstTimeStamp > nowTimeStampPlusBuffer, nowTimeStampPlusBuffer);

      // 組出可以預約的時段
      const handledUsedTimeKeyArr = Object.keys(handledUsedTime);
      const result = Object.entries(handledUsedTime).reduce((acc, [time, { cells }], i) => {

        // 如果是最後一個的話，就把結束時間改為 無
        const originStartTimeStamp = +time;
        const endTimeStamp = +handledUsedTimeKeyArr[i + 1];

        // 如果開始時間小於現在時間的話，則把那筆的開始時間換成現在時間
        const startTimeStamp = (nowTimeStampPlusBuffer > originStartTimeStamp && endTimeStamp > nowTimeStampPlusBuffer) ? nowTimeStampPlusBuffer : originStartTimeStamp;

        // 處理要顯示的結束文字
        const end = (i + 1 === handledUsedTimeKeyArr.length)
          ? '-'
          : formatDateTimeStr(endTimeStamp);

        // 處理資源
        const resource = handleResource(cells, totalResourceObj);

        // console.log('i', i);
        // console.log('resource', resource);
        // console.log('start', formatDateTimeStr(originStartTimeStamp));
        // console.log('originStartTimeStamp', originStartTimeStamp);
        // console.log('endTimeStamp', endTimeStamp)
        // console.log('end', end);

        // 過濾沒有資源的時間段 或是 不是未來的時間段
        if(resource.length === 0 || endTimeStamp < nowTimeStampPlusBuffer) {
          return [ ...acc ];
        } else {
          const diffStamp = end === '-'
            ? Number.MAX_SAFE_INTEGER
            : endTimeStamp - startTimeStamp;
          return [
            ...acc,
            {
              id: `${startTimeStamp} - ${end}`,
              start: formatDateTimeStr(startTimeStamp),
              startTimeStamp,
              end,
              resource,
              diffStamp
            }
          ];
        }
      }, []);

      // console.log('result', result);

      return result;
    }
  };

  // & handled data
  const filterDropdownOptions = [
    { name: t('allShow'), optionkey: 'all', color: 'blue' },
    { name: t('verified'), optionkey: 'accept', color: 'green' },
    { name: t('verifying'), optionkey: 'pending', color: 'orange' },
    { name: t('denied'), optionkey: 'deny', color: 'red' }
  ];

  // * hooks
  /**
   * @author odin
   * @description 取得時間段
  */
  useEffect(() => {
    if(!isUndefined(selectedVg)) getTimePeriod();
  }, [selectedVg]);

  /**
   * @author odin
   * @description 取得管理者或是組長限制特定使用者的資源限制數量列表，以及目前這個集群被限制的資源數量列表
  */
  useEffect(() => {
    // selfLimitResourceObj 為空的，則不重新指定目前登入使用者的限制資源列表
    if(isEmpty(selfLimitResourceObj)) return;

    if(selectedVg) {
      const resourceCells  = selfLimitResourceObj[selectedVg].resourceCells;
      setThisVgLimitedResourceObj(resourceCells)
    }

  }, [selectedVg, selfLimitResourceObj])

  /**
   * @author odin
   * @description 要組成顯示在畫面上的資料
  */
  useEffect(() => {
    // console.log('usedTimePeriod', usedTimePeriod);
    // console.log('totalResourceObj', totalResourceObj);

    const period = getAvailableResourcePeriod();
    // console.log('period', period);
    setAvailableTimePeriod(period);
  }, [usedTimePeriod, totalResourceObj]);

  return (
    <>
      {/* Materail UI layout */}
      <div className={`${classes.pageContainer} ${classes.pageContainerSchedule}`}>
        <BreadCrumbs />

        {/* 上方按鈕以及過濾區塊 */}
        <div className={`${classes.flex_align_center} ${classes.filterGroup}`}>

          <div className={`${classes.filterGroupPriamry}`}>
            {/* 重新整理 */}
            <DefaultButton
              children={t('refresh')}
              classNameProps={`${classes.refreshBtn} ${classes.mr_10}`}
              disabled={isLoading}
              onClick={refreshEvent}
              startIcon={<Icon>refresh</Icon>}
            />

            {/* 選擇集群 */}
            <MuiDropdown
              // className
              classNameObj={{
                container: `${classes.mr_10}`
              }}
              list={addDropDownOptionKeys(canUseVg)}
              onChange={(e, option) => {
                // 帶入名稱，並且依照選擇的叢集重新取得資料渲染畫面
                handleVgDropdownChange(option.props.value)
              }}
              onRenderOption={(data) => {
                return (
                  <div className={`${classes.flex_align_center}`}>
                    <div>{data.name}</div>
                  </div>
                )
              }}
              text={`${t('select')}${t('vitualCluster')}`}
              value={selectedVg}
            />

            {/* 查詢時段 */}
            <BaseTooltip title={t('searchPeriodHint')}>
              <PrimaryButton
                children={t('searchPeriod')}
                onClick={() => {setIsOpenSearchPeriodModal(true)}}
                startIcon={<Icon>search</Icon>}
              />
            </BaseTooltip>
          </div>

          <div className={`${classes.filterGroupSecondary}`}>
            {/* 過濾 */}
            <MuiDropdown
              list={addDropDownOptionKeys(filterDropdownOptions)}
              onChange={(e, option) => {
                // 設定選擇了的選項的顯示文字
                setDropdownSelectedText(option.props.value)

                // 父層的state改變的時候會透過 useEffect 重新過濾顯示的資料
                setDropdownSelectedKey(option.props.optionkey);
              }}
              onRenderOption={(data) => {
                return (
                  <div style={{ color: data.color, display: 'flex', alignItems: 'center' }}>
                    <div>{data.name}</div>
                  </div>
                )
              }}
              text={`${'過濾'}`}
              value={dropdownSelectedText}
            />
          </div>

        </div>

        {/* 下方日曆的區域 */}
        <div className={`${classes.root} ${classes.calendarContainer}`}>

          <section className={`${classes.calendarSection}`}>
            <BaseCalendar
              dateClick={handleDateClick}
              dayCellClassNames={dayCellClassNames}
              dayMaxEventRows={dayMaxEventRows}
              eventBackgroundColor={'#378006'}
              eventClick={handleEventClick}
              eventContent={eventContent}
              eventDisplay={eventDisplay}
              events={events}
            />
          </section>
        </div>
      </div>

      {/* Modal */}
      {/* 查詢時段的燈箱 */}
      <SearchPeriodModal
        availableTimePeriod={availableTimePeriod}
        canUseVg={canUseVg}
        isOpen={isOpenSearchPeriodModal}
        onClose={() => { setIsOpenSearchPeriodModal(false); }}
        selectedVg={selectedVg}
        thisVgLimitedResourceObj={thisVgLimitedResourceObj}
      />
    </>
  );
};

export default ScheduleCalendar;

ScheduleCalendar.propTypes = {
  matchProps: PropTypes.object,
  refreshEvent: PropTypes.func.isRequired,
  calendarProps: PropTypes.object.isRequired,
  vgDropdownProps: PropTypes.object.isRequired,
  filterDropdownProps: PropTypes.object.isRequired,
  searchModalProps: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired
};
