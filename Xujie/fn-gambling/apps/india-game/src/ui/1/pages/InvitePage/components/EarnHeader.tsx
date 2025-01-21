import { useImgUrlByBreakPoint } from '@commonUtils/hooks';
import { cx } from '@libs/commonUtils';
import renderI18N from '@libs/commonUtils/renderI18N';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { useMode2InviteEarnStore } from '@mode2/zustand/page/invitePageStore';
import { useTranslation } from 'react-i18next';

export const EarnHeader = () => {
  const { t } = useTranslation();
  const { getImgUrlByBreakPoint } = useImgUrlByBreakPoint();

  const earnHeaderList = useMode2InviteEarnStore(
    (state) => state.earnHeaderList
  );

  return (
    <div className='bgi-[var(--base-1-main)]'>
      <img
        className={'w-full'}
        src={getImgUrlByBreakPoint('earn_banner', EResourceLevel.V, true, true)}
        alt="banner"
      />
      <div className="banner">
        {earnHeaderList.map((v) => {
          return (
            <div
              className={cx(
                'banner-item',
                FLEX_ITEMS_CENTER,
                'box-border',
                'mobile:px-6 mobile:py-3 p-2'
              )}
              key={v.id}
            >
              <img
                src={v.url}
                alt="icon-level"
                className={cx('mobile:h-[42px] h-6 mr-3')}
              />
              <div>
                <div
                  className={cx(
                    'text-sm tablet:text-lg font-semibold',
                    'bgi-text-[var(--linear-4)]'
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
        <img className='w-full' src={getImgUrl(EResourceLevel.V, 'earn_banner_bottom')} alt="" />
      </div>
    </div>
  );
};

export default EarnHeader;
