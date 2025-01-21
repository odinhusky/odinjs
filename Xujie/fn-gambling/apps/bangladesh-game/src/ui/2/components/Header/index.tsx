import { cx, useBreakPoint, useDeepEffect } from '@libs/commonUtils';
import { useLocation } from 'react-router-dom';

import { useHeaderBase } from '@/ui/hooks/components/useHeaderBase';
import LangueSelect from '@components/LangueSelect';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import {
  LoginFormType,
  useIsLoginStore,
  useIsShowLoginModalStore,
} from '@mode2/zustand/loginStore';
import { EHeaderType, IConfig } from '@mode2/zustand/components/headerStore';
import {
  handleBackActionClick,
  handleHomeActionClick,
  handleLoginActionClick,
  handleMenuActionClick,
} from '@mode2/action/components/header/actionType';
import GammerInfo from '../../components/GammerInfo';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { useObserverElementMetrics } from '@commonUtils/hooks/useObserverElementMetrics';
import { useTemplateLayoutStore } from '@mode2/zustand/template/templateLayoutStore';
import { useTranslation } from 'react-i18next';
import { memo } from 'react';
import { isEmpty, isEqual } from 'lodash';
import { useMoreGamePageStoreStore } from '@mode2/zustand/page/moreGamePage';
import useHeaderAction from '@mode2/action/components/header/headerAction';
import Icon from '@mode2/components/Icon';
import { I18NContent } from '@libs/mode2/@types/i18nType';
import renderI18N from '@libs/commonUtils/renderI18N';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { HeaderDepositButton } from '@components/HeaderDepositButton';
import { HeaderUserInfo } from '@components/HeaderUserInfo';
import { HeaderWalletBalanceSummary } from '@components/HeaderWalletBalanceSummary';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';

export const BackIcon = memo((props: { onBack?: () => void }) => {
  const { handleHeaderClick } = useHeaderAction();
  return (
    <div
      onClick={() =>
        handleHeaderClick({
          actionName: handleBackActionClick,
          payload: { callback: props.onBack },
        })
      }
    >
      <Icon className={cx('w-5 h-5 cursor-pointer')} name="ic_arrow_left_1" />
    </div>
  );
});

const MenuIcon = memo(() => {
  const { handleHeaderClick } = useHeaderAction();
  return (
    <div
      onClick={() =>
        handleHeaderClick({
          actionName: handleMenuActionClick,
        })
      }
    >
      <Icon
        className={cx('w-5 h-5 cursor-pointer')}
        name="ic_menu"
        color="var(--base-2-main)"
      />
    </div>
  );
});

