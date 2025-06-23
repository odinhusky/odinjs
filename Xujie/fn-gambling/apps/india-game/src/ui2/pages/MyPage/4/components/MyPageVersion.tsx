import { cx } from '@libs/commonUtils';
import { FLEX_CENTER } from '@libs/constant/style';
import sdkUtils from '@mode2/utils/sdk';

export const MyPageVersion = () => {
  return (
    <div
      className={cx(
        FLEX_CENTER,
        'w-full h-5',
        'text-sm',
        'bgi-text-[var(--grayscale-50)]'
      )}
    >
      version {sdkUtils.getH5VersionName()}
    </div>
  );
};

export default MyPageVersion;
