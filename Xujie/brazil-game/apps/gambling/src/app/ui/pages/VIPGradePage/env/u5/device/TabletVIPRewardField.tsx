import {twMerge} from "tailwind-merge";
import {GetUserVIPAllInfoResponseData} from "../../../../../../external/UserEndpoint";
import {useState} from "react";
import {environment} from "../../../../../../../environments/environment";

interface ITabletVIPRewardFieldProps {
  signInTotalDays?: number;
  className?: string
  allLevelInfoWithBonus: Array<GetUserVIPAllInfoResponseData & { signInBonus: string; upRewardAmount: string; withdrawAmountLimitDayString: string }>
}

export const TabletVIPRewardField = ({
  className,
  signInTotalDays,
  allLevelInfoWithBonus
}: ITabletVIPRewardFieldProps) => {
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
      className={
        twMerge(
          'flex flex-col gap-5 py-8 px-5 bg-[var(--grayscale-20)] rounded-lg',
          className
        )
      }
    >
      <div
        className='relative flex px-[10px] gap-3 w-full'
      >

        <img
          alt="left"
          className="w-8 cursor-pointer absolute top-1/2 -translate-y-1/2 -left-10 hover:brightness-[1.3] active:brightness-[0.7]"
          src={`assets/${environment.uVersion}/${environment.mVersion}/vip_left_arrow.png`}
          onClick={() => {
            handleSelected(-1);
          }}
        />

        {
          vipInfoTabList.map((item, index) => (
            <div
              className={
                twMerge(
                  'px-1 py-4 flex flex-col gap-2 bg-[var(--grayscale-25)] w-full rounded-lg items-center cursor-pointer box-border',
                  index === selected && 'bg-[var(--grayscale-40)] border border-[var(--grayscale-70)]'
                )
              }
              onClick={() => setSelected(index)}
            >
              <img
                alt={item.title}
                className='w-10'
                src={item.iconSrc}
              />
              <div className='font-extrabold text-sm text-center'>{item.title}</div>
            </div>
          ))
        }

        <img
          alt="right"
          className="w-8 cursor-pointer absolute top-1/2 -translate-y-1/2 -right-10 hover:brightness-[1.3] active:brightness-[0.7]"
          src={`assets/${environment.uVersion}/${environment.mVersion}/vip_right_arrow.png`}
          onClick={() => {
            handleSelected(1);
          }}
        />

      </div>

      <div
        className='mt-5 flex flex-col gap-4'
      >
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
  )
}