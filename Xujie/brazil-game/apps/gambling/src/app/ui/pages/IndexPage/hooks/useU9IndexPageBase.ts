import { RootState } from 'apps/gambling/src/app/reduxStore';
import { useSelector } from 'react-redux';
import { environment } from 'apps/gambling/src/environments/environment';
import useBreakpoint from '../../../pageTemplate/hooks/useBreakpoint';
import { useMemo, useState } from 'react';
import { get, has } from 'lodash';
import useU9IndexActions from '../actions/useU9IndexActions';
import {
  actionType,
  handleChangeGameType,
  handleCheckInBannerClick,
  handleDepositCashbackBannerClick,
  handleDownloadClick,
  handleFirstDepositBannerClick,
  handleInviteBannerClick,
  handleVIPBannerClick,
} from '../actions/actionsType';

export interface IndexBannerType {
  id: number;
  text1: string;
  text2: string;
  bgAlt: string;
  bgSrc: string;
  action: () => void;
  isTextStyleReverse?: boolean;
}

export interface IndexGameTab {
  id: string;
  type: string;
  text: string;
  activeImgSrc: string;
  inActiveTarget: string;
  isActive: boolean;
  action: () => void;
}

interface HandleIndexClickProps {
  actionName: string;
  payload?: any;
}

