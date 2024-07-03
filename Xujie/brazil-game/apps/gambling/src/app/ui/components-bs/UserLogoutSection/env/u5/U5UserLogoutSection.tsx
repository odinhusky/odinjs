import { IUserLogoutSectionProps } from '../../index';
import { environment } from '../../../../../../environments/environment';
import cx from '../../../../utils/cx';
import {
  FLEX_CENTER,
  FLEX_COL,
  FLEX_ITEMS_CENTER,
} from 'apps/gambling/src/assets/constant/style';
import t from 'apps/gambling/src/assets/constant/lang';
import U5UserLogoutSectionBtn from './U5UserLogoutSectionBtn';

export const U5UserLogoutSection = ({
  onHandleLogout,
  onHandleCancel,
}: IUserLogoutSectionProps) => (
  <div
    className={cx(
      'relative',
      'w-[80vw] md:w-[360px] xl:w-[424px]',
      'p-8',
      'rounded-lg',
      FLEX_COL,
      'text-white',
      'bg-linear-3-main'
    )}
  >
    <button
      className={cx(
        'absolute -right-2.5 -top-2.5',
        'w-10 h-10',
        'rounded-full',
        FLEX_CENTER,
        'bg-linear-3-main',
        'shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.25)]'
      )}
      onClick={onHandleCancel}
    >
      <img
        className="w-[24px] h-[24px] hover:opacity-80"
        src={`assets/${environment.uVersion}/icon_close.png`}
        alt="close"
      />
    </button>

    <div>
      <img
        alt="bg"
        className="w-full"
        src={`assets/${environment.uVersion}/ic_logout.png`}
      />
      <div className={cx(FLEX_COL, 'tablet:mt-4')}>
        <div className="text-center font-bold text-base sm:text-xl  xl:text-xl">
          {t['confirmLogout']}
        </div>

        <div className={cx(FLEX_ITEMS_CENTER, 'gap-5', 'mt-3 sm:mt-4 xl:mt-8')}>
          <U5UserLogoutSectionBtn onClick={onHandleCancel}>
            {t['Cancel']}
          </U5UserLogoutSectionBtn>

          <U5UserLogoutSectionBtn
            className={cx('group')}
            onClick={onHandleLogout}
          >
            {t['Confirm']}
          </U5UserLogoutSectionBtn>
        </div>
      </div>
    </div>
  </div>
);

export default U5UserLogoutSection;
