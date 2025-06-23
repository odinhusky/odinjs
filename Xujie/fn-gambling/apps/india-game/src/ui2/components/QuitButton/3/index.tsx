import Icon from '@components/Icon';
// import { useTranslation } from 'react-i18next';
import { memo } from 'react';
import cx from '@commonUtils/cx';
import { useBreakPoint } from '@libs/commonUtils';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { UserRoleType } from '@mode2/@types/userRoleTypes';
import { useTranslation } from 'react-i18next';
import { QuitButtonProps } from '../QuitButtonProps';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';

export const QuitButton = memo((props: QuitButtonProps) => {
  useBreakPoint();
  const { t } = useTranslation();
  const userRole = useUserProfileStore((state) => state.userRole);
  return [UserRoleType.PLAYER, UserRoleType.USER].includes(userRole) ? (
    <BaseSecondaryBtn
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
      <span>{props.text ? props.text : t('logout_button')}</span>
    </BaseSecondaryBtn>
  ) : null;
});
