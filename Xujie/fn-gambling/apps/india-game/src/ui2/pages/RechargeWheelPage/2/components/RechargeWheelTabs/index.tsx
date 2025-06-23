import { cx } from '@libs/commonUtils';
import { FLEX_ITEMS_STRETCH } from '@libs/constant/style';
import RechargeWheelTab from '../RechargeWheelTab';
import {
  RechargeWheelType,
  useRechargeWheelTabStore,
} from '@libs/mode2/zustand/components/rechargeWheelTabStore';
import useMode2RechargeWheelPageStore from '@libs/mode2/zustand/page/rechargeWheelPage';
import { useMemo } from 'react';
import { RECHARGE_TAB_NAMES } from '@libs/constant/wheelConst';

export const RechargeWheelTabs = () => {
  const wheelRemainSpinNumberObj = useMode2RechargeWheelPageStore(
    (state) => state.wheelRemainSpinNumberObj
  );

  const wheelLevelConfigObj = useMode2RechargeWheelPageStore(
    (state) => state.wheelLevelConfigObj
  );

  const wheelTabList: {
    id: string;
    type: RechargeWheelType;
    value: number | string;
    isLocked: boolean;
    remainNum: number;
  }[] = useMemo(() => {
    const list = RECHARGE_TAB_NAMES.map((tab) => ({
      id: `${tab} wheel`,
      type: tab,
      value: wheelLevelConfigObj[tab].maxReward,
      isLocked: tab === 'supreme' ? true : false,
      remainNum: wheelRemainSpinNumberObj[tab],
    }));

    return list;
  }, [wheelRemainSpinNumberObj, wheelLevelConfigObj, RECHARGE_TAB_NAMES]);

  const activeRechargeActiveTab = useRechargeWheelTabStore(
    (state) => state.activeRechargeActiveTab
  );

  return (
    <div className={cx(FLEX_ITEMS_STRETCH, 'gap-3')}>
      {wheelTabList.map((item) => (
        <RechargeWheelTab
          key={item.id}
          isActive={activeRechargeActiveTab === item.type}
          {...item}
        />
      ))}
    </div>
  );
};

export default RechargeWheelTabs;
