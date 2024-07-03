import { IUserLogoutSectionProps } from '../../index';
import t from 'apps/gambling/src/assets/constant/lang';
import cx from '../../../../utils/cx';
import P1UserLogoutSectionBtn from './P1UserLogoutSectionBtn';

export const P1UserLogoutSection = ({
  onHandleLogout,
  onHandleCancel,
}: IUserLogoutSectionProps) => (
  <div className={cx('flex flex-col text-sm md:text-base')}>
    <div className={'mb-2 text-[var(--white)]'}>{t['confirmLogout']}</div>

    <div className={'flex flex-row justify-center'}>
      <P1UserLogoutSectionBtn type="cancel" onClick={() => onHandleCancel()}>
        {t['Cancel']}
      </P1UserLogoutSectionBtn>

      <P1UserLogoutSectionBtn type="confirm" onClick={() => onHandleLogout()}>
        {' '}
        {t['Confirm']}
      </P1UserLogoutSectionBtn>
    </div>
  </div>
);

export default P1UserLogoutSection;
