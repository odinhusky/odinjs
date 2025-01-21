import NoData from '@components/NoData';
import cx from '@libs/commonUtils/cx';
import renderI18N from '@libs/commonUtils/renderI18N';
import { rechargeWheelLevelTypeMapping } from '@libs/mode2/@types/rechargeWheelLevelTypes';
import Icon from '@libs/mode2/components/Icon';
import { WheelSpinHistoryResult } from '@libs/mode2/external/api/endpoint/wheel/PostWheelPlayerSpinHistoryListEndpoint';
import {
  EResourceLevel,
  formatDate,
  formatMoney,
  getImgUrl,
} from '@libs/mode2/utils';
import {
  SortNameTypes,
  useActivityRecordPageStore,
} from '@libs/mode2/zustand/page/activityRecordPageStore';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useRechargeWheelRewardsRecordBase from '@mode2/usecase/page/activityRecordPage/useRechargeWheelRewardsRecordBase';

const RechargeWheelRewardsRecordContent = () => {
  useRechargeWheelRewardsRecordBase();
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const listSort = useActivityRecordPageStore((state) => state.listSort);
  const setListSort = useActivityRecordPageStore((state) => state.setListSort);
  const totalRewards = useActivityRecordPageStore(
    (state) => state.totalRewards
  );
  const rechargeRewardRecordList = useActivityRecordPageStore(
    (state) => state.rechargeRewardRecordList
  );
  const setBottomNavigationElMetrics = useTemplateLayoutStore(
    (state) => state.bottomNavigationElMetrics
  );
  const headerElMetrics = useTemplateLayoutStore(
    (state) => state.headerElMetrics
  );

  // 預設時間由近排到遠
  useEffect(() => {
    setListSort({
      sortName: SortNameTypes.SPIN_TIME,
      sortIndex: 1,
    });
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [listSort]);

  return (
    <div className="flex flex-col gap-3 my-3">
      <div
        className="flex flex-col gap-1 bgi-border-[var(--base-2-light)] bgi-[var(--linear-1)]
            rounded-lg p-3 justify-center items-center"
      >
        <div className="text-sm bgi-text-[var(--grayscale-100)] font-medium">
          {renderI18N({ i18nKey: 'deposit_wheel_my_rewards_total_rewards' }, t)}
        </div>
        <div className="text-lg bgi-text-[var(--state-warn-main)] leading-6 font-semibold">
          {formatMoney(totalRewards, true)}
        </div>
      </div>
      {/* 排序按钮 */}
      <div className="flex gap-1">
        <div
          className="flex gap-1 items-center cursor-pointer"
          onClick={() => {
            if (listSort.sortName !== SortNameTypes.SPIN_TIME) {
              setListSort({ sortName: SortNameTypes.SPIN_TIME, sortIndex: 1 });
              return;
            }
            if (listSort.sortIndex >= 3) {
              setListSort({ sortName: SortNameTypes.SPIN_TIME, sortIndex: 1 });
            } else {
              setListSort({
                sortName: SortNameTypes.SPIN_TIME,
                sortIndex: listSort.sortIndex + 1,
              });
            }
          }}
        >
          <span
            className={cx('text-xs font-medium', {
              'bgi-text-[var(--grayscale-100)]':
                listSort.sortName === SortNameTypes.SPIN_TIME &&
                listSort.sortIndex !== 3,
              'bgi-text-[var(--transparent-white-50)]':
                listSort.sortName !== SortNameTypes.SPIN_TIME ||
                listSort.sortIndex === 3,
            })}
          >
            {renderI18N(
              { i18nKey: 'deposit_wheel_my_rewards_sort_spin_time' },
              t
            )}
          </span>
          {listSort.sortIndex === 2 &&
          listSort.sortName === SortNameTypes.SPIN_TIME ? (
            <Icon className="w-4 h-4 rotate-180" name={'ic_menu_down'} />
          ) : listSort.sortIndex === 1 &&
            listSort.sortName === SortNameTypes.SPIN_TIME ? (
            <Icon className="w-4 h-4" name={'ic_menu_down'} />
          ) : (
            <Icon
              className="w-3 h-3"
              name={'ic_menu_double'}
              color="var(--transparent-white-50)"
            />
          )}
        </div>
        <div
          className="flex gap-1 items-center cursor-pointer"
          onClick={() => {
            if (listSort.sortName !== SortNameTypes.REWARDS) {
              setListSort({ sortName: SortNameTypes.REWARDS, sortIndex: 1 });
              return;
            }
            if (listSort.sortIndex >= 3) {
              setListSort({ sortName: SortNameTypes.REWARDS, sortIndex: 1 });
            } else {
              setListSort({
                sortName: SortNameTypes.REWARDS,
                sortIndex: listSort.sortIndex + 1,
              });
            }
          }}
        >
          <span
            className={cx('text-xs font-medium', {
              'bgi-text-[var(--grayscale-100)]':
                listSort.sortName === SortNameTypes.REWARDS &&
                listSort.sortIndex !== 3,
              'bgi-text-[var(--transparent-white-50)]':
                listSort.sortName !== SortNameTypes.REWARDS ||
                listSort.sortIndex === 3,
            })}
          >
            {renderI18N(
              { i18nKey: 'deposit_wheel_my_rewards_sort_rewards' },
              t
            )}
          </span>
          {listSort.sortIndex === 2 &&
          listSort.sortName === SortNameTypes.REWARDS ? (
            <Icon className="w-4 h-4 rotate-180" name={'ic_menu_down'} />
          ) : listSort.sortIndex === 1 &&
            listSort.sortName === SortNameTypes.REWARDS ? (
            <Icon className="w-4 h-4" name={'ic_menu_down'} />
          ) : (
            <Icon
              className="w-3 h-3"
              name={'ic_menu_double'}
              color="var(--transparent-white-50)"
            />
          )}
        </div>
      </div>
      {/* 列表 */}
      <div
        ref={scrollRef}
        className="flex flex-col gap-3 overflow-y-auto overscroll-contain"
        style={{
          height: `calc(100vh - ${
            headerElMetrics.height + setBottomNavigationElMetrics.height + 150
          }px)`,
        }}
      >
        {rechargeRewardRecordList.map((item: WheelSpinHistoryResult, index) => {
          return (
            <div
              key={item.createTime + '_' + index}
              className="flex gap-3 bgi-[var(--base-1-50)] rounded-lg p-2 justify-between items-center"
            >
              <div className="shrink-0 w-10 h-10">
                <img
                  className="h-full m-auto"
                  src={getImgUrl(
                    EResourceLevel.V,
                    `${rechargeWheelLevelTypeMapping[item.wheelLevel]}_wheel_s`
                  )}
                  alt="wheel"
                />
              </div>
              <div className="w-full text-xs font-medium">
                <div className="bgi-text-[var(--grayscale-100)]">
                  {renderI18N(
                    {
                      i18nKey: `deposit_wheel_my_rewards_${
                        rechargeWheelLevelTypeMapping[item.wheelLevel]
                      }_wheel`,
                    },
                    t
                  )}
                </div>
                <div className="bgi-text-[var(--transparent-white-70)] mt-[2px]">
                  {formatDate(item.createTime ?? 0)}
                </div>
              </div>
              <div className="text-base bgi-text-[var(--transparent-white-70)] font-medium">
                {formatMoney(item.rewards ?? 0, true)}
              </div>
            </div>
          );
        })}
        {rechargeRewardRecordList.length === 0 ? (
          <NoData
            styles={{ container: '!pt-5' }}
            text={t('spin_and_share_wheel_withdrawal_history_no_data')}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
export default RechargeWheelRewardsRecordContent;
