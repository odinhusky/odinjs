import { cx } from '@libs/commonUtils';
import { FULL } from '@libs/constant/style';
import handleGlobalClick from '@libs/mode2/action/handleGlobalClick';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';

interface TeamClubSwiperNavigationBtnProps {
  type: 'prev' | 'next';
  isDisabled: boolean;
}

export const TeamClubSwiperNavigationBtn = ({
  type = 'prev',
  isDisabled,
}: TeamClubSwiperNavigationBtnProps) => {
  return (
    <button
      className={cx(
        'w-5 h-5',
        'absolute bottom-[2.2%]  z-[1]',
        {
          'custom-prev left-[32%]': type === 'prev',
          'custom-next right-[32%]': type === 'next',
        }
        // 用 class 綁定 action: custom-prev | custom-next
      )}
      onClick={() => {
        // 不做事情，只是提供一個點擊的集中管理
        handleGlobalClick({
          target:
            type === 'prev'
              ? 'handleTeamClubLevelSummarySwiperPrevButtonClick'
              : 'handleTeamClubLevelSummarySwiperNextButtonClick',
          callback: () => {},
        });
      }}
    >
      <img
        src={getImgUrl(
          EResourceLevel.V,
          type === 'prev'
            ? 'ic_team_swiper_left_arrow'
            : 'ic_team_swiper_right_arrow'
        )}
        alt={`Swiper ${type} arrow button`}
        className={cx(FULL, { block: !isDisabled, hidden: isDisabled })}
      />

      <img
        src={getImgUrl(
          EResourceLevel.V,
          type === 'prev'
            ? 'ic_team_swiper_left_arrow_disabled'
            : 'ic_team_swiper_right_arrow_disabled'
        )}
        alt={`Disabled swiper ${type} arrow button`}
        className={cx(FULL, { block: isDisabled, hidden: !isDisabled })}
      />
    </button>
  );
};

export default TeamClubSwiperNavigationBtn;
