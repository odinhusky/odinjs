import {IBoxPageProps} from "../../index";
import {PageContainer} from "../../../../../components-bs/PageContainer";
import {BackNavigation} from "../../../../../components-bs/BackNavigation/BackNavigation";
import {usePageNavigate} from "../../../../../router/hooks/usePageNavigate";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import {CacheImage} from "../../../../../components/image/CacheImage";
import {ActivityTextContainer} from "../../../ActivityTextContainer";
import {RecordModal} from "./RecordModal";
import React, {useEffect} from "react";
import useBoxPage from "../../hooks/useBoxPage";
import {formatLocaleMoney} from "../../../../../utils/format";
import {environment} from "../../../../../../../environments/environment";
import cx from "../../../../../utils/cx";
import {ActivityPageRouter} from "../../../index";

export const BoxPage = ({
  fontConfig,
  internalBannerRes,
  isFromActivity,
}: IBoxPageProps) => {
  const {
    isInvitationOpen,
    bannerContent,
    inviteLink,
    inviteNum,
    recharge,
    betFlow,
    steps,
    contentHtml,
    onClickToClaim,
    onClickToCopy,
    contextHolder,
    recordOpen,
    setRecordOpen
  } = useBoxPage();


  const { onClickToActivity, onClickToIndex} = usePageNavigate()
  const { isMobile, isDesktop } = useBreakpoint()

  useEffect(() => {
    if(recordOpen) {
      document.body.classList.add('overflow-hidden')
    }else {
      document.body.classList.remove('overflow-hidden')
    }

    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [recordOpen]);

  return (
    <PageContainer
      className='text-white pb-20'
    >
      {contextHolder}
      <BackNavigation
          onClick={() => isFromActivity ? onClickToActivity() : onClickToIndex()}
        title={isMobile?<div className={"w-full font-bold text-center text-lg md:text-3xl"}>Abrir o baú do tesouro</div>:undefined}
      />

      {/*Banner*/}
      <div
        className='relative mt-6 md:mt-10 lg:mt-6'
      >
        <CacheImage className='w-full' src={internalBannerRes} />
        <div
          className={cx(
            {'text-[3vw] px-[60px] w-1/2': isDesktop},
            {'text-[4vw] px-[32px] w-2/3': isMobile},
            'flex flex-wrap ',
            'absolute transform -translate-y-1/2 top-1/2',
            'justify-start'
          )}
        >
          {
            bannerContent.split(/\s+/).map((item) => (
              <ActivityTextContainer
                children={item}
                fontConfig={fontConfig}
              />
            ))
          }
        </div>
      </div>

      <div
        className='text-sm md:text-base lg:text-xl flex flex-col items-center'
      >
        <div
          className='w-full xl:w-4/5'
        >
          {
            isInvitationOpen && (
              <>
                <div
                  className='font-bold text-center mt-4'
                >
                  Recomende aos seus amigos e ganhe bônus! Estamos sinceramente esperando que mais jogadores se juntem a
                  nós!
                </div>

                {/*Copy Field*/}
                <div
                  className='px-3 py-3 md:px-8 md:py-5 mt-3 md:mt-4
                      bg-[var(--white-10)] rounded-2xl
                    '
                >
                  <div className='font-medium'>Copie o link para seus amigos!</div>
                  <div
                    className='rounded-lg flex overflow-hidden mt-2'
                  >
                    <div
                      className='px-3 py-2 md:px-6 md:py-3
                         w-full text-base bg-[var(--white)] text-[var(--black)] flex items-center'
                    >
                      {inviteLink}
                    </div>
                    <div
                      className='w-1/3 lg:w-1/5 px-5 py-3 text-center text-sm md:text-base flex items-center bg-gradient-to-b from-[var(--secondary-main-from)] to-[var(--secondary-main-to)] font-medium justify-center cursor-pointer'
                      onClick={onClickToCopy}
                    >
                      Convide Amigos
                    </div>
                  </div>
                </div>
              </>
            )
          }

          <div
            className={cx('mt-3 md:mt-4 font-medium text-center', !isInvitationOpen && 'mt-0 md:mt-0')}
          >
            Regras de liquidação da plataforma: O evento é atualizado a cada 10 a 30 minutos. Depois que as condições do
            convite
            forem atendidas, aguarde alguns minutos para reivindicar o bônus. Clique em "Reg de Coletas" para ver os
            detalhes do bônus.
          </div>
        </div>


        <div
          className='bg-[var(--white-10)] rounded-2xl mt-3 md:mt-4 flex flex-col items-center'
        >
          <div
            className='px-6 py-3 w-full xl:w-4/5 text-center font-bold text-base'
          >
            Nota: Para garantir a justiça, os usuários trapaceiros serão banidos permanentemente, os fundos obtidos
            ilegalmente serão congelados e as responsabilidades legais relevantes serão assumidas.
          </div>

          <div className='w-full h-[1px] bg-[var(--white)]'/>


          <div
            className='text-sm md:text-base w-full py-2 md:py-3 lg:py-4 flex flex-col md:flex-row md:justify-around xl:justify-center gap-3 xl:gap-20 items-center'
          >
            <div
              className='text-center'
            >
              <div>O subordinado acumulou recargas</div>
              <div className='text-sm md:text-base lg:text-xl font-bold'>R$ {formatLocaleMoney(recharge)} Ou o acima mencionado</div>
            </div>
            <div
              className='text-center'
            >
              <div>O subordinado acumulou apostas</div>
              <div className='text-sm md:text-base lg:text-xl font-bold'>R$ {formatLocaleMoney(betFlow)} Ou o acima mencionado</div>
            </div>
          </div>

        </div>


        {/*Button Field*/}
        <div
          className='flex flex-col lg:flex-row gap-3 md:gap-4 lg:gap-5 w-full mt-3 lg:mt-4'
        >
          <button
            className='w-full rounded-2xl text-base md:text-xl font-bold px-2 py-3 md:py-[18px] bg-gradient-to-b from-[var(--primary-main-from)] to-[var(--primary-main-to)]'
            onClick={()=>setRecordOpen(true)}
          >
            Pessoas de nível inferior eficazes <span className='text-[var(--secondary-assistant)]'>{inviteNum}</span> pessoas <span className='text-[var(--secondary-assistant)]'>Detalhes</span>
          </button>
          <button
            className='w-full rounded-2xl text-base md:text-xl font-bold px-2 py-3 md:py-[18px] bg-gradient-to-b from-[var(--primary-main-from)] to-[var(--primary-main-to)]'
            onClick={()=>onClickToActivity({category: ActivityPageRouter.RECORD})}
          >
            Reg de Coletas
          </button>
        </div>

      </div>

      <div
        className='mt-3 md:mt-4 rounded-2xl bg-[var(--white-10)]
          px-4 py-3
          md:px-5 md:py-5
          xl:px-[146px] xl:py-10
          grid grid-cols-4 gap-x-[14px] md:gap-x-6 xl:gap-x-12 gap-y-1
        '
      >
        {
          steps.map((item, index) => (
            <div
              key={index}
              className='w-full flex flex-col justify-center items-center'
            >
              <div
                className='relative'
              >
                <img
                  alt='box'
                  className='w-16 md:w-[140px] xl:w-[300px]'
                  src={`assets/${environment.uVersion}/${environment.mVersion}/ic_box_${item.icon}_${item.status.toLowerCase()}.png`}
                />
                {
                  !!((index + 1) % 4) && index !== steps.length -1 && (
                    <img
                      alt='arrow'
                      className='w-[14px] md:w-6 xl:w-12 absolute top-1/2 -translate-y-1/2 -right-[5vw] md:-right-[4vw] lg:-right-[6vw] xl:-right-[3.5vw]'
                      src={`assets/${environment.uVersion}/${environment.mVersion}/box_arrow_right.png`}
                    />
                  )
                }
                {
                  item.status === 'UNCLAIMED' && (
                    <button
                      className='text-[9px] md:text-[16px] font-medium absolute absolute left-1/2 -translate-x-1/2
                        bottom-[6px] md:bottom-[13px] xl:bottom-10 px-2 py-1 xl:px-[42px] xl:py-2
                        bg-gradient-to-b from-[var(--button-modal-download-from)] to-[var(--button-modal-download-to)] rounded-full
                        shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]
                      '
                      onClick={()=>onClickToClaim(item.inviteNum)}
                    >Receber</button>
                  )
                }
              </div>
              <div className='font-medium text-[10px] md:text-base w-full justify-center flex text-center break-all'>{item.inviteNum} pessoas</div>
              <div className='font-medium text-xs md:text-lg w-full justify-center flex text-center break-all'>R$ {formatLocaleMoney(item.rewardAmount)}</div>
            </div>
          ))
        }
      </div>

      <div
        className='mt-3 md:mt-4 rounded-2xl bg-[var(--white-10)]
          px-4 py-3 xl:px-[146px]
          text-sm md:text-base
        '
      >
        <p className='font-bold'>Instruções Do Evento:</p>
        <div dangerouslySetInnerHTML={{ __html: contentHtml}} />
      </div>

      {
        recordOpen && (
          <RecordModal onClose={()=>setRecordOpen(false)} />
        )
      }
    </PageContainer>
  )
}