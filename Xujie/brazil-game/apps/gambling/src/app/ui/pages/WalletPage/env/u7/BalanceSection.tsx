import { BalanceSectionType, IBalanceSectionProps } from "./types/walletTypes";
import { useState } from "react";
import WalletBtnGroup from "./components/WalletBtnGroup";
import WalletTotalSection from "./components/WalletTotalSection";
import cx from "../../../../utils/cx";
import { environment } from "apps/gambling/src/environments/environment";
import { AppCarousel } from "../../../IndexPage/Carousel";
import Carousel from "react-multi-carousel";
import { responsive } from "../../../IndexPage/Carousel/responsive";
import { formatLocaleMoney } from "../../../../utils/format";

const BalanceItem = ({ data, index }: { data: any; index: number }) => {
  return (
    <div className="flex flex-col gap-5 w-full items-center justify-center">
      <div
        className={cx(
          "h-16 text-2xl text-[var(--grayscale-100)] text-center font-bold",
          {
            "leading-[64px]": index === 0,
          }
        )}
      >
        <span>{data.title}</span>
        {data.title2 && (
          <>
            <br />
            <div className="relative flex">
              <div>{data.title2}</div>
              <div className="group flex w-8 h-8 justify-center items-center">
                <img
                  className="w-5 h-5 opacity-70 group-hover:opacity-100 group-focus:opacity-100"
                  src={`assets/${environment.uVersion}/icon_question.png`}
                  alt="question"
                />
                <div
                  className={cx(
                    "absolute text-xs mobile:w-[287px] w-[235px] font-medium text-[var(--grayscale-80)] bg-[var(--grayscale-25)]",
                    "mobile:left-[-10%] left-[-11%] top-8 rounded-lg p-2 shadow-[0px_4px_4px_#00000040] hidden group-hover:block group-focus:block",
                    {
                      "left-[-11%]": index === 1,
                      "left-[-22%]": index === 2,
                    }
                  )}
                >
                  {data.tagTXT}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="flex gap-3 text-sm w-full font-medium">
        <div className="w-full text-center">
          Balanço Total:
          <br />
          R$ {formatLocaleMoney(data.balance)}
        </div>
        <div className="w-full text-center">
          Retirável Total
          <br />
          R$ {formatLocaleMoney(data.Retiravel)}
        </div>
      </div>
    </div>
  );
};

export const BalanceSection = ({
  balanceSectionValue,
}: IBalanceSectionProps) => {
  const [tabState, setTabState] = useState<BalanceSectionType>("total");
  const [isMoving, setIsMoving] = useState(false);
  const balanceInfo = [
    {
      title: "Total Da Conta",
      title2: "",
      balance: balanceSectionValue ? (balanceSectionValue.total ? balanceSectionValue.total.balance : "0") : "0",
      Retiravel: balanceSectionValue ? (balanceSectionValue.total ? balanceSectionValue.total.retrievable : "0") : "0",
      isTag: false,
      tagTXT: "",
    },
    {
      title: "Depositar conta",
      title2: "(Atividade)",
      balance: balanceSectionValue ? (balanceSectionValue.deposit ? balanceSectionValue.deposit.balance : "0") : "0",
      Retiravel: balanceSectionValue ? (balanceSectionValue.deposit ? balanceSectionValue.deposit.retrievable : "0") : "0",
      isTag: true,
      tagTXT: `Uma conta que consiste no valor da recarga,
              recompensas pela participação em atividades, 
              vitórias e derrotas no jogo, etc.`,
    },
    {
      title: "Conta",
      title2: "Promovida",
      balance: balanceSectionValue ? (balanceSectionValue.promotion ? balanceSectionValue.promotion.balance : "0") : "0",
      Retiravel: balanceSectionValue ? (balanceSectionValue.promotion ? balanceSectionValue.promotion.retrievable : "0") : "0",
      isTag: true,
      tagTXT: `Uma conta composta por recompensas por convidar amigos e retorno de comissões com base no valor da transação dos usuários convidados. `,
    },
  ];

  return (
    <div className="mt-3 mobile:mt-4 tablet:mt-5">
      {/* <WalletBtnGroup
        tabState={tabState}
        handleSetTabState={(val: BalanceSectionType) => { setTabState(val) }}
      /> */}

      {/* <WalletTotalSection
        balanceSectionValue={balanceSectionValue}
        tabState={tabState}
      /> */}

      {/* 桌面 */}
      <div className="bg-amount-banner border-amount-button hidden tablet:flex gap-[10px] w-full p-8 rounded-lg before:rounded-lg before:border-2 justify-between">
        {balanceInfo.map((data, index) => {
          return <BalanceItem key={index} data={data} index={index} />;
        })}
      </div>
      {/* 移动端 */}
      <div className="bg-amount-banner border-amount-button tablet:hidden w-full rounded-lg before:rounded-lg before:border-2">
        <Carousel
          swipeable={true}
          draggable={true}
          showDots={true}
          arrows={true}
          responsive={responsive}
          autoPlay={false}
          autoPlaySpeed={0}
          infinite={true}
          customTransition={`transform ${0.3}s ease-in-out`}
          transitionDuration={0.3 * 1000}
          keyBoardControl={false}
          partialVisible={true}
          containerClass="pt-8 pb-9 w-[99%] mx-auto"
          dotListClass="u7-dot-list-style"
          itemClass={""}
          sliderClass="z-[1]"
          beforeChange={() => setIsMoving && setIsMoving(true)}
          afterChange={() => setIsMoving && setIsMoving(false)}
        >
          {balanceInfo.map((data, index) => {
            return <BalanceItem key={index} data={data} index={index} />;
          })}
        </Carousel>
      </div>
    </div>
  );
};

export default BalanceSection;
