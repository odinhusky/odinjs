import { BoxInfoStep } from "../../../../../../external/endpoint/activity/box/GetBoxInfoEndpoint";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import { CacheImage } from "../../../../../components/image/CacheImage";
import { environment } from "../../../../../../../environments/environment";
import { tcx } from "apps/gambling/src/app/ui/utils/tcx";
import { ActivityRedeemableModal } from "apps/gambling/src/app/ui/modals/ActivityRedeemableModal";
import { useState } from "react";
import { XY_CENTER } from "apps/gambling/src/assets/constant/style";
import t from "apps/gambling/src/assets/constant/lang";
import { formatLocaleMoney } from "apps/gambling/src/app/ui/utils/format";

interface StepsContainerProps {
  steps: BoxInfoStep[];
  onClickToClaim: (number: number) => Promise<void>;
}
export const StepsContainer = ({
  steps,
  onClickToClaim,
}: StepsContainerProps) => {
  const { isTablet, isMobile, isDesktop } = useBreakpoint();
  const num = isDesktop ? 4 : isTablet ? 3 : 2;
  const [claimStep, setClaimStep] = useState<BoxInfoStep | null>(null);
  return (
    <div
      className={tcx(
        "bg-linear-4-main border-popup-button before:rounded-lg rounded-lg mobile:py-10 mobile:px-5 py-6 px-3",
        "grid tablet:grid-cols-4 mobile:grid-cols-3 grid-cols-2 gap-x-5 mobile:gap-x-6 tablet:gap-y-6 mobile:gap-y-4 gap-y-8"
      )}
    >
      {claimStep && (
        <ActivityRedeemableModal
          redeemableAmount={`R$${claimStep.rewardAmount}`}
          title={"Parabéns por ganhar o"}
          submitText={"Claro"}
          onClick={() => {
            onClickToClaim(claimStep.inviteNum);
            setClaimStep(null);
          }}
          onCloseClick={() => {
            setClaimStep(null);
          }}
        />
      )}
      {steps.map((step, index) => (
        <div
          key={index}
          className={
            "flex flex-col mobile:gap-3 gap-2"
            // isMobile
            //   ? tcx(
            //       "relative",
            //       "before:absolute before:left-0 before:-bottom-4  before:h-[1px] before:bg-[var(--grayscale-70)]",
            //       index % num ? "before:w-full" : "before:w-[calc(100%+20px)]"
            //     )
            //   : ""
          }
        >
          <div className="relative">
            <div
              className={tcx(
                "flex justify-center items-center flex-1",
                ["px-[22px]", isDesktop],
                ["px-[17.33px]", isTablet],
                ["px-[6px]", isMobile],
                ["cursor-pointer", step.status === "UNCLAIMED"]
              )}
              style={
                step.status === "UNCLAIMED"
                  ? {
                      border: "5px solid transparent",
                      backgroundClip: "padding-box",
                      backgroundOrigin: "padding-box",
                    }
                  : {}
              }
              onClick={() => step.status === "UNCLAIMED" && setClaimStep(step)}
            >
              <CacheImage
                alt="box"
                src={`assets/${environment.uVersion}/${
                  environment.mVersion
                }/ic_box_${step.icon}_${step.status.toLowerCase()}.png`}
              />
            </div>
            {step.status === "LOCKED" && (
              <img
                className={tcx("absolute w-16 h-16", XY_CENTER)}
                alt=""
                src={`assets/${environment.uVersion}/icon_lock2.png`}
              />
            )}
            <img
              className={tcx(
                "w-auto h-[31%] absolute top-1/2 right-[2%] translate-x-full -translate-y-1/2",
                ["opacity-0", !((index + 1) % num && index < steps.length - 1)]
              )}
              alt=""
              src={`assets/${environment.uVersion}/icon_arrow_right_2.png`}
            />
          </div>
          <div className="mobile:text-base text-sm text-center text-[var(--transparent-white-70)] font-medium">
            {t["boxInternalInvitePeopleNum"](step.inviteNum)}
          </div>
          <div className="mobile:text-xl text-lg text-center font-bold">
            R$ {formatLocaleMoney(step.rewardAmount)}
          </div>
        </div>
      ))}
    </div>
  );
};
