import { ITotal } from '../..';
import {
  InfiniteTable,
  TInfiniteTableColumn,
} from '../../../../../components-bs/InfiniteTable';
import React, { useMemo } from 'react';
import { QuestionTipsIcon } from '../../../../../components-bs/Icons/QuestionTipsIcon';
import useBreakpoint from '../../../../../pageTemplate/hooks/useBreakpoint';
import cx from '../../../../../utils/cx';
import { Tooltip } from 'react-tooltip';

export type ITotalRecord = {
  totalReward: string; // 總邀請獎勵
  numRecharge: string; // 邀請玩家總數
  firstRecharge: string; // 邀請首充獎勵
  gamerTotalRecharge: string; // 邀請玩家總流水
  gamerTotalReward: string; // 邀請玩家總流水獎金
};

const TotalTableCard = (props: ITotalRecord & { type: string }) => {
  const {
    type,
    totalReward,
    numRecharge,
    firstRecharge,
    gamerTotalRecharge,
    gamerTotalReward,
  } = props;

  return (
    <div className={'border-stroke-popup-1 rounded-lg '}>
      <div
        className={cx(
          'bg-linear-4-main rounded-lg py-5 px-4',
          'grid grid-cols-2 items-center gap-y-4 gap-x-3',
          'items-start text-center text-sm text-[var(--grayscale-100)] font-medium'
        )}
      >
        <div className={'col-span-2'}>
          <p>{totalReward}</p>
          <p
            className={'text-xs text-[var(--transparent-white-90)] font-normal'}
          >
            {TableHeader[4]}
          </p>
        </div>

        {type === '1' && (
          <div>
            <p>{numRecharge}</p>
            <p
              className={
                'text-xs text-[var(--transparent-white-90)] font-normal'
              }
            >
              {TableHeader[0]}
            </p>
          </div>
        )}

        {type === '1' && (
          <div>
            <p>{firstRecharge}</p>
            <p
              className={
                'text-xs text-[var(--transparent-white-90)] font-normal'
              }
            >
              {TableHeader[1]}
            </p>
          </div>
        )}

        <div className={''}>
          <p>{gamerTotalRecharge}</p>
          <p
            className={'text-xs text-[var(--transparent-white-90)] font-normal'}
          >
            {TableHeader[2]}
          </p>
        </div>

        <div>
          <div className={'flex justify-center'}>
            <p>{gamerTotalReward}</p>
            <div className={'ml-1 -mt-1'}>
              <a data-tooltip-id={'gamer-total-tooltip'}>
                <QuestionTipsIcon
                  className={'text-sm text-[var(--state-warn-main)]'}
                />
                <Tooltip
                  arrowColor="var(--background-tooltips)"
                  style={{
                    width: '254px',
                    whiteSpace: 'pre-wrap',
                    fontSize: '12px',
                    fontWeight: '500',
                    textAlign: 'start',
                    lineHeight: 'normal',
                    color: 'var(--text-tooltips)',
                    background: 'var(--background-tooltips)',
                    boxShadow:
                      'inset 0px -4px 4px 0px rgba(0,0,0,0.25),inset 0px 4px 4px 0px rgba(255,255,255,0.25)',
                    borderRadius: '4px',
                  }}
                  opacity={1}
                  id={'gamer-total-tooltip'}
                  place={'top'}
                  offset={0}
                  content={'As recompensas são liquidadas toda segunda-feira'}
                  afterHide={() => {}}
                />
              </a>
            </div>
          </div>
          <p
            className={'text-xs text-[var(--transparent-white-90)] font-normal'}
          >
            {TableHeader[3]}
          </p>
        </div>
      </div>
    </div>
  );
};

const TableHeader = [
  'Usuário De Recarga',
  'Primeira Recarga Recompensas',
  'Valor Da Transação Do Jogo',
  'Recompensas De Troca De Jogos',
  'Recompensa Total',
];

