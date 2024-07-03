import { PageContainer } from "../../../../../components-bs/PageContainer";
import { BackNavigation } from "../../../../../components-bs/BackNavigation/BackNavigation";
import Select, { StylesConfig } from "react-select";
import { useRecordModal } from "../../hooks/useRecordModal";
import { RecordTable } from "./RecordTable";
import { formatLocaleMoney } from "../../../../../utils/format";
import { environment } from "../../../../../../../environments/environment";

const selectStyleProps: StylesConfig = {
  control: (base, { isFocused }) => ({
    ...base,
    background: "none",
    border: "none",
    // border: isFocused
    //   ? "1.5px solid var(--state-warn-main)"
    //   : "1.5px solid var(--grayscale-80)",
    // color: "var(--grayscale-100)",
    padding: "0px 8px",
    borderRadius: "100px",
    outline: "none",
    boxShadow: "none",
    cursor: "pointer",
    "&:hover": {
      background: "var(--linear-4-light-hover)",
    },
    height: "100%",
  }),
  valueContainer: (style) => ({
    ...style,
    // color: "var(--grayscale-80)",
  }),

  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),

  option: (base, { isFocused, isSelected }) => ({
    ...base,
    background: isFocused ? "var(--transparent-white-10)" : "none",
    color:
      isSelected || isFocused ? "var(--grayscale-100)" : "var(--grayscale-80)",
    // "&:active": {
    //   background: "var(--grayscale-20)",
    // },
  }),

  menu: (base) => ({
    ...base,
    borderRadius: "8px",
    background: "var(--linear-4-main)",
  }),
  menuList: (base) => ({
    ...base,
    borderRadius: "8px",
    border: "1.5px solid var(--grayscale-40)",
    padding: "0px",
  }),
  singleValue: (provided: any, state: any) => {
    return {
      ...provided,
      color: state.selectProps.menuIsOpen
        ? "var(--grayscale-100)"
        : "var(--grayscale-80)",
      "&:hover": {
        color: "var(--grayscale-100)",
      },
    };
  },
  indicatorsContainer: (base, state) => ({
    ...base,
    opacity: state.selectProps.menuIsOpen ? "1" : "0.6",
    transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "rotate(0deg)",
  }),
};

interface RecordPageProps {
  onClickToBack: () => void;
}

export const RecordPage = ({ onClickToBack }: RecordPageProps) => {
  const {
    isShowConditionDetail,
    totalRechargeNum,
    totalRechargeAmount,
    inviteTotalCount,
    inviteList,
    statusOption,
    selectedStatus,
    setSelectedStatus,
  } = useRecordModal();

  return (
    <PageContainer className="text-[var(--grayscale-100)]">
      <BackNavigation onClick={onClickToBack} />

      <div className="flex flex-col text-[var(--grayscale-100)]">
        <div className="mobile:text-2xl text-lg font-bold mobile:text-left text-center">
          Minha lista de recomendações
        </div>

        <div className="flex max-mobile:flex-col justify-between items-center mobile:my-5 mt-1 mb-4">
          <div className="relative mobile:w-[240px] w-full h-12 p-[1.9px]">
            <div className="border-popup-button absolute top-0 left-0 w-full h-full" />
            <Select
              className="bg-linear-4-main rounded-full h-full"
              isSearchable={false}
              styles={selectStyleProps}
              options={statusOption}
              value={selectedStatus}
              onChange={(item: any) => setSelectedStatus(item)}
              components={{ DropdownIndicator }}
            />
          </div>
          <div className="mobile:text-lg text-base font-medium mobile:text-left text-center">
            <p className={inviteTotalCount != undefined ? "" : "hidden"}>
              Número total de convites :{" "}
              <span className="text-[#00C885] font-bold">
                {inviteTotalCount}
              </span>
            </p>
            <p className={totalRechargeNum != undefined ? "" : "hidden"}>
              Número de Usuários Recarregados :{" "}
              <span className="text-[#00C885] font-bold">
                {totalRechargeNum || 0}
              </span>
            </p>
            <p className={totalRechargeAmount != undefined ? "" : "hidden"}>
              {/* Montante total recarregado:  */}
              Bônus :{" "}
              <span className="text-[#00C885] font-bold">
                R${formatLocaleMoney(totalRechargeAmount || 0)}
              </span>
            </p>
          </div>
        </div>

        <RecordTable
          isShowConditionDetail={isShowConditionDetail}
          inviteList={inviteList}
        />
      </div>
    </PageContainer>
  );
};

interface CustomDropdownIndicatorProps {
  // 这里可以根据需要添加更多的属性
}

const DropdownIndicator: React.FC<CustomDropdownIndicatorProps> = (props) => {
  return (
    <div className="flex justify-center items-center w-9 h-full">
      <img
        className="w-3 h-3"
        src={`assets/${environment.uVersion}/icon_arrow_down.png`}
        alt="arrow"
      />
    </div>
  );
};
