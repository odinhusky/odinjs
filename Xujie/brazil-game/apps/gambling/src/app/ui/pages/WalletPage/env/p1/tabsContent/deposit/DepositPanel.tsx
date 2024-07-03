import { DepositMoneyButton } from "../../../../../../components-bs/Buttons/DepositMoneyButton";
import { DepositInput } from "../../../../components/deposit/DepositInput"
import { DepositNoticeSection } from "./DepositNoticeSection"
import cx from 'classnames';
import { depositButtonProps } from "./depositButtonProps";
import useBreakpoint from "../../../../../../pageTemplate/hooks/useBreakpoint";
import { tcx } from "apps/gambling/src/app/ui/utils/tcx";
import { IDepositPanelProps } from "../../../../components/deposit/DepositPanel";
import { ArrowRight } from "../../../../../../components-bs/Icons/ArrowRight";
import { BASE_TAB_HEIGHT } from "../../../../../../pageTemplate";

interface DepositToNextPageButtonProps {
  onClick: (e: any) => void;
  className?: string;
}

const DepositToNextPageButton = (props: DepositToNextPageButtonProps) => {
  return (
    <button
      className={cx(`w-[264px] h-[45px] rounded-full
      bg-gradient-to-b from-[#C8F568] to-[#16FF8F]
      text-[#047A70] flex justify-center items-center px-3.5 py-2 text-xl font-bold
      `, props.className)}
      onClick={props.onClick}
    >
      <span>Depósito</span>
      {/*<ArrowRight />*/}
    </button>
  )
};

export const DepositPanel = (props: IDepositPanelProps) => {
  const { isMobile } = useBreakpoint()
  const { isLoaded, onClickToNextDepositPage } = props;



  return (
    <div id={"text-white deposit-section"}>
      <DepositNoticeSection />
      <section className={"flex flex-col w-full"}>
        {isLoaded && (
          <DepositInput {...props.depositInputProps} />
        )}
        <div className={tcx("flex flex-1 flex-row flex-wrap basis-[100%] justify-start items-stretch mb-20")}>
          {props?.depositButtonsOptions?.map((options: any, index: number) => {
            const { rechargeValue, isShowRate, config, rate } = options;
            return (
              <div className={`basis-[30%] max-w-[33%] flex-1 overflow-hidden ${index % 3 === 1 ? 'mx-2' : ''}`}>
                <DepositMoneyButton
                  key={index}
                  onClick={() => {
                    props.handleClickDepositMoneyButton(rechargeValue, index, config)
                  }}
                  isActive={props.selectedIndex === index}
                  isShowRate={isShowRate}
                  {...depositButtonProps({ rechargeValue: rechargeValue, isMobile, rate })}
                />
              </div>
            )
          })}
          {
            // NOTE: 排版用，塞空的的區塊補齊空位
            Array.from({ length: (props?.depositButtonsOptions?.length - 1) % 3 }, (_, index) => {
              return (
                <div
                  key={index}
                  className={cx('basis-[30%] max-w-[33%] flex-1')}
                ></div>
              )
            })
          }
        </div>
        {isMobile ? (
          <section className={`bg-[rgba(0,0,0,.5)] fixed bottom-[${BASE_TAB_HEIGHT}px] left-0 right-0 flex flex-col justify-center items-center w-full py-4 z-10`}>
            <DepositToNextPageButton onClick={onClickToNextDepositPage} className={cx({ "opacity-50": !isLoaded })} />
          </section>
        ) : isLoaded ? (
          <section className={"flex flex-col justify-center items-center w-full"}>
            <DepositToNextPageButton onClick={onClickToNextDepositPage} />
          </section>
        ) : null}
      </section>
    </div>
  )
}
