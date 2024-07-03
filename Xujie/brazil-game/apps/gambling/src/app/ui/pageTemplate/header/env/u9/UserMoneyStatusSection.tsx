import { useCallback, useEffect, useRef, useState } from "react"
import { ThreeDots } from "react-loading-icons"
import { useUserMoneyStatusSection } from "../../hooks/useUserMoneyStatusSection"
import {
  formatLocaleMoney,
  formatLocaleMoneyWithAbbr,
} from "../../../../utils/format"
import { environment } from "../../../../../../environments/environment"
import { debounce } from "lodash"
import cx from "../../../../utils/cx"
import { CacheImage } from "../../../../components/image/CacheImage"
import { IProps } from "../../UserMoneyStatusSection"
import useBreakpoint from "../../../hooks/useBreakpoint"
import { IconTooltip } from "../../../../components/Tooltips/IconTooltip"
import { EyeOutlined } from "@ant-design/icons"
import { tcx } from "../../../../utils/tcx"
import { notification } from "antd"
import Icon from "../../../../components-bs/Icon"

export const UserMoneyStatusSection = (props: IProps) => {
  const {
    onClickToWallet,
    totalBalanceSheetValue,
    update,
    isUserMoneyStatusLoading,
  } = useUserMoneyStatusSection()

  const debouncedOnUpdate = useCallback(
    debounce(update, 1000), // 500ms的去抖动时间
    [] // 依赖项数组，空数组意味着该函数在组件的生命周期内不会改变
  )

  return (
    <div className="w-[129px] flex justify-around items-center gap-1 px-1.5 py-2 rounded-full border border-[var(--transparent-50)]">
      <img
        className="w-3 h-3"
        src={`assets/${environment.uVersion}/icon_brazil.png`}
        alt="logo"
      />
      {isUserMoneyStatusLoading ? (
        <span className="text-[var(--grayscale-100)] text-xs font-medium">
          Loading
        </span>
      ) : (
        <span className="text-[var(--text-amount)] text-xs font-medium flex-1">
          {formatLocaleMoney(totalBalanceSheetValue)}
        </span>
      )}
      <Icon
        name="reset"
        size="12"
        className={tcx("cursor-pointer", [
          "animate-spin",
          isUserMoneyStatusLoading,
        ])}
        onClick={debouncedOnUpdate}
      />
    </div>
  )
}
