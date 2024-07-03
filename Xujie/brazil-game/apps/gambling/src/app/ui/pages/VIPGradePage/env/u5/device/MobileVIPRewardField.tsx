import {GetUserVIPAllInfoResponseData} from "../../../../../../external/UserEndpoint";
import {useState} from "react";
import {environment} from "../../../../../../../environments/environment";
import {twMerge} from "tailwind-merge";

interface IMobileVIPRewardFieldProps {
  signInTotalDays?: number;
  allLevelInfoWithBonus: Array<GetUserVIPAllInfoResponseData & { signInBonus: string; upRewardAmount: string; withdrawAmountLimitDayString: string }>
}


export const MobileVIPRewardField = ({
  signInTotalDays,
  allLevelInfoWithBonus
}: IMobileVIPRewardFieldProps) => {
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
      className='flex flex-col gap-3 bg-[var(--grayscale-20)] p-4 rounded-lg mt-3'
    >
      <div className='relative'>
        <img
          alt="left"
          className="w-8 cursor-pointer absolute top-1/2 -translate-y-1/2 -left-4 hover:brightness-[1.3] active:brightness-[0.7]"
          src={`assets/${environment.uVersion}/${environment.mVersion}/vip_left_arrow.png`}
          onClick={() => {
            handleSelected(-1);
          }}
        />

        <div
          className='px-1 py-4 flex flex-col gap-2 bg-[var(--grayscale-40)] w-full rounded-lg border border-[var(--grayscale-70)] items-center cursor-pointer box-border'
        >
          <img
            alt='select'
            className='w-10'
            src={vipInfoTabList[selected].iconSrc}
          />
          <div className='font-extrabold text-sm text-center w-[144px]'>{vipInfoTabList[selected].title}</div>
        </div>

        <img
          alt="right"
          className="w-8 cursor-pointer absolute top-1/2 -translate-y-1/2 -right-4 hover:brightness-[1.3] active:brightness-[0.7]"
          src={`assets/${environment.uVersion}/${environment.mVersion}/vip_right_arrow.png`}
          onClick={() => {
            handleSelected(1);
          }}
        />
      </div>

      {
        allLevelInfoWithBonus.map(info => {
          const isJackPot = (info.level >= 20) && selected === 1

          return (
            <div className='flex gap-2'>
              <div
                className='font-extrabold rounded-lg w-[120px] py-2 bg-linear-2-main text-sm flex items-center justify-center'
                style={{
                  textShadow: '0 0 2px #00000080'
                }}
              >
                VIP {info.level}
              </div>

              <div
                className={
                  twMerge(
                    'py-2 px-3 rounded-lg bg-[var(--grayscale-30)] w-full flex items-center font-bold text-sm',
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
  )
}