import cx from 'apps/gambling/src/app/ui/utils/cx';
import { LogoutCancelButton } from '../../../Buttons/LogoutCancelButton';
import { LogoutConfirmButton } from '../../../Buttons/LogoutConfirmButton';
import t from 'apps/gambling/src/assets/constant/lang';

interface DefaultLogoutSectionProps {
  className?: string;
  onHandleCancel: () => void;
  onHandleLogout: () => void;
}

export const DefaultLogoutSection = ({
  className = '',
  onHandleCancel,
  onHandleLogout,
}: DefaultLogoutSectionProps) => {
  return (
    <div className={cx('flex flex-col text-sm md:text-base', className)}>
      <div className={'mb-2 text-[var(--white)]'}>{t['confirmLogout']}</div>

      <div className={'flex flex-row justify-center'}>
        <LogoutCancelButton onClick={onHandleCancel} />

        <LogoutConfirmButton onClick={onHandleLogout} />
      </div>
    </div>
  );
};

export default DefaultLogoutSection;
