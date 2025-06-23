import {
  RankingPageTabConfig,
  RankingPageTabs,
  useRankingPageStore,
} from '@mode2/zustand/page/RankingPage/rankingPageStore';
import cx from '@commonUtils/cx';
import { FLEX_JUSTIFY_CENTER } from '@constant/style';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { useTranslation } from 'react-i18next';
import { Icon } from '@components/Icon';
import useRankingPageActions from '@mode2/action/rankingPageAction/useRankingPageActions';
import {
  handleRankingPageHeaderShareBtnClick,
  handleRankingPageTabClick,
} from '@mode2/action/actionTypes';
import { memo } from 'react';
import { useHeaderStore } from '@mode2/zustand/components/headerStore';
import useHeaderAction from '@mode2/action/components/header/headerAction';
import { handleBackActionClick } from '@mode2/action/actionTypes';

const rankingPageTabs: RankingPageTabConfig[] = [
  {
    id: RankingPageTabs.MAIN,
    titleKey: 'ranking_ranking_tab',
    isShow: true,
    isShowRedDot: false,
    isActive: false,
  },
  {
    id: RankingPageTabs.RULE,
    titleKey: 'ranking_rules_tab',
    isShow: true,
    isShowRedDot: false,
    isActive: false,
  },
  {
    id: RankingPageTabs.RECORDS,
    titleKey: 'ranking_reward_tab',
    isShow: true,
    isShowRedDot: false,
    isActive: false,
  },
];

const RankingPageTab = (props: RankingPageTabConfig) => {
  const rankingPageTab = useRankingPageStore((state) => state.rankingPageTab);
  const { t } = useTranslation();
  const { handleRankingPageClick } = useRankingPageActions();
  const isActive = props.id === rankingPageTab;
  return (
    <div
      className={cx(
        'tab-item',
        FLEX_JUSTIFY_CENTER,
        'items-end',
        'flex-1',
        // 'h-full',
        'text-center text-base font-medium',
        'px-px',
        'relative',
        'cursor-pointer',
        props.className
      )}
      onClick={() => {
        // item.action();
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
        handleRankingPageClick({
          actionName: handleRankingPageTabClick,
          payload: { tab: props.id },
        });
      }}
    >
      <span
        className={cx('m-auto', {
          'bgi-text-[var(--transparent-white-40)]': !isActive,
          'bgi-text-[var(--base-1-main)]': isActive,
        })}
      >
        {t(props.titleKey)}
      </span>

      {isActive ? (
        <img
          src={getImgUrl(EResourceLevel.V, 'bg_active_tab_light')}
          alt="Tab Active Bottom background "
          className={cx('w-full', 'object-contain', 'absolute bottom-0 left-0')}
        />
      ) : null}
    </div>
  );
};

export const RankingPageBackIcon = memo(() => {
  const config = useHeaderStore((state) => state.config);
  const { handleHeaderClick } = useHeaderAction();
  return (
    <Icon
      className={cx('w-7 h-7 cursor-pointer self-center')}
      name={'ic_back_header'}
      onClick={() =>
        handleHeaderClick({
          actionName: handleBackActionClick,
          payload: { callback: config.onBack },
        })
      }
    />
  );
});

export const RankingPageHeader = () => {
  const { handleRankingPageClick } = useRankingPageActions();
  return (
    <div
      className={cx(
        'relative z-10',
        'flex gap-3',
        'w-full h-full',
        'pt-[24px]'
      )}
    >
      <RankingPageBackIcon />

      {rankingPageTabs
        .filter((item) => item.isShow)
        .map((item, index) => {
          return <RankingPageTab key={item.id} {...item} />;
        })}

      <Icon
        className={'m-auto w-7 h-7 cursor-pointer'}
        name={'ic_share_2'}
        onClick={() => {
          handleRankingPageClick({
            actionName: handleRankingPageHeaderShareBtnClick,
            payload: { isShowRankingShareModal: true },
          });
        }}
      />
    </div>
  );
};

export default RankingPageHeader;
