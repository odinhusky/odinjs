import moment, { Moment } from "moment/moment"
import { DatePicker } from "antd"
import { useAllowLoginRouterRules } from "../../../../router/hooks/useAllowLoginRouterRules"
import { PageOrModalPathEnum } from "../../../../PageOrModalPathEnum"
import { useNavigate } from "react-router"
import { useLazyGetUserInviteRewardRecordQuery } from "../../../../../external"
import { useCallback, useEffect, useState } from "react"
import { AppLocalStorage } from "../../../../../persistant/localstorage"
import { BackNavigation } from "../../../../components-bs/BackNavigation/BackNavigation"
import { Table } from "../../../../components-bs/Table"
import { AppLocalStorageKey } from "../../../../../persistant/AppLocalStorageKey"
import { formatLocaleMoney } from "../../../../utils/format"
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint"
import { PageContainer } from "../../../../components-bs/PageContainer"
const { RangePicker } = DatePicker

export const InviteSettlementRecordPage = () => {
  useAllowLoginRouterRules()

  const navigate = useNavigate()
  const { isMobile } = useBreakpoint()
  const [triggerGetUserInviteReward, { currentData }] = useLazyGetUserInviteRewardRecordQuery()
  const min = moment().subtract(7, "days")
  const max = moment()
  const dateFormat = "YYYY-MM-DD hh:mm:ss"
  const [dates, setDates] = useState([min, max])

  const refresh = useCallback((startTime: string, endTime: string) => {
    if (!AppLocalStorage.getItem(AppLocalStorageKey.userId)) return
    triggerGetUserInviteReward({
      userId: AppLocalStorage.getItem(AppLocalStorageKey.userId) || "",
      pageNum: "1",
      pageSize: "10000",
      startTime,
      endTime,
    })
  }, [])

  const columns = [
    {
      title: "Hora De Entrada",
      name: "updateTime",
      key: "updateTime",
      render: (record: any) =>
        moment(record.updateTime).format("DD.MM-YYYY HH:mm:ss"),
    },
    {
      title: "Bônus",
      name: "reward",
      key: "reward",
      render: (record: any) => `R$: ${formatLocaleMoney(record.reward / 100)}`,
    },
  ]

  useEffect(() => {
    refresh(dates[0].format(dateFormat), dates[1].format(dateFormat))
  }, [dates])

  return (
    <PageContainer id={"game-record-section"} className="text-white">
      <BackNavigation
        // title={isMobile && <div className={"w-full text-center font-bold"}>Registros de liquidação</div>}
        className="max-tablet:mb-3"
        onClick={() => navigate(PageOrModalPathEnum.InvitePage)}
      />
      <div className="bg-[var(--grayscale-20)] rounded-lg p-8 tablet:mt-5">
        <section
          className={
            "flex justify-between items-center max-mobile:flex-col max-mobile:justify-center"
          }
        >
          <button
            className="linear-6-button w-60 max-mobile:w-full font-extrabold"
            onClick={() => {
              refresh(dates[0].format(dateFormat), dates[1].format(dateFormat))
            }}
          >
             Registros de liquidação
          </button>
          <div className="w-60 max-mobile:w-full max-mobile:mt-3 h-10">
            <RangePicker
              separator={"-"}
              value={[dates[0], dates[1]]}
              allowClear={false}
              suffixIcon={false}
              format="YYYY-MM-DD"
              onChange={(dates) => {
                if (dates) {
                  setDates(dates as Moment[])
                }
              }}
              className="before:translate-y-0.5 before:pt-1 before:mr-2 before:content-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADkSURBVHgBrZWNDYIwEIWvTIAb1A3cxG5QNtANYAMcQSdgFEaoG+gG552p4UfoXQlf8mjSvHsh16MALICIJakidaSAA33c86CFzI70QpkgBpPhhvk0a2ENbqedh1VCwYV0FTyOs0wMDLTYRDds9IaE5006Fvx2QpiWknQu+AH74TjQwn6cDHdTYbQg9/BLAToOxpgnrQ/RidNPaw322Oi/J3w9GzrUERShnWaoc0L972bRXAaT0Fg32R/30WEeAf9b5eeH0+J26rUTrzGfVhqjCnWjxH13oAWHX0A/Cglxz5PKpboPs8FL0YwrZ74AAAAASUVORK5CYII=')]"
              style={{
                color: "white",
                backgroundColor: "var(--grayscale-30)",
                borderRadius: "100px",
                display: "flex",
              }}
              disabledDate={(current) => current > max}
            />
          </div>
        </section>
        <div className="mt-3 mobile:mt-5 tablet:mt-8  overflow-x-auto rounded-lg ">
          <Table
            theadClassName="bg-linear-6-disabled"
            titleStyle="p-4 text-sm border-transparent !border-x-0 text-white"
            contentStyle="text-base !border-x-0 !border-b !py-6"
            columns={columns}
            dataSource={currentData?.rows || []}
            dataCount={0}
            noDataClassName={"!bg-[var(--grayscale-20)]"}
          />
        </div>
      </div>
    </PageContainer>
  )
}
