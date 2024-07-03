import { PageContainer } from "../../../../../components-bs/PageContainer"
import { usePageNavigate } from "../../../../../router/hooks/usePageNavigate"
import { BackNavigation } from "../../../../../components-bs/BackNavigation/BackNavigation"
import {
  TActivityRecordItem,
  useActivityRecord,
} from "../../../hooks/useActivityRecord"
import Select from "react-select"
import { Table } from "../../../../../components-bs/Table"
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint"
import "./index.scss"
import cx from "../../../../../utils/cx"
import { NoData } from "../../../../../components-bs/Table/env/u5/NoData"
import {StylesConfig} from "react-select";
const selectStyleProps: StylesConfig = {
  control: (base, { isFocused }) => ({
    ...base,
    background: "var(--grayscale-20)",
    border: isFocused
      ? "1.5px solid var(--state-warn-main)"
      : "1.5px solid var(--grayscale-80)",
    color: "var(--grayscale-80)",
    padding: "0px 8px",
    borderRadius: "8px",
    outline: "none",
    boxShadow: "none",
    "&:hover": {},
    cursor: "pointer",
  }),
  valueContainer: (style) => ({
    ...style,
    color: "var(--grayscale-80)"
  }),

  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),

  option: (base, { isFocused, isSelected }) => ({
    ...base,
    background: isFocused
      ? "var(--grayscale-40)"
      : "var(--grayscale-20)",
    color: isSelected || isFocused ? "var(--grayscale-100)" : "var(--grayscale-80)",
    "&:active": {
      background: "var(--grayscale-20)",
    },
  }),

  menu: (base) => ({
    ...base,
    borderRadius: "8px",
  }),
  menuList: (base) => ({
    ...base,
    borderRadius: "8px",
    border: "1.5px solid var(--grayscale-40)",
    padding: "0px",
  }),

  singleValue: (provided: any, state: any) => ({
    ...provided,
    color: "var(--grayscale-80)",
  }),
}
const recordStatusMap = {
  true: {
    title: "Sucesso",
    color: "var(--state-success-main)",
  },
  false: {
    title: "Não recebido",
    color: "var(--state-warn-main)",
  },
}
export const RecordPage = () => {
  const { isMobile } = useBreakpoint()
  const { onClickToActivity } = usePageNavigate()

  const { activityRecordState, useQueryByActivityOptionAndDayOption } =
    useActivityRecord()

  const columns = [
    {
      title: "Tempo",
      name: "time",
      key: "time",
      render: (record: TActivityRecordItem) => <div>{record.time}</div>,
    },
    {
      title: "Nome do evento",
      name: "name",
      key: "name",
      render: (record: TActivityRecordItem) => <div>{record.name}</div>,
    },
    {
      title: "Valor do bônus",
      name: "bonus",
      key: "bonus",
      render: (record: TActivityRecordItem) => <div>{record.bonus}</div>,
    },
    {
      title: "Estado",
      name: "status",
      key: "status",
      render: (record: TActivityRecordItem) => (
        <div
          style={{
            color: recordStatusMap[record.status ? "true" : "false"].color,
          }}
        >
          {recordStatusMap[record.status ? "true" : "false"].title}
        </div>
      ),
    },
    {
      title: "IP",
      name: "ip",
      key: "ip",
      render: (record: TActivityRecordItem) => <div>{record.ip}</div>,
    },
  ]

  const MobilePage = () => {
    return (
      <div className="max-h-[60vh] overflow-y-auto">
        {activityRecordState?.tableBody?.length ? (
          <>
            {activityRecordState?.tableBody.map((record: any, i) => (
              <div
                key={i}
                className={
                  "w-full mb-3 text-white p-2 box-border rounded-xl bg-[var(--grayscale-40)]"
                }
              >
                {columns.map((item, index) => (
                  <div className={cx(index == 0 ? "" : "mt-2")}>
                    <div
                      key={index}
                      className={cx(
                        "flex justify-between items-center box-border"
                      )}
                    >
                      <div className="text-xs text-[var(--grayscale-80)]">
                        {item.title}
                      </div>
                      <div className="text-xs">
                        {item.render ? item.render(record) : record[index]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </>
        ) : (
          <NoData
            className="w-full !py-4"
            imgClassName="!w-[120px] !h-[120px] mobile:!w-40 tablet:!w-50"
            textClassName="!text-xs mobile:!text-2xl !text-[var(--grayscale-60)]"
          />
        )}
      </div>
    )
  }

  return (
    <PageContainer className="text-white">
      <BackNavigation onClick={onClickToActivity} />

      <div className="rounded-lg bg-[var(--grayscale-30)] py-4 px-5 mobile:py-8 mobile:px-9 tablet:py-10 tablet:px-12 mt-3 mobile:mt-4 tablet:mt-5">
        <div
          className={cx("flex justify-between items-center", {
            "flex-wrap justify-center": isMobile,
          })}
        >
          <div className="text-base mobile:text-lg font-medium">
            Bônus{" "}
            <span className="state-info-main">
              {activityRecordState?.totalBonus}
            </span>
          </div>

          <div className={cx("flex gap-4", { "my-4 w-full": isMobile })}>
            <Select
              className="w-full mobile:w-[152px] tablet:w-[264px]"
              isSearchable={false}
              value={activityRecordState?.currentDay}
              options={activityRecordState?.dayOptions}
              styles={selectStyleProps}
              onChange={(item: any) => {
                useQueryByActivityOptionAndDayOption(
                  activityRecordState?.currentTypeName || {
                    label: "",
                    value: "",
                    type: "",
                  },
                  item
                )
              }}
            />

            <Select
              className="w-full mobile:w-[152px] tablet:w-[264px]"
              isSearchable={false}
              value={activityRecordState?.currentTypeName}
              options={activityRecordState?.activityOptions}
              styles={selectStyleProps}
              onChange={(item: any) => {
                useQueryByActivityOptionAndDayOption(
                  item,
                  activityRecordState?.currentDay || { label: "", value: 1 }
                )
              }}
            />
          </div>
        </div>

        <div className="mobile:mt-5">
          {isMobile ? (
            <MobilePage />
          ) : (
            <Table
              theadClassName="table-head"
              columns={columns || []}
              dataSource={activityRecordState?.tableBody || []}
              dataCount={activityRecordState?.tableBody.length || 0}
              isHidePagination={true}
            />
          )}
        </div>
      </div>
    </PageContainer>
  )
}
