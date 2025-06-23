import { SocialUnitImageType } from '@libs/mode2/zustand/components/socialListStore';
import { Avatar } from '@components/Avatar';
import Icon from '@components/Icon';
import { SocialList } from '@components/SocialList';
import { cx } from '@libs/commonUtils';
import BaseModal from '@libs/components/Modal';
import {
  FLEX_CENTER,
  MOBILE_BREAK_POINT_MAX_WIDTH,
} from '@libs/constant/style';
import {
  handleRankingPageHeaderShareBtnClick,
  handleSharePagePostTgClick,
  handleSharePagePostWhatsAppClick,
  handleShareSaveImageClick,
} from '@mode2/action/actionTypes';
import useRankingPageActions from '@libs/mode2/action/rankingPageAction/useRankingPageActions';
import { handleSharePageClipboardClick } from '@mode2/action/actionTypes';
import useSharePageAction from '@libs/mode2/action/sharePageAction/useSharePageAction';
import { EResourceLevel, formatMoney, getImgUrl } from '@libs/mode2/utils';
import sdkUtils from '@libs/mode2/utils/sdk';
import { SocialScenarios } from '@libs/mode2/zustand/components/socialListStore';
import { useRankingPageStore } from '@libs/mode2/zustand/page/RankingPage/rankingPageStore';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import RankingContentSummary from '../../components/RankingContentSummary';
import { QRCodeSVG } from 'qrcode.react';
import { memo, RefObject, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const ReferralQRCode = () => {
  const referralLink = useUserProfileStore((state) => state.referralLink);
  return (
    <div className="w-[72px] h-[72px]">
      {referralLink ? (
        <div className="w-full h-full p-1 bgi-[var(--grayscale-100)]">
          <QRCodeSVG className="w-full h-full" value={referralLink} />
        </div>
      ) : // <QRCode
      //   bgColor="white"
      //   style={{
      //     width: '100%',
      //     height: '100%',
      //     background: '#FFFFFF',
      //     padding: '0.25rem',
      //     borderRadius: '0',
      //   }}
      //   value={referralLink}
      // />
      null}
    </div>
  );
};

const RankingContentSummaryContent = memo(() => {
  return (
    <div className={'bgi-[var(--background-middle)]'}>
      <RankingContentSummary
        isModalMode={true}
        styles={{
          top3Section: '-bottom-[54px]',
          JockPotSectionAnimateCounterBox: '!bottom-[19%]',
          JockPotSectionAnimateCounter: '!h-7',
          JockPotSectionText: '!-bottom-8',
        }}
      />
    </div>
  );
});

const RankingShareReferralInfo = () => {
  const { t } = useTranslation();
  const displayUserName = useUserProfileStore((state) => state.displayUserName);
  const referralCode = useUserProfileStore((state) => state.referralCode);
  return (
    <div
      className={cx(
        'absolute bottom-0',
        'w-full',
        'p-3 box-border flex justify-between items-end',
        'bgi-[var(--base-2-variant13)]'
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

const RankingShareFooter = ({
  asImageRef,
}: {
  asImageRef: RefObject<HTMLDivElement | null>;
}) => {
  const { t } = useTranslation();
  const { handleRankingPageClick } = useRankingPageActions();
  const { handleSharePageClick } = useSharePageAction();
  const referralLink = useUserProfileStore((state) => state.referralLink);

  const money = formatMoney({ value: 2000000 });
  const shareText = `Secrets! Play ${sdkUtils.productName()} to split ${money} free every day, click here! ${referralLink}`;

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
              handleRankingPageClick({
                actionName: handleShareSaveImageClick,
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
                  shareText: `Secrets! Play ${sdkUtils.productName()} to split ${formatMoney(
                    { value: 2000000 }
                  )} free every day, click here! ${referralLink}`,
                },
              }),
          },
        ]}
      />
    </div>
  );
};

export const RankingShareModal = () => {
  const { handleRankingPageClick } = useRankingPageActions();

  const isShowRankingShareModal = useRankingPageStore(
    (state) => state.isShowRankingShareModal
  );

  const asImageRef = useRef<HTMLDivElement | null>(null);

  const handleClose = () => {
    handleRankingPageClick({
      actionName: handleRankingPageHeaderShareBtnClick,
      payload: {
        isShowRankingShareModal: false,
      },
    });
  };

  useEffect(() => {
    return () => {
      handleClose();
    };
  }, []);

  return isShowRankingShareModal ? (
    <BaseModal className={cx('bgi-[var(--transparent-gray-90)]')}>
      <div
        className={cx(
          MOBILE_BREAK_POINT_MAX_WIDTH,
          'w-screen h-screen',
          'fixed top-0 bottom-0 left-0 right-0 z-[1002]',
          ''
        )}
      >
        <div className={cx('bgi-text-[var(--grayscale-100)]')}>
          <div
            className={cx(
              'absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3'
            )}
          >
            <Icon
              name="ic_close"
              className="w-9 h-9 mb-3 flex justify-end w-full cursor-pointer"
              onClick={() => handleClose()}
            />
            <div
              ref={asImageRef}
              className="w-[336px] h-[526px] relative"
              id="captureArea"
            >
              <div
                className={cx(
                  'h-12 w-full bgi-[var(--base-2-variant5)] bg-shadow-[var(--ranking-share-modaal-header)]',
                  FLEX_CENTER
                )}
              >
                <span className="text-lg font-bold bgi-text-[var(--base-1-variant5)]">
                  {sdkUtils.productName()}
                </span>
              </div>

              <RankingContentSummaryContent />

              <RankingShareReferralInfo />
            </div>
          </div>

          <RankingShareFooter asImageRef={asImageRef} />
        </div>
      </div>
    </BaseModal>
  ) : null;
};
