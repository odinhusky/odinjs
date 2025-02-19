import useTeamDataDetailModalAction from '@libs/mode2/action/teamDataDetailModalAction/useTeamDataDetailModalAction';
import { handleTeamDataDetailModalCloseBtnClick } from '@libs/mode2/action/teamDataDetailModalAction/actionType';
import { useTranslation } from 'react-i18next';
import Icon from '@components/Icon';

export const TeamDataDetailTitle = () => {
  const { t } = useTranslation();
  const { handleTeamDataDetailModalClick } = useTeamDataDetailModalAction();
  return (
    <div className="relative bgi-[var(--base-1-main)] p-2 justify-between items-center">
      <div className="w-full mobile:text-lg text-base font-semibold text-center">
        {t('earn_money_team_data_btn_detail')}
      </div>
      <button
        className="absolute w-6 h-6 top-1/2 -translate-y-1/2 right-2"
        onClick={() => {
          handleTeamDataDetailModalClick({
            actionName: handleTeamDataDetailModalCloseBtnClick,
          });
        }}
      >
        <Icon className="w-full" name="ic_close" />
      </button>
    </div>
  );
};
