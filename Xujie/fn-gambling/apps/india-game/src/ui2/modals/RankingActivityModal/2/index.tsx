import Icon from '@components/Icon';
import { cx, useDurationCountDown } from '@libs/commonUtils';
import BaseModal from '@libs/components/Modal';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';
import {
  EResourceLevel,
  formatCountdownTime,
  formatMoney,
  getImgUrl,
} from '@libs/mode2/utils';
import useRankingActivityModalStore from '@mode2/zustand/modal/RankingActivityModal';
import useRankingActivityModalBase from '@libs/mode2/usecase/modal/useRankingActivityModalBase';
import Checkbox from '@libs/mode2/components/Checkbox';
import { useTranslation } from 'react-i18next';
import useRankingActivityModalAction from '@mode2/action/rankingActivityModalAction';
import {
  handleRankingActivityModalClose,
  handleRankingActivityModalGetMoneyBtnClick,
} from '@mode2/action/actionTypes';
import {
  FLEX_CENTER,
  FLEX_COL,
  FLEX_ITEMS_CENTER,
  FLEX_JUSTIFY_CENTER,
  X_CENTER,
} from '@libs/constant/style';
import { handleRankingActivityFirstChargeModalNotShowTodayClick } from '@mode2/action/actionTypes';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import AnimateCounter from '@components/AnimateCounter';
import { RankingRateInfoResult } from '@libs/mode2/external/api/endpoint/ranking/PostRankingRulesEndpoint';
import { useMemo } from 'react';
import isArray from 'lodash/isArray';
import dayjs from '@commonUtils/localizedDayjs';
import { CloseBtnUnit } from '@modals/BaseModalCloseButton';
import {
  ScreenOrientationType,
  useTemplateLayoutStore,
} from '@libs/mode2/zustand/template/templateLayoutStore';

interface RankingRuleColumn extends RankingRateInfoResult {
  icon?: string;
}

