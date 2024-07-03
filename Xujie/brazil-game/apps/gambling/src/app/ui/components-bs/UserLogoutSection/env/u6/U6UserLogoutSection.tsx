import { IUserLogoutSectionProps } from '../../index';
import { environment } from '../../../../../../environments/environment';
import cx from 'apps/gambling/src/app/ui/utils/cx';
import { FLEX_CENTER } from 'apps/gambling/src/assets/constant/style';
import t from 'apps/gambling/src/assets/constant/lang';
import U6UserLogoutSectionBtn from './U6UserLogoutSectionBtn';

export const U6UserLogoutSection = ({
  onHandleLogout,
  onHandleCancel,
}: IUserLogoutSectionProps) => (
  <div
    className={cx(
      'relative',
      'w-[320px] mobile:w-[360px] tablet:w-[552px]',
      'px-4 py-6 mobile:px-8 mobile:py-8 tablet:px-9 tablet:py-10',
      'rounded-xl',
      'box-border',
      'text-center text-[var(--grayscale-100)]',
      'bg-linear-4-main'
    )}
  >
    {/* 關閉按鈕 */}
    <div
      className={cx(
        'absolute right-[9px] top-[8px] mobile:right-3 mobile:top-3',
        FLEX_CENTER,
        'rounded-full',
        'w-[28px] h-[28px] mobile:w-9 mobile:h-9 tablet:w-[40px] tablet:h-[40px]',
        'linear-5-button'
      )}
      onClick={onHandleCancel}
    >
      <img
        src={`assets/${environment.uVersion}/icon_cross.png`}
        className={cx(
          'w-[21px] h-[21px] mobile:w-[27px] mobile:h-[27px] tablet:w-[30px] tablet:h-[30px]'
        )}
        alt="close"
      />
    </div>

    <div className="w-full space-y-4">
      <div className={cx('tablet:space-y-5', FLEX_CENTER, 'flex-col')}>
        <div
          className={cx(
            'w-[288px] mobile:w-[296px]  tablet:w-[480px] ',
            'h-[200px] mobile:h-[280px] tablet:h-[520px]'
          )}
        >
          <img
            src={`assets/${environment.uVersion}/ic_logout_m.png`}
            className="w-full h-full block mobile:hidden"
            alt="icon"
          />
          <img
            src={`assets/${environment.uVersion}/ic_logout_t.png`}
            className="w-full h-full hidden max-tablet:mobile:block"
            alt="icon"
          />
          <img
            src={`assets/${environment.uVersion}/ic_logout.png`}
            className="w-full h-full hidden tablet:block"
            alt="icon"
          />
        </div>

        <div className="text-base mobile:text-lg tablet:text-2xl font-medium">
          {t['confirmLogout']}
        </div>
      </div>

      <div
        className={cx(
          'w-full',
          'flex justify-between',
          'space-x-2',
          'text-sm tablet:text-base font-bold tablet:font-medium'
        )}
      >
        <U6UserLogoutSectionBtn
          className="linear-1-button"
          onClick={onHandleCancel}
        >
          {t['Cancel']}
        </U6UserLogoutSectionBtn>

        <U6UserLogoutSectionBtn
          className="linear-2-button"
          onClick={onHandleLogout}
        >
          {t['Confirm']}
        </U6UserLogoutSectionBtn>
      </div>
    </div>
  </div>
);

export default U6UserLogoutSection;
