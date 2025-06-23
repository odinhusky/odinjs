import Icon from '@components/Icon';
import NoData from '@components/NoData';
import { cx } from '@libs/commonUtils';
import {
  FLEX_COL,
  FLEX_ITEMS_CENTER,
  MOBILE_BREAK_POINT_MAX_WIDTH,
} from '@libs/constant/style';
import { handleMyBonusTabSwitchClick } from '@mode2/action/actionTypes';
import useActivityPageActions from '@libs/mode2/action/activityPageAction/useActivityPageActions';
import { useMode2VipBonusPageBase } from '@libs/mode2/usecase/page/vipBonusPage/useMode2VipBonusPageBase';
import {
  EResourceLevel,
  formatDate,
  formatMoney,
  getImgUrl,
} from '@libs/mode2/utils';
import {
  myBonusTabList,
  useMode2MyBonusListStore,
} from '@libs/mode2/zustand/page/activityPageStore';
import { useTranslation } from 'react-i18next';
import { VipRewardType } from '@mode2API/endpoint/team/PostVipRewardHistoryEndpoint';

export const VipBonusPage = () => {
  const { t } = useTranslation();
  const { handleOnScroll } = useMode2VipBonusPageBase();

  const { handleActivityPageClick } = useActivityPageActions();

  const totalRewards = useMode2MyBonusListStore((state) => state.totalRewards);
  const myBonusList = useMode2MyBonusListStore((state) => state.myBonusList);

  const myBonusTabIndex = useMode2MyBonusListStore(
    (state) => state.myBonusTabIndex
  );

  return (
    <div
      className={cx(
        MOBILE_BREAK_POINT_MAX_WIDTH,
        'w-screen -ml-4 h-[calc(100vh_-_80px)] relative',
        'overflow-hidden text-center',
        'bgi-text-[var(--grayscale-100)] bgi-[var(--background-dark)]'
      )}
    >
      {/* 内容 */}
      <div
        className="w-full h-80"
        style={{
          backgroundImage: `url(${getImgUrl(
            EResourceLevel.V,
            'casino_background'
          )})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          // height: 'calc(100vh - 5rem)', // 5rem === 80px
        }}
      ></div>

      <div
        className={cx('absolute top-0 left-0 w-full h-[calc(100%_-_230px)]')}
      >
        <div className="text-2xl py-4 font-medium">
          <div>{t('deposit_wheel_my_rewards_total_rewards')}</div>
          <div className="bgi-text-[var(--base-1-variant8)]">
            {formatMoney({ value: totalRewards })}
          </div>
        </div>
        <div
          className={cx(
            'm-4 h-full box-border',
            'border border-[var(--base-1-main)] rounded-md overflow-y-auto'
          )}
        >
          <div className={cx('flex', 'bgi-[var(--base-2-variant11)]')}>
            {myBonusTabList.map((item, i) => {
              return (
                <div
                  className={cx(
                    'w-40 text-base font-medium flex-1',
                    'py-3 box-border',
                    'text-lg font-medium',
                    'relative flex items-center justify-center cursor-pointer',
                    {
                      'bgi-text-[var(--base-2-variant1)]':
                        myBonusTabIndex !== item.label,
                      'bgi-[var(--base-2-variant14)] bgi-text-[var(--grayscale-100)]':
                        myBonusTabIndex === item.label,
                    }
                  )}
                  key={i}
                  onClick={() => {
                    handleActivityPageClick({
                      actionName: handleMyBonusTabSwitchClick,
                      payload: { value: item.label },
                    });
                  }}
                >
                  {item.label}
                  {myBonusTabIndex === item.label ? (
                    <img
                      className={cx(
                        'w-full h-full',
                        'absolute bottom-0 left-0'
                      )}
                      src={getImgUrl(EResourceLevel.ICONS, 'record_header')}
                      alt="active"
                    />
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* table */}
          <div className="h-[500px] overflow-y-auto" onScroll={handleOnScroll}>
            {myBonusList.map((item, index) => {
              return (
                <div
                  className={cx(
                    'flex justify-between',
                    'py-3 px-4 box-border',
                    'font-medium',
                    'odd:bgi-[var(--base-2-variant10)]'
                  )}
                  key={index}
                >
                  <div className={cx(FLEX_ITEMS_CENTER, 'gap-8')}>
                    <Icon name="ic_my_bonus_rewards_1" className="w-12 h-12" />
                    <div className={cx(FLEX_COL, 'text-base')}>
                      <span>
                        VIP {item.level}{' '}
                        {t(
                          item.rewardType === VipRewardType.UPGRADE
                            ? 'activity_VIP_my_bonus_table_monthly_rewards'
                            : 'wallet_detail_income_from_vip_monthly_rewards'
                        )}
                      </span>
                      <span className="flex bgi-text-[var(--base-2-variant1)]">
                        {formatDate(item.dateTime, 'YYYY-MM-DD HH:mm:ss')}
                      </span>
                    </div>
                  </div>
                  <div className="text-2xl bgi-text-[var(--base-1-main)]">
                    {formatMoney({ value: item.rewardAmount })}
                  </div>
                </div>
              );
            })}
            {!myBonusList.length ? (
              <NoData styles={{ container: 'py-20' }} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VipBonusPage;
