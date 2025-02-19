import { EResourceLevel, formatMoney, getImgUrl } from '@mode2/utils';
import { useMyPageStore } from '@mode2/zustand/page/myPageStore';
import cx from '@commonUtils/cx';
import Icon from '@components/Icon';
import BaseProgress from '@libs/mode2/components/BaseProgress';
import useMyPageActions from '@libs/mode2/action/myPageAction/useMyPageActions';
import { handleMyPageVIPDetailBtnClick } from '@libs/mode2/action/myPageAction/acitonType';

export const MyPageVIPBlock = () => {
  // const { t } = useTranslation();
  const { handleMyPageClick } = useMyPageActions();

  const betProgressPercent = useMyPageStore(
    (state) => state.betProgressPercent
  );
  const vipLevel = useMyPageStore((state) => state.vipLevel);

  const bgPath = getImgUrl(
    EResourceLevel.ICONS,
    `profile_vip_cards_${vipLevel}`
  );

  return (
    <div
      className="h-[165px] my-4 w-full relative flex items-end pl-4"
      style={{
        backgroundImage: `url(${bgPath})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleMyPageClick({
          actionName: handleMyPageVIPDetailBtnClick,
        });
      }}
    >
      <div
        className={cx(
          'absolute top-0 right-3',
          'flex items-end gap-2 cursor-pointer'
        )}
      >
        <img
          className="h-24"
          src={getImgUrl(EResourceLevel.ICONS, `vip_rank_${vipLevel}`)}
          alt="vip"
        />
        <Icon name="ic_arrow_right_color" className="w-8 h-8" />
      </div>

      <div className={cx('mb-5 w-full')}>
        {/* TODO i18n TODO Ronan 累計存款升級VIP對不上 等下次同步會議向Evan確認 */}
        <div className="text-sm mb-1 font-medium bgi-text-[#9F714F]">
          Upgrade to VIP{vipLevel + 1}&nbsp;
          <span className="bgi-text-[var(--base-2-variant3)]">
            with {formatMoney(5000)}
          </span>{' '}
          left
        </div>
        <BaseProgress
          percent={betProgressPercent}
          strokeWidth={6}
          trailClass="w-2/3 bgi-[var(--base-1-60)]"
          strokeClass="bgi-[var(--linear-14)]"
        />
      </div>
    </div>
  );
};

export default MyPageVIPBlock;
