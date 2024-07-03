import {Container} from "./Container";
import {CloseICON} from "../../../../components-bs/Icons/CloseICON";
import {Description} from "./Description";
import {Item} from "./Item";
import {EarnButton} from "../../../../components-bs/Buttons/EarnButton";
import {InviteButton} from "../../../../components-bs/Buttons/InviteButton";
import React from "react";
import {useInviteConfig} from "../../../../hooks/useInviteConfig";
import cx from "classnames";


interface InviteBonusModalProps {
  close: () => void;
  onConfirm: () => void;
}

export const InviteBonusModal = (props: InviteBonusModalProps) => {
  const {currentConfig} = useInviteConfig();
  const currentConfigItems = currentConfig ? currentConfig?.items : []

  return <div
    className={"z-[1005] fixed left-0 top-0 right-0 bottom-0 flex flex-col flex justify-center items-center w-full h-full bg-[rgba(0,0,0,0.65)]"}
    onClick={(event) => {
      // props.close();
    }}
  >

    <Container
      className={
        // NOTE:
        cx(
          "w-[90vw] max-w-[336px] h-auto",
          "my-3"
        )
      }
      onClick={(event: any) => {
        event.stopPropagation();
      }}
    >
      <div className={"flex flex-row justify-end mb-2 absolute right-[10px] top-[10px]"}>
        <div
          onClick={() => {
            props.close();
          }}
        >
          <CloseICON/>
        </div>
      </div>

      {/*<img alt="title" className={"w-[269px] h-[16px]"} src={`assets/${environment.assetPrefix}/Convite de recompensa.png`}/>*/}
      {/*<img alt="title" className={"w-[269px]"} src={`assets/${environment.assetPrefix}/Convite de recompensa.png`}/>*/}
      <div className={"text-2xl font-extrabold text-[var(--text-popup)] mt-4 mb-2"}>Convite Recompensa</div>

      <div className={"mb-2"}>
        <Description/>
      </div>

      <div className={"w-full overflow-auto"}>
        {/*{currentData?.data.map(() => {*/}

        {/*})}*/}
        <div className={"flex flex-col w-full mb-2"}>
          {currentConfigItems?.map((item, index) => {
            if (currentConfigItems.length - 1 !== index) {
              // NOTICE: 型別遺失 這個沒有寫 number 沒有被檢測到要number, money={Number(item.reward)}
              return <Item key={index}
                           title={`Convidar ${item.num}-${Number(currentConfigItems[index + 1]?.num) - 1}`}
                           money={(Number(item.reward) / 100)}/>
            } else {
              return <Item key={index} title={`Convidar > ${item.num}`} money={Number(item.reward) / 100}/>
            }
          })}
        </div>


      </div>

      <div className={"flex flex-row justify-between items-center text-sm"}>
        <EarnButton className={"text-sm font-bold"} onClick={() => props.close()}>Ganhar Dinheiro</EarnButton>
        <InviteButton className={"text-sm font-bold"} onClick={() => props.onConfirm()}>Convide Agora</InviteButton>
      </div>

    </Container>
  </div>
}
