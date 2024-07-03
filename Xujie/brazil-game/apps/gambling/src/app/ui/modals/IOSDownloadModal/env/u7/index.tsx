import { environment } from "../../../../../../environments/environment";
import { useEffect, useState } from "react";
import cx from "../../../../utils/cx";
import { IOSDownloadModalProps } from "../..";
import { U7Modal } from "../../../UModal/u7/U7Modal";
import t from "apps/gambling/src/assets/constant/lang";

export const U7IOSDownloadModal = ({
  onClose
}: IOSDownloadModalProps) => {
  const [isShow, setIsShow] = useState(true)

  useEffect(() => {
    if (isShow) return;
    const timer = setTimeout(() => {
      onClose();
    }, 500)
    return () => clearTimeout(timer)
  }, [isShow]);

  // = styles
  const IOSModalTextClass = cx(
    'block',
    'font-medium text-xs leading-4',
    'tab:font-normal tab:text-base tab:leading-5'
  );

  const IOSImagesClass = cx(
    'block w-full'
  );

  return (
    <U7Modal
      baseModalClass={cx(
        'animate__animated animate__faster',
        isShow ? 'animate__slideInUp' : 'animate__slideOutDown'
      )}
      onClose={() => {
        setIsShow(false);
      }}
    >
      <div
        className={cx(
          'w-full',
          'flex justify-center'
        )}
      >
        <div className={cx(
          'w-full h-full',
          'relative',
          'flex flex-col gap-5'
        )}>
          <p
            className={cx(IOSModalTextClass)}
          >{t['IOSDownloadModalP1']}</p>

          <img
            className={cx(IOSImagesClass)}
            src={`assets/${environment.uVersion}/bg_ios_modal_share.png`}
            alt="IOS download modal description image for sharing"
          />

          <p
            className={cx(IOSModalTextClass)}
          >{t['IOSDownloadModalP2']}</p>

          <img
            className={cx(IOSImagesClass)}
            src={`assets/${environment.uVersion}/bg_ios_modal_plus.png`}
            alt="IOS download modal description image for plus"
          />
        </div>
      </div>
    </U7Modal>
  )
}

export default U7IOSDownloadModal;
