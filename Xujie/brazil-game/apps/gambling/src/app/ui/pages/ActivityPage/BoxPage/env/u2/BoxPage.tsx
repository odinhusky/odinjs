import {IBoxPageProps} from "../../index";
import {PageContainer} from "../../../../../components-bs/PageContainer";
import {CacheImage} from "../../../../../components/image/CacheImage";
import useBoxPage from "../../hooks/useBoxPage";
import {ActivityTextContainer} from "../../../ActivityTextContainer";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import {formatLocaleMoney} from "../../../../../utils/format";
import {usePageNavigate} from "../../../../../router/hooks/usePageNavigate";
import {environment} from "../../../../../../../environments/environment";
import {ClaimButton} from "./ClaimButton";
import {RecordPage} from "./RecordPage";
import cx from "../../../../../utils/cx";
import {ActivityPageRouter} from "../../../index";
import React from "react";


export const BoxPage = ({
  internalBannerRes,
  fontConfig
}: IBoxPageProps) => {

  const { onClickToActivity } = usePageNavigate()

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

  const { isDesktop, isTablet, isMobile } = useBreakpoint();

  const arrowMod = isDesktop? 4 : isTablet ? 3: 2
  const gridsCol = isDesktop? 'grid-cols-4': isTablet?'grid-cols-3': 'grid-cols-2'

  if(recordOpen) return <RecordPage onClickToBack={()=>setRecordOpen(false)} />

  return (
    <PageContainer
      className='text-[var(--grayscale-100)] pb-20'
    >
      {contextHolder}
      <div
        className='relative'
      >
        <CacheImage src={internalBannerRes}/>
        <div
          className={cx(
            {'text-[3vw] px-[60px] w-2/3': isDesktop},
            {'text-[4vw] px-[48px] w-2/3': isTablet},
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

      {
        isInvitationOpen && (
          <>
            <div
              className='text-[var(--grayscale-70)] text-center rounded-lg border border-[var(--grayscale-20)]
          mt-3 py-2 px-2 text-sm
          mobile:mt-5
          tablet:mt-8 tablet:py-3 tablet:text-base
        '
            >
              Recomende aos seus amigos e ganhe bônus! Estamos sinceramente esperando que mais jogadores se juntem a nós!
            </div>

            <div
              className='bg-gradient-to-br from-[var(--liner-main-from)] to-[var(--liner-main-to)]
          mt-3 px-3 py-3 rounded-xl
          mobile:mt-5 mobile:px-4 mobile:py-4
          tablet:mt-8 tablet:rounded-2xl
        '
            >
              <div
                className='font-bold
            text-sm
            mobile:text-base
            tablet:text-xl
          '
              >
                Copie o link para seus amigos!
              </div>

              <div
                className='flex
            mt-2 gap-2
            mobile:gap-3
            tablet:mt-3 tablet:gap-5
          '
              >
                <div
                  className='border border-[var(--grayscale-100)] w-full bg-[var(--white-30)] rounded-lg
              px-2 py-3 text-xs
              mobile:px-3 mobile:py-[14px] mobile:text-sm
              tablet:px-5 tablet:py-3 tablet:text-lg
            '
                >
                  {inviteLink}
                </div>
                <button
                  className='font-medium bg-[var(--primary-main)] rounded-lg shadow-[inset_0px_-4px_4px_0px_rgba(0,0,0,0.25),inset_0px_4px_4px_0px_rgba(255,255,255,0.25)]
              text-sm py-[10px] w-[64px]
              mobile:text-base mobile:py-3 mobile:w-[125px]
              tablet:text-xl tablet:py-[14px] tablet:w-[236px]
            '
                  onClick={onClickToCopy}
                >
                  {isDesktop ? 'Convide Amigos' : 'Cópia'}
                </button>
              </div>
            </div>
          </>
        )
      }

      <div
        className={
          cx(
            'text-[var(--grayscale-70)] text-center rounded-lg border border-[var(--grayscale-20)] ' +
            'mt-3 py-2 px-2 text-sm ' +
            'mobile:mt-5 ' +
            'tablet:mt-8 tablet:py-3 tablet:text-base',
            !isInvitationOpen && 'mt-0 mobile:mt-0 tablet:mt-0'
          )
        }
      >
        Regras de liquidação da plataforma: O evento é atualizado a cada 10 a 30 minutos. Depois que as condições do
        convite forem atendidas, aguarde alguns minutos para reivindicar o bônus. Clique em "Reg de Coletas" para ver os
        detalhes do bônus.
      </div>

      <div
        className='bg-[var(--grayscale-20)]
          mt-3 px-4 py-2 rounded-lg
          mobile:mt-5 mobile:px-5 mobile:py-4 mobile:rounded-xl
          tablet:mt-8 tablet:px-8 tablet:py-8
        '
      >
        <div
          className='font-medium text-[var(--grayscale-60)] text-center bg-gradient-to-r from-[rgba(255,255,255,0)] via-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0)]
            text-sm
            tablet:text-base
          '
        >
          {
            isDesktop ?
              'Nota: Para garantir a justiça, os usuários trapaceiros serão banidos permanentemente, os fundos obtidos ilegalmente serão congelados e as responsabilidades legais relevantes serão assumidas.' :
              'Promoção sujeita ao cumprimento de todas as seguintes condições.'
          }
        </div>

        <div
          className='flex justify-between
            mt-3 gap-3 text-sm
            mobile:gap-5 mobile:text-2xl
            tablet:mt-5 tablet:3xl
          '
        >
          <div
            className='w-full text-center font-bold
              '
          >
            <div>R$ {formatLocaleMoney(recharge)}</div>
            <div>ou o acima mencionado</div>
            <div className='font-medium
                text-xs mt-2
                mobile:text-sm mobile:mt-5
                tablet:text-base
              '>
              O subordinado acumulou recargas
              </div>
            </div>
            <div
              className='w-full text-center font-bold
              '
            >
              <div>R$ {formatLocaleMoney(betFlow)}</div>
              <div>ou o acima mencionado</div>
              <div className='font-medium
                text-xs mt-2
                mobile:text-sm mobile:mt-5
                tablet:text-base
              '>
                O subordinado acumulou apostas
              </div>
            </div>
        </div>
      </div>


      <div
        className='bg-[var(--grayscale-20)] rounded-lg flex
          mt-3 flex-col px-3 py-3 gap-2 text-sm
          mobile:mt-5 mobile:flex-row mobile:px-5 mobile:gap-5 mobile:text-base mobile:items-center
          tablet:mt-8 tablet:text-xl
        '
      >
        <div className='w-full'>
          Pessoas de nível inferior eficazes <span className='text-[var(--state-warn-main)]'>{inviteNum}</span>  pessoas
        </div>
        <div
          className='font-medium flex
            gap-2
            mobile:gap-5
          '
        >
          <button
            className='rounded-lg bg-[var(--secondary-main)] shadow-[inset_0px_-4px_4px_0px_rgba(0,0,0,0.25),inset_0px_4px_4px_0px_rgba(255,255,255,0.25)]
              w-full py-[10px]
              mobile:w-[100px] mobile:py-3
              tablet:w-[165px] tablet:py-[14px]
            '
            onClick={()=>setRecordOpen(true)}
          >
            Detalhes
          </button>
          <button
            className='rounded-lg bg-[var(--primary-main)] shadow-[inset_0px_-4px_4px_0px_rgba(0,0,0,0.25),inset_0px_4px_4px_0px_rgba(255,255,255,0.25)]
              w-full py-[10px]
              mobile:w-[148px] mobile:py-3
              tablet:w-[225px] tablet:py-[14px]
            '
            onClick={()=>onClickToActivity({category: ActivityPageRouter.RECORD})}
          >
            Reg de Coletas
          </button>
        </div>
      </div>

      <div
        className='bg-[var(--grayscale-20)] rounded-lg
          mt-3 px-3 py-3
          mobile:mt-5 mobile:px-4 mobile:py-4
          tablet:mt-8 tablet:px-5 tablet:py-5
        '
      >
        <div
          className={
          cx('grid gap-x-3 gap-y-3 mobile:gap-x-5 mobile:gap-y-4 tablet:gap-x-5 tablet:gap-y-5', gridsCol)
          }
        >
          {
            steps.map((item, index) => (
              <div
                key={index}
                className='w-full flex flex-col justify-center items-center'
              >
                <div
                  className='relative flex justify-center'
                >
                  <CacheImage
                    alt='box'
                    className='w-4/5'
                    src={`assets/${environment.uVersion}/${environment.mVersion}/ic_box_${item.icon}_${item.status.toLowerCase()}.png`}
                  />
                  {
                    !!((index + 1) % arrowMod) && index !== steps.length -1 && (
                      <CacheImage
                        alt='arrow'
                        className='absolute top-1/2 -translate-y-1/2
                           w-5 -right-5
                           mobile:w-10 mobile:-right-10
                        '
                        src={`assets/${environment.uVersion}/${environment.mVersion}/box_arrow_right.png`}
                      />
                    )
                  }
                </div>

                {
                  item.status === 'UNCLAIMED' ? (
                    <ClaimButton
                      rewardAmount={item.rewardAmount}
                      onConfirm={()=>onClickToClaim(item.inviteNum)}
                    />
                  ) : (
                    <div
                      className='text-center'
                    >
                      <div
                        className='font-medium
                          text-sm
                          tablet:text-base
                        '
                      >
                        {item.inviteNum} pessoas
                      </div>
                      <div
                        className='font-bold
                          text-sm
                          tablet:text-lg
                        '
                      >
                        R$ {formatLocaleMoney(item.rewardAmount)}
                      </div>
                    </div>
                  )
                }
              </div>
            ))
          }
        </div>

        <div
          className='bg-[var(--grayscale-15)] rounded-lg py-3 px-5
            mt-3
            mobile:mt-5
            tablet:mt-8
            text-[var(--grayscale-70)]
          '
        >
          <p className='font-bold text-[var(--grayscale-100)]'>Instruções Do Evento:</p>
          <div dangerouslySetInnerHTML={{__html: contentHtml}}/>
        </div>
      </div>

    </PageContainer>
  )
}