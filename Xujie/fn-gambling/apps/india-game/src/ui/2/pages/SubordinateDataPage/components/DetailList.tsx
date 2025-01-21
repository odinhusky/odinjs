import AvatarFrame from '@components/AvatarFrame';
import NoData from '@components/NoData';
import { cx, getAvatarOrder } from '@libs/commonUtils';
import { XY_CENTER } from '@libs/constant/style';
import {
  EResourceLevel,
  formatDate,
  formatMoney,
  getImgUrl,
  maskNumbers,
} from '@libs/mode2/utils';
import { useMode2SubordinateDataPageStore } from '@libs/mode2/zustand/page/SubordinateDataStore';
import { t } from 'i18next';

export const DetailList = () => {
  const teamFinanceTierSummaryList = useMode2SubordinateDataPageStore(
    (state) => state.teamFinanceTierSummaryList
  );

  return teamFinanceTierSummaryList?.length ? (
    <div className="text-xs mobile:text-sm tablet:text-base font-medium bgi-text-[var(--transparent-white-70)]">
      {teamFinanceTierSummaryList.map((item, index) => (
        <div
          className="mb-3 p-2 mobile:p-3 box-border flex items-center justify-between rounded bgi-[var(--base-3-50)]"
          key={index}
        >
          <div className="flex items-center">
            <div className="relative shrink-0">
              <img
                className="w-10 h-10"
                src={getImgUrl(
                  EResourceLevel.V,
                  `avatar_${getAvatarOrder(Number(item.avatarId))}`
                )}
                alt=""
              />
              {item.avatarFrameId ? (
                <AvatarFrame
                  className={cx('absolute', XY_CENTER, 'w-11 h-11 max-w-none')}
                  avatarFrameId={item.avatarFrameId}
                  alt="Avatar frame image"
                />
              ) : null}
            </div>
            <div className="ml-3 flex-1 flex flex-col gap-[2px]">
              <div className="flex justify-between">
                <div>
                  <span>{maskNumbers(item.displayName)}</span>
                  <span className="ml-2 bgi-text-[var(--linear-2)]">
                    {t('earn_subordinate_data_level')}
                    {item.tier}
                  </span>
                </div>
              </div>
              <div>
                {t('earn_subordinate_data_item_deposit_amount')}
                <span className="bgi-text-[var(--grayscale-100)] ml-2">
                  {formatMoney(item.depositAmount)}
                </span>
              </div>
              <div>
                {t('earn_subordinate_data_sort_commission')}
                <span className="bgi-text-[var(--grayscale-100)] ml-2">
                  {formatMoney(item.commissionAmount)}
                </span>
              </div>
            </div>
          </div>
          <div className="w-24 text-right">
            {formatDate(item.joinTime, 'DD.MM.YYYY hh:mm:ss')}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <NoData text={t('earn_subordinate_data_no_data')} />
  );
};
