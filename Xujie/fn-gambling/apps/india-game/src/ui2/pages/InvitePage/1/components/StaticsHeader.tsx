import { useImgUrlByBreakPoint } from '@commonUtils/hooks';
import { cx } from '@libs/commonUtils';
import renderI18N from '@libs/commonUtils/renderI18N';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { useMode2InvitePageStaticsStore } from '@mode2/zustand/page/invitePageStore';
import { useTranslation } from 'react-i18next';

export const StaticsHeader = () => {
  const { t } = useTranslation();
  const { getImgUrlByBreakPoint } = useImgUrlByBreakPoint();

  const statisticsHeaderList = useMode2InvitePageStaticsStore(
    (state) => state.statisticsHeaderList
  );

  return (
    <div>
      <img
        className={'w-full'}
        src={getImgUrlByBreakPoint('statistics_banner', EResourceLevel.V, true, true)}
        alt="banner"
      />

      <div className={cx('statistics-banner', 'bgi-[var(--base-1-main)]')}>
        {statisticsHeaderList.map((v) => {
          return (
            <div
              className="statistics-banner-item"
              key={`statisticsHeaderList - ${v.title}`}
            >
              <img
                src={v.url}
                alt="icon-level"
                className="statistics-banner-icon-level"
              />
              <div>
                <div className="statistics-banner-desc">
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

export default StaticsHeader;
