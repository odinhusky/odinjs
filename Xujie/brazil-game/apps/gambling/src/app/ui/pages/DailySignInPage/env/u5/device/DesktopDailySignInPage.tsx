import {IDailySignInPageProps} from "../../../index";
import {PageContainer} from "../../../../../components-bs/PageContainer";
import Slider, {Settings} from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {useEffect, useRef, useState} from "react";
import {environment} from "../../../../../../../environments/environment";
import {VIPButtonList} from "../components/VIPButtonList";
import {RewardCard} from "../components/RewardCard";
import {useDailySignInPage} from "../hooks/useDailySignInPage";
import {usePageNavigate} from "../../../../../router/hooks/usePageNavigate";
import cx from "classnames";


export const DesktopDailySignInPage = ({
  currentVIP,
  signInAllConfig,
  todayIsSignIn,
  onClickToSignIn,
  signInTotalDays,
}: IDailySignInPageProps) => {
  const { onCLickToDailySignInRecord }= usePageNavigate()

  const slidesToShow = 7

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
      <div className='relative bg-[var(--grayscale-30)] rounded-[20px] flex justify-end'>
        <div className='absolute left-10 top-1/2 -translate-y-1/2 flex flex-col'>
          <div
            className='font-extrabold text-[2.5vw]'
            style={{
              textShadow: '-6px 6px 2px var(--grayscale-20)'
            }}
          >
            Colete recompensas todos os <br/>dias
          </div>
        </div>

        <img
          className='w-[700px]'
          alt='banner'
          src={`assets/${environment.uVersion}/${environment.mvVersion}/internal_banner_checkin.png`}
        />
      </div>


      <div
        className='p-4 rounded-lg bg-[var(--grayscale-20)] mt-5'
      >
        <div
          className='rounded-lg bg-[var(--grayscale-10)] py-3 px-5'
        >
          <div className='flex justify-center'>
            <img alt='warning' src={`assets/${environment.uVersion}/icon_warning.png`} className='w-7'/>
          </div>

          <div className='mt-5 text-center text-base text-[var(--state-warn-main)]'>
            Regras de recompensa diária VIP:Cada nível só pode receber recompensas por {dayConfigs.length} dias no total. As recompensas serão creditadas na próxima vez que você as reivindicar. Para garantir a justiça da plataforma, a plataforma adota uma estratégia antitrapaça, os usuários trapaceiros serão banidos e forneceremos atendimento ao cliente 24 horas para resolver seus problemas.
          </div>
        </div>

        <div
          className='mt-12 flex justify-end'
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
          className='mt-9 gap-3'
          selectedVIP={selectedVIP}
          setSelectedVIP={setSelectedVIP}
          currentVIP={currentVIP}
          buttonClassName='w-[120px] py-[6px] text-lg'
          onSelectedClassName='w-[120px] py-[10px] text-xl'
        />

        {
          dayConfigs.length > 6 && (
            <div
              className='relative mt-12 py-[50px]'
            >
              <Slider
                ref={sliderRef}
                className='daily-sign-in-desktop'
                {...settings}
              >
                {
                  dayConfigs.map((item, index) => (
                    <div
                      key={item.days}
                      onClick={()=> {
                        setCenterIndex(index)
                      }}
                    >
                      <RewardCard
                        day={item.days}
                        isLock={selectedVIP > currentVIP}
                        cashback={item.cashback}
                        todayIsSignIn={todayIsSignIn}
                        signInTotalDays={signInTotalDays}
                        classNames='py-3 px-3'
                        dayClassNames='font-extrabold text-base'
                        cashbackClassNames='font-bold text-sm'
                        boxClassNames='w-[68px]'
                        buttonClassNames='mt-3 py-1'
                        onClickToSignIn={onClickToSignIn}
                      />
                    </div>
                  ))
                }
              </Slider>

              <RewardCard
                day={dayConfigs?.find(item => item.days - 1 === centerIndex)?.days || 1}
                isLock={selectedVIP > currentVIP}
                cashback={dayConfigs?.find(item => item.days - 1 === centerIndex)?.cashback || 0}
                todayIsSignIn={todayIsSignIn}
                signInTotalDays={signInTotalDays}
                classNames='absolute w-[200px] py-5 px-4 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-[var(--grayscale-40)]'
                dayClassNames='font-extrabold text-2xl'
                cashbackClassNames='font-bold text-lg'
                boxClassNames='w-[100px]'
                buttonClassNames='mt-3 py-[10px] text-sm'
                onClickToSignIn={onClickToSignIn}
              />

              <img
                alt='left'
                className='w-8 absolute top-1/2 -translate-y-1/2 -left-[40px] cursor-pointer hover:brightness-[1.3] active:brightness-[0.7]'
                src={`assets/${environment.uVersion}/icon_arrow_left.png`}
                onClick={() => {
                  if(centerIndex === 0) {
                    setCenterIndex(dayConfigs.length - 1)
                  } else {
                    setCenterIndex(prev => (prev || 0) - 1)
                  }
                }}
              />

              <img
                alt='right'
                className='w-8 absolute top-1/2 -translate-y-1/2 -right-[40px] cursor-pointer hover:brightness-[1.3] active:brightness-[0.7]'
                src={`assets/${environment.uVersion}/icon_arrow_right.png`}
                onClick={() => {
                  if(centerIndex === (dayConfigs.length - 1)) {
                    setCenterIndex(0)
                  } else {
                    setCenterIndex(prev => (prev || 0) + 1)
                  }
                }}
              />
            </div>
          )
        }

        {
          dayConfigs.length < 7 && (
            <div
              className='mt-12 flex gap-5 overflow-x-scroll'
            >
              {
                dayConfigs.map((item) => (
                  <RewardCard
                    key={item.days}
                    day={item.days}
                    isLock={selectedVIP > currentVIP}
                    cashback={item.cashback}
                    todayIsSignIn={todayIsSignIn}
                    signInTotalDays={signInTotalDays}
                    classNames='py-3 px-3 w-[140px] flex-shrink-0'
                    dayClassNames='font-extrabold text-base'
                    cashbackClassNames='font-bold text-sm'
                    boxClassNames='w-[68px]'
                    buttonClassNames='mt-3 py-1'
                    onClickToSignIn={onClickToSignIn}
                  />
                ))
              }
            </div>
          )
        }
      </div>

    </PageContainer>
  )
}