import { cx } from '@libs/commonUtils';
import { handleRewardsDetailPageHeaderTypeClick } from '@mode2/action/actionTypes';
import useRewardsDetailPageAction from '@libs/mode2/action/rewardsDetailPageAction/useRewardsDetailPageAction';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import {
  RewardsDetailPageHeaderTabsTypes,
  useRewardsDetailStore,
} from '@libs/mode2/zustand/page/rewardsDetailStore';

export const RewardsDetailPageRecordHeader = () => {
  const headerTabIndex = useRewardsDetailStore((state) => state.headerTabIndex);
  const { handleRewardsDetailPageClick } = useRewardsDetailPageAction();

  const list = [
    RewardsDetailPageHeaderTabsTypes.REWARDS_DETAIL,
    RewardsDetailPageHeaderTabsTypes.WITHDRAWAL_HISTORY,
  ];

  return (
    <div className="h-20 flex justify-center">
      {list.map((item, index) => {
        return (
          <div
            className={cx(
              'w-40 h-full text-base font-medium ',
              'relative flex items-center justify-center cursor-pointer',
              {
                'bgi-text-[var(--transparent-white-40)]':
                  headerTabIndex !== item,
                'bgi-text-[var(--base-1-main)]': headerTabIndex === item,
              }
            )}
            key={index}
            onClick={() => {
              handleRewardsDetailPageClick({
                actionName: handleRewardsDetailPageHeaderTypeClick,
                payload: { value: item },
              });
            }}
          >
            {item}
            {headerTabIndex === item ? (
              <img
                className={cx('w-full', 'absolute bottom-0 left-0')}
                src={getImgUrl(EResourceLevel.ICONS, 'record_header')}
                alt="active"
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
