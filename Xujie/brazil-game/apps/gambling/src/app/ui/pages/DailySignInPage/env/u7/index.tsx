import { environment } from '../../../../../../environments/environment';
import { IDailySignInPageProps } from '../..';
import { PageContainer } from '../../../../components-bs/PageContainer';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { RewardCard } from './components/RewardCard';
import { VIPButtonList } from './components/VIPButtonList';
import { useDailySignInPage } from './hooks/useDailySignInPage';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import { BackNavigation } from '../../../../components-bs/BackNavigation/BackNavigation';
import cx from '../../../../utils/cx';
import { CacheImage } from '../../../../components/image/CacheImage';
import React, { useMemo } from 'react';
import { DragScrollContainer } from '../../../../components/DragScrollContainer';

// 'ALREADY_REDEEMED' // 已經兌換
// 'REDEEMABLE' // 可兌換
// 'NON_REDEEMABLE'  // 不可兌換]
export type RedemptionStates =
  | 'ALREADY_REDEEMED'
  | 'REDEEMABLE'
  | 'NON_REDEEMABLE';

const ViewLogsButton = () => {};
const DailySignInPage = (props: IDailySignInPageProps) => {
  const {
    currentVIP,
    signInAllConfig,
    todayIsSignIn,
    onClickToSignIn,
    signInTotalDays = -1,
    isFromActivity,
  } = props;
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const { onCLickToDailySignInRecord, onClickToIndex, onClickToActivity } =
    usePageNavigate();
  const slidesToShow = 7;
  const { dayConfigs, selectedVIP, setSelectedVIP, carditemsRef } =
    useDailySignInPage(
      currentVIP,
      signInAllConfig,
      slidesToShow,
      signInTotalDays
    );

  const isButtonDisable: boolean = useMemo(() => {
    const states = dayConfigs.map((item, index) => {
      let state: RedemptionStates;
      if (selectedVIP < currentVIP) {
        state = 'ALREADY_REDEEMED';
      } else if (selectedVIP === currentVIP) {
        if (item.days - 1 === signInTotalDays) {
          state = todayIsSignIn ? 'NON_REDEEMABLE' : 'REDEEMABLE';
        } else if (item.days - 1 < signInTotalDays) {
          state = 'ALREADY_REDEEMED';
        } else {
          state = 'NON_REDEEMABLE';
        }
      } else {
        state = 'NON_REDEEMABLE';
      }
      return state;
    });
    const isRedeemable = states.find((item) => item === 'REDEEMABLE');
    return isRedeemable === undefined;
  }, [dayConfigs]);

  return (
    <div
      style={{
        backgroundImage: isDesktop
          ? ''
          : `url("assets/${environment.uVersion}/bg_convidar.png")`,
        backgroundPosition: 'center bottom', // 将垂直位置设置为底部
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
      className={cx('')}
    >
      <PageContainer
        style={
          !isDesktop
            ? {
                paddingBottom: isMobile ? '500px' : '600px',
              }
            : {}
        }
        className={cx(
          'text-[var(--grayscale-100)]',
          'pt-0 mobile:pt-5 tablet:pt-0'
        )}
      >
        {!isTablet && (
          <BackNavigation
            onClick={() => {
              if (!isMobile) {
                isFromActivity ? onClickToActivity() : onClickToIndex();
              }
            }}
            title={
              isMobile && (
                <div className={'w-full flex justify-between items-center'}>
                  <div
                    onClick={() =>
                      isFromActivity ? onClickToActivity() : onClickToIndex()
                    }
                    className={'w-fit cursor-pointer'}
                  >
                    {'Retornar'}
                  </div>
                  <div className={'rounded-full'}>
                    <button
                      className={cx(
                        'linear-4-button border-popup-button rounded-full',
                        'px-5 py-2',
                        'text-sm font-bold text-[var(--grayscale-100)]'
                      )}
                      onClick={() => onCLickToDailySignInRecord()}
                    >
                      {'Visualizar registros'}
                    </button>
                  </div>
                </div>
              )
            }
          />
        )}

        <div
          className={cx(
            'mt-4 mobile:mt-0 tablet:mt-8',
            'rounded-xl text-[var(--grayscale-100)]',
            isDesktop ? 'border-stroke-popup-1' : ''
          )}
        >
          <div
            style={{
              backgroundImage: isDesktop
                ? `url("assets/${environment.uVersion}/bg_convidar.png")`
                : '',
              backgroundPosition: 'center bottom', // 将垂直位置设置为底部
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}
            className={cx('rounded-xl')}
          >
            <div
              className={cx(
                'rounded-xl',
                'flex flex-col',
                'gap-4 mobile:gap-8',
                'py-0 px-0 tablet:py-10 tablet:px-12'
              )}
            >
              {/* banner */}
              <div className={'w-full flex items-center'}>
                {isTablet && (
                  <BackNavigation
                    style={{
                      flexGrow: '1',
                      width: 'auto',
                      paddingRight: '0px',
                      paddingLeft: '0px',
                      marginLeft: '-32px',
                      marginRight: '32px',
                      background: 'transparent',
                      flex: '1 1 0%',
                    }}
                    onClick={() =>
                      isFromActivity ? onClickToActivity() : onClickToIndex()
                    }
                  />
                )}
                {isDesktop && <div className={'flex-1'}></div>}

                <CacheImage
                  alt={'convidar-title'}
                  src={`assets/${environment.uVersion}/img_convidar_title.png`}
                  className={cx('h-8 tablet:h-12 flex-1 object-contain')}
                />

                {!isMobile && (
                  <div className={'flex-1 flex justify-end'}>
                    <div className={'rounded-full'}>
                      <button
                        className={cx(
                          'linear-4-button border-popup-button rounded-full',
                          'px-5 py-2',
                          'text-sm font-bold text-[var(--grayscale-100)]'
                        )}
                        onClick={() => onCLickToDailySignInRecord()}
                      >
                        {'Visualizar registros'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                {/* level */}
                <VIPButtonList
                  selectedVIP={selectedVIP}
                  setSelectedVIP={setSelectedVIP}
                  currentVIP={currentVIP}
                />

                {/* 列表 */}
                <DragScrollContainer
                  className={cx(
                    'mt-4 mobile:mt-5',
                    '',
                    isMobile ? 'grid grid-cols-4' : 'flex overflow-x-scroll',
                    'gap-2 mobile:gap-3 tablet:gap-4'
                  )}
                >
                  {dayConfigs.map((item, index) => {
                    // 判別狀態 [已經領, 可領, 不可以領]
                    let state: RedemptionStates;
                    if (selectedVIP < currentVIP) {
                      state = 'ALREADY_REDEEMED';
                    } else if (selectedVIP === currentVIP) {
                      if (item.days - 1 === signInTotalDays) {
                        state = todayIsSignIn ? 'NON_REDEEMABLE' : 'REDEEMABLE';
                      } else if (item.days - 1 < signInTotalDays) {
                        state = 'ALREADY_REDEEMED';
                      } else {
                        state = 'NON_REDEEMABLE';
                      }
                    } else {
                      state = 'NON_REDEEMABLE';
                    }
                    // signInTotalDays
                    return (
                      <RewardCard
                        ref={(el: any) => {
                          carditemsRef.current[index] = el;
                        }}
                        state={state}
                        key={item.days}
                        day={item.days}
                        cashback={item.cashback}
                        onClickToSignIn={onClickToSignIn}
                      />
                    );
                  })}
                </DragScrollContainer>
              </div>

              {/* 提示 */}
              <div
                className={cx(
                  'rounded-xl',
                  !isDesktop ? 'border-stroke-popup' : ''
                )}
              >
                <div
                  className={cx(
                    'flex flex-col',
                    'font-medium text-[var(--transparent-white-80)] tablet:text-[var(--grayscale-100)] text-base',
                    'rounded-xl p-5 ',
                    !isDesktop ? 'bg-main' : ''
                  )}
                >
                  <p
                    className={cx(
                      'mb-3',
                      'text-base mobile:text-lg tablet:text-base',
                      'font-bold mobile:font-medium text-[var(--grayscale-100)]'
                    )}
                  >
                    Regras de recompensa diária VIP:
                  </p>
                  <p>
                    Cada nível só pode receber recompensas por{' '}
                    {dayConfigs.length} dias no total. As recompensas serão
                    creditadas na próxima vez que você as reivindicar.
                  </p>
                  <p>
                    Para garantir a justiça da plataforma, a plataforma adota
                    uma estratégia antitrapaça, os usuários trapaceiros serão
                    banidos e forneceremos atendimento ao cliente 24 horas para
                    resolver seus problemas.
                  </p>
                </div>
              </div>

              <button
                disabled={isButtonDisable}
                className={cx(
                  'text-lg font-bold text-[var(--grayscale-100)]',
                  'linear-1-button rounded-full',
                  'w-full mobile:w-auto m-auto',
                  'py-0 px-0 mobile:py-[12.5px] mobile:px-[121.5px] tablet:px-[201.5px]',
                  'tablet:h-12 mobile:h-10 h-10'
                )}
                onClick={() => onClickToSignIn()}
              >
                Check-in
              </button>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default DailySignInPage;
