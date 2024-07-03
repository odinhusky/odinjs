import { PageContainer } from "../../../../../components-bs/PageContainer"
import { usePageNavigate } from "../../../../../router/hooks/usePageNavigate"
import { BackNavigation } from "../../../../../components-bs/BackNavigation/BackNavigation"
import {
  TActivityRecordItem,
  useActivityRecord,
} from "../../../hooks/useActivityRecord"
import Select from "react-select"
// import { Table } from "../../../../../components-bs/Table"
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint"
// import "./index.scss"
import cx from "../../../../../utils/cx"
// import { NoData } from "../../../../../components-bs/Table/env/u5/NoData"
import { StylesConfig } from "react-select";
import { InfiniteTable, TInfiniteTableColumn } from "apps/gambling/src/app/ui/components-bs/InfiniteTable"
import { InfiniteHorizontalTable } from "apps/gambling/src/app/ui/components-bs/InfiniteHorizontalTable"
// import { IActivityRecordState } from "apps/gambling/src/app/ui/pages/ActivityPage/hooks/useActivityRecord"

const selectStyleProps: StylesConfig = {
  control: (base, { isFocused }) => ({
    ...base,
    position: 'relative', /* 确保伪元素可以相对于这个元素定位 */
    background: "var(--linear-4-main)",
    border: "none",
    color: isFocused ? "var(--grayscale-100)" : "var(--grayscale-80)",
    borderRadius: "100px",
    outline: "none",
    boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
    "&:hover": {
      background: "var(--linear-4-dark-active)",
      color: "var(--grayscale-100)",
    },
    "&:before": {
      content: '""', /* 伪元素需要内容才能显示，即使它是空的 */
      position: 'absolute', /* 绝对定位使伪元素脱离文档流并相对于最近的定位父元素定位 */
      top: '-1.5px', /* 与.control的顶部对齐 */
      left: '-1.5px', /* 与.control的左侧对齐 */
      right: '-1.5px', /* 与.control的右侧对齐 */
      bottom: '-1.5px', /* 与.control的底部对齐 */
      zIndex: -1, /* 如果需要，可以将伪元素放在.control之下 */
      borderRadius: "100px",
      background: "var(--stroke-popup)",
    },
    cursor: "pointer",
  }),

  indicatorsContainer: (provided) => ({
    ...provided,
    color: "inherit",
    paddingRight: "10px",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "inherit",
    "&:hover": {
      color: "var(--grayscale-100)",
    },
    "&:active": {
      color: "var(--grayscale-100)",
    },
  }),

  valueContainer: (style) => ({
    ...style,
    color: "inherit",
    padding: "14px 13px 13px 12px",
  }),

  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),

  option: (base, { isFocused, isSelected }) => ({
    ...base,
    background: isFocused
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(255, 255, 255, 0)",
    color: isSelected || isFocused ? "var(--grayscale-100)" : "var(--grayscale-80)",
    "&:active": {
      background: "rgba(255, 255, 255, 0)",
    },
  }),

  menu: (base) => ({
    ...base,
    borderRadius: "8px",
    margin: "3px 0px",
    padding: "0px",
    "&:before": {
      content: '""', /* 伪元素需要内容才能显示，即使它是空的 */
      position: 'absolute', /* 绝对定位使伪元素脱离文档流并相对于最近的定位父元素定位 */
      top: '-1.5px', /* 与.control的顶部对齐 */
      left: '-1.5px', /* 与.control的左侧对齐 */
      right: '-1.5px', /* 与.control的右侧对齐 */
      bottom: '-1.5px', /* 与.control的底部对齐 */
      zIndex: -1, /* 如果需要，可以将伪元素放在.control之下 */
      borderRadius: "8px",
      background: "var(--stroke-popup)",
    }
  }),
  menuList: (base) => ({
    ...base,
    borderRadius: "8px",
    border: "none",
    margin: "0px",
    padding: "0px",
    background: "var(--linear-4-main)",
  }),

  singleValue: (provided: any, state: any) => ({
    ...provided,
    color: "inherit",
    // "&:hover": {
    //   color: "var(--grayscale-100)",
    // },
    // "&:active": {
    //   color: "var(--grayscale-100)",
    // },
    // "&:focus-within": {
    //   color: "var(--grayscale-100)",
    // },
    margin: "0px",
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

/**
 * 活動頁面[紀錄]
 */
export const RecordPage = () => {
  const { isMobile } = useBreakpoint()
  // const { onClickToActivity } = usePageNavigate()

  const { activityRecordState, useQueryByActivityOptionAndDayOption } =
    useActivityRecord()
  // console.log("activityRecordState", activityRecordState);


  const columns: TInfiniteTableColumn<TActivityRecordItem>[] = [
    { title: 'Tempo', dataIndex: 'time', render: (record: any) => <div>{record.time}</div>, thClassName: 'font-medium' },
    { title: 'Nomes do evento', dataIndex: 'name', render: (record: any) => <div>{record.name}</div>, thClassName: 'font-medium' },
    { title: 'Valor do bônus', dataIndex: 'bonus', render: (record: any) => <div>{record.bonus}</div>, thClassName: 'font-medium' },
    {
      title: 'Estado',
      dataIndex: 'status',
      render: (record: any) => <div style={{
        color: recordStatusMap[record.status ? 'true' : 'false'].color
      }}>{recordStatusMap[record.status ? 'true' : 'false'].title}</div>,
      thClassName: 'font-medium'
    },
    { title: 'IP', dataIndex: 'ip', render: (record: any) => <div>{record.ip}</div> },
  ]

  return (
    <PageContainer className="text-white">
      <BackNavigation /*onClick={onClickToActivity}*/ />

      <div className="mt-4 mobile:mt-[38px] tablet:mt-8">
        <div
          className={cx("flex justify-between items-center", {
            "flex-wrap justify-center": isMobile,
          })}
        >
          <div className={cx("flex gap-5", { "mb-3 w-full": isMobile })}>
            <Select
              className="w-full mobile:w-[240px]"
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
              className="w-full mobile:w-[240px]"
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
          <div className="text-base mobile:text-lg font-medium">
            Bônus{" "}
            <span className="text-[var(--state-success-main)] font-bold">
              {activityRecordState?.totalBonus}
            </span>
          </div>

        </div>

        <div className="mt-5 mobile:mt-8 tablet:mt-5">

          {isMobile ?
            <InfiniteHorizontalTable
              columnKey='time'
              className='h-[416px]'
              headerClassName=''
              rowClassName=''
              datasource={activityRecordState?.tableBody || []}
              rows={columns}
              totalCount={activityRecordState?.tableBody.length || 0}
            />
            :
            <div className='w-full h-[500px] rounded-lg text-xs tablet:text-sm text-[var(--grayscale-100)] text-center border-stroke-popup relative shadow-[0_4px_4px_rgba(0,0,0,0.25)] '/** */>

              <InfiniteTable<TActivityRecordItem>
                className='bg-linear-4-main'
                headerClassName='bg-[var(--transparent-black-10)] text-[var(--grayscale-80)] font-medium'
                rowKey='time'
                datasource={activityRecordState?.tableBody || []}
                columns={columns}
                totalCount={activityRecordState?.tableBody.length || 0}
              />

              {
                !activityRecordState?.tableBody || activityRecordState?.tableBody?.length === 0 ? null :
                  <div className="pointer-events-none w-full h-full absolute top-0 left-0 flex justify-between">
                    <span className="h-full w-[0.5px] bg-inherit"></span>
                    {
                      Array.from({ length: columns.length - 1 }, () => null).map((c, index) => (
                        <span key={index} className="h-full w-[0.5px] bg-[var(--transparent-white-5)]"></span>
                      ))
                    }
                    <span className="h-full w-[0.5px] bg-inherit"></span>
                  </div>
              }
            </div>
          }
        </div>
      </div>
    </PageContainer>
  )
}
