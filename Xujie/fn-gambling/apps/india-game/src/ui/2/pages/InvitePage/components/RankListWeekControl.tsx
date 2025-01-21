import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { handleInvitePageRankingListLastWeekBtnClick } from '@mode2/action/invitePageAction/actionType';
import useInvitePageActions from '@mode2/action/invitePageAction/useInvitePageActions';
import { useMode2InvitePageRankingListStore } from '@mode2/zustand/page/invitePageStore';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';
import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, FLEX_ITEMS_CENTER } from '@libs/constant/style';

export const RankListWeekControl = () => {
  const showLastData = useMode2InvitePageRankingListStore(
    (state) => state.showLastData
  );
  const initialCountdownSec = useMode2InvitePageRankingListStore(
    (state) => state.countdownSec
  );
  const setCountdownTIme = useMode2InvitePageRankingListStore(
    (state) => state.setCountdownTIme
  );

  const [countdownSec, setCountdownSec] = useState<null | number>(null);
  const isInitialized = countdownSec !== null;

  useEffect(() => {
    if (!isInitialized) return;

    const timer = setInterval(() => {
      setCountdownSec((prev: number | null) => {
        if (prev !== null && prev > 0) {
          return prev - 1;
        } else {
          clearInterval(timer);
          return 0;
        }
      });
    }, 1000);

    // 路由不變,但進入到Last week時也要停止倒數
    if (timer && showLastData) {
      clearInterval(timer);
      setCountdownSec(null);
      setCountdownTIme(0);
    }

    return () => {
      clearInterval(timer);
      setCountdownTIme(0);
    };
  }, [showLastData, isInitialized]);

  useEffect(() => {
    if (initialCountdownSec > 0) {
      setCountdownSec(initialCountdownSec);
    }
  }, [initialCountdownSec]);

  let hours = '00';
  let minutes = '00';
  let seconds = '00';
  if (isInitialized) {
    hours = `${Math.floor(countdownSec / 3600)}`.padStart(2, '0');
    minutes = `${Math.floor((countdownSec % 3600) / 60)}`.padStart(2, '0');
    seconds = `${countdownSec % 60}`.padStart(2, '0');
  }

  const { handleInvitePageClick } = useInvitePageActions();

  return (
    <div
      className={cx(
        FLEX_ITEMS_CENTER,
        'flex-row justify-between',
        'bgi-text-[var(--grayscale-100)]',
        'text-xs mobile:text-base'
      )}
    >
      <div className="">
        {showLastData
          ? t('earn_money_team_data_content_last_week')
          : t('earn_money_team_data_content_this_week')}
      </div>
      {!showLastData && (
        <div className={cx(FLEX_CENTER, 'flex-row', 'gap-1')}>
          {t('earn_money_ranking_list_time_box_reset')}
          <div className="time-box">{hours}</div>:
          <div className="time-box">{minutes}</div>:
          <div className="time-box">{seconds}</div>
        </div>
      )}

      {!showLastData && (
        <BaseSecondaryBtn
          className="w-[89px] mobile:w-[105px] h-8 mobile:text-base font-medium"
          onClick={() => {
            handleInvitePageClick({
              actionName: handleInvitePageRankingListLastWeekBtnClick,
            });
          }}
        >
          {t('earn_money_team_data_content_last_week')}
        </BaseSecondaryBtn>
      )}
    </div>
  );
};

export default RankListWeekControl;
