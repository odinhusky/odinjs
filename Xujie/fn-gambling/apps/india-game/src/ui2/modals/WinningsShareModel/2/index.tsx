import { RefObject, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useSharePageAction from '@mode2/action/sharePageAction/useSharePageAction';
import { cx } from '@libs/commonUtils';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';
import { SocialList } from '@components/SocialList';
import { SocialScenarios } from '@mode2/zustand/components/socialListStore';
import { SocialUnitImageType } from '@mode2/zustand/components/socialListStore';
import { EResourceLevel, formatMoney, getImgUrl } from '@mode2/utils';
import {
  handleSharePageClipboardClick,
  handleSharePagePostTgClick,
  handleSharePagePostWhatsAppClick,
} from '@mode2/action/actionTypes';
import BaseModal from '@libs/components/Modal';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import sdkUtils from '@mode2/utils/sdk';
import { Avatar } from '@components/Avatar';
import Icon from '@components/Icon';
import { QRCodeSVG } from 'qrcode.react';
import { BaseCacheImg } from '@mode2/components/BaseCacheImg';
import useWinningsShareModelBase from '@mode2/usecase/modal/useWinningsShareModelBase';
import useWinningsShareModelStore from '@mode2/zustand/modal/WinningsShareModel';
import useWinningsShareModalActions from '@mode2/action/winningsShareModalAction/useWinningsShareModalActions';
import {
  handleWinningsShareCloseClick,
  handleWinningsShareSaveImageClick,
} from '@mode2/action/actionTypes';

const ReferralQRCode = () => {
  const referralLink = useUserProfileStore((state) => state.referralLink);
  return (
    <div className="w-[72px] h-[72px]">
      {referralLink ? (
        <div className="w-full h-full p-1 bgi-[var(--grayscale-100)]">
          <QRCodeSVG className="w-full h-full" value={referralLink} />
        </div>
      ) : // <QRCode
      null}
    </div>
  );
};

const WinningsShareReferralInfo = () => {
  const { t } = useTranslation();
  const displayUserName = useUserProfileStore((state) => state.displayUserName);
  const referralCode = useUserProfileStore((state) => state.referralCode);
  return (
    <div
      className={cx(
        'w-full',
        'p-3 box-border flex justify-between items-end',
        'bgi-[var(--grayscale-00)]'
      )}
    >
      <div className="flex gap-4">
        <div className="flex flex-col justify-between">
          <Avatar
            rootClassName={cx('!w-6 !h-6', 'rounded-full')}
            className={cx('!w-6 !h-6', 'rounded-full')}
            isShowVIP={false}
          />
          <Icon name={'ic_google'} className={cx('w-6 h-6', 'rounded-full')} />
        </div>
        <div className="text-xxs flex flex-col gap-1.5 bgi-text-[var(--grayscale-100)]">
          <div>
            <span className="">{displayUserName}</span>
          </div>
          <div className="my-1.5">
            <span>{t('ranking_share_invite_code')}:&nbsp;</span>
            <span className="text-base font-bold bgi-text-[#FFE16B]">
              {referralCode}
            </span>
          </div>
          <div className="">
            <span>{t('spin_and_share_wheel_share_search')}:&nbsp;</span>
            <span className="text-base font-bold">
              {sdkUtils.productName()}
            </span>
          </div>
        </div>
      </div>
      <ReferralQRCode />
    </div>
  );
};

const WinningsShareContent = () => {
  const winningAmount = useWinningsShareModelStore(
    (state) => state.winningAmount
  );
  return (
    <div className="relative">
      <BaseCacheImg
        className={cx('')}
        src={getImgUrl(
          EResourceLevel.POPUP_BANNER,
          'popup_player_win_money',
          '.webp'
        )}
        imgName="popup_player_win_money.webp"
        alt={'popup_player_win_money'}
      />

      <div
        className={cx(
          'absolute w-full bottom-0',
          'mb-4',
          'text-center bgi-text-[var(--grayscale-100)] text-base font-medium'
        )}
      >
        <p>You won</p>
        <p className="text-4xl bgi-text-[var(--base-1-variant1)] font-extrabold">
          {formatMoney({
            value: winningAmount,
            showCurrency: false,
            includeDecimal: true,
            includeComma: true,
          })}
        </p>
      </div>
    </div>
  );
};
const WinningsShareFooter = ({
  asImageRef,
}: {
  asImageRef: RefObject<HTMLDivElement | null>;
}) => {
  const { t } = useTranslation();
  const { handleWinningsShareModalClick } = useWinningsShareModalActions();
  const { handleSharePageClick } = useSharePageAction();
  const referralLink = useUserProfileStore((state) => state.referralLink);
  // const gameName = useMode2WebviewPageStore((state) => state.gameName);
  const shareText = `🎉I just won big on [${sdkUtils.productName()}]!💰 Trust me, it‘s a blast - you might be the next lucky winner! Good luck and click here ${referralLink}, let’s see who can win the most! 🙌`;

  return (
    <div
      className={cx(
        MOBILE_BREAK_POINT_MAX_WIDTH,
        'w-screen',
        'fixed bottom-0 left-1/2 -translate-x-1/2',
        'py-5 px-4 box-border',
        'bgi-[var(--base-2-variant12)]'
      )}
    >
      <SocialList
        scenarios={SocialScenarios.NOTHING}
        isShowLabelFromProps={true}
        className="flex justify-center items-center flex-wrap"
        classNameUnit="gap-2 w-20 flex-shrink-0 flex-col flex-wrap"
        iconOuterClassName="p-4 box-border rounded-full bgi-[var(--base-2-variant6)]"
        iconClassName="!w-8 !h-8 rounded-none"
        classNameLabel="text-xs !bgi-text-[var(--base-2-variant1)]"
        isShowLabel={true}
        srcType={SocialUnitImageType.OUTLINE}
        extraList={[
          {
            label: 'Whatsapp',
            icon: getImgUrl(EResourceLevel.SHARED, 'social/icon_whatsapp'),
            onActionClick: () => {
              handleSharePageClick({
                actionName: handleSharePagePostWhatsAppClick,
                payload: {
                  postLinkText: shareText,
                },
              });
            },
          },
          {
            label: 'Telegram',
            icon: getImgUrl(EResourceLevel.SHARED, 'social/icon_telegram'),
            onActionClick: () => {
              handleSharePageClick({
                actionName: handleSharePagePostTgClick,
                payload: {
                  postLinkText: shareText,
                },
              });
            },
          },
          {
            label: 'Save Picture',
            icon: getImgUrl(EResourceLevel.ICONS, 'ic_save'),
            onActionClick: () => {
              handleWinningsShareModalClick({
                actionName: handleWinningsShareSaveImageClick,
                payload: {
                  asImageRef: {
                    current: asImageRef.current,
                  },
                },
              });
            },
          },
          {
            label: t('earn_share_link'),
            icon: getImgUrl(EResourceLevel.ICONS, 'ic_link'),
            onActionClick: () =>
              handleSharePageClick({
                actionName: handleSharePageClipboardClick,
                payload: {
                  shareText,
                },
              }),
          },
        ]}
      />
    </div>
  );
};

export const WinningsShareModel = () => {
  useWinningsShareModelBase();
  const asImageRef = useRef<HTMLDivElement | null>(null);
  const isShowWinningsShareModel = useWinningsShareModelStore(
    (state) => state.isShowWinningsShareModel
  );

  const { handleWinningsShareModalClick } = useWinningsShareModalActions();
  return isShowWinningsShareModel ? (
    <BaseModal className="!bgi-[var(--transparent-gray-90)]">
      <div
        className={cx(
          MOBILE_BREAK_POINT_MAX_WIDTH,
          'w-screen h-screen',
          'fixed top-0 bottom-0 left-0 right-0 z-[1002]'
        )}
      >
        <div
          className={cx(
            'absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3'
          )}
        >
          <Icon
            name="ic_close"
            className="w-9 h-9 mb-3 flex justify-end w-full cursor-pointer"
            onClick={() => {
              handleWinningsShareModalClick({
                actionName: handleWinningsShareCloseClick,
              });
            }}
          />
          <div ref={asImageRef} className="w-[336px] relative" id="captureArea">
            <WinningsShareContent />
            <WinningsShareReferralInfo />
          </div>
        </div>

        <WinningsShareFooter asImageRef={asImageRef} />
      </div>
    </BaseModal>
  ) : null;
};

export default WinningsShareModel;
