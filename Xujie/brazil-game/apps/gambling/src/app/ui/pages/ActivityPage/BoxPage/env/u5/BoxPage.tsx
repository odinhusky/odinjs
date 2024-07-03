import {PageContainer} from "../../../../../components-bs/PageContainer";
import {IBoxPageProps} from "../../index";
import {CacheImage} from "../../../../../components/image/CacheImage";
import {ActivityTextContainer} from "../../../ActivityTextContainer";
import useBoxPage from "../../hooks/useBoxPage";
import {formatLocaleMoney} from "../../../../../utils/format";
import {usePageNavigate} from "../../../../../router/hooks/usePageNavigate";
import cx from "../../../../../utils/cx";
import {StepsContainer} from "./StepsContainer";
import React, {useEffect, useState} from "react";
import {RecordPage} from "./RecordPage";
import {ActivityPageRouter} from "../../../index";
import { useScrollToPartPageTemplate } from "apps/gambling/src/app/ui/pageTemplate/hooks/useScrollToPartPageTemplate";


export const BoxPage = ({
  internalBannerRes,
  fontConfig
}: IBoxPageProps) => {
  const { onClickToActivity } = usePageNavigate()
  const { scrollToWindowTop } = useScrollToPartPageTemplate();

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

  useEffect(() => {
    if(recordOpen) scrollToWindowTop();
  }, [recordOpen])

  if(recordOpen) return <RecordPage onClickToBack={()=>setRecordOpen(false)} />

  return (
    <PageContainer
      className='text-[var(--grayscale-100)] pb-20'
    >
      {contextHolder}
      <div
        className='relative'
      >
        <CacheImage alt='banner' src={internalBannerRes}/>
        <div
          className='absolute top-1/2 -translate-y-1/2 flex flex-wrap
            text-[16px] left-3 w-1/2
            mobile:text-[30px] mobile:left-6 mobile:w-2/3
            tablet:text-[48px] tablet:left-12
            '
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
        className='rounded-lg bg-[var(--grayscale-20)]
          p-4 mt-3
          mobile:mt-5
          tablet:p-8 tablet:mt-8
        '
      >
        {
          isInvitationOpen && (
            <>
              <div
                className='bg-[var(--grayscale-10)] rounded-lg
            px-3 py-3 text-xs text-center
            mobile:px-5 mobile:text-sm mobile:text-left
            tablet:text-base
          '
              >
                Recomende aos seus amigos e ganhe bônus! Estamos sinceramente esperando que mais jogadores se juntem a
                nós!
              </div>

              <div
                className='bg-linear-5-main rounded-lg flex justify-between gap-4 items-center
            mt-3 px-3 py-3 flex-col
            mobile:px-5 mobile:py-2 mobile:flex-row
            tablet:mt-8 tablet:py-4
          '
              >
                <div
                  className='flex flex-col
              gap-2
              tablet:gap-3
            '
                >
                  <div
                    className='font-extrabold
                text-base text-center
                mobile:text-lg mobile:text-left
                tablet:text-xl
              '
                  >Copie o link para seus amigos!
                  </div>
                  <div
                    className='font-bold
                      text-[var(--transparente-80)]
                      text-sm text-center
                      mobile:text-left
                      table:text-base
                    '
                  >{inviteLink}</div>
                </div>

                <button
                  className='state-info-button font-extrabold rounded-full
              w-[200px] h-10 text-sm
              mobile:w-[180px]
              tablet:text-base tablet:h-12
            '
                  onClick={onClickToCopy}
                >
                  Convide Amigos
                </button>
              </div>
            </>
          )
        }

        <div
          className={
            cx(
              'bg-[var(--grayscale-10)] rounded-lg' +
              'mt-3 px-3 py-3 text-xs text-center ' +
              'mobile:px-5 mobile:text-sm mobile:text-left ' +
              'tablet:mt-8 tablet:text-base',
              !isInvitationOpen && 'mt-0 tablet:mt-0'
            )
          }
        >
          Regras de liquidação da plataforma: O evento é atualizado a cada 10 a 30 minutos. Depois que as condições do
          convite forem atendidas, aguarde alguns minutos para reivindicar o bônus. Clique em "Reg de Coletas" para ver
          os detalhes do bônus.
        </div>

        <div
          className='rounded-xl bg-[var(--grayscale-30)] shadow-[inset_0px_-4px_4px_0px_rgba(0,0,0,0.25),inset_0px_4px_4px_0px_rgba(255,255,255,0.25)]
            mt-3 p-3
            mobile:p-8
            tablet:mt-8
          '
        >
          <div
            className='font-bold bg-[var(--grayscale-40)] text-[var(--grayscale-70)] rounded-lg text-center
              px-3 py-3 text-xs
              mobile:px-5 mobile:py-[10px] mobile:text-sm
              tablet:px-[80px] tablet:text-base
            '
          >
            Nota: Para garantir a justiça, os usuários trapaceiros serão banidos permanentemente, os fundos obtidos
            ilegalmente serão congelados e as responsabilidades legais relevantes serão assumidas.
          </div>

          <div
            className='flex text-center
              mt-3 gap-2
              mobile:mt-5
            '
          >
            <div
              className='w-full'
            >
              <div
                className='font-extrabold
                  text-sm
                  mobile:text-base
                  table:text-xl
                '
              >
                R$ {formatLocaleMoney(recharge)} <br className='tablet:hidden'/>ou o acima mencionado
              </div>
              <div
                className='text-[var(--grayscale-80)] font-bold
                  mt-2 text-xs
                  mobile:mt-5 mobile:text-sm
                '
              >
                O subordinado acumulou recargas
              </div>
            </div>
            <div
              className='w-full'
            >
              <div
                className='font-extrabold
                  text-sm
                  mobile:text-base
                  table:text-xl
                '
              >
                R$ {formatLocaleMoney(betFlow)} <br className='tablet:hidden'/>ou o acima mencionado
              </div>
              <div
                className='text-[var(--grayscale-80)] font-bold
                  mt-2 text-xs
                  mobile:mt-5 mobile:text-sm
                '
              >
                O subordinado acumulou apostas
              </div>
            </div>
          </div>
        </div>

        <div
          className='rounded-lg bg-[var(--grayscale-10)] flex
            mt-3 px-3 py-3 flex-col gap-3
            mobile:px-5 mobile:flex-row mobile:justify-between mobile:items-center
            tablet:mt-8
          '
        >
          <div
            className='
              text-sm text-center
              mobile:text-left
              tablet:text-base
            '
          >Pessoas de nível inferior eficazes <span className='text-[var(--state-warn-main)]'>{inviteNum}</span> pessoas
          </div>

          <div
            className='flex
              gap-3
              mobile:gap-5
            '
          >
            <button
              className='state-other-button font-extrabold rounded-full
                w-full py-2 text-sm
                mobile:w-[140px]
                tablet:py-[10px]
              '
              onClick={() => setRecordOpen(true)}
            >Detalhes
            </button>
            <button
              className='state-success-button font-extrabold rounded-full
                w-full py-2 text-sm
                mobile:w-[140px]
                tablet:py-[10px]
              '
              onClick={() => onClickToActivity({category: ActivityPageRouter.RECORD})}
            >Reg de Coletas
            </button>
          </div>
        </div>
      </div>

      <div
        className='bg-[var(--grayscale-20)] rounded-lg
          mt-3 p-4
          mobile:mt-5
          tablet:p-8 tablet:mt-8
        '
      >
        <StepsContainer steps={steps} onClickToClaim={onClickToClaim}/>

        <div
          className='rounded-lg bg-[var(--grayscale-10)]
            mt-3 px-3 py-3
            mobile:px-5
            tablet:mt-8
            text-[var(--grayscale-80)]
          '
        >
          <p className='font-extrabold text-[var(--grayscale-100)]'>Instruções Do Evento:</p>
          <div dangerouslySetInnerHTML={{__html: contentHtml}}/>
        </div>
      </div>

    </PageContainer>
  )
}