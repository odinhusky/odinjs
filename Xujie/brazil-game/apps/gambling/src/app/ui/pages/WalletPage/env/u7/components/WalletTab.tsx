import { BaseBtn } from 'apps/gambling/src/app/ui/components-bs/Buttons/BaseBtn';
import cx from 'apps/gambling/src/app/ui/utils/cx';

interface WalletTabProps {
  active: boolean;
  onClick: () => void;
  title: string;
}

export const WalletTab = ({ active, title, onClick }: WalletTabProps) => {
  return (
    <BaseBtn
      isActive={active}
      activeBgClass=""
      btnClass={cx(
        'w-full mobile:w-[120px] h-[42px]',
        'rounded-none border-none p-0'
      )}
      btnCenterClass="w-full h-full"
      childrenClass={cx(
        'relative w-full h-full text-[var(--grayscale-80)]',
        'text-[var(--grayscale-80)] text-sm font-medium leading-[42px]',
        { 'text-linear font-bold': active }
      )}
      onClick={onClick}
    >
      {title}
      {active && (
        <hr className="absolute w-full bottom-0 border-[1.5px] border-[var(--grayscale-80)] " />
      )}
    </BaseBtn>
  );
};

export default WalletTab;
