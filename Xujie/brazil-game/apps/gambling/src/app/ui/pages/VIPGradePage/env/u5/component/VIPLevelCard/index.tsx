import { twMerge } from "tailwind-merge";
import { environment } from "../../../../../../../../environments/environment";
import { GetUserVIPAllInfoResponse, GetVIPInfoResponse } from "../../../../../../../external/UserEndpoint";
import { useVIPGradePage } from "../../../../hook/useVIPGradePage";
import { ProgressBar } from "../../../../../../components-bs/ProgressBar";
import { formatLocaleMoney } from "../../../../../../utils/format";
import useBreakpoint from "../../../../../../pageTemplate/hooks/useBreakpoint";


interface IVIPLevelCardProps {
  currentLevel: number
  arrowPadding?: number
  className?: string
  userVIPInfo?: GetVIPInfoResponse
  allLevelInfo: GetUserVIPAllInfoResponse['data']
}

export const VIPLevelCard = ({
  currentLevel,
  arrowPadding,
  className,
  userVIPInfo,
  allLevelInfo
}: IVIPLevelCardProps) => {
  const { selectedVIP, setSelectedVIP } = useVIPGradePage(currentLevel, userVIPInfo?.data.vip_score)

  const handleChangeLevel = (value: -1 | 1) => {
    if(selectedVIP !== 0 && value === -1) {
      setSelectedVIP((prev) => prev + value)
    }

    if(selectedVIP !== 25 && value === 1) {
      setSelectedVIP((prev) => prev + value)
    }
  }

  const { isTablet } = useBreakpoint();


  return (
    <div className={twMerge(
      'relative bg-[var(--grayscale-20)] p-[30px] rounded-lg flex gap-8 justify-between items-center',
      isTablet && 'gap-5',
      className
    )}>
      {/*left bottom*/}
      {selectedVIP != 0 &&
          <img
              className='absolute top-1/2 -translate-y-1/2 w-8 h-10 cursor-pointer hover:brightness-[1.3] active:brightness-[0.7]'
              style={{
                left: arrowPadding ? `${-arrowPadding}px` : '-52px'
              }}
              alt='left'
              src={`assets/${environment.uVersion}/${environment.mVersion}/vip_left_arrow.png`}
              onClick={()=>handleChangeLevel(-1)}
          />
      }

      {/*right bottom*/}
      {selectedVIP < allLevelInfo.length -1 &&
          <img
              className='absolute top-1/2 -translate-y-1/2 w-8 h-10 cursor-pointer hover:brightness-[1.3] active:brightness-[0.7]'
              style={{
                right: arrowPadding ? `${-arrowPadding}px` : '-52px'
              }}
              alt='right'
              src={`assets/${environment.uVersion}/${environment.mVersion}/vip_right_arrow.png`}
              onClick={()=>handleChangeLevel(1)}
          />
      }


      <img
        className={
          twMerge(
            'w-[160px]',
            isTablet && 'w-[136px]'
          )
        }
        alt={`vip${selectedVIP}`}
        src={`assets/${environment.uVersion}/${environment.mVersion}/icon_vip_level_${selectedVIP}.png`}
      />

      {
        selectedVIP !== 0 && (
          <div
            className='w-full flex flex-col gap-3'
          >
            <div>
              <div className={
                twMerge(
                  "flex justify-between text-base font-bold",
                  isTablet && "text-sm"
                )
              }>
                <div className='text-[var(--state-warn-main)]'>Valor total da recarga</div>
                <div>
                  <span>R$ {formatLocaleMoney((userVIPInfo?.data?.vip_score || 0) / 100)}</span>
                  <span className='text-[var(--state-warn-main)]'>/R$ {formatLocaleMoney(allLevelInfo[selectedVIP].rechargeAmountLimit / 100)}</span>
                </div>
              </div>
              <ProgressBar
                className={
                  twMerge(
                    "h-10 py-[14px] px-5 mt-2 text-white text-lg font-extrabold",
                    isTablet && 'h-9 py-[12px] mt-[6px] text-base'
                  )
                }
                progress={
                  ((userVIPInfo?.data?.vip_score || 0) / 100) / (allLevelInfo[selectedVIP].rechargeAmountLimit / 100 || 1)
                }
              />
            </div>

            <div>
              <div className={
                twMerge(
                  "flex justify-between text-base font-bold",
                  isTablet && "text-sm"
                )
              }>
                <div className='text-[var(--state-warn-main)]'>Número total de apostas</div>
                <div>
                  <span>R$ {formatLocaleMoney((userVIPInfo?.data?.flow || 0) / 100)}</span>
                  <span className='text-[var(--state-warn-main)]'>/R$ {formatLocaleMoney(allLevelInfo[selectedVIP].flowLimit / 100)}</span>
                </div>
              </div>
              <ProgressBar
                className={
                  twMerge(
                    "h-10 py-[14px] px-5 mt-2 text-white text-lg font-extrabold",
                    isTablet && "h-9 py-[12px] mt-[6px] text-base"
                  )
                }
                progress={
                  ((userVIPInfo?.data?.flow || 0) / 100) / (allLevelInfo[selectedVIP].flowLimit / 100 || 1)
                }
              />
            </div>

          </div>
        )
      }

      {
        selectedVIP === 0 && (
          <div className={
            twMerge(
              'w-full font-bold text-base',
              isTablet && "text-sm"
            )
          }>
            Bem-vindo ao {environment.platformName}! Como novo jogador, você está atualmente no Nível 0. Quer experimentar mais emoção e conteúdo exclusivo do jogo? Recarregue agora e suba de nível! Desbloqueie jogos de níveis superiores e recompensas exclusivas esperando por você. Clique em "Primeira recarga" para começar sua jornada para o próximo nível!
          </div>
        )
      }
    </div>
  )
}
