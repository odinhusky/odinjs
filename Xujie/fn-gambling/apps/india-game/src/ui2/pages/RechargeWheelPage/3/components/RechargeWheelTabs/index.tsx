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
    <div>
      <div className={cx(FLEX_ITEMS_STRETCH, 'gap-3', 'relative z-[1]')}>
        {wheelTabList.map((item, index) => (
          <RechargeWheelTab
            index={index}
            key={item.id}
            isActive={activeRechargeActiveTab === item.type}
            {...item}
          />
        ))}

        {/* 黃色底線 */}
        <div
          className={cx(
            'w-full h-[3px]',
            'bgi-[var(--base-1-variant6)]',
            'absolute bottom-0 left-0 z-[1]'
          )}
        ></div>
      </div>

      <div
        className={cx(
          'w-full h-[9px]',
          '-mt-[1px]',
          'bgi-[var(--base-2-variant16)]',
          'relative z-[1]'
        )}
      ></div>
    </div>
  );
};

export default RechargeWheelTabs;
