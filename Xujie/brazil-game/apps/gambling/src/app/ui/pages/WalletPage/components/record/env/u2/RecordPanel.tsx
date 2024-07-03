import { useEffect, useState } from 'react';
import useBreakpoint from '../../../../../../pageTemplate/hooks/useBreakpoint';
import { DepositMobileTable, WithdrawMobileTable } from './MobileTable';
import { RecordPanelDeposit } from './RecordPanelDeposit';
import { RecordPanelWithdraw } from './RecordPanelWithdraw';
import cx from "classnames";
import {RecordButton,RecordButton2} from "../../../../../../components-bs/Buttons/RecordButton";
import { renderByUVersion } from '../../../../../../utils/renderByUVersion';
import { RecordButton as CRecordButton } from '../../../../../../components-bs/Buttons/env/u1/RecordButton';
import { RecordButton as RioRecordButton } from '../../../../../../components-bs/Buttons/env/u2/RecordButton';

export const DepositStatusMap: { [key: number]: { title: string; color: string} } = {
  0: {
    title: 'Pendente', // Pending
    color: '#F59E0B'
  },
  1: {
    title: 'Concluido', // Completed
    color: '#10B981'
  },
  2: {
    title: 'Pendente', // Pending
    color: '#F59E0B'
  },
  3: {
    title: 'Falha', // Failed
    color: '#EF4444'
  },
  4: {
    title: 'Falha', // Failed
    color: '#EF4444'
  },
  5: {
    title: 'Congelada', //Frozen
    color: '#793BF6'
  },
};


export const WithdrawStatusMap: { [key: number]: { title: string; color: string} } = {
  0: {
    title: 'Pendente', // Pending
    color: '#F59E0B'
  },
  1: {
    title: 'Concluido', // Completed
    color: '#10B981'
  },
  2: {
    title: 'Pendente', // Pending
    color: '#F59E0B'
  },
  3: {
    title: 'Falha', // Failed
    color: '#EF4444'
  },
  4: {
    title: 'Falha', // Failed
    color: '#EF4444'
  },
  5: {
    title: 'Congelada', //Frozen
    color: '#793BF6'
  },
};


type IRecordPanel = {
  recordPanelMode: 'deposit' | 'withdraw';
}


const RecordTabButton = renderByUVersion({
  "wild777bet": RecordButton,
  "u1": CRecordButton,
  "u2": RioRecordButton
}, RecordButton)



export const RecordPanel = (props: IRecordPanel) => {
  const [selectedValueIndex, setSelectedValueIndex] = useState(0);

  const [recordPanelMode, setRecordPanelMode] = useState<
    'deposit' | 'withdraw'
  >('deposit');

  useEffect(() => {
    if(props.recordPanelMode) {
      setRecordPanelMode(props.recordPanelMode);
    }
  }, [props.recordPanelMode])

  const { isMobile } = useBreakpoint();

  return (
    <div id={'record-section'} className='text-white bg-[var(--grayscale-20)] rounded-lg p-5'>
      {/*{isMobile && <BlueBoard />}*/}

      {/* {isMobile && (
        <TotalSectionContainer/>
      )} */}

      <section className={cx('button-list flex flex-row mb-2 md:mb-4 md:justify-start font-medium')}>
        <div className="bg-[var(--grayscale-30)] flex flex-row rounded-[100px] sm:w-auto w-full justify-between">
          <RecordTabButton
            className={cx("mr-3 px-3.5 md:px-6 flex-none ",{'!text-lg':!isMobile, '!grow': isMobile})}
            active={recordPanelMode === 'deposit'}
            onClick={() => {
              setRecordPanelMode('deposit');
            }}
          >
            Depósito
          </RecordTabButton>
          <RecordTabButton
            className={cx("mr-3 px-3.5 md:px-6 flex-none ",{'!text-lg':!isMobile,'!grow': isMobile})}
            active={recordPanelMode === 'withdraw'}
            onClick={() => {
              setRecordPanelMode('withdraw');
            }}
          >
            Retirar
          </RecordTabButton>
        </div>
      </section>

      {isMobile && recordPanelMode === 'deposit' && (
        <DepositMobileTable />
      )}
      {isMobile && recordPanelMode === 'withdraw' && (
        <WithdrawMobileTable  />
      )}

      {/*<section className={"table"}>*/}
      {/*  <section className={"flex flex-row"}>*/}
      {/*    <div className={"text-white border-[1px] border-white"}>identificador </div>*/}
      {/*    <div className={"text-white border-[1px] border-white"}>Valor</div>*/}
      {/*    <div className={"text-white border-[1px] border-white"}>Bônus</div>*/}
      {/*    <div className={"text-white border-[1px] border-white"}>Método De Depósito</div>*/}
      {/*    <div className={"text-white border-[1px] border-white"}>Estado Do Depósito</div>*/}
      {/*    <div className={"text-white"}>Tempo</div>*/}
      {/*  </section>*/}

      {/*  <section>*/}
      {/*    {([{*/}
      {/*      "identificador": "BB2806ECC6E67271",*/}
      {/*      "Valor": "R$100.00",*/}
      {/*      "Bônus": "R$20.00",*/}
      {/*      "Método De Depósito": "pixpay",*/}
      {/*      "Estado Do Depósito": "Pending",*/}
      {/*      "Tempo": "09.10 13:38",*/}
      {/*    }] as any).map((item: any, index: number) => {*/}
      {/*      return (*/}
      {/*        <section className={"flex flex-row"}>*/}
      {/*          <div className={"text-white border-[1px] border-white"}>{item["identificador"]}</div>*/}
      {/*          <div className={"text-white border-[1px] border-white"}>{item["Valor"]}</div>*/}
      {/*          <div className={"text-white border-[1px] border-white"}>{item["Bônus"]}</div>*/}
      {/*          <div className={"text-white border-[1px] border-white"}>{item["Método De Depósito"]}</div>*/}
      {/*          <div className={"text-white border-[1px] border-white"}>{item["Estado Do Depósito"]}</div>*/}
      {/*          <div className={"text-white border-[1px] border-white"}>{item["Tempo"]}</div>*/}
      {/*          <div className={"text-white"}>Tempo</div>*/}
      {/*        </section>*/}
      {/*      );*/}
      {/*    })}*/}
      {/*  </section>*/}
      {/*</section>
       */}

      {/*<div className="overflow-x-auto mb-10">*/}
      {/*  <table className="table table-zebra w-full">*/}
      {/*    /!* head *!/*/}
      {/*    <thead>*/}
      {/*    <tr>*/}
      {/*      <th>identificador</th>*/}
      {/*      <th>Valor</th>*/}
      {/*      <th>Bônus</th>*/}
      {/*      <th>Método De Depósito</th>*/}
      {/*      <th>Estado Do Depósito</th>*/}
      {/*      <th>Tempo</th>*/}
      {/*    </tr>*/}
      {/*    </thead>*/}

      {/*    <tbody>*/}
      {/*    /!* noData 1 *!/*/}
      {/*    <tr>*/}
      {/*      <section>*/}
      {/*        <img alt={"no data"} src-={""}/>*/}
      {/*        <div>Nada aqui</div>*/}
      {/*      </section>*/}

      {/*    </tr>*/}
      {/*    </tbody>*/}
      {/*  </table>*/}
      {/*</div>*/}

      {isMobile ? null : recordPanelMode === 'deposit' ? (
        <RecordPanelDeposit />
      ) : (
        <RecordPanelWithdraw />
      )}
    </div>
  );
};
