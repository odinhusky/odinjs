import {IBoxPageProps} from "../../index";
import {PageContainer} from "../../../../../components-bs/PageContainer";
import {usePageNavigate} from "../../../../../router/hooks/usePageNavigate";
import useBoxPage from "../../hooks/useBoxPage";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import {BackNavigation} from "../../../../../components-bs/BackNavigation/BackNavigation";
import {CacheImage} from "../../../../../components/image/CacheImage";
import cx from "../../../../../utils/cx";
import {ActivityTextContainer} from "../../../ActivityTextContainer";
import React from "react";
import {formatLocaleMoney} from "../../../../../utils/format";
import {ActivityPageRouter} from "../../../index";
import {environment} from "../../../../../../../environments/environment";
import {ClaimButton} from "./ClaimButton";
import {RecordModal} from "./RecordModal";


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

  const { isDesktop} = useBreakpoint()

  const arrowMod = isDesktop ? 5: 2
  const gridsCol = isDesktop ? 'grid-cols-5': 'grid-cols-2'

  return (
    <PageContainer
      className={
        cx(
          'text-white',
          !isDesktop && 'py-[18px]'
        )
      }
    >
      {contextHolder}
      { recordOpen && <RecordModal onClose={() => setRecordOpen(false)} />}
      {
        isDesktop && (
          <BackNavigation
            onClick={onClickToActivity}
          />
        )
      }
      <div
        className={
          cx(
            'relative',
            isDesktop && 'mt-8'
          )
        }
      >
        <CacheImage className='w-full' src={internalBannerRes}/>
        <div
          className={cx(
            {'text-[2.5vw] px-[60px] w-4/5': isDesktop},
            {'text-[5vw] px-[32px] w-3/4': !isDesktop},
            'flex flex-wrap ',
            'absolute transform -translate-y-1/2 top-1/2',
            'justify-start'
          )}
        >

          {bannerContent.split(/\s+/).map(item =>
            <ActivityTextContainer
              children={item}
              fontConfig={fontConfig}
            />
          )}
        </div>
      </div>

      <div
        className='bg-[var(--background-modal)] rounded-2xl border border-[var(--outline-table)]
          mt-[10px] px-4 py-4
          mobile:mt-6 mobile:px-6 mobile:py-5
        '
      >
        {
          isInvitationOpen && (
            <>
              <div className='text-center text-[var(--text-primary)] text-sm mobile:text-xl'>Recomende aos seus amigos e ganhe bônus! Estamos sinceramente esperando que mais jogadores se juntem a nós!</div>
              {
                isDesktop && (
                  <div
                    className='flex rounded-full overflow-hidden mt-6'
                  >
                    <div className='w-full bg-white py-3 text-xl font-bold px-10'>
                      <div className='text-[var(--text-title-secondary)]'>Copie o link para seus amigos!</div>
                      <div className='text-[var(--text-seondary)]'>{inviteLink}</div>
                    </div>
                    <button
                      className='px-[25px] flex-shrink-0 bg-gradient-to-b from-[var(--btn-gradient1-from)] to-[var(--btn-gradient1-to)] text-[var(--text-button)] font-bold text-2xl'
                      onClick={onClickToCopy}
                    >
                      Convide Amigos
                    </button>
                  </div>
                )
              }
              {
                !isDesktop && (
                  <>
                    <div className='w-full bg-white rounded-full px-5 py-2 font-bold mt-3'>
                      <div className='text-[var(--text-title-secondary)] text-sm'>Copie o link para seus amigos!</div>
                      <div className='text-[var(--text-seondary)] text-xs'>{inviteLink}</div>
                    </div>

                    <button
                      className='rounded-full w-full mt-1 py-2 font-bold text-sm bg-gradient-to-b from-[var(--btn-gradient1-from)] to-[var(--btn-gradient1-to)] text-[var(--text-button)]'
                      onClick={onClickToCopy}
                    >
                      {'Convide Amigos'.toUpperCase()}
                    </button>
                  </>
                )
              }
            </>
          )
        }

        <div
          className='font-medium text-center
            mt-3 text-sm
            mobile:mt-6 mobile:text-xl
          '
        >
          Regras de liquidação da plataforma: O evento é atualizado a cada 10 a 30 minutos. Depois que as condições do convite forem atendidas, aguarde alguns minutos para reivindicar o bônus. Clique em "Reg de Coletas" para ver os detalhes do bônus.
        </div>
      </div>

      <div
        className='bg-[var(--background-item)] rounded-2xl border border-[var(--outline-table)]
          px-3 py-4 mt-3
          mobile:px-6 mobile:py-5 mobile:mt-6
        '
      >
        <div className='text-center font-bold text-sm mobile:text-xl italic'>Nota: Para garantir a justiça, os usuários trapaceiros serão banidos permanentemente, os fundos obtidos ilegalmente serão congelados e as responsabilidades legais relevantes serão assumidas.</div>
        <div className='bg-white w-full h-[1px] my-3 mobile:my-4' />
        {
          isDesktop && (
            <div className='flex justify-center gap-4'>
              <div className='flex flex-col justify-center items-center gap-2'>
                <div className='text-base'>O subordinado acumulou recargas</div>
                <div className='font-bold text-xl'>R${formatLocaleMoney(recharge)} Ou o acima mencionado</div>
              </div>
              <div className='flex flex-col justify-center items-center gap-2'>
                <div className='text-base'>O subordinado acumulou apostas</div>
                <div className='font-bold text-xl'>R${formatLocaleMoney(betFlow)} Ou o acima mencionado</div>
              </div>
            </div>
          )
        }
        {
          !isDesktop && (
            <div
              className='flex justify-between gap-2'
            >
              <div className='w-full text-center'>
                <div className='font-bold text-base'>R${formatLocaleMoney(recharge)}</div>
                <div className='font-bold text-baas'>Ou o acima mencionado</div>
                <div className='mt-2 text-sm'>O subordinado <br/> acumulou recargas</div>
              </div>
              <div className='w-full text-center'>
                <div className='font-bold text-base'>R${formatLocaleMoney(betFlow)}</div>
                <div className='font-bold text-baas'>Ou o acima mencionado</div>
                <div className='mt-2 text-sm'>O subordinado <br/> acumulou apostas</div>
              </div>
            </div>
          )
        }
      </div>

      <div
        className='bg-[var(--background-item)] rounded-2xl border border-[var(--outline-table)] flex
          mt-3 px-6 py-4 flex-col items-center gap-3
          mobile:mt-6 mobile:px-4 mobile:py-4 mobile:flex-row mobile:justify-center mobile:gap-[80px]
        '
      >
        <div className='text-center mobile:text-right w-full text-sm mobile:text-xl'>Pessoas de nível inferior eficazes <span className='text-[var(--primary-assistant)]'>{inviteNum}</span> pessoas</div>
        <div
          className='flex gap-3 mobile:gap-4 justify-between mobile:justify-start w-full'
        >
          <button
            className='font-bold text-[var(--text-button)] bg-gradient-to-b from-[var(--btn-gradient1-from)] to-[var(--btn-gradient1-to)] rounded-full
              py-2 text-sm w-fill px-5
              mobile:py-4 mobile:text-base mobile:w-[132px]
            '
            onClick={()=>setRecordOpen(true)}
          >
            {'Detalhes'.toUpperCase()}</button>
          <button
            className='font-bold text-[var(--text-button)] bg-gradient-to-b from-[var(--secondary-main-from)] to-[var(--secondary-main-to)] rounded-full
              py-2 text-sm w-full
              mobile:py-4 mobile:text-base mobile:w-[188px]
            '
            onClick={()=>onClickToActivity({category: ActivityPageRouter.RECORD})}
          >
            {'Reg de Coletas'.toUpperCase()}</button>
        </div>
      </div>

      <div
        className='rounded-2xl border border-[var(--outline-secondary)] bg-[var(--background-instruction-80)]
          px-9 py-6 mt-3
          mobile:px-[72px] mobile:mt-6
        '
      >
        <div
          className={
            cx(
              'grid gap-x-[56px] mobile:gap-x-[97px] gap-y-4 mobile:gap-y-5', gridsCol
            )
          }
        >
          {
            steps.map((item, index) => (
              <div
                key={index}
                className='w-full flex flex-col justify-center items-center gap-1'
              >
                <div
                  className='relative'
                >
                  <CacheImage
                    alt='box'
                    className='w-full'
                    src={`assets/${environment.uVersion}/${environment.mVersion}/ic_box_${item.icon}_${item.status.toLowerCase()}.png`}
                  />
                  {
                    !!((index + 1) % arrowMod) && index !== steps.length -1 && (
                      <CacheImage
                        alt='arrow'
                        className='absolute top-1/2 -translate-y-1/2
                           w-6 -right-[52px] -translate-x-3
                           mobile:w-9 mobile:-right-[85px] mobile:-translate-x-[18px]
                        '
                        src={`assets/${environment.uVersion}/${environment.mVersion}/box_arrow_right.png`}
                      />
                    )
                  }
                  {
                    item.status === 'UNCLAIMED' && <ClaimButton rewardAmount={item.rewardAmount} onConfirm={() => onClickToClaim(item.inviteNum)} />
                  }
                </div>

                <div className='text-center'>
                  <div className='font-medium text-xs mobile:text-base'>{item.inviteNum} pessoas</div>
                  <div className='font-bold text-sm mobile:text-lg'>R$ {formatLocaleMoney(item.rewardAmount)}</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      <div
        className='rounded-2xl border border-[var(--outline-secondary)] bg-[var(--background-instruction-80)]
          px-3 py-5 mt-3
          mobile:px-5 mobile:py-5 mobile:mt-6
        '
      >
        <div dangerouslySetInnerHTML={{__html:contentHtml}}/>
      </div>
    </PageContainer>
  )
}