const Title = memo(
  (props: { title?: I18NContent }) => {
    const { t } = useTranslation();
    return !isEmpty(props.title) ? (
      <div
        className={cx(
          'bgi-text-[var(--base-2-main)]',
          'text-sm font-medium leading-5'
        )}
      >
        {props.title ? renderI18N(props.title, t) : ''}
      </div>
    ) : null;
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);

const GameLogo = memo(() => {
  const manufacturer = useMoreGamePageStoreStore((state) => state.manufacturer);
  const manufacturerLogoUrl = useMoreGamePageStoreStore(
    (state) => state.manufacturerLogoUrl
  );
  const moreGameLogo = getImgUrl(
    EResourceLevel.SHARED,
    `manufacturer/logo_${manufacturer.toLowerCase()}`
  );
  return (
    <img
      src={manufacturerLogoUrl || moreGameLogo}
      className={cx(
        'h-8 max-h-8 w-auto pt-1 pb-1',
        manufacturerLogoUrl ? 'pt-0 pb-0 h-auto' : ''
      )}
      alt="game-logo"
    />
  );
});

const SystemLogo = memo(() => {
  const { handleHeaderClick } = useHeaderAction();
  return (
    <img
      src={getImgUrl(EResourceLevel.LOGO, 'game_logo_1')}
      className={cx('h-7 mobile:h-10 object-contain', 'cursor-pointer')}
      alt="game_logo_1"
      onClick={() =>
        handleHeaderClick({
          actionName: handleHomeActionClick,
        })
      }
    />
  );
});

const LoginButton = memo(() => {
  const { t } = useTranslation();
  const { handleHeaderClick } = useHeaderAction();
  return (
    <div className={cx('flex', 'gap-2')}>
      <BaseSecondaryBtn
        className={cx(
          'headerButton register',
          'w-auto h-auto',
          'text-sm mobile:text-sm font-medium',
          'px-4 py-1'
        )}
        onClick={() =>
          handleHeaderClick({
            actionName: handleLoginActionClick,
            payload: { type: LoginFormType.REGISTER },
          })
        }
        children={t('header_sign_up')}
      />

      <BasePrimaryBtn
        className={cx(
          'headerButton login',
          'w-auto h-auto',
          'text-sm mobile:text-sm font-medium',
          'px-4 py-1'
        )}
        onClick={() =>
          handleHeaderClick({
            actionName: handleLoginActionClick,
            payload: { type: LoginFormType.LOGIN },
          })
        }
        children={t('header_sign_in')}
      />
    </div>
  );
});

const HomeIcon = memo(() => {
  const { handleHeaderClick } = useHeaderAction();
  return (
    <div
      onClick={() =>
        handleHeaderClick({
          actionName: handleHomeActionClick,
        })
      }
    >
      <Icon
        className={cx('w-5 h-5 cursor-pointer')}
        name="ic_home"
        color="var(--base-2-main)"
      />
    </div>
  );
});

const HeadLeft = memo(
  (props: IConfig) => {
    const { isDesktop } = useBreakPoint();
    switch (props.type) {
      case EHeaderType.Common: //全局文字標題
        return (
          <>
            <BackIcon onBack={props.onBack} />
            <Title title={props.title} />
          </>
        );
      case EHeaderType.GameSel: // 遊戲選單
        return (
          <>
            <BackIcon onBack={props.onBack} />
            <GameLogo />
          </>
        );
      case EHeaderType.GameWeb: // 遊戲畫面
        return (
          <>
            <BackIcon onBack={props.onBack} />
            <SystemLogo />
          </>
        );
      case EHeaderType.MoreGame: // 更多遊戲頁面
        return (
          <>
            {isDesktop ? (
              <div className="w-6" />
            ) : (
              <BackIcon onBack={props.onBack} />
            )}
            {isDesktop ? <SystemLogo /> : <GameLogo />}
          </>
        );
      default: //首頁 遊戲畫面
        return (
          <>
            {isDesktop ? <div className="w-6" /> : <MenuIcon />}
            <SystemLogo />
          </>
        );
    }
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);

const HeadRight = memo(
  (props: { type: `${EHeaderType}`; onDepositClick?: () => void }) => {
    const isLogin = useIsLoginStore((state) => state.isLogin);
    const { isDesktop } = useBreakPoint();
    switch (props.type) {
      case EHeaderType.Common: //全局文字標題
        return <HomeIcon />;
      case EHeaderType.GameSel: //遊戲選單
        return (
          isLogin && (
            <>
              <HeaderWalletBalanceSummary />
              <HeaderDepositButton
                isInGame={false}
                onDepositClick={props.onDepositClick}
              />
              <HeaderUserInfo />
            </>
          )
        );
      case EHeaderType.MoreGame: // 更多遊戲頁面
        return isLogin ? (
          <>
            <HeaderWalletBalanceSummary />
            <HeaderDepositButton
              isInGame={false}
              onDepositClick={props.onDepositClick}
            />
            <HeaderUserInfo isInMoreGame={true} />
          </>
        ) : (
          <LoginButton />
        );
      case EHeaderType.GameWeb: //遊戲畫面，必定登入
        return (
          <HeaderDepositButton
            isInGame={true}
            onDepositClick={props.onDepositClick}
          />
        );
      default: //首頁
        return isLogin ? (
          <>
            <HeaderWalletBalanceSummary />
            <HeaderDepositButton
              isInGame={false}
              onDepositClick={props.onDepositClick}
            />
            <HeaderUserInfo />
          </>
        ) : (
          <>
            {isDesktop && <LangueSelect mode={2} />}
            <LoginButton />
          </>
        );
    }
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);

export const Header = memo(
  (props: Partial<IConfig>) => {
    const location = useLocation();
    const { isDesktop } = useBreakPoint();
    const { config } = useHeaderBase(props);
    const { isShowLoginModal } = useIsShowLoginModalStore();

    const isHomePage = location.pathname === BasePagePathObj.HallPage;
    const isShowGammerInfoPopup = isHomePage && !isShowLoginModal;

    const setHeaderElMetrics = useTemplateLayoutStore(
      (state) => state.setHeaderElMetrics
    );
    const { elementRef, elementMetrics } =
      useObserverElementMetrics<HTMLDivElement>();
    useDeepEffect(() => {
      setHeaderElMetrics(elementRef, elementMetrics);
    }, [elementMetrics]);

    return (
      <header
        ref={elementRef}
        className={cx(
          'header-content',
          FLEX_ITEMS_CENTER,
          'justify-between',
          'w-full h-11 mobile:h-14',
          'bgi-[var(--grayscale-00)]',
          'px-2 py-0',
          'shrink-0',
          'top-0 z-40',
          isDesktop ? 'fixed' : 'sticky'
        )}
      >
        <div className={cx(FLEX_ITEMS_CENTER, 'gap-2')}>
          <HeadLeft {...config} />
        </div>
        <div className={cx(FLEX_ITEMS_CENTER, 'gap-2')}>
          <HeadRight
            type={config.type}
            onDepositClick={config.onDepositClick}
          />
        </div>

        {isShowGammerInfoPopup && <GammerInfo />}
      </header>
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);
