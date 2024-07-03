import { Board } from './Board';
import { useNavigate } from 'react-router';
import { DailyTable } from './DailyTable';
import { TotalTable } from './TotalTable';
import { TabItem } from './compontents/TabItem';
import { BackNavigation } from '../../../../../components-bs/BackNavigation/BackNavigation';
import { PageOrModalPathEnum } from 'apps/gambling/src/app/ui/PageOrModalPathEnum';
import React, { useEffect } from 'react';
import useBreakpoint from 'apps/gambling/src/app/ui/pageTemplate/hooks/useBreakpoint';
import { Level1RechargeData } from '../../../index';
import { PageContainer } from '../../../../../components-bs/PageContainer';
import cx from '../../../../../utils/cx';
import styled from 'styled-components';
import { environment } from 'apps/gambling/src/environments/environment';

export const Panel = ({
  level1RechargeData,
  isProxy,
  totalRewardData,
  totalInviteData,
  totalPanelMode,
  setTotalPanelMode,
  dailyData,
  dailyPanelMode,
  setDailyPanelMode,
  onBack,
  setPanelMode,
}: {
  level1RechargeData: Level1RechargeData;
  isProxy: boolean;
  totalRewardData: any;
  totalInviteData: any;
  totalPanelMode: any;
  setTotalPanelMode: (value: '1' | '2' | '3') => void;
  dailyData: any;
  dailyPanelMode: any;
  setDailyPanelMode: (value: '1' | '2' | '3') => void;
  onBack: () => void;
  setPanelMode: any;
}) => {
  const { isMobile, isTablet } = useBreakpoint();
  const navigate = useNavigate();
  useEffect(() => {
    const pageContainer = document.getElementById('page-container');
    if (pageContainer) {
      pageContainer.scrollTop = 0;
    }
  }, []);

  return (
    <>
      <PageContainer
        className={cx('mx-auto relative')}
        style={
          isMobile
            ? {
                backgroundImage: `url('assets/${environment.uVersion}/bg_invite_panel.png')`,
                backgroundPosition: 'center bottom',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 100%',
                minHeight:'calc(100vh - 64px)'
              }
            : { }
        }
      >
        {!isMobile &&
          <BackNavigation className={'h-12 mobile:h-16'} onClick={onBack} />
        }

        <div
          className={cx(
            'flex justify-between mobile:justify-center',
            'h-12 mobile:h-16 mt-0 mobile:-mt-16',
            'font-bold text-sm mobile:text-base text-[var(--grayscale-80)]'
          )}
        >
          <button
            className={cx(
              'w-full mobile:w-auto px-4 mobile:px-10',
              'hover:text-[var(--grayscale-100)]',
              'border-b-2 border-transparent'
            )}
            onClick={() => setPanelMode('howto')}
          >
            {'Como convidar'}
          </button>

          <button
            className={cx(
              'w-full mobile:w-auto px-4 mobile:px-10',
              'text-linear cursor-default',
              'border-b-2 border-[var(--grayscale-80)]'
            )}
          >
            {'Dados diários'}
          </button>
        </div>

        <div
          className={cx(
            'w-full flex flex-col',
            'mt-3 mobile:mt-8 space-y-5 mobile:space-y-8',
            'items-center rounded-[20px]',
            'text-[var(--grayscale-100)]'
          )}
        >
          <div className={'w-full flex flex-col space-y-5'}>
            <button
              className={cx(
                'hidden mobile:block',
                'py-2 px-8',
                'linear-4-button border-popup-button rounded-full',
                'linear-1-button self-end tablet:font-medium font-bold rounded-full'
              )}
              onClick={() =>
                navigate(PageOrModalPathEnum.InviteSettlementRecordPage)
              }
            >
              {'Registro'}
            </button>
            <Board
              onClick={() =>
                navigate(PageOrModalPathEnum.InviteSettlementRecordPage)
              }
              data={totalRewardData}
            />
          </div>

          {/* Total Record */}
          <div className={'w-full flex flex-col space-y-3 mobile:space-y-5'}>
            {/* title */}

            <div
              className={cx(
                'text-xl font-bold text-start mobile:text-center mobile:text-left'
              )}
            >
              <span className={isMobile ? 'text-sm text-linear' : ''}>
                {'Dados totais'}
              </span>
            </div>

            <div
              className={
                'flex mobile:flex-row flex-col gap-3 mobile:mt-0 mt-1 justify-between items-center'
              }
            >
              <div
                id={'tab-item'}
                className={
                  'max-mobile:w-full flex w-auto justify-start items-start self-start'
                }
              >
                <div className={'flex w-full rounded-lg gap-x-2'}>
                  {(['1', '2', '3'] as const).map((key) => (
                    <TabItem
                      className={'rounded-full'}
                      key={key}
                      active={totalPanelMode === key}
                      onClick={() => setTotalPanelMode(key)}
                      name={`Nível ${key}`}
                    />
                  ))}
                </div>
              </div>
              <div
                className={cx(
                  'flex flex-col justify-between items-center mobile:items-end self-center mobile:self-end'
                )}
              >
                {totalPanelMode === '1' &&
                  level1RechargeData.isShowDividends && (
                    <div className="text-base text-right font-bold ">
                      {level1RechargeData.dividendsText}
                    </div>
                  )}
                {totalPanelMode === '1' &&
                  level1RechargeData.isAvgAmountShow && (
                    <div className="text-base text-right font-bold ">
                      {level1RechargeData.avgAmountText}
                    </div>
                  )}
                <div
                  className={
                    'text-sm text-[var(--grayscale-80)] text-right font-bold'
                  }
                >
                  {'Atualize a cada 30 minutos'}
                </div>
              </div>
            </div>
            <div className="mobile:mt-0 mt-3">
              <TotalTable
                isProxy={isProxy}
                type={totalPanelMode}
                data={totalInviteData}
              />
            </div>
          </div>

          {/* Daily Record */}
          <div className="w-full flex flex-col space-y-3 mobile:space-y-5">
            {/* title */}
            <div
              className={cx(
                'text-xl font-bold text-start mobile:text-center mobile:text-left'
              )}
            >
              <span className={isMobile ? 'text-sm text-linear' : ''}>
                {'Dados diários'}
              </span>
            </div>

            <div className="flex mobile:flex-row flex-col gap-3 mobile:mt-0 mt-1 justify-between items-center">
              <div
                id={'tab-item'}
                className={
                  'max-mobile:w-full flex w-auto justify-start items-start self-start'
                }
              >
                <div className={'flex w-full rounded-lg gap-x-2'}>
                  {(['1', '2', '3'] as const).map((key) => (
                    <TabItem
                      className={'rounded-full'}
                      key={key}
                      active={dailyPanelMode === key}
                      onClick={() => setDailyPanelMode(key)}
                      name={`Nível ${key}`}
                    />
                  ))}
                </div>
              </div>

              <div
                className={cx(
                  'flex flex-col justify-between items-center mobile:items-end self-center mobile:self-end'
                )}
              >
                {isMobile && dailyPanelMode === '1' && isProxy && (
                  <div className="text-base text-right font-bold ">
                    Dividends:R${' '}
                    {dailyData !== undefined
                      ? dailyData[0]?.dividendos
                      : '0.00'}
                  </div>
                )}
                <div className="text-sm text-[var(--grayscale-80)] text-right font-bold">
                  {'Atualize a cada 30 minutos'}
                </div>
              </div>
            </div>
            <DailyTable
              isProxy={isProxy}
              type={dailyPanelMode}
              records={dailyData}
            />
          </div>
        </div>
      </PageContainer>
    </>
  );
};
