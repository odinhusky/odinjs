import moment from 'moment';
export { default as getInitials } from './getInitials';
export { default as i18n } from './i18n';

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes < 0) return;
  if (bytes === 0) return '0 Byte';
  if (bytes === 1) return '1 Byte';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const checkUrlIsImage = url => url.match(/\.(jpeg|jpg|gif|png)$/) !== null

export const timestampToDurationString = (time) => {
  if (time === 0) return 0
  const duration = moment.duration(time);
  const day = duration.days();
  const hour = duration.hours();
  const minute = duration.minutes();
  const second = duration.seconds();

  return `${day > 0 ? `${day}d ` : ''}${hour > 0 ? `${hour}h ` : ''}${minute > 0 ? `${minute}m ` : ''}${second > 0 ? `${second}s ` : ''}`
}

export const uuidGenerator = () => {
  var d = Date.now();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
    d += performance.now(); //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

export const isUUID = (id) => {
  if (typeof(id) === 'string') {
    const regexUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return regexUUID.test(id)
  }
  return false
}

export const dateConvertToDurationsObj = (timeStamp) => {
  const days = Math.floor(timeStamp / ( 24 * 3600 * 1000));
  const remainHours = timeStamp % ( 24 * 3600 * 1000);
  const hours = Math.floor(remainHours / (3600 * 1000));
  const remainMinutes = timeStamp % ( 3600 * 1000);
  const minutes = Math.floor(remainMinutes / (60 * 1000));
  const remainSeconds = timeStamp % ( 60 * 1000);
  const seconds = Math.floor(remainSeconds / 1000);
  return {
    timeStamp,
    days,
    hours,
    minutes,
    seconds,
    text: `${days !== 0 ? `${days}d ` : ''}${hours !== 0 ? `${hours}h ` : ''}${minutes !== 0 ? `${minutes}m ` : ''}${seconds !== 0 ? `${seconds}s ` : ''}`
  }
}