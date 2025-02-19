import { cx } from '@libs/commonUtils';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { LoginFormType, useIsLoginStore } from '@mode2/zustand/loginStore';
import {
  EHeaderType,
  IConfig,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';
import {
  handleBackActionClick,
  handleHomeActionClick,
  handleLoginActionClick,
  handleMenuActionClick,
} from '@mode2/action/components/header/actionType';
import { useTranslation } from 'react-i18next';
import { forwardRef, memo, Ref } from 'react';
import { isEmpty, isEqual } from 'lodash';
import { useMoreGamePageStoreStore } from '@mode2/zustand/page/moreGamePage';
import useHeaderAction from '@mode2/action/components/header/headerAction';
import { I18NContent } from '@libs/mode2/@types/i18nType';
import renderI18N from '@libs/commonUtils/renderI18N';
import {
  FLEX_CENTER,
  FLEX_ITEMS_CENTER,
  MOBILE_BREAK_POINT_MAX_WIDTH,
} from '@libs/constant/style';
import { HeaderDepositButton } from '@components/HeaderDepositButton';
import { HeaderUserInfo } from '@components/HeaderUserInfo';
import { HeaderWalletBalanceSummary } from '@components/HeaderWalletBalanceSummary';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';
import Icon from '@components/Icon';
import { HeaderSystemLogo } from '@components/HeaderSystemLogo';
import { useMobileExclusiveHeaderOverride } from '@/ui/4/components/Header/useMobileExclusiveHeaderOverride';

export const BackIcon = memo(() => {
  const config = useHeaderStore((state) => state.config);
  const { handleHeaderClick } = useHeaderAction();
  return (
    <div
      onClick={() =>
        handleHeaderClick({
          actionName: handleBackActionClick,
          payload: { callback: config.onBack },
        })
      }
    >
      <Icon className={cx('w-7 h-7 cursor-pointer')} name={'ic_back_header'} />
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
        name={'ic_menu'}
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
          'bgi-text-[var(--grayscale-100)]',
          'text-2xl font-medium'
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
  const activeManufacturer = useMoreGamePageStoreStore(
    (state) => state.activeManufacturer
  );
  const activeManufacturerLogoUrl = useMoreGamePageStoreStore(
    (state) => state.activeManufacturerLogoUrl
  );
  const moreGameLogo = getImgUrl(
    EResourceLevel.SHARED,
    `manufacturer/logo_${activeManufacturer.toLowerCase()}`
  );
  return (
    <img
      src={activeManufacturerLogoUrl || moreGameLogo}
      className={cx(
        'h-8 max-h-8 w-auto pt-1 pb-1',
        activeManufacturerLogoUrl ? 'pt-0 pb-0 h-auto' : ''
      )}
      alt="game-logo"
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
        onClick={() => {
          handleHeaderClick({
            actionName: handleLoginActionClick,
            payload: { type: LoginFormType.LOGIN },
          });
        }}
        children={t('header_sign_in')}
      />

      <BasePrimaryBtn
        className={cx(
          'headerButton login',
          'w-auto h-auto',
          'text-sm mobile:text-sm font-medium',
          'px-4 py-1'
        )}
        onClick={() => {
          handleHeaderClick({
            actionName: handleLoginActionClick,
            payload: { type: LoginFormType.REGISTER },
          });
        }}
        children={t('header_sign_up')}
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
        name={'ic_home'}
        color="var(--base-2-main)"
      />
    </div>
  );
});

const HeadLeft = memo(
  () => {
    const config = useHeaderStore((state) => state.config);
    switch (config.type) {
      case EHeaderType.Common: //全局文字標題
        return (
          <>
            <BackIcon />
            {/*<Title title={config.title} />*/}
          </>
        );
      case EHeaderType.GameSel: // 遊戲選單
        return (
          <>
            <BackIcon />
            <GameLogo />
          </>
        );
      case EHeaderType.GameWeb: // 遊戲畫面
        return (
          <>
            <BackIcon />
            <HeaderSystemLogo />
          </>
        );
      case EHeaderType.MoreGame: // 更多遊戲頁面
        return (
          <>
            {/*{isDesktop ? (*/}
            {/*  <div className="w-6" />*/}
            {/*) : (*/}
            {/*  <BackIcon onBack={props.onBack} />*/}
            {/*)}*/}
            <BackIcon />

            <GameLogo />
          </>
        );
      default: //首頁 遊戲畫面
        return (
          <>
            {/*{isDesktop ? <div className="w-6" /> : <MenuIcon />}*/}
            <HeaderSystemLogo />
          </>
        );
    }
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);

const HeadRight = memo(
  () => {
    const isLogin = useIsLoginStore((state) => state.isLogin);
    const config = useHeaderStore((state) => state.config);
    switch (config.type) {
      case EHeaderType.Common: //全局文字標題
        // return <HomeIcon />;
        return (
          <div className="relative w-full">
            <div
              className={cx(
                FLEX_CENTER,
                'w-full absolute top-1/2 -translate-y-1/2'
              )}
            >
              <Title title={config.title} />
            </div>

            {config?.render && config.render()}
          </div>
        );
        return null;
      case EHeaderType.GameSel: //遊戲選單
        return (
          isLogin && (
            <>
              <HeaderDepositButton
                isInGame={false}
                onDepositClick={config.onDepositClick}
              />
              <HeaderUserInfo />
            </>
          )
        );
      case EHeaderType.MoreGame: // 更多遊戲頁面
        return isLogin ? (
          <>
            <HeaderWalletBalanceSummary />
            {/*<HeaderDepositButton*/}
            {/*  isInGame={false}*/}
            {/*  onDepositClick={config.onDepositClick}*/}
            {/*/>*/}
            <HeaderUserInfo isInMoreGame={true} />
          </>
        ) : (
          <LoginButton />
        );
      case EHeaderType.GameWeb: //遊戲畫面，必定登入
        return (
          <HeaderDepositButton
            isInGame={true}
            onDepositClick={config.onDepositClick}
          />
        );
      default: //首頁
        return isLogin ? (
          <div className="flex gap-2">
            {/*<HeaderWalletBalanceSummary />*/}
            {/*<HeaderDepositButton*/}
            {/*  isInGame={false}*/}
            {/*  onDepositClick={props.onDepositClick}*/}
            {/*/>*/}
            {/*<HeaderUserInfo />*/}

            {/*<LuckyWheelButton />*/}
            {/*<InBoxButton />*/}
            {config?.render && config.render()}
          </div>
        ) : (
          <LoginButton />
        );
    }
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);

const CenterTitleHeader = () => {
  const config = useHeaderStore((state) => state.config);
  return (
    <div className={cx(FLEX_CENTER, 'w-full')}>
      <Title title={config.title} />
    </div>
  );
};

const EmptyHeader = () => {
  const config = useHeaderStore((state) => state.config);
  return <>{config?.render && config.render()}</>;
};

const HeadLeftAndRight = () => {
  const config = useHeaderStore((state) => state.config);
  return (
    <>
      <div
        className={cx(FLEX_ITEMS_CENTER, 'gap-2', {
          'z-10': config.type === EHeaderType.Common,
        })}
      >
        <HeadLeft />
      </div>
      <div
        className={cx(FLEX_ITEMS_CENTER, 'gap-2', {
          'w-full -ml-7 ': config.type === EHeaderType.Common,
        })}
      >
        <HeadRight />
      </div>
    </>
  );
};

export const Header = memo(
  forwardRef<HTMLDivElement, Partial<IConfig>>(
    (props: Partial<IConfig>, ref: Ref<HTMLDivElement>) => {
      useMobileExclusiveHeaderOverride();
      const config = useHeaderStore((state) => state.config);

      const headerBgColor =
        config.headerBgColor !== undefined
          ? config.headerBgColor
          : 'bgi-[var(--base-2-variant5)]';

      const headerComponent =
        config.type === EHeaderType.Empty ? (
          <EmptyHeader />
        ) : config.type === EHeaderType.CenterTitle ? (
          <CenterTitleHeader />
        ) : (
          <HeadLeftAndRight />
        );

      return config.type === EHeaderType.Null ? (
        <></>
      ) : (
        <header ref={ref} className={cx('header-content', 'w-full fixed z-40')}>
          <div
            className={cx(
              FLEX_ITEMS_CENTER,
              MOBILE_BREAK_POINT_MAX_WIDTH,
              'justify-between',
              'w-full h-20',
              headerBgColor,
              'px-4',
              'shrink-0',
              'top-0 '
            )}
          >
            {headerComponent}
          </div>
        </header>
      );
    }
  ),
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);
