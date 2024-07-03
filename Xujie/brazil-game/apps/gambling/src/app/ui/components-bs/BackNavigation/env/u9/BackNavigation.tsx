import { LeftOutlined } from "@ant-design/icons"
import React from "react"
import { twMerge } from "tailwind-merge"
import t from "apps/gambling/src/assets/constant/lang"
import { useNavigate } from "react-router-dom"
import cx from "../../../../utils/cx"
import { tcx } from "../../../../utils/tcx"

type IProps = {
  onClick?: () => void
  title?: React.ReactNode
  className?: string
}

export const BackNavigation = (props: IProps) => {
  const navigate = useNavigate()

  const handleBack = () => {
    if (props.onClick) {
      props.onClick()
    } else {
      navigate(-1)
    }
  }

  return (
    <div
      className={tcx(
        "viewport-fixed top-0 left-0 right-0 bg-header2",
        "px-4 h-12 box-border",
        "cursor-pointer"
      )}
    >
      <div className="flex justify-center items-center relative h-full">
        <div
          className="absolute left-0 top-0 h-full flex items-center"
          onClick={handleBack}
        >
          <svg
            className="w-3 h-3"
            viewBox="0 0 16 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.68815 12.0051L14.6665 3.02634C14.9137 2.77971 15.0497 2.44995 15.0497 2.09834C15.0497 1.74654 14.9137 1.41698 14.6665 1.16995L13.8798 0.38361C13.6329 0.136195 13.303 0 12.9514 0C12.5998 0 12.2702 0.136195 12.0232 0.38361L1.33303 11.0736C1.08503 11.3214 0.949225 11.6525 0.950201 12.0045C0.949225 12.358 1.08483 12.6888 1.33303 12.9368L12.0132 23.6164C12.2602 23.8638 12.5898 24 12.9416 24C13.2932 24 13.6228 23.8638 13.87 23.6164L14.6565 22.83C15.1683 22.3182 15.1683 21.4851 14.6565 20.9735L5.68815 12.0051Z"
              className="fill-[var(--tertiary-main)]"
            />
          </svg>
        </div>
        <div className="text-[var(--transparent-100)] font-bold text-base">{props.title}</div>
      </div>
    </div>
  )
}
