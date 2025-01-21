import Icon from '@mode2/components/Icon';
import { useTranslation } from 'react-i18next';
import { memo } from 'react';
import { useIsLoginStore } from '@mode2/zustand/loginStore';
import cx from '@commonUtils/cx';
import { useBreakPoint } from '@libs/commonUtils';

export const QuitButton = memo(
  (props: { className?: string; onClick: () => void }) => {
    useBreakPoint();
    const isLogin = useIsLoginStore((state) => state.isLogin);
    const { t } = useTranslation();
    return isLogin ? (
      <button
        className={cx(
          'h-full',
          'py-2 px-3',
          'border border-[var(--grayscale-15)]',
          'bgi-[var(--grayscale-10)]',
          'flex items-center rounded-lg',
          props.className
        )}
        onClick={props.onClick}
      >
        <Icon className="w-5 h-5" color="var(--grayscale-60)" name="ic_quit" />
      </button>
    ) : null;
  }
);
