import {BoxInfoStep} from "../../../../../../external/endpoint/activity/box/GetBoxInfoEndpoint";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import Slider, {Settings} from "react-slick";
import {useEffect, useRef, useState} from "react";
import {CacheImage} from "../../../../../components/image/CacheImage";
import {environment} from "../../../../../../../environments/environment";
import {CenterStepCard} from "./CenterStepCard";
import {formatLocaleMoney} from "../../../../../utils/format";


const findStepFirstStatusIndex = (steps: BoxInfoStep[], status:'UNCLAIMED' | 'CLAIMED' | 'LOCKED') => {
  for(let i=0; i< steps.length; i++) {
    if(steps[i].status === status) {
      return i
    }
  }
  return -1
}

interface StepsContainerProps {
  steps: BoxInfoStep[],
  onClickToClaim: (number: number) => Promise<void>
}

export const StepsContainer = ({
  steps,
  onClickToClaim
}: StepsContainerProps) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [centerIndex, setCenterIndex] = useState<number>(0)
  const sliderRef = useRef<Slider>(null);


  const firstUnClaimIndex = findStepFirstStatusIndex(steps, 'UNCLAIMED')
  const firstLockIndex = findStepFirstStatusIndex(steps, 'LOCKED')
  const initIndex = firstUnClaimIndex !== -1 ? firstUnClaimIndex : firstLockIndex !== -1 ? firstLockIndex : 0

  const { isMobile, isDesktop } = useBreakpoint()

  const slidesToShow = isMobile ? 3: 7

  const settings: Settings = {
    infinite: true,
    slidesToShow: slidesToShow,
    arrows: false,
    draggable: false,
    touchMove: false
  };

  useEffect(() => {
    sliderRef?.current?.slickGoTo((centerIndex || 0) < Math.floor(slidesToShow / 2) ? steps.length - Math.floor(slidesToShow / 2) + (centerIndex || 0) : (centerIndex || 0) - Math.floor(slidesToShow / 2), true)
  }, [centerIndex, sliderRef?.current]);

  useEffect(() => {
    setCenterIndex(initIndex)
  }, [initIndex]);

  return (
    <div
      className='relative
        py-[60px]
        tablet:py-[80px]
      '
    >
      {
        modalOpen && (
          <div
            className='fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center z-[1005] bg-[rgba(0,0,0,0.6)]'
            onClick={() => setModalOpen(false)}
          >
            <div
              className='relative rounded-[20px] p-8 text-center bg-linear-5-main
                w-[90%]
                mobile:w-[304px]
              '
              onClick={e => e.stopPropagation()}
            >
              <button
                className='linear-5-button absolute -right-2 -top-2 p-2 rounded-full'
                onClick={() => setModalOpen(false)}
              >
                <CacheImage
                  alt='close'
                  className='w-6'
                  src={`assets/${environment.uVersion}/icon_close.png`}
                />
              </button>
              <div className='font-bold text-base'>Parabéns por ganhar o</div>
              <div className='font-bold text-lg mt-5'>R${formatLocaleMoney(steps[centerIndex].rewardAmount)}</div>

              <button
                className='state-info-button w-full mt-8 py-3 font-extrabold rounded-full'
                onClick={() => {
                  setModalOpen(false)
                  onClickToClaim(steps[centerIndex].inviteNum)
                }}
              >
                Claro
              </button>
            </div>
          </div>
        )
      }
      <CenterStepCard step={steps[centerIndex]} onClickToClaim={() => setModalOpen(true)}/>
      <Slider
        ref={sliderRef}
        className={isDesktop ? 'activity-box-desktop' : 'activity-box-tablet'}
        {...settings}
      >
        {
          steps.map((step, index) => (
            <div
              key={index}
              onClick={() => setCenterIndex(index)}
              className='cursor-pointer rounded-xl bg-[var(--grayscale-30)] text-center shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]
                px-2 py-2
                tablet:px-4 tablet:py-4
              '
            >
              <div
                className='font-extrabold
                  text-xs
                  tablet:text-base
                '
              >
                {step.inviteNum} pessoas
              </div>
              <div
                className='font-bold text-[var(--grayscale-80)]
                  mt-[7px]
                  tablet:mt-1
                '
              >
                R$ {step.rewardAmount}
              </div>

              <CacheImage
                alt='box'
                className='w-full
                  mt-[7px]
                  tablet:mt-1
                '
                src={`assets/${environment.uVersion}/${environment.mVersion}/ic_box_${step.icon}_${step.status.toLowerCase()}.png`}
              />
            </div>
          ))
        }
      </Slider>
      <CacheImage
        alt='left'
        className='w-8 absolute top-1/2 -translate-y-1/2 cursor-pointer hover:brightness-[1.3] active:brightness-[0.7]
          -left-5
          tablet:-left-[40px]
        '
        src={`assets/${environment.uVersion}/${environment.mVersion}/icon_arrow_left.png`}
        onClick={() => {
          if (centerIndex === 0) {
            setCenterIndex(steps.length - 1)
          } else {
            setCenterIndex(prev => prev - 1)
          }
        }}
      />
      <CacheImage
        alt='right'
        className='w-8 absolute top-1/2 -translate-y-1/2 cursor-pointer hover:brightness-[1.3] active:brightness-[0.7]
          -right-5
          tablet:-right-[40px]
        '
        src={`assets/${environment.uVersion}/${environment.mVersion}/icon_arrow_right.png`}
        onClick={() => {
          if (centerIndex === (steps.length - 1)) {
            setCenterIndex(0)
          } else {
            setCenterIndex(prev => (prev || 0) + 1)
          }
        }}
      />
    </div>
  )
}