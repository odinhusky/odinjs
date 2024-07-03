import React, { useMemo } from 'react';
import useBreakpoint from '../../../../../pageTemplate/hooks/useBreakpoint';
import {
  InfiniteTable,
  TInfiniteTableColumn,
} from '../../../../../components-bs/InfiniteTable';
import cx from '../../../../../utils/cx';
import { QuestionTipsIcon } from '../../../../../components-bs/Icons/QuestionTipsIcon';
import { Tooltip } from 'react-tooltip';

export type TDailyRecord = {
  key: string;
  bonus: string; // 獎勵 //dividendos
  dateTime: string; // 日期 day
  numRecharge: string;
  firstRecharge: string; // 邀請首充獎勵
  gameRecharge: string;
  gameRechargeReward: string; // 邀請玩家總流水
  totalReward: string; // 邀請玩家總流水獎金
};


const TableHeader = [
  'Dividends',
  'Data',
  'Usuário De Recarga',
  'Primeira Recarga Recompensas',
  'Valor da transação do jogo',
  'Recompensas De Troca De Jogos',
  'Recompensa Total',
];

const DailyTableCard = (
  props: TDailyRecord & { isProxy: boolean; type: string }
) => {
  const {
    isProxy,
    type,
    bonus,
    dateTime,
    numRecharge,
    firstRecharge,
    gameRecharge,
    gameRechargeReward,
    totalReward,
  } = props;

  return (
    <div className={'w-full border-stroke-popup-1 rounded-lg '}>
      <div
        className={cx(
          'bg-linear-4-main rounded-lg py-5 px-4',
          'grid grid-cols-2 items-center gap-y-4 gap-x-3',
          'items-start text-center text-sm text-[var(--grayscale-100)] font-medium'
        )}
      >
        <div className={'col-span-2'}>
          <p>{totalReward}</p>
          <p className="text-xs text-[var(--transparent-white-90)] font-normal">
            {TableHeader[6]}
          </p>
        </div>

        {type === '1' && (
          <div>
            <p>{numRecharge}</p>
            <p className="text-xs text-[var(--transparent-white-90)] font-normal">
              {TableHeader[2]}
            </p>
          </div>
        )}

        <div className={type === '1' ? '' : 'col-span-2'}>
          <p>{firstRecharge}</p>
          <p className="text-xs text-[var(--transparent-white-90)] font-normal">
            {TableHeader[3]}
          </p>
        </div>

        <div>
          <p>{gameRecharge}</p>
          <p className="text-xs text-[var(--transparent-white-90)] font-normal">
            {TableHeader[4]}
          </p>
        </div>

        <div>
          <div className={'flex justify-center'}>
            <p>{gameRechargeReward}</p>
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
                    boxShadow: 'inset 0px -4px 4px 0px rgba(0,0,0,0.25),inset 0px 4px 4px 0px rgba(255,255,255,0.25)',
                    borderRadius: '4px'
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
          <p className="text-xs text-[var(--transparent-white-90)] font-normal">
            {TableHeader[5]}
          </p>
        </div>
      </div>
    </div>
  );
};

export const DailyTable = (props: {
  records: any;
  isProxy: boolean;
  type: string;
}) => {
  const { isProxy, type } = props;
  const { isMobile } = useBreakpoint();
  const tableBorderStyle = 'border-r border-[var(--transparent-white-10)]';
  const tableTextStyle = 'text-[var(--grayscale-80)]';

  const columns2: TInfiniteTableColumn<TDailyRecord>[] = [
    {
      title: '',
      thClassName: ``,
      dataIndex: 'key',
      className: `w-full`,
      renderClassName: 'w-full',
      render: (record: any) => (
        <DailyTableCard {...record} isProxy={isProxy} type={type} />
      ),
    },
  ];

  const columns: TInfiniteTableColumn<TDailyRecord>[] = [
    ...((isProxy
      ? [
          {
            title: TableHeader[0],
            thClassName: `p-1 ${tableBorderStyle} ${tableTextStyle}`,
            dataIndex: 'bonus',
            className: `py-2 ${tableBorderStyle}`,
            render: (record: any) => `${record.bonus}`,
          },
        ]
      : []) as TInfiniteTableColumn<TDailyRecord>[]),
    ...((type === '1'
      ? [
          {
            title: TableHeader[1],
            thClassName: `p-1 ${tableBorderStyle} ${tableTextStyle}`,
            dataIndex: 'dateTime',
            className: `py-2 ${tableBorderStyle}`,
            render: (record: any) => `${record.dateTime}`,
          },
          {
            title: TableHeader[2],
            thClassName: `p-1 ${tableBorderStyle} ${tableTextStyle}`,
            dataIndex: 'numRecharge',
            className: `py-2 ${tableBorderStyle}`,
            render: (record: any) => `${record.numRecharge}`,
          },
        ]
      : []) as TInfiniteTableColumn<TDailyRecord>[]),
    {
      title: TableHeader[3],
      thClassName: `p-1 ${tableBorderStyle} ${tableTextStyle}`,
      dataIndex: 'firstRecharge',
      className: `py-2 ${tableBorderStyle}`,
      render: (record: any) => `${record.firstRecharge}`,
    },
    {
      title: TableHeader[4],
      thClassName: `p-1 ${tableBorderStyle} ${tableTextStyle}`,
      dataIndex: 'gameRecharge',
      className: `py-2 ${tableBorderStyle}`,
      render: (record: any) => `${record.gameRecharge}`,
    },
    {
      title: TableHeader[5],
      thClassName: `p-1 ${tableBorderStyle} ${tableTextStyle}`,
      dataIndex: 'gameRechargeReward',
      className: `py-2 ${tableBorderStyle}`,
      render: (record: any) => `${record.gameRechargeReward}`,
    },
    {
      title: TableHeader[6],
      thClassName: `py-2.5 px-1 ${tableTextStyle}`,
      dataIndex: 'totalReward',
      render: (record: any) => `${record.totalReward}`,
    },
  ];

  const transformData = (records: any): TDailyRecord[] => {
    return records.map((item: any, index: number) => {
      return {
        key: `${index}`,
        bonus: `R$ ${item.dividendos || '0,00'}`,
        dateTime: `${item.day || ''}`,
        numRecharge: `${item.numRecharge || 0}`,
        firstRecharge: `R$ ${item.firstRecharge || '0,00'}`,
        gameRecharge: `R$ ${item.gameRecharge || '0,00'} `,
        gameRechargeReward: `R$ ${item.gameRechargeReward || '0,00'}`,
        totalReward: `R$ ${item.totalReward || '0,00'}`,
      };
    });
  };

  const datasource = useMemo(() => {
    return transformData(props.records || []);
  }, [props.records]);

  return (
    <div
      className={cx(
        'flex flex-col',
        isMobile ? '' : 'rounded-lg border-stroke-popup h-[500px]'
      )}
    >
      <InfiniteTable<TDailyRecord>
        className={isMobile ? '' : 'bg-linear-4-main'}
        headerClassName={
          isMobile
            ? 'hidden'
            : 'text-[var(--grayscale-100)] font-medium text-pretty text-xs tablet:text-sm bg-[var(--transparent-black-10)]'
        }
        tbodyTrClassName={''}
        rowKey="key"
        datasource={datasource}
        columns={isMobile ? columns2 : columns}
        totalCount={datasource.length}
      />
    </div>
  );
};