export const useU9IndexPageBase = () => {
  const { actionObj } = useU9IndexActions();

  const handleIndexClick = ({ actionName, payload }: HandleIndexClickProps) => {
    if (!has(actionObj, actionName)) return;

    const action = actionObj[actionName as actionType];

    // 如果該 function 沒有參數的話就不給予 payload
    if (action.length > 0) {
      action(payload);
    } else {
      // @ts-ignore
      action();
    }
  };

  // === 首頁banner
  const recharge_first_cashback_rate = useSelector(
    (rootState: RootState) => rootState.app.config.recharge_first_cashback_rate
  );

  const recharge_cashback_rate = useSelector(
    (rootState: RootState) => rootState.app.config.recharge_cashback_rate
  );

  const invite_hig_reward = useSelector(
    (rootState: RootState) => rootState.app.config.invite_hig_reward
  );

  const { isMobile, isTablet } = useBreakpoint();

  // - methods
  // 到時候需要 RWD 的時候把 isHandle 改成預設 true 就可以，或是移除 isHandle
  const handleBgSrc = (target: string, isHandle: boolean = false) => {
    return `assets/${environment.uVersion}/${environment.mVersion}/${target}${
      isHandle ? (isMobile ? '_m' : isTablet ? '_t' : '') : ''
    }.png`;
  };

  const indexBannersList: IndexBannerType[] = useMemo(
    () => [
      // 首次充值
      {
        id: 0,
        text1: 'Primeiro depósito',
        text2: `+ bônus de ${recharge_first_cashback_rate}`,
        bgAlt: 'banner_primeira_recharg',
        bgSrc: handleBgSrc('banner_primeira_recarga'),
        action: () => {
          handleIndexClick({ actionName: handleFirstDepositBannerClick });
        },
      },
      // 現金回饋
      {
        id: 1,
        text1: 'Benefícios-ofertasde deposito',
        text2: `Ate ${recharge_cashback_rate} bônus`,
        bgAlt: 'banner_cashback',
        bgSrc: handleBgSrc('banner_cashback'),
        action: () => {
          handleIndexClick({ actionName: handleDepositCashbackBannerClick });
        },
      },
      // Recommend
      {
        id: 2,
        text1: 'Convide amigos e ganhe ',
        text2: `até R$${invite_hig_reward} cada`,
        bgAlt: 'banner_recommend',
        bgSrc: handleBgSrc('banner_recommend'),
        action: () => {
          handleIndexClick({ actionName: handleInviteBannerClick });
        },
      },
      // VIP
      {
        id: 3,
        text1: 'Prêmio upgrade Só esperando você coletar!',
        text2: `VIP0 Pode Retirar`,
        bgAlt: 'banner_vip',
        bgSrc: handleBgSrc('banner_vip'),
        action: () => {
          handleIndexClick({ actionName: handleVIPBannerClick });
        },
      },
      // Check In
      {
        id: 4,
        text1: 'Check-in',
        text2: `todos os dias O dinheiro não para!`,
        isTextStyleReverse: true,
        bgAlt: 'banner_checkin',
        bgSrc: handleBgSrc('banner_checkin'),
        action: () => {
          handleIndexClick({ actionName: handleCheckInBannerClick });
        },
      },
    ],
    [recharge_first_cashback_rate, recharge_cashback_rate, invite_hig_reward]
  );

  // ==== 遊戲類別 Tabs
  const [activeTab, setActiveTab] = useState('popular');

  const tabTypeToImgTarget = {
    popular: 'fire',
    slots: 'slots',
    fishing: 'fish',
    vivo: 'vivo',
    viver: 'viver',
    tables: 'tables',
    arcades: 'arcades',
    cards: 'cards',
    bingo: 'bingo',
    others: 'others',
    rebate: 'rebate',
    pendente: 'pending',
    histórico: 'historic',
    vip: 'vip',
    checkin: 'check_in',
    convide: 'invite',
    baixarAPP: 'download',
  };

  const defaultIcon = 'others';

  const label = useSelector((state: RootState) => state.gameList.label);

  const tabsImgSrc = (target: string, isActive: boolean = false) =>
    `assets/${environment.uVersion}/icon_${target}${
      isActive ? '_color' : ''
    }.png`;

  const dynamicIndexTabs = label?.map((item, index) => {
    const type =
      typeof item === 'string' && item !== ''
        ? item.toLowerCase()
        : `index-${index}`;

    const tabsImgSrcTarget = get(tabTypeToImgTarget, type, defaultIcon);

    return {
      id: type,
      type,
      text: item,
      activeImgSrc: tabsImgSrc(tabsImgSrcTarget, true),
      inActiveTarget: tabsImgSrcTarget,
      isActive: activeTab === type,
      action: () => {
        handleIndexClick({
          actionName: handleChangeGameType,
          payload: {
            type,
            setActiveTab,
          },
        });
      },
    };
  });

  const indexGameTabs: IndexGameTab[] = useMemo(
    () => [
      {
        id: 'popular',
        type: 'popular',
        text: 'Popular',
        activeImgSrc: tabsImgSrc('fire', true),
        inActiveTarget: tabTypeToImgTarget['popular'],
        isActive: activeTab === 'popular',
        action: () => {
          handleIndexClick({
            actionName: handleChangeGameType,
            payload: {
              type: 'popular',
              setActiveTab,
            },
          });
        },
      },
      ...dynamicIndexTabs,
      {
        id: 'others',
        type: 'others',
        text: 'Others',
        activeImgSrc: tabsImgSrc('others', true),
        inActiveTarget: tabTypeToImgTarget['others'],
        isActive: activeTab === 'others',
        action: () => {
          handleIndexClick({
            actionName: handleChangeGameType,
            payload: {
              type: 'others',
              setActiveTab,
            },
          });
        },
      },
      {
        id: 'rebate',
        type: 'rebate',
        text: 'Rebate',
        activeImgSrc: tabsImgSrc(tabTypeToImgTarget['rebate'], true),
        inActiveTarget: tabTypeToImgTarget['rebate'],
        isActive: activeTab === 'rebate',
        action: () => {
          handleIndexClick({
            actionName: handleChangeGameType,
            payload: {
              type: 'rebate',
              setActiveTab,
            },
          });
        },
      },
      {
        id: 'pendente',
        type: 'pendente',
        text: 'Pendente',
        activeImgSrc: tabsImgSrc(tabTypeToImgTarget['pendente'], true),
        inActiveTarget: tabTypeToImgTarget['pendente'],
        isActive: activeTab === 'pendente',
        action: () => {
          handleIndexClick({
            actionName: handleChangeGameType,
            payload: {
              type: 'pendente',
              setActiveTab,
            },
          });
        },
      },
      {
        id: 'histórico',
        type: 'histórico',
        text: 'Histórico',
        activeImgSrc: tabsImgSrc(tabTypeToImgTarget['histórico'], true),
        inActiveTarget: tabTypeToImgTarget['histórico'],
        isActive: activeTab === 'histórico',
        action: () => {
          handleIndexClick({
            actionName: handleChangeGameType,
            payload: {
              type: 'histórico',
              setActiveTab,
            },
          });
        },
      },
      {
        id: 'vip',
        type: 'vip',
        text: 'VIP',
        activeImgSrc: tabsImgSrc(tabTypeToImgTarget['vip'], true),
        inActiveTarget: tabTypeToImgTarget['vip'],
        isActive: false,
        action: () => {
          handleIndexClick({
            actionName: handleVIPBannerClick,
          });
        },
      },
      {
        id: 'checkin',
        type: 'checkin',
        text: 'Check-in',
        activeImgSrc: tabsImgSrc(tabTypeToImgTarget['checkin'], true),
        inActiveTarget: tabTypeToImgTarget['checkin'],
        isActive: false,
        action: () => {
          handleIndexClick({
            actionName: handleCheckInBannerClick,
          });
        },
      },
      {
        id: 'convide',
        type: 'convide',
        text: 'Convide',
        activeImgSrc: tabsImgSrc(tabTypeToImgTarget['convide'], true),
        inActiveTarget: tabTypeToImgTarget['convide'],
        isActive: false,
        action: () => {
          handleIndexClick({
            actionName: handleInviteBannerClick,
          });
        },
      },
      {
        id: 'baixarAPP',
        type: 'baixarAPP',
        text: 'Baixar APP',
        activeImgSrc: tabsImgSrc(tabTypeToImgTarget['baixarAPP'], true),
        inActiveTarget: tabTypeToImgTarget['baixarAPP'],
        isActive: false,
        action: () => {
          handleIndexClick({
            actionName: handleDownloadClick,
          });
        },
      },
    ],
    [activeTab, setActiveTab, tabsImgSrc, handleIndexClick]
  );

  return {
    indexBannersList,
    indexGameTabs,
  };
};

export default useU9IndexPageBase;
