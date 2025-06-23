import RulesContainer from '@components/RulesContainer';
import RulesImgTitle from '@components/RulesImgTitle';
import renderI18N from '@libs/commonUtils/renderI18N';
import { handleTeamClubPageContactNowClick } from '@mode2/action/actionTypes';
import useTeamClubPageActions from '@libs/mode2/action/teamClubPageAction/useTeamClubPageActions';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { useTranslation } from 'react-i18next';

export const InviteTelegramGroup = () => {
  const { t } = useTranslation();
  const { handleTeamClubPageClick } = useTeamClubPageActions();
  return (
    <div>
      <RulesImgTitle
        className="mb-3"
        classNameText="drop-shadow-[0px_2px_2px_#33333340]"
        title={{
          i18nKey: 'earn_share_for_bonus_official_telegram_group_title',
        }}
      />
      <RulesContainer
        className="bgi-border-[var(--base-2-light)]"
        children={
          <div className="flex flex-col gap-4 py-5 px-3 items-center">
            <img
              className="max-w-12"
              src={getImgUrl(EResourceLevel.V, 'fab_telegram_default')}
              alt=""
            />
            <ul className="list-decimal bgi-text-[var(--grayscale-100)] ml-5">
              <li>
                {renderI18N({ i18nKey: 'earn_official_group_rules_1' }, t)}
              </li>
              <li>
                {renderI18N({ i18nKey: 'earn_official_group_rules_2' }, t)}
              </li>
              <li>
                {renderI18N({ i18nKey: 'earn_official_group_rules_3' }, t)}
              </li>
            </ul>
            <div className="w-full h-[1px] bgi-[var(--transparent-white-20)]" />
            <div className="flex flex-col gap-1">
              <div className="text-center text-xs bgi-text-[var(--transparent-white-70)] font-normal">
                {renderI18N(
                  { i18nKey: 'earn_official_group_custom_program' },
                  t
                )}
              </div>
              <button
                className="text-center text-xs bgi-text-[var(--linear-2)] font-medium z-[1]"
                onClick={() => {
                  handleTeamClubPageClick({
                    actionName: handleTeamClubPageContactNowClick,
                  });
                }}
              >
                <span className="border-b border-b-[#FFB516]">
                  {renderI18N(
                    {
                      i18nKey:
                        'earn_official_group_custom_program_contact_button',
                    },
                    t
                  )}
                </span>
              </button>
            </div>
          </div>
        }
      />
    </div>
  );
};
