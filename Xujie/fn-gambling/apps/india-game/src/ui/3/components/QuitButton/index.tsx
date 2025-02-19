import Icon from '@components/Icon';
// import { useTranslation } from 'react-i18next';
import { memo } from 'react';
import { useIsLoginStore } from '@mode2/zustand/loginStore';
import cx from '@commonUtils/cx';
import { useBreakPoint } from '@libs/commonUtils';

interface IProps {
  className?: string;
  text?: string;
  iconClassName?: string;
  showIcon?: boolean;
  onClick: () => void;
}

export const QuitButton = memo((props: IProps) => {
  useBreakPoint();
  const isLogin = useIsLoginStore((state) => state.isLogin);
  // const { t } = useTranslation();

  return isLogin ? (
    <button
      className={cx(
        'w-full h-full',
        'py-2 px-3',
        'bgi-[var(--base-2-variant5)] bgi-text-[var(--transparent-white-70)]',
        'flex items-center rounded-lg gap-2',
        'font-medium text-lg',
        props.className
      )}
      onClick={props.onClick}
    >
      {props.showIcon ? (
        <Icon
          className={cx('w-5 h-5', props.iconClassName)}
          color="var(--grayscale-50)"
          name="ic_quit"
        />
      ) : null}
      {/* TODO i18n */}
      <span>{props.text ? props.text : 'Logout'}</span>
    </button>
  ) : null;
});
