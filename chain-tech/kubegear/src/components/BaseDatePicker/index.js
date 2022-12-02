import React from 'react';
// import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
// import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { DatePicker as UIDatePicker } from 'office-ui-fabric-react/lib/DatePicker';

// import datePickerStyle from './index.scss';
// import styled from 'styled-components';

// const Wrapper = styled.div`
//   height: 100%;
//   position: relative;
//   background-color: white;
// `;

export const DatePicker = ({ ...props }) => {
  const { t } = useTranslation();

  const DayPickerStrings = {
    months: [
      t('calendar.months.January'),
      t('calendar.months.February'),
      t('calendar.months.March'),
      t('calendar.months.April'),
      t('calendar.months.May'),
      t('calendar.months.June'),
      t('calendar.months.July'),
      t('calendar.months.August'),
      t('calendar.months.September'),
      t('calendar.months.October'),
      t('calendar.months.November'),
      t('calendar.months.December')
    ],
    shortMonths: [
      t('calendar.shortMonths.Jan'),
      t('calendar.shortMonths.Feb'),
      t('calendar.shortMonths.Mar'),
      t('calendar.shortMonths.Apr'),
      t('calendar.shortMonths.May'),
      t('calendar.shortMonths.Jun'),
      t('calendar.shortMonths.Jul'),
      t('calendar.shortMonths.Aug'),
      t('calendar.shortMonths.Sep'),
      t('calendar.shortMonths.Oct'),
      t('calendar.shortMonths.Nov'),
      t('calendar.shortMonths.Dec')
    ],
    days: [
      t('calendar.days.Sunday'),
      t('calendar.days.Monday'),
      t('calendar.days.Tuesday'),
      t('calendar.days.Wednesday'),
      t('calendar.days.Thursday'),
      t('calendar.days.Friday'),
      t('calendar.days.Saturday')
    ],

    shortDays: [
      t('calendar.shortDays.Sun'),
      t('calendar.shortDays.Mon'),
      t('calendar.shortDays.Tue'),
      t('calendar.shortDays.Wed'),
      t('calendar.shortDays.Thu'),
      t('calendar.shortDays.Fir'),
      t('calendar.shortDays.Sat')
    ],

    goToToday: t('gototoday'),
    prevMonthAriaLabel: 'Go to previous month',
    nextMonthAriaLabel: 'Go to next month',
    prevYearAriaLabel: 'Go to previous year',
    nextYearAriaLabel: 'Go to next year',
    closeButtonAriaLabel: 'Close date picker'
  };

  const styles = {
    root: {
      borderRadius: '3px',
      width: '200px',
      boxSizing: 'border-box',
      textAlign: 'center',
      fontWeight: 'normal',
      height: '32px',
      marginRight: '8px'
    },
    textField: {
      borderRadius: 10,
      selectors: {
        '& .ms-TextField-fieldGroup': { borderRadius: '3px' }
      }
    },
    callout: {
      selectors: {
        '& .ms-DatePicker-weekday': { textAlign: 'center' }
      }
    }
  };

  // const controlClass = mergeStyleSets({
  //   control: {
  //     margin: '0 0 15px 0',
  //     maxWidth: '200px',
  //   },
  // });

  return (
    <UIDatePicker
      strings={DayPickerStrings}
      // className={datePickerStyle.datePicker}
      styles={styles}
      {...props}
    />
  );
};

DatePicker.propTypes = {
  // children: PropTypes.node,
};

export default DatePicker;
