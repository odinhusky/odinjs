import { BoxInfoStep } from "../../../../../../external/endpoint/activity/box/GetBoxInfoEndpoint"
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint"
import { CacheImage } from "../../../../../components/image/CacheImage"
import { environment } from "../../../../../../../environments/environment"
import { tcx } from "apps/gambling/src/app/ui/utils/tcx"
import { ActivityRedeemableModal } from "apps/gambling/src/app/ui/modals/ActivityRedeemableModal"
import { useState } from "react"

interface StepsContainerProps {
  steps: BoxInfoStep[]
  onClickToClaim: (number: number) => Promise<void>
}
export const StepsContainer = ({
  steps,
  onClickToClaim,
}: StepsContainerProps) => {
  const { isTablet, isMobile, isDesktop } = useBreakpoint()
  const num = isDesktop ? 5 : isTablet ? 4 : 2
  const [claimStep, setClaimStep] = useState<BoxInfoStep | null>(null)
  return (
    <div
      className={tcx(
        "rounded-xl border border-[var(--grayscale-70)] tablet:px-10 tablet:py-6 mobile:p-6 px-4 py-3",
        "grid tablet:grid-cols-5 mobile:grid-cols-4 grid-cols-2 gap-x-5 mobile:gap-x-6 tablet:gap-y-6 mobile:gap-y-4 gap-y-8"
      )}
    >
      {claimStep && (
        <ActivityRedeemableModal
          redeemableAmount={`R$${claimStep.rewardAmount}`}
          title={"Parabéns por ganhar o"}
          submitText={"Claro"}
          onClick={() => {
            onClickToClaim(claimStep.inviteNum)
            setClaimStep(null)
          }}
          onCloseClick={() => {
            setClaimStep(null)
          }}
        />
      )}
      {steps.map((step, index) => (
        <div
          key={index}
          className={
            isMobile
              ? tcx(
                  "relative",
                  "before:absolute before:left-0 before:-bottom-4  before:h-[1px] before:bg-[var(--grayscale-70)]",
                  index % num ? "before:w-full" : "before:w-[calc(100%+20px)]"
                )
              : ""
          }
        >
          <div className="relative">
            <div
              className={tcx(
                "rounded-lg flex justify-center items-center flex-1",
                ["px-[22.8px] py-[8.8px]", isDesktop],
                ["px-5 py-4 ", isTablet],
                ["px-6 py-5", isMobile],
                ["bg-[#4D4D4D]", step.status === "CLAIMED"],
                ["bg-linear-1-disabled", step.status !== "CLAIMED"],
                ["cursor-pointer", step.status === "UNCLAIMED"]
              )}
              style={
                step.status === "UNCLAIMED"
                  ? {
                      boxSizing: "border-box",
                      border: "5px solid transparent",
                      backgroundClip: "padding-box, border-box",
                      backgroundOrigin: "padding-box, border-box",
                      backgroundImage:
                        "var(--linear-1-disabled), var(--linear-1-main)",
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
                className="w-4 h-5 absolute top-2.5 right-3"
                alt=""
                src={`assets/${environment.uVersion}/icon_lock.png`}
              />
            )}
            <img
              className={tcx(
                "mobile:w-6 w-5 absolute top-1/2 right-0 translate-x-full -translate-y-1/2",
                ["opacity-0", !((index + 1) % num && index < steps.length - 1)]
              )}
              alt=""
              src={`assets/${environment.uVersion}/icon_arrow_right_2.png`}
            />
          </div>
          <div className="font-medium tablet:text-xl mobile:text-lg text-base text-[var(--grayscale-100)] mt-1">
            {step.inviteNum} pessoas
          </div>
          <div className="tablet:text-lg mobile:text-base text-sm text-[var(--grayscale-70)]">
            R$ {step.rewardAmount}
          </div>
        </div>
      ))}
    </div>
  )
}
