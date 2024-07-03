import QRCode from 'react-qr-code';
import cx from 'classnames';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { U7Modal } from '../../../UModal/u7/U7Modal';
import t from 'apps/gambling/src/assets/constant/lang';
import U7OutlinedBtn from '../../../../components-bs/Buttons/env/u7/U7OutlinedBtn';

export type IInitialChargeModal = {
  close: () => void;
};

export const DownloadModal = (props: IInitialChargeModal) => {
  const { onClickToOpenDownload, downloadUrl } = usePageNavigate();

  const handleDownload = () => {
    onClickToOpenDownload();
  };

  // = style
  const spacingY = cx('mt-4 tab:mt-6 tablet:mt-8');

  return (
    <U7Modal
      onClose={() => {
        props.close();
      }}
    >
      <>
        <QRCode
          className={cx(
            'bg-[var(--grayscale-100)]',
            'w-40 mobile:w-60',
            'h-40 mobile:h-60',
            'rounded-lg',
            'p-2 mobile:p-4'
          )}
          value={downloadUrl}
        />

        <div
          className={cx(
            'w-full',
            'font-medium text-center',
            'text-xs leading-4',
            'tab:text-base tab:leading-5',
            'tablet:text-lg tablet:leading-6',
            spacingY
          )}
        >
          {t['downloadModalText']}
        </div>

        <U7OutlinedBtn
          borderClass={cx(spacingY)}
          onClick={() => handleDownload()}
          children={t['downloadAndroid']}
        />
      </>
    </U7Modal>
  );
};
