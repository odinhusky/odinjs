import { EResourceLevel, getImgUrl } from '@mode2/utils';
import {
  handleTeamClubPageClipboardRecommendedCodeClick,
  handleTeamClubPageClipboardRecommendedLinkClick,
  handleTeamClubPageContactNowClick,
} from '@mode2/action/actionTypes';
import { SocialList } from '@components/SocialList';
import { SocialScenarios } from '@mode2/zustand/components/socialListStore';
import sdkUtils from '@mode2/utils/sdk';
import { useTranslation } from 'react-i18next';
import Icon from '@components/Icon';
import { cx } from '@libs/commonUtils';
import { FLEX_CENTER } from '@libs/constant/style';
import useTeamClubPageActions from '@mode2/action/teamClubPageAction/useTeamClubPageActions';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';

/**
 * 社群分享Block
 * - 社群分享link
 * - 複製推薦連結
 * - 複製推薦碼
 * - 官方Telegram群組連結
 */
export const ShareToSocialBlock = () => {
  const { t } = useTranslation();
  const referralCode = useUserProfileStore((state) => state.referralCode);
  const referralLink = useUserProfileStore((state) => state.referralLink);
  const { handleTeamClubPageClick } = useTeamClubPageActions();

  return (
    <div
      className={cx(
        'bottom',
        'box-border',
        'p-6',
        'rounded-lg',
        'bgi-[var(--grayscale-20)]'
      )}
    >
      <div
        className={cx(
          'text-base mobile:text-lg',
          'pb-2 mobile:pb-3',
          'bgi-text-[var(--grayscale-100)]',
          'font-semibold',
          'text-center',
          'border-b-[var(--grayscale-50)] border-b border-solid'
        )}
      >
        {t('earn_money_social_community_share_with_your_social')}
      </div>

      <div className={cx('w-full', FLEX_CENTER, 'flex-col gap-3', 'mx-0 my-4')}>
        <SocialList scenarios={SocialScenarios.INVITE_PAGE} />
      </div>

      <div className={cx('earn-share-copy-box')}>
        <div className={cx('earn-share-copy-title')}>
          {t('earn_money_social_community_recommended_link')}
        </div>
        <div className={cx('earn-share-href')}>
          <div className={cx('earn-share-href-text')}>{referralLink}</div>

          <div
            onClick={() => {
              handleTeamClubPageClick({
                actionName: handleTeamClubPageClipboardRecommendedLinkClick,
                payload: {
                  link: referralLink,
                },
              });
            }}
          >
            <Icon className="earn-share-href-icon-copy" name="ic_copy" />
          </div>
        </div>
      </div>

      <div className={cx('earn-share-copy-box')}>
        <div className={cx('earn-share-copy-title')}>
          {t('earn_money_social_community_referral_code')}
        </div>
        <div className={cx('earn-share-href')}>
          <div className={cx('earn-share-href-text')}>{referralCode}</div>

          <div
            onClick={() => {
              handleTeamClubPageClick({
                actionName: handleTeamClubPageClipboardRecommendedCodeClick,
                payload: {
                  code: referralCode,
                },
              });
            }}
          >
            <Icon className="earn-share-href-icon-copy" name="ic_copy" />
          </div>
        </div>
      </div>

      <div
        className={cx(
          'w-full',
          'text-base mobile:text-lg',
          'text-center font-semibold',
          'bgi-text-[var(--grayscale-100)]'
        )}
      >
        {t('earn_money_notice_title', {
          productName: sdkUtils.productName(),
        })}
      </div>

      <div className="bottom-item">
        {/* <button> */}
        <Icon
          className={'icon-button p-2 object-contain w-12 h-12'}
          level={EResourceLevel.SHARED}
          name={'social/icon_telegram'}
        />
        {/* </button> */}
        <div className="desc text-sm mobile:text-base font-normal bgi-text-[var(--grayscale-100)]">
          <div className="desc-item">{t('earn_money_notice_1-1')}</div>
          <div className="desc-item">{t('earn_money_notice_1-2')}</div>
          <div className="desc-item">{t('earn_money_notice_1-3')}</div>
        </div>
      </div>
      <div className="bottom-item">
        <img src={getImgUrl(EResourceLevel.V, 'earn_coins')} alt="coins" />
        <div>
          <div className="desc">
            {t('earn_money_notice_2-1')}
            <div
              className="desc-contact"
              onClick={() => {
                handleTeamClubPageClick({
                  actionName: handleTeamClubPageContactNowClick,
                });
              }}
            >
              <a className="bgi-text-[var(--state-warn-main)]">
                {t('earn_money_notice_contact')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareToSocialBlock;
