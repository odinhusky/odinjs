import NoData from '@components/NoData';
import { cx, getAvatarOrder } from '@libs/commonUtils';
import {
  EResourceLevel,
  formatDate,
  formatMoney,
  getImgUrl,
  maskNumbers,
} from '@libs/mode2/utils';
import { useMode2SubordinateDataPageStore } from '@libs/mode2/zustand/page/SubordinateDataStore';
import { useTranslation } from 'react-i18next';

export const DetailList = () => {
  const { t } = useTranslation();

  const teamFinanceTierSummaryList = useMode2SubordinateDataPageStore(
    (state) => state.teamFinanceTierSummaryList
  );

  return teamFinanceTierSummaryList?.length ? (
    <div
      className={cx(
        'text-sm font-medium bgi-text-[var(--transparent-white-70)]',
        'flex flex-col gap-3'
      )}
    >
      {teamFinanceTierSummaryList.map((item, index) => (
        <div
          className={cx(
            'p-3 box-border flex  justify-between ',
            'rounded-lg bgi-[var(--base-2-variant6)] '
          )}
          key={index}
        >
          <div className="flex items-center bgi-text-[var(--base-2-variant1)]">
            <div className="relative shrink-0 bgi-border-[var(--base-1-variant3)] rounded-full">
              <img
                className="w-14 h-14"
                src={getImgUrl(
                  EResourceLevel.V,
                  `avatar_${getAvatarOrder(Number(item.avatarId))}`
                )}
                alt=""
              />
              {/* TODO Ronan 判斷是否為新成員 */}
              <div
                className={cx(
                  'w-11',
                  'absolute -bottom-1.5 left-1/2 -translate-x-1/2 right-0 z-10 rounded-full',
                  'bgi-[var(--base-2-variant8)]'
                )}
              >
                <div className="text-center bgi-border-[var(--base-2-variant1)] rounded-full">
                  <span className="text-xs bgi-text-[var(--base-2-variant1)]">
                    NEW
                  </span>
                </div>
              </div>
            </div>
            <div className="ml-3 flex-1 flex flex-col gap-[2px]">
              <div className="flex justify-between">
                <div className="flex items-center gap-1">
                  <span>{maskNumbers(item.displayName)}</span>
                  <span
                    className={cx(
                      'text-xxs px-1.5 py-0.5',
                      'bgi-text-[var(--base-1-main)] bgi-[var(--base-2-variant3)] rounded-full'
                    )}
                  >
                    {t('earn_subordinate_data_level')}
                    {item.tier}
                  </span>
                </div>
              </div>
              <div>
                {t('earn_subordinate_data_item_deposit_amount')}:
                <span className="bgi-text-[var(--base-1-main)] ml-2">
                  {formatMoney(item.depositAmount)}
                </span>
              </div>
              <div>
                {t('earn_subordinate_data_sort_commission')}:
                <span className="bgi-text-[var(--base-1-main)] ml-2">
                  {formatMoney(item.commissionAmount)}
                </span>
              </div>
            </div>
          </div>
          <div className="text-xs text-right bgi-text-[var(--base-2-variant1)]">
            {formatDate(item.joinTime, 'YYYY-MM-DD. hh:mm:ss')}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <NoData text={t('earn_subordinate_data_no_data')} />
  );
};
