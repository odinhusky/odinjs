import {IDailySignInPageProps} from "../../../index";
import {PageContainer} from "../../../../../components-bs/PageContainer";
import {BackNavigation} from "../../../../../components-bs/BackNavigation/BackNavigation";
import {usePageNavigate} from "../../../../../router/hooks/usePageNavigate";
import {environment} from "../../../../../../../environments/environment";
import {useDailySignInPage} from "../hooks/useDailySignInPage";
import {VIPButtonList} from "../components/VIPButtonList";
import Slider, {Settings} from "react-slick";
import {RewardCard} from "../components/RewardCard";
import {twMerge} from "tailwind-merge";
import cx from "classnames";


export const MobileDailySignInPage = ({
  currentVIP,
  signInAllConfig,
  todayIsSignIn,
  onClickToSignIn,
  signInTotalDays
}: IDailySignInPageProps) => {
  const { onCLickToDailySignInRecord } = usePageNavigate()

  const slidesToShow = 3

  const {
    sliderRef,
    centerIndex,
    dayConfigs,
    setCenterIndex,
    selectedVIP,
    setSelectedVIP
  } = useDailySignInPage(currentVIP, signInAllConfig, slidesToShow, signInTotalDays)

  const settings: Settings = {
    infinite: true,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    speed: 500,
    arrows: false,
    draggable: false,
    touchMove: false
  };

  return (
    <PageContainer
      className='text-white'
    >
      <div className='relative bg-[var(--grayscale-30)] rounded-[8px] flex justify-end'>
        <div className='absolute left-3 top-1/2 -translate-y-1/2 flex flex-col'>
          <div
            className='font-extrabold text-base'
            style={{
              textShadow: '-6px 6px 2px var(--grayscale-20)'
            }}
          >
            Colete recompensas todos os <br/>dias
          </div>
        </div>

        <img
          className='w-[240px]'
          alt='banner'
          src={`assets/${environment.uVersion}/${environment.mvVersion}/internal_banner_checkin_m.png`}
        />
      </div>

      <div
        className='p-4 rounded-lg bg-[var(--grayscale-20)] mt-3'
      >
        <div
          className='rounded-lg bg-[var(--grayscale-10)] py-3 px-5'
        >
          <div className='flex justify-center'>
            <img alt='warning' src={`assets/${environment.uVersion}/icon_warning.png`} className='w-7'/>
          </div>

          <div className='mt-5 text-center text-sm text-[var(--state-warn-main)]'>
            Regras de recompensa diária VIP:Cada nível só pode receber recompensas por {dayConfigs.length} dias no
            total. As recompensas serão creditadas na próxima vez que você as reivindicar. Para garantir a justiça da
            plataforma, a plataforma adota uma estratégia antitrapaça, os usuários trapaceiros serão banidos e
            forneceremos atendimento ao cliente 24 horas para resolver seus problemas.
          </div>
        </div>

        <div
          className='mt-5 flex justify-end'
        >
          <button
            className={cx(
                'linear-5-button',
                'py-[10px] px-7 font-extrabold text-sm rounded-full',
            )}

          onClick={onCLickToDailySignInRecord}
          >
            <div className={'drop-shadow-lg'}>{'Registros'}</div>
          </button>
        </div>

        <VIPButtonList
          className='mt-6 gap-2'
          selectedVIP={selectedVIP}
          setSelectedVIP={setSelectedVIP}
          currentVIP={currentVIP}
          buttonClassName='w-[72px] py-[10px] text-sm'
          onSelectedClassName='w-[96px] py-[12px] text-base'
        />

        {
          dayConfigs.length > 4 && (
            <div
              className='relative mt-5'
            >
              <Slider
                ref={sliderRef}
                className='daily-sign-in-tablet'
                {...settings}
              >
                {
                  dayConfigs.map((item, index) => (
                    <div
                      key={item.days}
                      onClick={() => {
                        setCenterIndex(index)
                      }}
                    >
                      <RewardCard
                        day={item.days}
                        isLock={selectedVIP > currentVIP}
                        cashback={item.cashback}
                        todayIsSignIn={todayIsSignIn}
                        signInTotalDays={signInTotalDays}
                        classNames={twMerge(
                          'py-2 px-2',
                          centerIndex === index && 'bg-[var(--grayscale-40)]'
                        )}
                        dayClassNames='font-extrabold text-xs'
                        cashbackClassNames='font-bold text-xs'
                        boxClassNames='w-[52px]'
                        buttonClassNames='mt-2 py-1 text-xs'
                        onClickToSignIn={onClickToSignIn}
                      />
                    </div>
                  ))
                }
              </Slider>

              <img
                alt='left'
                className='w-8 absolute top-1/2 -translate-y-1/2 -left-[16px] cursor-pointer hover:brightness-[1.3] active:brightness-[0.7]'
                src={`assets/${environment.uVersion}/icon_arrow_left.png`}
                onClick={() => {
                  if (centerIndex === 0) {
                    setCenterIndex(dayConfigs.length - 1)
                  } else {
                    setCenterIndex(prev => (prev || 0) - 1)
                  }
                }}
              />

              <img
                alt='right'
                className='w-8 absolute top-1/2 -translate-y-1/2 -right-[16px] cursor-pointer hover:brightness-[1.3] active:brightness-[0.7]'
                src={`assets/${environment.uVersion}/icon_arrow_right.png`}
                onClick={() => {
                  if (centerIndex === (dayConfigs.length - 1)) {
                    setCenterIndex(0)
                  } else {
                    setCenterIndex(prev => (prev || 0) + 1)
                  }
                }}
              />
            </div>
          )
        }

      </div>
    </PageContainer>
  )
}