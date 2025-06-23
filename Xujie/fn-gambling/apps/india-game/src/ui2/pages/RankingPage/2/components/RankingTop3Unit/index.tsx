import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, FLEX_COL, X_CENTER } from '@libs/constant/style';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { useRankingPageStore } from '@libs/mode2/zustand/page/RankingPage/rankingPageStore';
import Avatar from '@components/Avatar';
import { useTranslation } from 'react-i18next';
import Icon from '@components/Icon';

interface RankingTop3UnitProps {
  reward: number | string; // 得獎%數
  bets: number | string; // 投注金額
  playerName: number | string; // 使用者 名稱
  place: 1 | 2 | 3; // 第幾名
  avatarId: number | string; // avatarId
  avatarFrameNode?: React.ReactNode;
  isRise?: boolean;
  isModal?: boolean;
}

const placeAbbrevObj = {
  1: '1st',
  2: '2nd',
  3: '3rd',
};

export const RankingTop3Unit = ({
  reward,
  bets,
  playerName,
  place,
  avatarId,
  avatarFrameNode,
  isRise,
  isModal,
}: RankingTop3UnitProps) => {
  const { t } = useTranslation();

  const isRankingSummaryLoading = useRankingPageStore(
    (state) => state.isRankingSummaryLoading
  );

  const boxWidthStyle = {
    'w-[136px]': place === 2 || place === 3,
    'w-[152px]': place === 1,
  };

  const avatarBottomClass = {
    'bottom-2': place === 2 || place === 3,
    'bottom-3': place === 1,
  };

  const avatarFrameWidth = {
    'w-[108px]': place === 3,
    'w-[116px]': place === 2,
    'w-[152px]': place === 1,
  };

  const idLeftClass = {
    'left-[15px]': place === 2 || place === 3,
    'left-[23px] top-[-10px]': place === 1,
  };

  const jackpotStageText = {
    'bottom-[22px]': place === 2 || place === 3,
    'bottom-8': place === 1,
  };

  // Modal styles
  const jackpotStageTextModal = {
    'bottom-[18px]': place === 2 || place === 3,
    'bottom-6': place === 1,
  };

  const idLeftClassModal = {
    'left-[10px]': place === 3,
    'left-[11px]': place === 2,
    'left-[15px] top-[-12px]': place === 1,
    'w-[86px] h-4': [1, 2, 3].includes(place),
  };

  const avatarFrameWidthModal = {
    'w-[86px]': place === 3,
    'w-[91px]': place === 2,
    'w-[120px]': place === 1,
  };

  const avatarWidth = {
    '!w-[70px] !h-[70px]': place === 3,
    '!w-[74px] !h-[74px]': place === 2,
    '!w-[86px] !h-[86px]': place === 1,
  };

  const avatarBottomClassModal = {
    'bottom-1.5': place === 3,
    'bottom-1.5 !-translate-x-[52%]': place === 2,
    'bottom-2.5': place === 1,
  };

  const avatarWidthModal = {
    '!w-[55px] !h-[55px]': place === 3,
    '!w-[60px] !h-[60px]': place === 2,
    '!w-[68px] !h-[68px]': place === 1,
  };

  const showHideClass = {
    hidden: isRankingSummaryLoading,
  };

  return (
    <div
      className={cx(
        boxWidthStyle,
        FLEX_CENTER,
        'flex-col gap-3',
        {
          'gap-1': place === 3,
        },
        boxWidthStyle
      )}
    >
      <div className={cx(FLEX_COL, 'items-center', 'relative')}>
        {/* 小皇冠 */}
        <img
          src={getImgUrl(EResourceLevel.V, `ranking_${place}`)}
          alt="Ranking crown_image"
          className={cx('block', 'w-[28px] h-[28px]')}
        />

        {/* 頭像框 */}
        {avatarFrameNode ? (
          avatarFrameNode
        ) : (
          <img
            src={getImgUrl(
              EResourceLevel.V,
              `jackpot_frame_${placeAbbrevObj[place]}`
            )}
            alt="First avatar frame_image"
            className={cx(
              'block',
              isModal ? avatarFrameWidthModal : avatarFrameWidth
            )}
          />
        )}

        {/* Avatar */}
        <div
          className={cx(
            isModal ? avatarWidthModal : avatarWidth,
            'absolute z-[1]',
            isModal ? avatarBottomClassModal : avatarBottomClass,
            X_CENTER
          )}
        >
          <Avatar
            isGuest={true}
            isShowVIP={false}
            otherAvatarId={isRankingSummaryLoading ? 0 : avatarId} // 0 就是預設都沒有
            className={cx(isModal ? avatarWidthModal : avatarWidth)}
            rootClassName={cx(isModal ? avatarWidthModal : avatarWidth)}
          />
        </div>
      </div>

      {/* 下方台座 */}
      <div className={cx('relative')}>
        {/* 使用者名稱 */}
        <div
          className={cx(
            'w-[106px] h-[20px] rounded-full',
            'bgi-[var(--transparent-gray-50)]',
            'absolute top-0 z-[1]',
            isModal ? idLeftClassModal : idLeftClass,
            FLEX_CENTER
          )}
        >
          {typeof isRise === 'boolean' &&
          isRankingSummaryLoading === false &&
          isModal === false ? (
            <Icon
              name={`ic_ranking_${isRise ? 'rise' : 'down'}`}
              className={cx('w-4 h-4')}
            />
          ) : null}

          <span
            className={cx(
              'text-xs',
              'bgi-text-[var(--grayscale-100)]',
              showHideClass,
              {
                'text-xxs': isModal,
              }
            )}
          >
            {playerName}
          </span>
        </div>

        {/* 由台座的圖片來撐出寬高 */}
        <img
          src={getImgUrl(
            EResourceLevel.V,
            `jackpot_stage_${placeAbbrevObj[place]}`
          )}
          alt="Prize box_image"
          className={cx('block', boxWidthStyle)}
        />

        {/* 台座的資訊 */}
        <div
          className={cx(
            'w-[98px]',
            'bgi-text-[var(--base-1-main)]',
            'text-xs',
            'absolute bottom-[23px] z-[1]',
            X_CENTER,
            'text-center',
            showHideClass,
            isModal ? jackpotStageTextModal : jackpotStageText,
            {
              'text-xxs': isModal,
            }
          )}
        >
          {/* Reward */}
          <span className={cx('block')}>
            {t('ranking_reward')}: {reward}%
          </span>

          {/* Bets */}
          <span className={cx('block text-nowrap')}>
            {t('ranking_bets')}: {bets}
          </span>
        </div>
      </div>
    </div>
  );
};
