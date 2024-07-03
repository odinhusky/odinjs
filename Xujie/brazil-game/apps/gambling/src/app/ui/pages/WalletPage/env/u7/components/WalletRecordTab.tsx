import BaseBtn from "apps/gambling/src/app/ui/components-bs/Buttons/BaseBtn";
import cx from "apps/gambling/src/app/ui/utils/cx";

interface WalletRecordTabProps {
  title: string;
  active: boolean;
  onClick: () => void;
}

export const WalletRecordTab = ({
  title,
  active,
  onClick,
}: WalletRecordTabProps) => {
  return (
    <BaseBtn
    // className="font-bold"
      btnClass={cx(
        "w-[100px] h-10 border-none ",
        {
          "bg-linear-3-main shadow-[0px_0px_10.6px_6px_#FFFFFF40_inset] ": active,
        }
      )}
      childrenClass={cx(
        "text-sm text-[var(--transparent-white-50)] font-normal",
        {
          "text-[var(--transparent-white-100)] font-bold": active,
        }
      )}
      children={title}
      onClick={onClick}
    />
  );
};

export default WalletRecordTab;
