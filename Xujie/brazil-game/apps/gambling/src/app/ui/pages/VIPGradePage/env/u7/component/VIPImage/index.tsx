import cx from "apps/gambling/src/app/ui/utils/cx";
import VIPLock from "../VIPLock";

interface VIPImageProps {
  src: string;
  alt: string;
  isShowVIPLock: boolean;
  isShowVIPImage?: boolean;
  imgClass?: string;
  isBiggerLock?: boolean
  containerClass?: string;
}

export const VIPImage = ({
  src,
  alt,
  isShowVIPImage = true,
  isShowVIPLock,
  imgClass = '',
  isBiggerLock = false,
  containerClass = ''
}: VIPImageProps) => {

  return (
    <>
      {
        isShowVIPImage ? (
          <div className={cx(containerClass)}>
            <img
              className={cx(imgClass)}
              alt={alt}
              src={src}
            />

            {/* 當前等級沒有達到就上鎖 */}
            {
              isShowVIPLock ? <VIPLock isBigger={isBiggerLock} /> : null
            }
          </div>
        ) : null
      }
    </>
  )
}

export default VIPImage;