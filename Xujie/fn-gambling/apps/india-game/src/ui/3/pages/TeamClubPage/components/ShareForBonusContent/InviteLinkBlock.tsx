import {
  handleTeamClubPageClipboardRecommendedLinkClick,
  handleTeamClubPageSaveRecommendedBarCodeClick,
} from '@libs/mode2/action/teamClubPageAction/actionType';
import Icon from '@components/Icon';
import renderI18N from '@libs/commonUtils/renderI18N';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import useTeamClubPageActions from '@libs/mode2/action/teamClubPageAction/useTeamClubPageActions';
import { QRCode } from 'antd';
import { SocialList } from '@components/SocialList';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SocialScenarios } from '@libs/mode2/zustand/components/socialListStore';
import { useMode2InviteEarnStore } from '@libs/mode2/zustand/page/invitePageStore';
import RulesImgTitle from '@components/RulesImgTitle';
import RulesContainer from '@components/RulesContainer';

export const InviteLinkBlock = () => {
  const { t } = useTranslation();
  const asImageRef = useRef<HTMLDivElement>(null);
  const referralInfo = useMode2InviteEarnStore((state) => state.referralInfo);
  const { handleTeamClubPageClick } = useTeamClubPageActions();
  return referralInfo && referralInfo.link ? (
    <div>
      <RulesImgTitle
        className="mb-3"
        classNameText="drop-shadow-[0px_2px_2px_#33333340]"
        title={{ i18nKey: 'earn_share_for_bonus_invite_to_earn_rewards_title' }}
      />
      <RulesContainer
        className="bgi-border-[var(--base-2-light)]"
        children={
          <div className="flex flex-col gap-4 rounded-lg py-5 px-3 items-center">
            <div ref={asImageRef} className="max-w-[160px]">
              <QRCode
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#FFFFFF',
                  padding: '0.75rem',
                  borderRadius: '0.25rem',
                }}
                value={referralInfo.link}
              />
            </div>
            <BasePrimaryBtn
              className="w-auto h-auto z-[1] py-1 px-8"
              classNameText="text-sm bgi-text-[var(--grayscale-100)] font-medium"
              children={
                <>
                  {renderI18N(
                    { i18nKey: 'earn_share_for_bonus_save_qr_code_button' },
                    t
                  )}
                </>
              }
              onClick={() => {
                handleTeamClubPageClick({
                  actionName: handleTeamClubPageSaveRecommendedBarCodeClick,
                  payload: {
                    asImageRef: asImageRef,
                  },
                });
              }}
            />
            <div className="flex flex-col gap-1 w-full items-center">
              <div className="text-sm bgi-text-[var(--linear-2)] font-medium">
                {renderI18N(
                  { i18nKey: 'earn_share_for_bonus_my_referral_link' },
                  t
                )}
              </div>
              <div
                className="flex gap-2 w-full bgi-[var(--transparent-white-20)] rounded
                    py-2 px-3 justify-between items-center"
              >
                <p className="text-xs bgi-text-[var(--grayscale-90)] font-normal truncate">
                  {referralInfo.link}
                </p>
                <button
                  className="z-[1]"
                  onClick={() => {
                    handleTeamClubPageClick({
                      actionName:
                        handleTeamClubPageClipboardRecommendedLinkClick,
                      payload: {
                        link: referralInfo.link,
                      },
                    });
                  }}
                >
                  <Icon name={'ic_copy'} />
                </button>
              </div>
            </div>
            <div className="flex flex-col w-full max-w-80 gap-1 items-center">
              <div className="text-sm bgi-text-[var(--linear-2)] font-medium">
                {renderI18N(
                  { i18nKey: 'earn_share_for_bonus_share_to_social_community' },
                  t
                )}
              </div>
              <div className="flex gap-2 w-full bgi-[var(--transparent-white-20)] rounded py-2 px-3 justify-center items-center z-[1]">
                <SocialList
                  classNameUnit="item-scale-anim"
                  scenarios={SocialScenarios.INVITE_PAGE}
                />
              </div>
            </div>
          </div>
        }
      />
    </div>
  ) : null;
};
