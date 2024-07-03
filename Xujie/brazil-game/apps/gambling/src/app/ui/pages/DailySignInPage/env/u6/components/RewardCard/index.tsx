import { twMerge } from "tailwind-merge";
import { environment } from "../../../../../../../../environments/environment";
import { formatLocaleMoney } from "../../../../../../utils/format";
import cx from "apps/gambling/src/app/ui/utils/cx";

interface RewardCardProps {
  isLock: boolean;
  day: number;
  cashback: number;
  todayIsSignIn: boolean;
  signInTotalDays?: number;
  onClickToSignIn: () => void;
  isSigned: boolean;
}

export const RewardCard = ({
  isLock,
  day,
  cashback,
  todayIsSignIn,
  signInTotalDays,
  onClickToSignIn,
  isSigned,
}: RewardCardProps) => {
  const singInStatus = isLock
    ? "after" //未签到
    : day <= (signInTotalDays || 0)
    ? "before" //签到过
    : day === (signInTotalDays || 0) + 1 && !todayIsSignIn
    ? "current" //当前
    : "after";
  return (
    <div
      className={cx(
        "bg-linear-1-main relative flex flex-col gap-2 text-[var(--grayscale-100)] tablet:py-3 tablet:px-4 mobile:py-2 mobile:px-3 p-2",
        "rounded-xl justify-center items-center overflow-hidden",
        "shadow-[0px_-4.49px_4.49px_0px_#00000033_inset,0px_4.49px_4.49px_0px_#FFFFFF33_inset]",
        {
          "bg-[#4D4D4D] shadow-none text-[var(--transparente-30)]":
            singInStatus === "before" || isSigned,
        }
      )}
    >
      <div className="tablet:text-lg text-base text-center font-medium">
        Dia {day}
      </div>
      <img
        className={cx("w-[68px] h-[72px] drop-shadow-none", {
          "drop-shadow-[0px_0px_13.5px_#FFFFFF80]": singInStatus !== "before",
        })}
        alt="img"
        src={`assets/${environment.uVersion}/icon_box_current.png`}
      />
      <div className="tablet:text-xl mobile:text-lg text-base text-center font-bold">
        R$ {formatLocaleMoney(cashback)}
      </div>
      <div
        className={cx(
          "flex font-medium tablet:text-base mobile:text-sm text-xs tablet:w-[155.2px] mobile:w-[125px] w-[148px] tablet:h-10 mobile:h-9 h-8",
          "bg-[var(--transparente-gray-30)] rounded-lg pointer-events-auto justify-center items-center cursor-pointer",
          {
            "linear-2-button": singInStatus === "current" && !isSigned,
            "linear-2-button pointer-events-none":
              singInStatus === "after" && !isSigned,
          }
        )}
        onClick={(e) => {
          if (singInStatus === "current") {
            e.stopPropagation();
            onClickToSignIn();
          }
        }}
      >
        Check-in
      </div>
      <div
        className={cx("absolute w-full h-full bg-black hidden", {
          "opacity-30 block": singInStatus === "after",
          "opacity-20 block": singInStatus === "before" || isSigned,
        })}
      />
    </div>
  );
};
