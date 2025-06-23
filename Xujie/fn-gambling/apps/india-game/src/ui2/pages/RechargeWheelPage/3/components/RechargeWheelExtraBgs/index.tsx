import { cx } from '@libs/commonUtils';
import { XY_CENTER } from '@libs/constant/style';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { BaseCacheImg } from '@mode2/components/BaseCacheImg';

interface RechargeWheelExtraBgsProps {}

export const RechargeWheelExtraBgs = ({}: RechargeWheelExtraBgsProps) => {
  const commonClass = cx(
    'absolute z-[0]',
    XY_CENTER,
    '-translate-y-[52%]',
    'w-[80%] phone:w-[480px]',
    'py-8'
  );
  return (
    <>
      <div className={cx(commonClass)}>
        <BaseCacheImg
          src={getImgUrl(EResourceLevel.V, 'deposit_wheel_background_light')}
          imgName="deposit_wheel_background_light"
          alt="Wheel background light image"
          className={cx('block', 'w-full')}
        />
      </div>

      <div className={cx(commonClass)}>
        <BaseCacheImg
          src={getImgUrl(EResourceLevel.V, 'deposit_wheel_background_stars')}
          imgName="deposit_wheel_background_stars"
          alt="Wheel background light image"
          className={cx('block', 'w-full')}
        />
      </div>
    </>
  );
};

export default RechargeWheelExtraBgs;
