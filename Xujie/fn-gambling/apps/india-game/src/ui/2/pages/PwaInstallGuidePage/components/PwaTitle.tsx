import cx from '@libs/commonUtils/cx';
import { IPwa } from '..';
import sdkUtils from '@libs/mode2/utils/sdk';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';

export const PwaTitle = ({ timeDown, success }: IPwa) => {
  const productName = sdkUtils.productName();
  return (
    <div className="flex gap-4 items-center justify-center">
      <div className="relative">
        <div
          className={cx(
            'absolute left-[-7px] top-[-7px] hidden',
            'loadingAnim',
            {
              block: timeDown,
            }
          )}
        >
          <svg viewBox="25 25 50 50">
            <circle r="20" cy="50" cx="50"></circle>
          </svg>
        </div>
        <div className="flex w-[68px] h-[68px]">
          <img
            className={cx('w-[68px] h-[68px] m-auto rounded-lg', {
              'w-[40px] h-[40px]': timeDown,
            })}
            src={getImgUrl(EResourceLevel.LOGO, 'game_logo_512')}
            alt="icon"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-[#000000] text-[22px]">{productName}</div>
        <div className="text-[#FF9B05] text-sm">
          {timeDown || success ? (
            <div className="intern" />
          ) : (
            'Product domain.com'
          )}
        </div>
      </div>
    </div>
  );
};