export const TotalTable = (props: ITotal & { type: string }) => {
  const { type } = props;
  const { isMobile } = useBreakpoint();
  const transformData = (total: ITotal): ITotalRecord => {
    const data = total.data;
    return {
      totalReward: `R$ ${data.totalReward || '0,00'}`,
      numRecharge: `${data.numRecharge || 0}`,
      firstRecharge: `R$ ${data.firstRecharge || '0,00'}`,
      gamerTotalRecharge: `R$ ${data.gameRecharge || '0,00'}`,
      gamerTotalReward: `R$ ${data.gameRechargeReward || '0,00'}`,
    };
  };

  const tableBorderStyle = 'border-r border-[var(--transparent-white-10)]';
  const datasource = useMemo(() => {
    return [transformData(props)];
  }, [props.data]);

  const columns: TInfiniteTableColumn<ITotalRecord>[] = [
    ...((type === '1'
      ? [
          {
            title: TableHeader[0],
            thClassName: `p-1 ${tableBorderStyle}`,
            dataIndex: 'numRecharge',
            className: `py-2 ${tableBorderStyle}`,
            render: (record: any) => <div>{record.numRecharge}</div>,
          },
          {
            title: TableHeader[1],
            thClassName: `p-1 ${tableBorderStyle}`,
            dataIndex: 'firstRecharge',
            className: `py-2 ${tableBorderStyle}`,
            render: (record: any) => <div>{record.firstRecharge}</div>,
          },
        ]
      : []) as TInfiniteTableColumn<ITotalRecord>[]),
    {
      title: TableHeader[2],
      thClassName: `p-1 ${tableBorderStyle}`,
      dataIndex: 'gamerTotalRecharge',
      className: `py-2 ${tableBorderStyle}`,
      render: (record: any) => <div>{record.gamerTotalRecharge}</div>,
    },
    {
      title: TableHeader[3],
      thClassName: `p-1 ${tableBorderStyle}`,
      dataIndex: 'gamerTotalReward',
      className: `py-2 ${tableBorderStyle}`,
      renderTitle: () => (
        <div className={'flex justify-center'}>
          <p>Recompensas De Troca De Jogos</p>
          <div className={'ml-1 -mt-1'}>
            <a data-tooltip-id={'gamer-total-tooltip'}>
            <QuestionTipsIcon
               className={
                  'text-base text-[var(--grayscale-100)] mb-1 opacity-70 hover:opacity-100'
                }
               />
              <Tooltip
                arrowColor="var(--background-tooltips)"
                style={{
                  width: '254px',
                  whiteSpace: 'pre-wrap',
                  fontSize: '12px',
                  fontWeight: '500',
                  textAlign: 'start',
                  lineHeight: 'normal',
                  color: 'var(--text-tooltips)',
                  background: 'var(--background-tooltips)',
                  boxShadow: 'inset 0px -4px 4px 0px rgba(0,0,0,0.25),inset 0px 4px 4px 0px rgba(255,255,255,0.25)',
                  borderRadius: '4px'
                }}
                opacity={1}
                id={'gamer-total-tooltip'}
                place={'top'}
                offset={0}
                content={'As recompensas de troca de Jogos são liquidadas toda segunda-feira'}
              />
            </a>
          </div>
        </div>
      ),
      render: (record: any) => <div>{record.gamerTotalReward}</div>,
    },
    {
      title: TableHeader[4],
      thClassName: 'p-1',
      dataIndex: 'totalReward',
      className: 'py-2',
      render: (record: any) => <div>{record.totalReward}</div>,
    },
  ];

  return isMobile ? (
    <TotalTableCard {...datasource[0]} type={type} />
  ) : (
    <div className="flex flex-col rounded-lg ">
      <InfiniteTable<ITotalRecord>
        className={'bg-linear-4-main'}
        headerClassName={
          'text-[var(--grayscale-100)] font-medium text-pretty text-xs tablet:text-sm bg-[var(--transparent-black-10)]'
        }
        tbodyTrClassName={'bg-[var(--transparent-white-5)]'}
        rowKey="numRecharge"
        datasource={datasource}
        columns={columns}
        totalCount={datasource.length}
      />
    </div>
  );
};
