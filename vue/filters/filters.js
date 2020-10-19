import { getI18nLanguage } from '@/plugins/utility.js';

function formatDate(time) {
  let d = new Date(time),
    min = d.getMinutes(),
    hour = d.getHours(),
    month = d.getMonth() + 1,
    day = d.getDate(),
    year = d.getFullYear(),
    timeText = '';

  const i18nlanguage = getI18nLanguage();

  if (i18nlanguage === 'en-US') {
    if (hour >= 0 && hour < 12) {
      timeText = 'AM';
    } else if (hour >= 12 && hour < 24) {
      hour = hour - 12;
      timeText = 'PM';
    }
  } else {
    if (hour >= 0 && hour < 6) {
      timeText = '凌晨';
    } else if (hour >= 6 && hour < 12) {
      timeText = '早上';
    } else if (hour >= 12 && hour < 18) {
      hour = hour - 12;
      timeText = '下午';
    } else if (hour >= 18 && hour < 24) {
      hour = hour - 12;
      timeText = '凌晨';
    }
  }

  if (day < 10) day = '0' + day;
  if (hour < 10) hour = '0' + hour;
  if (min < 10) min = '0' + min;

  // console.log('time', time);
  // console.log('min', min);
  // console.log('hour', hour);
  // console.log('month', month);
  // console.log('day', day);
  // console.log('year', year);
  // console.log('timeText', timeText);
  // console.log('date', d);

  return `${year} ${month}月 ${day} ${hour}:${min} ${timeText}`;
}

export default {
  formatDate: formatDate,
};
