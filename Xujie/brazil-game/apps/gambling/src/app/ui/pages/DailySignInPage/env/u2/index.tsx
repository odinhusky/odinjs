import { environment } from "../../../../../../environments/environment";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import { tcx } from "../../../../utils/tcx";

import ArrowRight from './images/ArrowRight.png';
import { VIPButtonList } from "./components/VIPButtonList";
import { useEffect, useState } from "react";
import { DailySignInBonusList } from "./components/DailySignInBonusList";
import { notification } from "antd";
import { usePageNavigate } from "../../../../router/hooks/usePageNavigate";
import {PageContainer} from "../../../../components-bs/PageContainer";
import { GetPunchInConfigResponse } from "../../../../../external/PunchInEndpoint";
import createNotification from "../../../../components-bs/ProgressBarNotification";



interface IDailySignInPageProps {
  onClickToSignIn: () => Promise<boolean>
  currentVIP: GetPunchInConfigResponse['data']['vipLevel']
  signInAllConfig: GetPunchInConfigResponse['data']['signInAllConfig']
  todayIsSignIn: GetPunchInConfigResponse['data']['todayIsSignIn']
  signInTotalDays: GetPunchInConfigResponse['data']['signInTotalDays'];
}

const DailySignInPage = ({
 currentVIP,
 signInAllConfig,
 todayIsSignIn,
 onClickToSignIn,
 signInTotalDays
}: IDailySignInPageProps) => {
  const [selectedVIP, setSelectedVIP] = useState(1);

  const [notice, contextHolder] = notification.useNotification();

  const { onCLickToDailySignInRecord } = usePageNavigate();

  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  const disableSignInButton = currentVIP === 0 || todayIsSignIn

  const vipConfig = signInAllConfig?.find(
    (config) =>
      config.identifier.split('::')[2].replace('V', '') ===
      `${selectedVIP}`
  )

  const dayConfigs = JSON.parse(vipConfig?.value || '[]');

  useEffect(()=> {
    setSelectedVIP(currentVIP === 0? 1: currentVIP)
  }, [currentVIP])

  const [notify, setNotify] = useState(false)

  return (
    <PageContainer>
      {contextHolder}

      {/*Banner*/}
      <div className='relative text-white font-bold'>
        <img alt='banner' src={`assets/${environment.uVersion}/${environment.mvVersion}/internal_banner_checkin.png`}/>
        <div className={tcx('absolute left-[5%] top-1/2 transform -translate-y-1/2 text-[3vw] leading-[3vw]', ['text-xl leading-none', isMobile])}>
          {
            isDesktop && (
              <>
                <div>Colete recompensas todos</div>
                <div>os dias</div>
              </>
            )
          }
          {
            isTablet && (
              <>
                <div>Colete</div>
                <div>recompensas</div>
                <div>todos os dias</div>
              </>
            )
          }
          {
            isMobile && (
              <>
                <div>Colete</div>
                <div>recompensas todos</div>
                <div>os dias</div>
              </>
            )
          }
        </div>
      </div>

      {/*簽到紀錄按鈕*/}
      <div className='flex justify-end mt-3 sm:mt-5 text-sm lg:text-lg text-white'>
        <button
          className='flex gap-2 items-center justify-center py-[10px] px-5 rounded-full shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)] bg-[var(--secondary-main)]'
          onClick={onCLickToDailySignInRecord}
        >
          <div>Registros</div>
          <img alt='Registros' className='w-5 h-5 lg:w-6 lg:h-6' src={ArrowRight}/>
        </button>
      </div>

      {/*領取規則*/}
      <div className='mt-5 border border-[var(--grayscale-20)] text-[var(--state-warn-main)] rounded-lg py-2 sm:py-3 px-2 sm:px-4 lg:px-5'>
        Regras de recompensa diária VIP:Cada nível só pode receber recompensas por {dayConfigs.length} dias no total. As recompensas serão creditadas na próxima vez que você as reivindicar. Para garantir a justiça da plataforma, a plataforma adota uma estratégia antitrapaça, os usuários trapaceiros serão banidos e forneceremos atendimento ao cliente 24 horas para resolver seus problemas.
      </div>

      {/*VIP選單*/}
      <VIPButtonList
        className='mt-5 gap-2 sm:gap-4'
        startVIP={1}
        selectedVIP={selectedVIP}
        setSelectedVIP={setSelectedVIP}
        currentVIP={currentVIP}
        buttonClassName={tcx(
          ['w-[108px] py-1 text-base', isDesktop],
          ['w-[80px] py-[6px] text-sm', isTablet],
          ['w-[72px] py-[6px] text-sm', isMobile],
        )}
        onSelectedClassName={tcx(
          ['w-[140px] py-[6px] text-lg', isDesktop],
          ['w-[120px] py-2 text-base', isTablet],
          ['w-[96px] py-[10px]', isMobile],
        )}
      />


      {/*Daily Sign in Bonus list*/}
      <DailySignInBonusList
        className='mt-5 lg:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-5'
        selectedVIP={selectedVIP}
        currentVIP={currentVIP}
        signInTotalDays={signInTotalDays}
        dayConfigs={dayConfigs}
      />

      {/*Sign in Button*/}
      <button
        className={tcx(
          'w-full rounded-lg bg-[var(--primary-main)] text-sm sm:text-base lg:text-xl mb-10 sm:mb-16 lg:mb-20 mt-[30px] sm:mt-8 lg:mt-10 py-[10px] sm:py-3 lg:py-[14px] text-white shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)]',
          ['shadow-none bg-[var(--primary-light-disable)]', disableSignInButton]
        )
        }
        onClick={()=>{
          if(todayIsSignIn) {
            notice.error({
              message: "Você concluiu o check-in hoje"
            })
            return;
          }
          if(disableSignInButton) {
            notice.error({
              message: "O VIP 0 temporariamente não suporta"
            })
            return;
          }
          onClickToSignIn().then((success) => {
            if(success) {
              // notice.success({
              //   message: "Check-in concluído"
              // })
              createNotification({
                message: 'Check-in concluído',
                isOpen: notify,
                onClose() {
                  setNotify(!notify)
                },
                isDesktop: isDesktop
              })
            }
          })
        }}
      >
        {todayIsSignIn ? 'Recebido': 'Coletar cupons'}
      </button>
    </PageContainer>
  )
}

export default DailySignInPage
