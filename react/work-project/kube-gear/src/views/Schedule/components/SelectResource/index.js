/* eslint-disable no-unused-vars */
import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// ? context
import ScheduleContext from '../../ScheduleContext';
// import GlobalContext from 'layouts/Main/GlobalContext';

// ^ Material-ui Componets(Functions)
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

// ? Self-packed Components || Functions
import { DebounceRestrictRangeNumberInput } from 'components/Debounce/DebounceRestrictRangeNumberInput'

// ^ plugins
import { useTranslation } from 'react-i18next';
import { isEmpty, isNil, isNumber, isNull } from 'lodash';
import PropTypes from 'prop-types';

/**
 * @author odin
 * @prop {number} dataId -- 要修改的 data ID，有的話就代表是在修改模式
 * @prop {number} activeStep -- 目前在第幾步(0 => 第一步 | 2 => 第三步)
 * @prop {object} selectedVgObj -- 選擇的集群的物件
 * @prop {array} resOptions -- 資源的選項 eg. [{
    key: unitName,
    text: `${resourceName} (${gpu !== null ? gpu : 0} GPU, ${cpu} CPU, ${memory} memory)`,
    resourceName,
    resourse: resourceUnit[unitName],
    vgName: selectedVgObj.name,
    canUseNumber
  }]
 * @prop {object} classNameObj -- 額外控制內部元素的 className 物件
 * @prop {function} onChange -- 修改資料的 function
 * @prop {function} onChangeMulti -- 修改taskRole物件的 function，可以接收多個 key: value
 * @prop {object} resourceValue -- 選擇已經選定的資源以及數量
 * @prop {object} thisVgLimitedResourceObj -- 目前這個使用者之於這個集群裡面的限制資源資源
 * @prop {boolean} isShowRemain -- 是否顯示剩餘資源，預設為是
 * @level views/Schedule/any/SelectResource
 * @component SelectResource
 * @description Schedule Calendar Page
*/
export const SelectResource = ({
  dataId,
  activeStep,
  selectedVgObj,
  resOptions,
  classNameObj,
  onChange,
  onChangeMulti,
  resourceValue,
  thisVgLimitedResourceObj,
  isShowRemain = true
}) => {

  // $ init data
  const { t } = useTranslation();

  // = style
  const {
    classes,
    selfCanUseVgList,
    filteredResourceObj
  } = useContext(ScheduleContext);

  // % context
  // const { getResource } = useContext(GlobalContext);

  // # states
  const [selectedResourceObj, setSelectedResourcesObj] = useState({ text: '' });
  const [selectedResourceNum, setSelectedResourceNum] = useState(1);

  const [remainingNumber, setRemainingNumber] = useState(null)

  // - methods
  /**
   * @author odin
   * @param {object} optionObj -- 選擇的 option object
   * @description 根據 目前選擇的叢集物件 | 資源型別 | 可使用得子資源詳細列表 計算出目前可使用的資源數量，進一步控制選擇資源分配的數量上限，以及 "選擇資源" 最後面可分配資源的數量顯示
  */
  const handleRemainingNumber = (cellName) => {
    const limitedNum = thisVgLimitedResourceObj[cellName]

    // 依照型號字串取得剩餘的可用資源數量
    const reamingNumber = filteredResourceObj[cellName]

    const maxSelectableNum =
          // limitedNum 拿回來的數值有可能是 -1(無限制)，所以要判斷掉
          (limitedNum === -1)
            ? reamingNumber
            : Math.min(limitedNum, reamingNumber)

    // 設定可使用的資源數量
    setRemainingNumber(maxSelectableNum)
  }

  // * hooks
  /**
   * @author odin
   * @description 從外面送進來的資源以及資源數量，把值帶入目前的 State 中(只會執行一次)
  */
  useEffect(() => {
    let resourceName = '';
    let matchOptionObj = null;
    const { vg, skuType, sku, skuNum } = resourceValue;

    if(
      !isNil(vg) &&
      !isNil(skuType) &&
      !isNil(sku)
    ) {
      resourceName = `${vg}.${skuType}.${sku}`
      matchOptionObj = resOptions.find(item => item.resourceName === resourceName)

      if(!isNil(matchOptionObj)) setSelectedResourcesObj(matchOptionObj)
      if(isNumber(skuNum)) setSelectedResourceNum(skuNum)
    } else {
      setSelectedResourcesObj({ text: '' })
      setSelectedResourceNum(1)
    }
  }, [resourceValue])

  /**
   * @author odin
   * @description 當選擇資源的時候，同步處理剩餘的數量
  */
  useEffect(() => {
    if(
      selectedResourceObj.text !== '' &&
      !isEmpty(selectedResourceObj)
    ) {
      const cellName = selectedResourceObj.resourceName
      handleRemainingNumber(cellName)
    }
  }, [
    selectedResourceObj,
    selectedResourceNum
  ])

  /**
   * @author odin
   * @description 選擇資源的項目改動的時候就更新 對應資料的內容
  */
  useEffect(() => {
    if(!isEmpty(selectedResourceObj) && !isEmpty(selectedResourceObj.hivedScheduler) && !isEmpty(selectedResourceObj.resource)) {
      const { resource, hivedScheduler } = selectedResourceObj
      const { vg, sku, skuType } = hivedScheduler
      const { cpu, gpu, memory } = resource
      const value = {
        vg, // 1st
        skuType, // 2nd
        sku, // 3rd
        skuNum: selectedResourceNum
      }

      if(activeStep === 0) {
        // console.log('資源', value)
        // 預約資源排程
        onChange(value)
      } else {
        // console.log('作業', value)
        // 預約作業排程
        onChangeMulti({
          hivedScheduler: value,
          containerSize: {
            cpu,
            gpu,
            memoryMB: memory
          }
        })
      }
    }

  }, [selectedResourceObj, selectedResourceNum])

  return (
    <div className={`${classes.stepRowAverage} ${classNameObj?.container}`}>

      {/* 選擇資源名稱 */}
      <div className={`${classes.stepWidth_30} ${classNameObj?.resource}`}>
        <FormControl
          className={`${classes.unlimitWidthSelect}`}
          error={isEmpty(selectedResourceObj)}
          fullWidth
        >
          <InputLabel id="select-resource-select">
            {`${t('Select')}${t('enSpace')}${t('resource')}`}
          </InputLabel>
          <Select
            id="demo-simple-select"
            inputProps={{
              name: 'select-resource-select',
              id: 'select-resource-select'
            }}
            label={`${t('Select')}${t('enSpace')}${t('resource')}`}
            onChange={(e, child) => {
              const text = e.target.value
              const thisOptionObj = resOptions.find(item => item.text === text)

              // 設定選擇的內容
              setSelectedResourcesObj(thisOptionObj)
            }}
            value={selectedResourceObj.text}
            variant="outlined"
          >
            {resOptions.map((item) => {
              return (
                <MenuItem
                  key={item.key}
                  value={item.text}
                >
                  {item.text}
                </MenuItem>
              )
            })}
          </Select>
          {
            resOptions.length === 0
              ? <FormHelperText className={`${classes.textRed}`}>{t('noResourceCanBeChoosenWithLimitedTime')}</FormHelperText>
              : isEmpty(selectedResourceObj) && <FormHelperText className={`${classes.textRed}`}>{t('fieldRequired')}</FormHelperText>
          }
        </FormControl>
      </div>

      {/* 限制的數量 */}
      <div className={`${classes.stepWidth_30} ${classNameObj?.number}`}>
        <DebounceRestrictRangeNumberInput
          classNameProps={`${classes.unlimitWidthInput}`}
          max={remainingNumber}
          min={1}
          onChange={(value) => {
            setSelectedResourceNum(value)
          }}
          textInputProps={{
            variant: 'outlined',
            disabled: isNull(remainingNumber)
          }}
          value={selectedResourceNum}
        />
      </div>

      {/* 剩餘可以選擇的資源數量 */}
      {
        isShowRemain &&
        <div className={`${classes.stepWidth_30} ${classes.flex_align_center} ${classNameObj?.remain}`}>
          {
          // 是否要顯示可以選擇的最大數量
            !isNull(remainingNumber) ? `/ ${remainingNumber}` : ''
          }
        </div>
      }
    </div>
  );
};

export default SelectResource;

SelectResource.propTypes = {
  dataId: PropTypes.number,
  resourceValue: PropTypes.object.isRequired,
  activeStep: PropTypes.number.isRequired,
  selectedVgObj: PropTypes.object,
  resOptions: PropTypes.array.isRequired,
  classNameObj: PropTypes.object,
  onChange: PropTypes.func,
  onChangeMulti: PropTypes.func,
  thisVgLimitedResourceObj: PropTypes.object,
  isShowRemain: PropTypes.bool
};
