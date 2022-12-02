import { useEffect, useContext } from 'react';
import GlobalContext from 'layouts/Main/GlobalContext';
import moment from 'moment';
import 'moment/locale/ja';
import 'moment/locale/zh-tw';
import 'moment/locale/zh-cn';

export const useMomentWithLocale = () => {
  const { locale } = useContext(GlobalContext);

  useEffect(() => {
    if (locale === 'jp') moment.locale('ja') // 我們取jp 但moment吃ja
    else moment.locale(locale)
  }, [locale])

  return moment;
}
