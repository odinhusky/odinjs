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
import RangeDatePicker from "../../../../components-bs/DatePickers/RangeDatePicker"
import { environment } from "../../../../../../environments/environment";
import { datePickerStyle } from "../../../../components-bs/DatePickers/DatePicker"
import "../../../GameRecordPage/env/u6/index.scss"
import cx from "../../../../utils/cx"

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
        className="mb-3 mobile:mb-4 tablet:mb-5"
        onClick={() => navigate(-1)}
      />
      <div className="bg-[var(--grayscale-30)] rounded-xl py-4 px-[30px] mobile:py-8 mobile:px-9 tablet:py-10 tablet:px-12">
        <section
          className={cx(
            "flex justify-between items-center max-mobile:flex-col max-mobile:justify-center",
            "mb-4 mobile:mb-5"
          )}
        >
          <button
            className={cx(
              "w-60 max-mobile:w-full h-9 mobile:h-10 linear-1-button flex justify-center items-center",
              "text-sm font-bold tablet:text-base tablet:font-medium"
            )}
            onClick={() => {
              refresh(dates[0].format(dateFormat), dates[1].format(dateFormat))
            }}
          >
            Registros de liquidação
          </button>
          <div className={cx("max-mobile:w-full", isMobile ? 'mt-2' : '')}>
            {
              isMobile ?
                (
                  <RangeDatePicker
                    min='2023-01-01'
                    max={max.format('YYYY-MM-DD')}
                    className="bg-white text-black"
                    onConfirm={(values) => setDates([moment(values[0], 'YYYY-MM-DD'), moment(values[1], 'YYYY-MM-DD')])}
                    value={[dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')]}
                  />
                ) :
                (
                  <div className='text-sm font-medium flex items-center border-[1.5px] border-[var(--grayscale-80)] rounded-lg bg-[var(--grayscale-20)]'>
                    <RangePicker
                      value={[dates[0], dates[1]]}
                      allowClear={false}
                      format="YYYY-MM-DD"
                      separator={' - '}
                      onChange={(dates) => {
                        if (dates) {
                          setDates(dates as Moment[]);
                        }
                      }}
                      suffixIcon={false}
                      className="u6-range-picker !border-0"
                      style={datePickerStyle}
                      disabledDate={(current) => current > max}
                    />
                    <img className='w-6 h-6 mr-4' src={`assets/${environment.uVersion}/Calendar.png`} alt="icon_calendar" />
                  </div>
                )
            }
          </div>
        </section>
        <div className="mt-4 tablet:mt-5">
          <Table
            columns={columns}
            dataSource={currentData?.rows || []}
            dataCount={0}
            isHidePagination={true}
          />
        </div>
      </div>
    </PageContainer>
  )
}
