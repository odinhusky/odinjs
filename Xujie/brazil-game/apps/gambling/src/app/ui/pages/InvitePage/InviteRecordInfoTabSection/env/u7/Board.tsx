import { IBoardData } from '../..';
import { IBoardContainer } from '../../components/DesktopBoard';
import cx from '../../../../../utils/cx';
import useBreakpoint from '../../../../../pageTemplate/hooks/useBreakpoint';

export const Board = (
  props: {
    onClick?: () => void;
  } & IBoardData
) => {
  const { isMobile } = useBreakpoint();
  const BoardContainer = (props: IBoardContainer) => {
    return (
      <div
        className={cx(
          'flex flex-col gap-0 mobile:gap-1 w-full text-[var(--grayscale-100)] bg-[var(--grayscale-60)]',
          'tablet:py-5 tablet:px-4 mobile:py-4 mobile:px-2 py-1 px-4 ',
          'rounded-xl justify-center items-center',
          props.className
        )}
      >
        {props.children}
      </div>
    );
  };

  const rewardDatas = [
    {
      balance: `R$ ${props.data.totalReward || '0,00'}`,
      title: 'Prêmio total',
      bgColor: 'bg-level-1',
      className: 'w-1/2',
    },
    {
      balance: `R$ ${props.data.paidReward || '0,00'}${isMobile ? '  >' : ''}`,
      title: 'Bônus já liquidados',
      bgColor: 'bg-level-2',
      className: 'w-1/2',
    },
    {
      balance: `R$ ${props.data.waitForCalReward || '0,00'}`,
      title: 'Bônus aguardando liquidação * (Atualizar a cada 24 horas)',
      bgColor: 'bg-level-3',
      className: 'w-full',
    },
  ];
  return isMobile ? (
    <div
      onClick={() => props.onClick && props.onClick()}
      className={
        'w-full flex flex-wrap bg-level-2 justify-between items-center p-3 rounded-xl gap-y-4'
      }
    >
      {rewardDatas.map((data, index) => {
        return (
          <div className={cx('text-center', data.className)}>
            <div className={cx('text-base mobile:text-2xl font-bold')}>
              {data.balance}
            </div>
            <div className="text-[var(--transparent-white-90)] text-xs font-medium h-auto mt-0.5">
              {data.title.split('*')[0]}
              <br />
              {data.title.split('*')[1]}
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="w-full flex flex-row tablet:gap-5 gap-3 justify-between">
      {rewardDatas.map((data, index) => {
        return (
          <BoardContainer
            className={cx('py-4 px-2 tablet:py-3 tablet:px-5', data.bgColor)}
          >
            <div className={cx('text-base mobile:text-2xl font-bold')}>
              {data.balance}
            </div>
            <div className="text-[var(--transparent-white-90)] text-base font-medium text-center h-auto">
              {data.title.split('*')[0]}
              <br />
              {data.title.split('*')[1]}
            </div>
          </BoardContainer>
        );
      })}
    </div>
  );
};
