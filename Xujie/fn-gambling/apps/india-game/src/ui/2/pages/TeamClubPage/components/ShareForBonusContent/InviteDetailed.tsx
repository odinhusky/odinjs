import BasePrimaryBtn from '@components/BasePrimaryBtn';
import RulesContainer from '@components/RulesContainer';
import RulesImgTitle from '@components/RulesImgTitle';
import renderI18N from '@libs/commonUtils/renderI18N';
import { handleTeamClubPageShareForBonusTabLearnMoreClick } from '@libs/mode2/action/teamClubPageAction/actionType';
import useTeamClubPageActions from '@libs/mode2/action/teamClubPageAction/useTeamClubPageActions';
import sdkUtils from '@libs/mode2/utils/sdk';
import { useTranslation } from 'react-i18next';

export const InviteDetailed = () => {
  const { t } = useTranslation();
  const { handleTeamClubPageClick } = useTeamClubPageActions();
  const productName = sdkUtils.productName();
  const inviteInfos = [
    {
      title: { i18nKey: 'earn_how_to_invite_share_link_or_qr_code_title' },
      content: { i18nKey: 'earn_how_to_invite_share_link_or_qr_code_text' },
    },
    {
      title: { i18nKey: 'earn_how_to_invite_invite_friends_title' },
      content: { i18nKey: 'earn_how_to_invite_invite_friends_text' },
    },
    {
      title: { i18nKey: 'earn_how_to_invite_earn_rewards_title' },
      content: {
        i18nKey: 'earn_how_to_invite_earn_rewards_text',
        i18nOption: { productName: productName },
      },
    },
  ];
  return (
    <div>
      <RulesImgTitle
        className="mb-3"
        classNameText="drop-shadow-[0px_2px_2px_#33333340]"
        title={{ i18nKey: 'earn_share_for_bonus_how_to_invite_title' }}
      />
      <RulesContainer
        className="bgi-border-[var(--base-2-light)]"
        children={
          <div className="flex flex-col gap-4 p-3">
            <div className="flex flex-col gap-1">
              {inviteInfos.map((item, index) => (
                <div key={index} className="flex gap-[2px] text-sm font-normal">
                  <div className="bgi-text-[var(--linear-2)]">{index + 1}.</div>
                  <div className="flex flex-col gap-[2px]">
                    <div className="bgi-text-[var(--linear-2)]">
                      {renderI18N(item.title, t)}
                    </div>
                    <div className="bgi-text-[var(--grayscale-100)]">
                      {renderI18N(item.content, t)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <BasePrimaryBtn
              className="z-[1]"
              classNameText="text-base font-semibold"
              children={
                <>
                  {renderI18N(
                    { i18nKey: 'earn_how_to_invite_learn_more_button' },
                    t
                  )}
                </>
              }
              onClick={() => {
                handleTeamClubPageClick({
                  actionName: handleTeamClubPageShareForBonusTabLearnMoreClick,
                });
                window.scrollTo(0, 0);
              }}
            />
          </div>
        }
      />
    </div>
  );
};
