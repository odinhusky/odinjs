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
import Icon from '@components/Icon';
import { HeaderSystemLogo } from '@components/HeaderSystemLogo';

export const BackIcon = memo((props: { onBack?: () => void }) => {
  return null;
});

const MenuIcon = memo(() => {
  return null;
});

const Title = memo(
  (props: { title?: I18NContent }) => {
    return null;
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);

const GameLogo = memo(() => {
  return null;
});

const LoginButton = memo(() => {
  return null;
});

const HomeIcon = memo(() => {
  return null;
});

const HeadLeft = memo(
  (props: IConfig) => {
    return null;
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);

const HeadRight = memo(
  (props: { type: `${EHeaderType}`; onDepositClick?: () => void }) => {
    return null;
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);

export const Header = memo(
  forwardRef<HTMLDivElement, Partial<IConfig>>(
    (props: Partial<IConfig>, ref: Ref<HTMLDivElement>) => {
      return <div ref={ref}></div>;
    }
  ),
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);
