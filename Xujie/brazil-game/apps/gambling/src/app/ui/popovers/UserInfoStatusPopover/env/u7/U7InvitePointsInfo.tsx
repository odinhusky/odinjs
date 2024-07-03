import cx from "apps/gambling/src/app/ui/utils/cx";
import { environment } from "apps/gambling/src/environments/environment";
import { formatLocaleMoney } from "../../../../utils/format";
import t from "apps/gambling/src/assets/constant/lang";

interface U7InvitePointsInfoProps {
  onClose: <T>(arg?: T) => void;
  toInvite: <T>(arg?: T) => void;
  totalPrize: number;
  bonusAwaitingSettlement: number;
  fullWithdrawable: number;
}

export const U7InvitePointsInfo = ({
  onClose,
  toInvite,
  totalPrize,
  bonusAwaitingSettlement,
  fullWithdrawable
}: U7InvitePointsInfoProps) => {

  const list = [
    {
      id: 1,
      label: t['totalPrize'],
      value: totalPrize
    },
    {
      id: 2,
      label: t['bonusAwaitingSettlement'],
      value: bonusAwaitingSettlement
    },
    {
      id: 3,
      label: t['bonusAlreadySettled'],
      value: fullWithdrawable
    },
  ]

  return (
    <div
      className={cx(
        'flex flex-col gap-5'
      )}
    >
      <button
        className={cx(
          'relative',
          'w-full h-6',
        )}
        onClick={() => {
          onClose();
          toInvite();
        }}
      >
        <span className={cx(
          'block',
          'w-full',
          'text-center font-bold text-[var(--grayscale-100)]',
          'text-lg leading-6'
        )}>
          {t['promotedAccount']}
        </span>

        <img
          className="absolute top-0 right-0 h-5"
          src={`assets/${environment.uVersion}/icon=arrow-right.png`}
        />
      </button>

      <div className={cx(
        'w-full',
        'flex flex-col gap-3'
      )}>
        {
          list.map(item =>  {
            return (
              <div 
                key={item.id}
                className={cx(
                  'w-full',
                  'flex items-center',
                  'rounded-lg',
                  'bg-[var(--transparent-white-10)]',
                  'py-4 px-3'
                )}
              >
                <span className={cx(
                  'block',
                  'flex-auto',
                  'font-medium text-[var(--transparent-white-70)]',
                  'text-sm leading-[18px]'
                )}>
                  { item.label }
                </span>
                <span className={cx(
                  'flex-1',
                  'block',
                  'font-bold text-[var(--grayscale-100)] text-right',
                  'text-sm leading-[18px]'
                )}>
                  { t['moneyWithRSign'](formatLocaleMoney(item.value)) }
                </span>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default U7InvitePointsInfo;