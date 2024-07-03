import {twMerge} from "tailwind-merge";
import {environment} from "../../../../../../../../environments/environment";
import {formatLocaleMoney} from "../../../../../../utils/format";

interface RewardCardProps {
  isLock: boolean
  classNames?: string
  contentClassNames?: string
  dayClassNames?: string
  cashbackClassNames?: string
  boxClassNames?: string
  buttonClassNames?: string
  day: number
  cashback: number
  todayIsSignIn: boolean
  signInTotalDays?: number
  onClickToSignIn: () => void
}

export const RewardCard = ({
  isLock,
  classNames,
  contentClassNames,
  dayClassNames,
  cashbackClassNames,
  boxClassNames,
  buttonClassNames,
  day,
  cashback,
  todayIsSignIn,
  signInTotalDays,
  onClickToSignIn
}: RewardCardProps) => {

  const singInStatus = isLock? 'after' : day <= (signInTotalDays || 0) ? 'before': (day === (signInTotalDays || 0) + 1) && !todayIsSignIn ? 'current': 'after'

  const boxSrc =  `assets/${environment.uVersion}/icon_box_${singInStatus}.png`

  return (
    <div
      className={
        twMerge(
          'w-full rounded-xl bg-[var(--grayscale-30)] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]',
          classNames
        )
      }
    >
      <div
        className={
          twMerge(
            'flex flex-col items-center',
            contentClassNames
          )
        }
      >
        <div className={twMerge('text-center', dayClassNames)}>Dia{' '}{day}</div>

        <img alt='box' className={boxClassNames} src={boxSrc}/>

        <div className={twMerge('text-center', cashbackClassNames)}>R$ {formatLocaleMoney(cashback)}</div>
      </div>

      <div
        className={
          twMerge(
            'text-center rounded-full font-extrabold',
            buttonClassNames,
            singInStatus === 'current' ?
              'cursor-pointer linear-5-button' :
              singInStatus === 'before' ?
                'cursor-not-allowed border border-[var(--grayscale-50)]' :
                'cursor-not-allowed bg-linear-5-disabled',
          )
        }
        onClick={()=>{
          if(singInStatus === 'current') {
            onClickToSignIn()
          }
        }}
      >
        {singInStatus === 'before' ? 'Já registado': 'Registo'}
      </div>
    </div>
  )
}