import Icon from '@components/Icon';
import { cx } from '@libs/commonUtils';
import handleGlobalClick from '@libs/mode2/action/handleGlobalClick';

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
        'absolute bottom-7 se:bottom-[8%]  z-[1]',
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
      <Icon
        name={type === 'prev' ? 'ic_arrow_left_color' : 'ic_arrow_right_color'}
        className={cx('w-7 h-7')}
      />
    </button>
  );
};

export default TeamClubSwiperNavigationBtn;
