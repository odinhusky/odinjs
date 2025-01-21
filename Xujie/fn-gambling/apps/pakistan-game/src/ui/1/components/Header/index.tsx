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
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { useObserverElementMetrics } from '@commonUtils/hooks/useObserverElementMetrics';
import { useTemplateLayoutStore } from '@mode2/zustand/template/templateLayoutStore';
import { useTranslation } from 'react-i18next';
import { forwardRef, memo, Ref } from 'react';
import { isEmpty, isEqual } from 'lodash';
import { useMoreGamePageStoreStore } from '@mode2/zustand/page/moreGamePage';
import useHeaderAction from '@mode2/action/components/header/headerAction';
import { I18NContent } from '@libs/mode2/@types/i18nType';
import renderI18N from '@libs/commonUtils/renderI18N';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { HeaderDepositButton } from '@components/HeaderDepositButton';
import { HeaderUserInfo } from '@components/HeaderUserInfo';
import { HeaderWalletBalanceSummary } from '@components/HeaderWalletBalanceSummary';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';
import Icon from '@mode2/components/Icon';
import { HeaderSystemLogo } from '@components/HeaderSystemLogo';
import GammerInfo from '@components/GammerInfo';
import { EN } from '@/constant';

const loginButtonClassName =
  'px-3 tablet:px-4 h-7 mobile:h-8 tablet:h-10 rounded-lg tablet:rounded-xl shadow-[0px_-2px_2px_0px_rgba(255,255,255,0.4)_inset,_inset_0px_2px_2px_0px_rgba(255,255,255,0.6)]';

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
      className="w-7 h-7 flex justify-center items-center"
    >
      <Icon
        className={cx('w-4 h-4 rotate-180 cursor-pointer')}
        name={'ic_arrow_right'}
        color="var(--grayscale-90)"
      />
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
      className="w-7 h-7 flex justify-center items-center bgi-[var(--grayscale-15)] rounded-lg"
    >
      <Icon
        className={cx('w-4 h-4 cursor-pointer')}
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

const LoginButton = memo(() => {
  const { t } = useTranslation();
  const { handleHeaderClick } = useHeaderAction();
  return (
    <div
      className={cx(
        'flex shrink-0',
        'gap-1 mobile:gap-2 tablet:gap-3',
        'tablet:flex-row-reverse'
      )}
    >
      <BasePrimaryBtn
        className={cx(
          'w-auto h-auto',
          'text-sm mobile:text-sm font-medium',
          loginButtonClassName
        )}
        classNameText="!bgi-text-[var(--grayscale-10)]"
        onClick={() =>
          handleHeaderClick({
            actionName: handleLoginActionClick,
            payload: { type: LoginFormType.REGISTER },
          })
        }
        children={t('header_sign_up')}
      />

      <BaseSecondaryBtn
        className={cx(
          'w-auto h-auto',
          'text-sm mobile:text-sm font-medium',
          loginButtonClassName
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
        className={cx('w-7 h-7 cursor-pointer')}
        name={'ic_home'}
        color="var(--grayscale-90)"
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
            <HeaderSystemLogo onSystemLogoClick={props.onSystemLogoClick} />
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
            {isDesktop ? (
              <HeaderSystemLogo onSystemLogoClick={props.onSystemLogoClick} />
            ) : (
              <GameLogo />
            )}
          </>
        );
      default: //首頁 遊戲畫面
        return (
          <>
            {isDesktop ? <div className="w-6" /> : <MenuIcon />}
            <HeaderSystemLogo onSystemLogoClick={props.onSystemLogoClick} />
          </>
        );
    }
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);

const WalletDeposition = memo((props: { children: JSX.Element }) => {
  // const { isDesktop } = useBreakPoint();

  return (
    <div
      className={cx(
        'h-8 mobile:h-10 flex items-center',
        'border border-r-0 border-[var(--grayscale-20)]',
        'rounded-lg cursor-pointer',
        'bgi-[var(--grayscale-15)]',
        'shadow-[0px_2px_4px_0px_rgba(0,0,0,0.15)_inset'
      )}
    >
      {props.children}
    </div>
    //
    // isDesktop ? props.children :
    //   <div className={cx(
    //     'h-8 mobile:h-10 flex items-center',
    //     'border border-r-0 border-[var(--grayscale-20)]',
    //     'rounded-lg cursor-pointer',
    //     'bgi-[var(--grayscale-15)]',
    //     'shadow-[0px_2px_4px_0px_rgba(0,0,0,0.15)_inset'
    //   )}>
    //     {props.children}
    //   </div>
  );
});

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
              <WalletDeposition
                children={
                  <>
                    <HeaderWalletBalanceSummary />
                    <HeaderDepositButton
                      isInGame={false}
                      onDepositClick={props.onDepositClick}
                    />
                  </>
                }
              />
              <HeaderUserInfo />
            </>
          )
        );
      case EHeaderType.MoreGame: // 更多遊戲頁面
        return isLogin ? (
          <>
            <WalletDeposition
              children={
                <>
                  <HeaderWalletBalanceSummary />
                  <HeaderDepositButton
                    isInGame={false}
                    onDepositClick={props.onDepositClick}
                  />
                </>
              }
            />

            <HeaderUserInfo isInMoreGame={true} />
          </>
        ) : // <LoginButton />
        null;
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
            <WalletDeposition
              children={
                <>
                  <HeaderWalletBalanceSummary />
                  <HeaderDepositButton
                    isInGame={false}
                    onDepositClick={props.onDepositClick}
                  />
                </>
              }
            />
            <HeaderUserInfo />
          </>
        ) : (
          <>
            {isDesktop && (
              <LangueSelect
                mode={1}
                isHideArrow={true}
                defaultLangue={EN.toUpperCase()}
              />
            )}
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
  forwardRef<HTMLDivElement, Partial<IConfig>>((props: Partial<IConfig>, ref:Ref<HTMLDivElement>) => {
    const location = useLocation();
    const { isDesktop } = useBreakPoint();
    const { config } = useHeaderBase(props);
    const { isShowLoginModal } = useIsShowLoginModalStore();

    const isHomePage = location.pathname === BasePagePathObj.HallPage;
    const isShowGammerInfoPopup = isHomePage && !isShowLoginModal;

    return config.type === EHeaderType.Null ? <></> : (
      <header
        ref={ref}
        className={cx(
          'header-content',
          FLEX_ITEMS_CENTER,
          'justify-between',
          'w-full h-12 mobile:h-14',
          'bgi-[var(--grayscale-10)]',
          'px-2 py-0',
          'shrink-0',
          'top-0 z-40',
          'shadow-[0px_2px_4px_0px_rgba(51,51,51,0.16)]',
          isDesktop ? 'fixed' : 'sticky'
        )}
      >
        <div className={cx(FLEX_ITEMS_CENTER, 'gap-2')}>
          <HeadLeft {...config} />
        </div>
        <div
          className={cx(FLEX_ITEMS_CENTER, 'gap-1 mobile:gap-3 tablet:gap-4')}
        >
          <HeadRight
            type={config.type}
            onDepositClick={config.onDepositClick}
          />
        </div>

        {isShowGammerInfoPopup && <GammerInfo />}
      </header>
    );
  }),
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);
