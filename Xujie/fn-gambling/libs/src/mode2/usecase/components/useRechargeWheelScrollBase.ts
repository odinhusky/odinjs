import { useEffect } from 'react';
import { useDeepEffect } from '@libs/commonUtils';
import { usePostWheelNewsTickerListMutation } from '@libs/mode2/external/api';
import { formatMoney } from '@libs/mode2/utils';
import { useRechargeWheelScrollStore } from '@libs/mode2/zustand/components/rechargeWheelScrollStore';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'react-i18next';

export const useRechargeWheelScrollBase = () => {
  const { t } = useTranslation();

  const [postWheelNewsTickerList, { data, isSuccess }] =
    usePostWheelNewsTickerListMutation();

  const setNewsTickerMarqueeList = useRechargeWheelScrollStore(
    (state) => state.setNewsTickerMarqueeList
  );

  useEffect(() => {
    postWheelNewsTickerList();
  }, []);

  useDeepEffect(() => {
    if (data && isSuccess) {
      const handledNewsTickerList = data.newsTickerList
        .filter((item) => item.winAmount > 0)
        .map((item, index) => ({
          id: `newsTickerList - ${index}`,
          broadcastText: `${item.name} ${t('wins')} ${formatMoney({
            value: item.winAmount || 0,
          })}`,
        }));

      if (handledNewsTickerList && !isEmpty(handledNewsTickerList))
        setNewsTickerMarqueeList(handledNewsTickerList);
    }
  }, [isSuccess, data]);
};

export default useRechargeWheelScrollBase;
