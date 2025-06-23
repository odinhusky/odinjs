import BaseModal from '@libs/components/Modal';
import { useDailyRebateModalBase } from '@libs/mode2/usecase/modal/useDailyRebateModalBase';
import useDailyRebateModalStore from '@libs/mode2/zustand/modal/DailyRebateModal';
import {
  EResourceLevel,
  formatDate,
  formatMoney,
  getImgUrl,
} from '@mode2/utils';
import dayjs from '@commonUtils/localizedDayjs';
import { useEffect, useState } from 'react';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { cx } from '@libs/commonUtils';
import { useTranslation } from 'react-i18next';
import get from 'lodash/get';
import { BaseCacheImg } from '@mode2/components/BaseCacheImg';
import { useDailyRebateModalActions } from '@mode2/action/model/DailyRebateModalAction/useDailyRebateModalActions';
import { handleDailyRebateModalBtnClickAction } from '@mode2/action/actionTypes';

export const DailyRebateModal = () => {
  const { t } = useTranslation();
  useDailyRebateModalBase();

  const { handleDailyRebateModalClick } = useDailyRebateModalActions();

  const isShowDailyRebateModal = useDailyRebateModalStore(
    (state) => state.isShowDailyRebateModal
  );

  const parameter = useDailyRebateModalStore((state) => state.parameter);
  const betTime = get(parameter, 'betTime', dayjs().unix());
  const betsAmount = get(parameter, 'bets', 0);
  const rebateAmount = get(parameter, 'rebate', 0);

  const [showDropAnimation, setShowDropAnimation] = useState(true);

  useEffect(() => {
    let clearTime: NodeJS.Timeout | null = null;
    if (isShowDailyRebateModal) {
      setShowDropAnimation(true);
      clearTime = setTimeout(() => {
        setShowDropAnimation(false);
      }, 2000);
    }
    return () => {
      clearTime && clearTimeout(clearTime);
    };
  }, [isShowDailyRebateModal]);

  return isShowDailyRebateModal ? (
    <BaseModal className="!bgi-[var(--transparent-gray-90)]">
      <div className={'w-[480px] flex flex-col justify-center items-center'}>
        <div
          className={'-mb-[200px] flex flex-col justify-center items-center'}
        >
          <img
            className={'w-[278px] object-contain'}
            alt={'popup_bet_rebate_title'}
            src={getImgUrl(
              EResourceLevel.POPUP_BANNER,
              'popup_bet_rebate_title'
            )}
          />

          <p
            className={
              'bgi-text-[var(--base-2-variant2)] text-base font-medium'
            }
          >
            {formatDate(betTime, 'YYYY.MM.DD')}
          </p>
        </div>

        <div className={'relative'}>
          {showDropAnimation ? (
            <BaseCacheImg
              className={'w-full object-contain absolute'}
              src={getImgUrl(
                EResourceLevel.POPUP_BANNER,
                'popup_bet_rebate_1',
                '.webp'
              )}
              imgName="popup_bet_rebate_1.webp"
              alt={'popup_bet_rebate_1'}
            />
          ) : // <img
          //   className={'w-full object-contain absolute'}
          //   alt={'popup_bet_rebate_1'}
          //   src={getImgUrl(
          //     EResourceLevel.POPUP_BANNER,
          //     'popup_bet_rebate_1',
          //     '.webp'
          //   )}
          // />
          null}

          <BaseCacheImg
            className={cx('w-full object-contain', {
              'opacity-0': showDropAnimation,
              'opacity-100': !showDropAnimation,
            })}
            src={getImgUrl(
              EResourceLevel.POPUP_BANNER,
              'popup_bet_rebate_2',
              '.webp'
            )}
            imgName="popup_bet_rebate_2.webp"
            alt={'popup_bet_rebate_2'}
          />
        </div>

        <div
          className={cx(
            'z-10',
            '-mt-[300px] bgi-text-[var(--base-1-main)] text-lg font-medium w-full px-10',
            'flex flex-col justify-center items-center gap-1.5'
          )}
        >
          <p>
            {t('home_popup_my_bets', {
              bets: formatMoney({ value: betsAmount }),
            })}
          </p>
          <p>
            {t('home_popup_my_rebate', {
              rebate: formatMoney({
                value: rebateAmount,
                includeDecimal: true,
              }),
            })}
          </p>
          <BasePrimaryBtn
            className={cx('font-semibold w-full')}
            onClick={() => {
              handleDailyRebateModalClick({
                actionName: handleDailyRebateModalBtnClickAction,
              });
            }}
            children={t('home_claim_now_button')}
          />
        </div>
      </div>
    </BaseModal>
  ) : null;
};
export default DailyRebateModal;