export const RankingActivityModal = () => {
  const { t } = useTranslation();

  // = ClassNames
  const thClass = cx(
    'block',
    'text-center text-sm',
    'flex-1',
    'bgi-text-[var(--base-2-variant1)]'
  );

  const tdClass = cx('block', 'text-center', 'flex-1');

  useRankingActivityModalBase();
  const isShowRankingActivityModal = useRankingActivityModalStore(
    (state) => state.isShowRankingActivityModal
  );

  const isNotShowToday = useRankingActivityModalStore(
    (state) => state.isNotShowToday
  );

  // const jockPotNumber = 1801170.42;

  const rankingRulesResult = useRankingActivityModalStore(
    (state) => state.rankingRulesResult
  );

  const screenOrientation = useTemplateLayoutStore(
    (state) => state.screenOrientation
  );

  // 實作倒數機制
  const rankingRulesResultExpiredUnixTime = rankingRulesResult.expiredAt;
  const currentTimeUnit = dayjs().unix();
  const countDiffSeconds = rankingRulesResultExpiredUnixTime - currentTimeUnit;

  const { remainSec } = useDurationCountDown({
    duration: countDiffSeconds,
    key: 'RankingActivityModelCountDown',
  });

  const rankingRatesList: RankingRuleColumn[] = useMemo(() => {
    return rankingRulesResult.rankingRates.slice(0, 7).map((item) => {
      return {
        ...item,
        icon: ['1', '2', '3'].includes(item.rank)
          ? `ic_ranking_${item.rank}`
          : undefined,
      };
    });
  }, [rankingRulesResult.rankingRates]);

  const { handleRankingActivityModalClick } = useRankingActivityModalAction();

  const onClose = () => {
    handleRankingActivityModalClick({
      actionName: handleRankingActivityModalClose,
    });
  };

  const ItemColorMapping: Record<number, string> = {
    0: 'bgi-[var(--linear-8)]',
    1: 'bgi-[var(--linear-9)]',
    2: 'bgi-[var(--linear-10)]',
  };
  // const getItemColor = (index: number) => {
  //   '--linear-8';
  //   '--linear-9';
  //   '';
  //   return 'bgi-[var(--transparent-gray-30)]';
  // };

  return isShowRankingActivityModal ? (
    <BaseModal
      // onClick={onClose}
      className={cx('!bgi-[var(--transparent-gray-90)]', {
        '!justify-start pt-20':
          screenOrientation === ScreenOrientationType.Portrait,
      })}
    >
      <>
        <div className="w-96 relative">
          {/* 關閉按鈕 */}
          <div className="w-full flex justify-end items-end mb-4 ">
            <CloseBtnUnit
              customClass="!border-none w-9 h-9 !p-0 rounded-none"
              onClose={onClose}
            />
          </div>

          {/* 金額 */}
          <div className={cx('absolute top-[28%] z-[2]', X_CENTER)}>
            <AnimateCounter
              to={rankingRulesResult.jackpotAmount}
              isImage={true}
              leadingUnitImgName=""
              isUserFormatterInImage={true}
              digitClass={cx('h-[28px]')}
              formatter={(value) =>
                formatMoney({
                  value,
                  showCurrency: false,
                  includeDecimal: value === 0 ? false : true,
                })
              }
              imageDigitNameFn={(char) => {
                return `number_imgs_v2_${
                  char === '.' ? 'period' : char === ',' ? 'comma' : char
                }`;
              }}
            />
          </div>
          {/* 主圖撐開高度 */}
          <BaseCacheImg
            className={cx('w-96 cursor-pointer')}
            src={getImgUrl(EResourceLevel.POPUP_BANNER, 'popup_jackpot')}
            imgName="popup_jackpot"
            alt={'popup_jackpot'}
            onClick={(e) => {
              onClose();
            }}
          />

          {/* 列表 */}
          <div
            className={cx(
              'w-full h-[270px]',
              'px-5',
              'absolute bottom-[2px] left-0 z-[2]',
              'overflow-y-hidden',
              FLEX_COL,
              'gap-2'
            )}
          >
            {/* 最上方標題 */}
            <div
              className={cx(
                FLEX_ITEMS_CENTER,
                'w-full',
                'rounded',
                'py-[6px]',
                // 'bgi-[var(--base-2-variant10)]',
                'bgi-[var(--transparent-gray-30)]'
              )}
            >
              <span className={cx(thClass)}>
                {t('ranking_rules_award_rank')}
              </span>
              <span className={cx(thClass)}>{t('ranking_daily_tab')}</span>
              <span className={cx(thClass)}>{t('ranking_weekly_tab')}</span>
              <span className={cx(thClass)}>{t('ranking_monthly_tab')}</span>
            </div>

            {/* 內容 */}
            <div className={cx(FLEX_COL, 'gap-1')}>
              {rankingRatesList &&
              isArray(rankingRatesList) &&
              rankingRatesList.length > 0
                ? rankingRatesList.map((item, index) => (
                    <div
                      key={item.indexKey}
                      className={cx(
                        FLEX_ITEMS_CENTER,
                        'w-full',
                        'rounded',
                        'py-[6px]',
                        'h-[32px]',
                        // 'bgi-[var(--base-2-variant10)]',
                        ItemColorMapping[index]
                          ? ItemColorMapping[index]
                          : 'bgi-[var(--transparent-gray-30)]',
                        {}
                      )}
                    >
                      <span
                        className={cx(tdClass, FLEX_CENTER, {
                          'bgi-text-[var(--base-1-main)] text-lg': !item.icon,
                        })}
                      >
                        {item.icon ? <Icon name={item.icon} /> : item.rank}
                      </span>
                      <span className={cx(thClass)}>{item.dailyRate}%</span>
                      <span className={cx(thClass)}>{item.weeklyRate}%</span>
                      <span className={cx(thClass)}>{item.monthlyRate}%</span>
                    </div>
                  ))
                : null}
            </div>
          </div>
        </div>

        <div className={cx(FLEX_COL, 'gap-[6px]', 'mt-3 mb-5')}>
          {/* Countdown */}
          <div
            className={cx(
              FLEX_CENTER,
              'bgi-text-[var(--grayscale-100)]',
              'text-2xl'
            )}
          >
            <span className={'block'}>Ends in</span>
            {/*<span className={'block'}>hh:mm:ss</span>*/}
            <span className={'block ml-3'}>
              {/* {formatDate(rankingRulesResult.expiredAt, 'HH:mm:ss')} */}
              {formatCountdownTime(remainSec)}
            </span>
          </div>

          <span
            className={cx(
              'block',
              'text-sm',
              'bgi-text-[var(--base-1-main)]',
              'text-center'
            )}
          >
            ₹2000000+ Race-24 Hours
          </span>

          <div className={cx(FLEX_JUSTIFY_CENTER)}>
            <Checkbox
              checked={isNotShowToday}
              onChange={() => {
                handleRankingActivityModalClick({
                  actionName:
                    handleRankingActivityFirstChargeModalNotShowTodayClick,
                  payload: { value: !isNotShowToday },
                });
              }}
              label={t('home_popup_donot_show_again')}
              checkName={getImgUrl(EResourceLevel.ICONS, 'ic_check_box')}
              uncheckName={getImgUrl(
                EResourceLevel.ICONS,
                'ic_check_box_unchecked'
              )}
            />
          </div>
        </div>

        {/* // TODO I18N Odin */}
        <div className={cx(FLEX_CENTER)}>
          <BasePrimaryBtn
            className={cx('w-[196px] h-[44px]')}
            children={t('Get Money')}
            onClick={() => {
              handleRankingActivityModalClick({
                actionName: handleRankingActivityModalGetMoneyBtnClick,
              });
            }}
          />
        </div>
      </>
    </BaseModal>
  ) : null;
};

export default RankingActivityModal;
