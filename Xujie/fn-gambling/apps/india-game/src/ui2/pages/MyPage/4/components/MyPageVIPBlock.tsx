import { EResourceLevel, formatMoney, getImgUrl } from '@mode2/utils';
import { useMyPageStore } from '@mode2/zustand/page/myPageStore';
import cx from '@commonUtils/cx';
import Icon from '@components/Icon';
import BaseProgress from '@libs/mode2/components/BaseProgress';
import useMyPageActions from '@libs/mode2/action/myPageAction/useMyPageActions';
import { handleMyPageVIPPageBtnClick } from '@mode2/action/actionTypes';
import { Trans } from 'react-i18next';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';

export const MyPageVIPBlock = () => {
  const { handleMyPageClick } = useMyPageActions();

  const vipProgressPercent = useMyPageStore(
    (state) => state.vipProgressPercent
  );
  const level = useUserProfileStore((state) => state.level);
  const lackRechargeAmount = useMyPageStore(
    (state) => state.lackRechargeAmount
  );

  const bgPath = getImgUrl(EResourceLevel.ICONS, `profile_vip_cards_${level}`);

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
          actionName: handleMyPageVIPPageBtnClick,
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
          src={getImgUrl(EResourceLevel.ICONS, `vip_rank_${level}`)}
          alt="vip"
        />
        <Icon name="ic_arrow_right_color" className="w-8 h-8" />
      </div>

      <div className={cx('mb-5 w-full')}>
        <div className="text-sm mb-1 font-medium bgi-text-[#9F714F]">
          <Trans
            i18nKey="profile_vip_upgrade_requirement"
            values={{
              vipLevel: level + 1,
              vipRechargeAmount: formatMoney({
                value: lackRechargeAmount,
                includeDecimal: true,
              }),
            }}
            components={{
              upgradeRequiredAmount: (
                <span className="bgi-text-[var(--base-2-variant3)]" />
              ),
            }}
          />
        </div>
        <BaseProgress
          percent={vipProgressPercent}
          strokeWidth={6}
          trailClass="w-2/3 bgi-[var(--base-1-60)]"
          strokeClass="bgi-[var(--linear-14)]"
        />
      </div>
    </div>
  );
};

export default MyPageVIPBlock;
