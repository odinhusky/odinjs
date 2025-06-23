import { useTranslation } from 'react-i18next';
import { memo } from 'react';
import { useIsLoginStore } from '@mode2/zustand/loginStore';
import cx from '@commonUtils/cx';
import { useBreakPoint } from '@libs/commonUtils';
import Icon from '@components/Icon';
import { QuitButtonProps } from '../QuitButtonProps';

export const QuitButton = memo((props: QuitButtonProps) => {
  useBreakPoint();
  const isLogin = useIsLoginStore((state) => state.isLogin);
  const { t } = useTranslation();
  return isLogin ? (
    <button
      className={cx(
        'w-full h-full',
        'py-2 px-2',
        'bgi-[var(--transparent-white-10)] bgi-text-[var(--grayscale-50)]',
        'flex items-center rounded-lg gap-2',
        'font-medium text-sm mobile:text-base',
        props.className
      )}
      onClick={props.onClick}
    >
      <Icon className={cx('w-5 h-5', props.iconClassName)} name="ic_quit" />
      <span>{t('leftnav_quit')}</span>
    </button>
  ) : null;
});
