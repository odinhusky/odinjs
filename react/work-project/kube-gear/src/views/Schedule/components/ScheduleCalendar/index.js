/* eslint-disable no-unused-vars */
import React, {
  // useState,
  // useEffect,
  useContext } from 'react';

// ? context
import ScheduleContext from '../../ScheduleContext';

import Icon from '@material-ui/core/Icon';

// ? Self-packed Components || Functions
import BreadCrumbs from 'components/BreadCrumbs';
import BaseCalendar from 'components/BaseCalendar';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import MuiDropdown from 'components/BaseMuiDropdown';
import { addDropDownOptionKeys } from 'common/commonMethods'

// ^ plugins
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

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
  } = vgDropdownProps

  // Status dropdown related
  const {
    dropdownSelectedText,
    setDropdownSelectedText,
    setDropdownSelectedKey
  } = filterDropdownProps

  // = style
  const { classes } = useContext(ScheduleContext);

  // & handled data
  const filterDropdownOptions = [
    { name: t('allShow'), optionkey: 'all', color: 'blue' },
    { name: t('verified'), optionkey: 'accept', color: 'green' },
    { name: t('verifying'), optionkey: 'pending', color: 'orange' },
    { name: t('denied'), optionkey: 'deny', color: 'red' }
  ];

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
              classNameProps={`${classes.refreshBtn} ${classes.mr_20}`}
              disabled={isLoading}
              onClick={refreshEvent}
              startIcon={<Icon>refresh</Icon>}
            />

            {/* 選擇集群 */}
            <MuiDropdown
              // className
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
              eventClick={handleEventClick}
              eventContent={eventContent}
              eventDisplay={eventDisplay}
              events={events}
            />
          </section>
        </div>
      </div>
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
  isLoading: PropTypes.bool.isRequired
};
