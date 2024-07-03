import { twMerge } from "tailwind-merge";
import { GetUserVIPAllInfoResponse, GetUserVIPAllInfoResponseData } from "../../../../../../external/UserEndpoint";
import { GetPunchInConfigResponse } from "../../../../../../external/PunchInEndpoint";
import { useState } from "react";
import { environment } from "../../../../../../../environments/environment";

interface IDesktopVIPRewardFieldProps {
  signInTotalDays?: number;
  allLevelInfo: GetUserVIPAllInfoResponse['data'];
  className?: string
  allLevelInfoWithBonus: Array<GetUserVIPAllInfoResponseData & { signInBonus: string; upRewardAmount: string; withdrawAmountLimitDayString: string }>
}

export const DesktopVIPRewardField = ({
  className,
  signInTotalDays,
  allLevelInfoWithBonus
}: IDesktopVIPRewardFieldProps) => {
  const [selected, setSelected] = useState(0)


  const vipInfoTabList: { title: string, iconSrc: string, contentKey: 'signInBonus' | 'upRewardAmount' | 'withdrawAmountLimitDayString' | 'withdrawTimesLimitDay' }[] = [
    {
      title: `Recompensa total de check-in de ${signInTotalDays} dias`,
      iconSrc: `assets/${environment.uVersion}/vip_sign_in_bonus.png`,
      contentKey: 'signInBonus'
    },
    {
      title: 'Recompensa de atualização',
      iconSrc: `assets/${environment.uVersion}/vip_up_reward.png`,
      contentKey: 'upRewardAmount'
    },
    {
      title: 'Limite máximo de retirada única',
      iconSrc: `assets/${environment.uVersion}/vip_withdraw_amount_limit.png`,
      contentKey: 'withdrawAmountLimitDayString'
    },
    {
      title: 'Número de retiradas por dia',
      iconSrc: `assets/${environment.uVersion}/vip_withdraw_times_limit.png`,
      contentKey: 'withdrawTimesLimitDay'
    }
  ]

  const handleSelected = (value:number) => {
    setSelected(prevState => (prevState + value % vipInfoTabList.length + vipInfoTabList.length) % vipInfoTabList.length)
  }

  return (
    <div
      className={twMerge(
        "flex gap-8",
        className
      )}
    >
      <div
        className="flex flex-col gap-5 py-8 px-5 justify-center items-center bg-[var(--grayscale-20)] rounded-lg"
      >
        <img
          alt="up"
          className="w-8 cursor-pointer hover:brightness-[1.3] active:brightness-[0.7]"
          src={`assets/${environment.uVersion}/${environment.mVersion}/vip_up_arrow.png`}
          onClick={() => {
            handleSelected(-1);
          }}
        />

        {
          vipInfoTabList.map((item, index) => (
            <div
              className={
                twMerge(
                  'p-4 flex flex-col gap-1 bg-[var(--grayscale-25)] w-[245px] rounded-lg items-center cursor-pointer',
                  index === selected && 'bg-[var(--grayscale-40)] border border-[var(--grayscale-70)]'
                )
              }
              onClick={() => setSelected(index)}
            >
              <img
                alt={item.title}
                className='w-16'
                src={item.iconSrc}
              />
              <div className='font-extrabold text-base text-center'>{item.title}</div>
            </div>
          ))
        }

        <img
          alt="down"
          className="w-8 cursor-pointer hover:brightness-[1.3] active:brightness-[0.7]"
          src={`assets/${environment.uVersion}/${environment.mVersion}/vip_down_arrow.png`}
          onClick={() => {
            handleSelected(1);
          }}
        />
      </div>
      <div
        className="relative bg-[var(--grayscale-20)] rounded-lg w-full"
      >
        <div className='absolute top-8 left-8 right-8 bottom-8 overflow-y-scroll flex flex-col gap-4'>

          {
            allLevelInfoWithBonus.map(info => {
              const isJackPot = (info.level >= 20) && selected === 1

              return (
                <div className='flex gap-5'>
                  <div
                    className='font-extrabold rounded-lg w-[120px] py-2 bg-linear-2-main text-base flex items-center justify-center'
                    style={{
                      textShadow: '0 0 2px #00000080'
                    }}
                  >
                    VIP {info.level}
                  </div>

                  <div
                    className={
                      twMerge(
                        'py-2 px-6 rounded-lg bg-[var(--grayscale-30)] w-full flex items-center font-bold text-base',
                        isJackPot && 'text-[var(--state-warn-main)]'
                      )
                    }
                  >
                    {
                      !isJackPot && info[vipInfoTabList[selected].contentKey]
                    }
                    {
                      isJackPot && info.upRewardAmount
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}
