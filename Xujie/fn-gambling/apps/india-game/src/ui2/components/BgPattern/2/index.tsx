import { cx } from '@libs/commonUtils';
import { patternBgStyle } from '@libs/constant/style';
import { BgPatternProps } from '../BgPatternProps';

/**
 * @author Odin
 * @description 此元件為[ui/2] 為 [IN] V6 版本，特定的容器內的方格背景，以絕對定位的方式進行實作，若父層容器有需要圓角需要透過 className 傳入
 */
export const BgPattern = ({ className }: BgPatternProps) => {
  return (
    <div
      className={cx('w-full h-full', 'absolute inset-0 z-[0]', className)}
      style={patternBgStyle}
    ></div>
  );
};

export default BgPattern;
