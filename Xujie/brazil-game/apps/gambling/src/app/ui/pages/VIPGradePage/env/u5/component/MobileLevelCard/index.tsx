import {GetUserVIPAllInfoResponse, GetVIPInfoResponse} from "../../../../../../../external/UserEndpoint";
import {useVIPGradePage} from "../../../../hook/useVIPGradePage";
import {environment} from "../../../../../../../../environments/environment";
import {formatLocaleMoney} from "../../../../../../utils/format";
import {ProgressBar} from "../../../../../../components-bs/ProgressBar";

interface IMobileLevelCardProps {
  currentLevel: number
  arrowPadding?: number
  userVIPInfo?: GetVIPInfoResponse
  allLevelInfo: GetUserVIPAllInfoResponse['data']
}

export const MobileLevelCard = ({
  currentLevel,
  arrowPadding,
  userVIPInfo,
  allLevelInfo
}: IMobileLevelCardProps) => {
  const { selectedVIP, setSelectedVIP } = useVIPGradePage(currentLevel, userVIPInfo?.data.vip_score)

  const handleChangeLevel = (value: -1 | 1) => {
    if(selectedVIP !== 0 && value === -1) {
      setSelectedVIP((prev) => prev + value)
    }

    if(selectedVIP !== 25 && value === 1) {
      setSelectedVIP((prev) => prev + value)
    }
  }

  return (
    <div
      className='bg-[var(--grayscale-20)] rounded-lg p-4 mt-3'
    >
      <div
        className='relative w-full flex justify-center'
      >
        {/*left bottom*/}
        {selectedVIP != 0 &&
            <img
                className='absolute top-1/2 -translate-y-1/2 w-8 h-10 cursor-pointer hover:brightness-[1.3] active:brightness-[0.7]'
                style={{
                  left: arrowPadding ? `${-arrowPadding}px` : '-10px'
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
                  right: arrowPadding ? `${-arrowPadding}px` : '-10px'
                }}
                alt='right'
                src={`assets/${environment.uVersion}/${environment.mVersion}/vip_right_arrow.png`}
                onClick={()=>handleChangeLevel(1)}
            />
        }

        <img
          className='w-[96px]'
          alt={`vip${selectedVIP}`}
          src={`assets/${environment.uVersion}/${environment.mVersion}/icon_vip_level_${selectedVIP}.png`}
        />
      </div>

      {
        selectedVIP !== 0 && (
          <div
            className='flex flex-col w-full gap-2 text-sm font-bold'
          >
            <div>
              <div className='flex justify-end'>R$ {formatLocaleMoney((userVIPInfo?.data?.vip_score || 0) / 100)}</div>
              <div
                className='flex justify-between'
              >
                <div className='text-[var(--state-warn-main)]'>Valor total da recarga</div>
                <div
                  className='text-[var(--state-warn-main)]'>/R$ {formatLocaleMoney(allLevelInfo[selectedVIP].rechargeAmountLimit / 100)}</div>
              </div>
              <ProgressBar
                className="h-7 py-[10px] px-5 mt-[6px] text-white font-extrabold"
                progress={
                  ((userVIPInfo?.data?.vip_score || 0) / 100) / (allLevelInfo[selectedVIP].rechargeAmountLimit / 100 || 1)
                }
                percentClassName='w-[60px]'
              />
            </div>

            <div>
              <div className='flex justify-end'>R$ {formatLocaleMoney((userVIPInfo?.data?.flow || 0) / 100)}</div>
              <div
                className='flex justify-between'
              >
                <div className='text-[var(--state-warn-main)]'>Número total de apostas</div>
                <div
                  className='text-[var(--state-warn-main)]'>/R$ {formatLocaleMoney(allLevelInfo[selectedVIP].flowLimit / 100)}</div>
              </div>
              <ProgressBar
                className="h-7 py-[10px] px-5 mt-[6px] text-white font-extrabold"
                progress={
                  ((userVIPInfo?.data?.flow || 0) / 100) / (allLevelInfo[selectedVIP].flowLimit / 100 || 1)
                }
                percentClassName='w-[60px]'
              />
            </div>
          </div>
        )
      }

      {
        selectedVIP === 0 && (
          <div className='w-full font-bold text-sm p-2 text-center'>
            Bem-vindo ao {environment.platformName}! Como novo jogador, você está atualmente no Nível 0. Quer experimentar mais emoção e conteúdo exclusivo do jogo? Recarregue agora e suba de nível! Desbloqueie jogos de níveis superiores e recompensas exclusivas esperando por você. Clique em "Primeira recarga" para começar sua jornada para o próximo nível!
          </div>
        )
      }
    </div>
  )
}