import React, {
  useState,
  useEffect,
  useContext,
  useMemo
} from 'react';

// ? context
import Context from './context'

// ^ Material-ui Componets(Functions)
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// ? Self-packed Components || Functions
import { BasicSection } from './basic-section';
import { DebounceRestrictRangeNumberInput } from 'components/Debounce/DebounceRestrictRangeNumberInput'

import {
  getCanUseResourceNumber
} from 'common/commonMethods';

import { formatBytes } from 'utils';
import { MB } from 'constant';

// ^ Plugins
import { isEmpty, isNumber } from 'lodash';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export const SelectSkuResource = ({ onChange, hivedScheduler }) => {

  // $ init data
  const { t } = useTranslation();
  const isTablet = useMediaQuery('(max-width: 1280px)');
  const optionsGrid = isTablet ? {} : { xs: 9, sm: 9, md: 9, lg: 9, xl: 9 }

  // ? context
  const {
    hivedSkuTypes,
    hivedResourceUnits,
    classes,
    vgInfos,
    jobInformation,
    selfLimitResourceObj,
    setIsResourceRemain
  } = useContext(Context);

  // & handled data
  // ! 已經選擇的叢集名稱，但一開始可能是空的
  const selectedVgName = jobInformation?.virtualCluster

  // # states
  const [selectedKey, setSelectedKey] = useState([]);
  const [selectedResources, setSelectedResources] = useState({});
  const [selectedResourcesString, setSelectedResourcesString] = useState('');
  const [selectedType, setSelectedType] = useState([]);
  const [selectedSku, setSelectedSku] = useState([]);
  const [selectedVg, setSelectedVg] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState(1);

  const [remainingNumber, setRemainingNumber] = useState(null)

  // - methods
  /**
   * @author odin
   * @param {string} key -- 該 option 的 顯示的文字內容
   * @param {object} selfLimitResourceObj -- 用戶限制列表
   * @description 根據 目前選擇的叢集名稱 | 資源型別 | 可使用得子資源詳細列表 計算出目前可使用的資源數量，進一步控制選擇資源分配的數量上限，以及 "選擇資源" 最後面可分配資源的數量顯示
   * @return {number} 剩餘的資源數量
  */
  const handleRemaingNumber = (key, selfLimitResourceObj) => {
    // 依照型號字串取得剩餘的可用資源數量
    let resourceLimitNum = 0;
    const canUseResourceNumber = getCanUseResourceNumber(key, selectedVgName, vgInfos)
    if (selfLimitResourceObj && !isEmpty(selfLimitResourceObj)) {
      const { resourceCells } = selfLimitResourceObj[selectedVgName];
      resourceLimitNum = resourceCells[key];
    }
    const remainNum = (resourceLimitNum === -1) // -1 is no limit resource
      ? canUseResourceNumber
      : (canUseResourceNumber > resourceLimitNum) ? resourceLimitNum : canUseResourceNumber

    // 設定可使用的資源數量
    setRemainingNumber(remainNum)

    // 判斷是否有剩餘數量
    if(remainNum <= 0) {
      setIsResourceRemain(false)
    } else if(remainNum > 0) {
      setIsResourceRemain(true)
    }
  }

  // * hook
  /**
   * @author odin
   * @description 產出可以用的 "選擇資源" 的 option
  */
  const skuOptions = useMemo(
    () =>
      hivedSkuTypes.reduce((options, hivedSku) => {
        if (isEmpty(hivedResourceUnits)) return [];
        const { gpu, cpu, memory } = hivedResourceUnits[hivedSku.resourceUnit];
        const [ vg, pinnedOrVirtual, type ] = hivedSku.sku.split('.');
        const sku = pinnedOrVirtual === 'pinned' ? 'pinnedCellId' : 'skuType';

        return [
          ...options,
          {
            key: hivedSku.sku,
            sku,
            vg,
            resource: hivedResourceUnits[hivedSku.resourceUnit],
            type,
            text: `${hivedSku.name} (${gpu !== null ? gpu : 0} GPU, ${cpu} CPU, ${formatBytes(memory * MB)} ${t('Memory')})`,
            customKey: hivedSku.sku
          }
        ];
      }, []),
    [hivedSkuTypes, hivedResourceUnits],
  );

  useEffect(() => {
    if (!isEmpty(selectedResources)) {
      const { cpu, gpu, memory } = selectedResources;
      onChange({
        containerSize: {
          cpu: Number(selectedUnits) >= 1 ? cpu * Number(selectedUnits) : 0,
          gpu: Number(selectedUnits) >= 1 ? gpu * Number(selectedUnits) : 0,
          memoryMB: Number(selectedUnits) >= 1 ? memory * Number(selectedUnits) : 0
        },
        hivedScheduler: {
          skuNum: Number(selectedUnits) >= 1 ? Number(selectedUnits) : 0,
          skuType: selectedType,
          sku: selectedSku,
          vg: selectedVg
        }
      })
    }
  }, [selectedResources, selectedUnits, selectedType, selectedSku, selectedVg])

  useEffect(() => {
    const { skuType, skuNum } = hivedScheduler;
    const optionObj = skuOptions.find(item => item.type === skuType)
    if (optionObj) {
      setSelectedKey(optionObj.text)
      setSelectedType(optionObj.type)
      setSelectedSku(optionObj.sku)
      setSelectedVg(optionObj.vg)
      setSelectedResources(optionObj.resource)
      // 處理剩餘數量的資源
      handleRemaingNumber(optionObj.customKey, selfLimitResourceObj)
    }

    if (skuType === null || !optionObj) {
      setSelectedResources({})
      setSelectedKey([])
    }

    setSelectedUnits(skuNum >= 1 ? skuNum : 0)

  }, [hivedScheduler, skuOptions, selfLimitResourceObj])

  useEffect(() => {
    if (
      !isEmpty(selectedResources) &&
      isNumber(selectedUnits) &&
      selectedUnits > 0
    ) {
      const str = `${selectedResources.gpu * selectedUnits} GPU, ${selectedResources.cpu * selectedUnits} CPU, ${formatBytes(selectedResources.memory * MB * selectedUnits)} ${t('Memory')}`

      setSelectedResourcesString(str)
    } else {
      setSelectedResourcesString('')
    }
  }, [selectedResources, selectedUnits])

  return (
    <BasicSection
      // sectionTooltip={PROTOCOL_TOOLTIPS.hivedSkuType}
      classNameObj={{
        container: `${classes.pt_20} ${classes.pb_24}`
      }}
      containerItem
      customChildren
      sectionLabel={`${t('Select')}${t('enSpace')}${t('resource')}`}
      titleGrid={isTablet ? 12 : 3}
      titleOptions={isTablet ? { justify: 'flex-start' } : { justify: 'flex-end', alignItems: 'center' }}
    >
      <Grid
        container
        item
        {...optionsGrid}
        lg={isTablet ? 12 : 9}
        md={isTablet ? 12 : 9}
        sm={isTablet ? 12 : 9}
        spacing={3}
        xl={isTablet ? 12 : 9}
        xs={isTablet ? 12 : 9}
      >
        <Grid
          className={`${classes.selectResourceFirstInput}`}
          item
          lg={isTablet ? 5 : 4}
          md={isTablet ? 5 : 4}
          sm={isTablet ? 5 : 4}
          xl={isTablet ? 5 : 4}
          xs={isTablet ? 5 : 4}
        >
          <FormControl
            className={`${classes.defaultTextField} ${classes.unlimitWidthSelect}`}
            error={isEmpty(selectedResources)}
            fullWidth
          >
            <Select
              classes={{ root: classes.select }}
              onChange={(e, child) => {
                const { vg, type, sku, resource, customKey } = child.props;
                const value = e.target.value;

                // 設定選擇的內容
                setSelectedKey(value)
                setSelectedVg(vg)
                setSelectedType(type)
                setSelectedSku(sku)
                setSelectedResources(resource)

                // 處理剩餘數量的資源
                handleRemaingNumber(customKey, selfLimitResourceObj)
              }}
              value={selectedKey}
              variant="outlined"
            >
              {skuOptions.map((item) => {
                return (
                  <MenuItem
                    key={item.key}
                    value={item.text}
                    {...item}
                  >
                    {item.text}
                  </MenuItem>
                )
              })}
            </Select>
            {isEmpty(selectedResources) && <FormHelperText>{t('fieldRequired')}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid
          item
          lg={isTablet ? 5 : 4}
          md={isTablet ? 5 : 4}
          sm={isTablet ? 5 : 4}
          xl={isTablet ? 5 : 4}
          xs={isTablet ? 5 : 4}
        >
          <FormControl
            className={`${classes.unlimitWidthInput}`}
            fullWidth
          >
            {/* 有限制範圍的 Number Input */}
            <DebounceRestrictRangeNumberInput
              max={remainingNumber}
              min={1}
              onChange={(value) => {
                setSelectedUnits(value)
              }}
              textInputProps={{
                variant: 'outlined',
                disabled: (remainingNumber === null || remainingNumber === 0)
              }}
              value={selectedUnits}
            />
          </FormControl>
        </Grid>
        {
          remainingNumber !== null && (
            <Grid
              item
              lg={isTablet ? 2 : 4}
              md={isTablet ? 2 : 4}
              sm={isTablet ? 2 : 4}
              style={{
                flexDirection: isTablet ? 'column' : 'row',
                padding: isTablet && 0
              }}
              xl={isTablet ? 2 : 4}
              xs={isTablet ? 2 : 4}
            >
              <div className={`${classes.remainingNumber}`}> / {remainingNumber}</div>
            </Grid>
          )
        }
      </Grid>

      {/* 顯示目前已選取的資源狀態 */}
      {
        selectedResourcesString && (
          <div className={`${classes.resourcesWidthCtrl}`}>
            {selectedResourcesString}
          </div>
        )
      }
    </BasicSection>
  );
};

SelectSkuResource.propTypes = {
  hivedScheduler: PropTypes.object.isRequired,
  onChange: PropTypes.func
};
