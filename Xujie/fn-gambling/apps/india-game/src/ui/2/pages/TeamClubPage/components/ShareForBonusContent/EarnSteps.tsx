import { useImgUrlByBreakPoint } from '@commonUtils/hooks';
import { cx } from '@libs/commonUtils';
import renderI18N from '@libs/commonUtils/renderI18N';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { useMode2TeamClubPageShareForBonusStore } from '@mode2/zustand/page/teamClubPageStore';
import { useTranslation } from 'react-i18next';

/** 邀請賺錢步驟＆Banner */
export const EarnSteps = () => {
  const { t } = useTranslation();
  const { getImgUrlByBreakPoint } = useImgUrlByBreakPoint();

  const earnStepList = useMode2TeamClubPageShareForBonusStore(
    (state) => state.earnStepList
  );

  return (
    <div>
      <img
        className={'rounded-t-lg mobile:rounded-t-none w-full'}
        src={getImgUrlByBreakPoint('earn_banner', EResourceLevel.V, true, true)}
        alt="banner"
      />
      <div className="banner">
        {earnStepList.map((v) => {
          return (
            <div
              className={cx(
                'banner-item',
                FLEX_ITEMS_CENTER,
                'box-border',
                'px-6 py-3'
              )}
              key={v.id}
            >
              <img
                src={v.url}
                alt="icon-level"
                className={cx('w-[60px] h-[60px] mr-3')}
              />
              <div>
                <div
                  className={cx(
                    'text-sm tablet:text-lg font-semibold',
                    'bgi-text-[var(--linear-2)]'
                  )}
                >
                  {renderI18N(v.title, t)}
                </div>

                <div
                  className={cx(
                    'text-xs mobile:text-base',
                    'font-medium',
                    'bgi-text-[var(--grayscale-100)]'
                  )}
                >
                  {renderI18N(v.desc, t)}
                </div>
              </div>
            </div>
          );
        })}
        <img src={getImgUrl(EResourceLevel.V, 'earn_banner_bottom')} alt="" />
      </div>
    </div>
  );
};

export default EarnSteps;
