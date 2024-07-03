import { useEffect, useMemo, useRef, useState } from "react"
import { tcx } from "../../../../utils/tcx"
import { usePageNavigate } from "../../../../router/hooks/usePageNavigate"
import { notification } from "antd"
import { useSelector } from "react-redux"
import { RootState } from "../../../../../reduxStore"
const DepositBtn = () => {
  const { onClickToWallet } = usePageNavigate()
  const [showDeposit, setShowDeposit] = useState(false)
  const depositRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      const isTargetOrChildOfTarget =
        depositRef.current && depositRef.current.contains(event.target)
      if (!isTargetOrChildOfTarget) {
        setShowDeposit(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])
  const isLogin = useSelector((state: RootState) => state.app.isLogin)
  const options = useMemo(
    () => [
      { name: "Depósito", onClick: onClickToWallet },
      {
        name: "Saque",
        onClick: () => {
          notification.info({
            message: "TODO 設定提現密碼",
          })
        },
      },
      {
        name: "Juros",
        onClick: () => {
          notification.info({
            message: "Atualização de função em manutenção",
          })
        },
      },
    ],
    [isLogin]
  )
  return (
    <div className="relative">
      <button
        ref={depositRef}
        className="flex items-center gap-2 p-1.5 rounded-lg tertiary-button group"
        onClick={() => setShowDeposit(true)}
      >
        <span className="text-[var(--grayscale-30)] font-bold text-xs group-hover:text-[var(--grayscale-40)] group-active:text-[var(--grayscale-300)]">
          Depósito
        </span>

        <svg
          width="6"
          height="4"
          viewBox="0 0 6 4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={tcx(["rotate-180", showDeposit])}
        >
          <path
            d="M0 3.5L6 3.5L3 0.5L0 3.5Z"
            className={tcx(
              "fill-[var(--grayscale-30)]",
              "group-hover:fill-[var(--grayscale-40)] group-active:fill-[var(--grayscale-300)]"
            )}
          />
        </svg>
      </button>
      <div
        className={tcx(
          "absolute -bottom-0.5 left-0 translate-y-full w-full flex flex-col rounded-[4px] bg-quaternary-dark-active overflow-hidden",
          ["hidden", !showDeposit]
        )}
      >
        {options.map((item, index) => (
          <div
            key={index}
            className={tcx(
              "flex items-center justify-center w-full h-8 text-xs font-bold text-[var(--transparent-80)] cursor-pointer",
              "hover:text-[var(--tertiary-main)] hover:bg-[var(--quaternary-main)]",
              "active:text-[var(--tertiary-main)] active:bg-[var(--quaternary-main)]"
            )}
            onClick={() => {
              item.onClick()
            }}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  )
}
export default DepositBtn
