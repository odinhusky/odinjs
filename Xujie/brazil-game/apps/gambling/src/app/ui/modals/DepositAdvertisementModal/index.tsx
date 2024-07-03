import React from "react";
import { DepositAdvertisementModal as PDepositAdvertisementModal} from './env/p1';
import { DepositAdvertisementModal as CocoDepositAdvertisementModal} from './env/u1';
import { DepositAdvertisementModal as RioDepositAdvertisementModal} from './env/u2';
import { DepositAdvertisementModal as U5DepositAdvertisementModal} from './env/u5';
import { DepositAdvertisementModal as U6DepositAdvertisementModal} from './env/u6';
import U7DepositAdvertisementModal from './env/u7';


import { renderByUVersion } from "../../utils/renderByUVersion";

export interface IDepositAdvertisementModalProps {
  close: () => void;
  onConfirm: () => void
}

export const DepositAdvertisementModal = (props: IDepositAdvertisementModalProps) => {

  const {
    close,
    onConfirm
  } = props;

  return (
    <div className={"z-[1005] fixed left-0 top-0 right-0 bottom-0 flex-col flex justify-center items-center w-full h-full bg-[rgba(0,0,0,0.65)]"} onClick={(event) => {
      // close();
    }}>
      {
        renderByUVersion({
          "p1": <PDepositAdvertisementModal onConfirm={onConfirm} close={close} />,
          "u1": <CocoDepositAdvertisementModal onConfirm={onConfirm} close={close} />,
          "u2": <RioDepositAdvertisementModal onConfirm={onConfirm} close={close} />,
          "u5": <U5DepositAdvertisementModal onConfirm={onConfirm} close={close} />,
          "u6": <U6DepositAdvertisementModal onConfirm={onConfirm} close={close} />,
          "u7": <U7DepositAdvertisementModal {...props} />
        }, <CocoDepositAdvertisementModal onConfirm={onConfirm} close={close} />)
      }
    </div>
  )
}
