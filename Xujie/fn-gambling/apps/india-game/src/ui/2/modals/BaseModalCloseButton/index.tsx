import { cx, useBreakPoint } from '@libs/commonUtils';
import { FLEX_CENTER, X_CENTER } from '@libs/constant/style';
import Icon from '@components/Icon';

export const CloseBtnUnit = ({
  onClose,
  customClass,
}: {
  onClose: () => void;
  customClass?: string;
}) => {
  return (
    <button
      className={cx(
        FLEX_CENTER,
        'h-6 w-6',
        'p-1',
        'rounded-full',
        'border border-solid border-white',
        'z-[2]',
        customClass
      )}
      onClick={onClose}
    >
      <Icon className="w-full" name="ic_close" />
    </button>
  );
};

export interface BaseModalCloseButtonProps {
  onClose?: VoidFunction;
  className?: string;
}

export const BaseModalCloseButton = ({
  onClose,
  className,
}: BaseModalCloseButtonProps) => {
  const { isDesktop } = useBreakPoint();

  return (
    <>
      {isDesktop && (
        <CloseBtnUnit
          onClose={() => onClose?.()}
          customClass={cx('absolute top-3 right-3', className)}
        />
      )}

      {!isDesktop && (
        <div
          className={cx(
            'flex justify-center mt-3',
            'absolute -bottom-3 translate-y-[100%]',
            X_CENTER
          )}
        >
          <CloseBtnUnit
            customClass={cx(className)}
            onClose={() => onClose?.()}
          />
        </div>
      )}
    </>
  );
};

export default BaseModalCloseButton;
