import React, {
  useState,
  useEffect,
  useContext,
  useMemo
} from 'react';

// ? context
import Context from '../../Context';

// ^ Material-ui Componets(Functions)
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import FormLabel from '@material-ui/core/FormLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';

// ? Self-packed Components || Functions
import { DebounceRestrictRangeNumberInput } from 'components/Debounce/DebounceRestrictRangeNumberInput';
import { formatBytes } from 'utils';
import { MB } from 'constant';

import {
  getCanUseResourceNumber
} from 'common/commonMethods';


// ^ Plugins
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export const SelectSkuResource = ({ onChange, hivedScheduler }) => {

  // $ init data
  const { t } = useTranslation();
  const isTablet = useMediaQuery('(max-width: 1280px)');
  // const optionsGrid = isTablet ? {} : { xs: 9, sm: 9, md: 9, lg: 9, xl: 9 }

  // ? context
  const {
    hivedSkuTypes,
    resourceUnitObject,
    classes,
    vgInfos,
    jobInformation
  } = useContext(Context);

  // & handled data
  // ! 已經選擇的叢集名稱，但一開始可能是空的
  const selectedVgName = jobInformation?.virtualCluster

  // # states
  const [selectedKey, setSelectedKey] = useState([]);
  const [selectedResources, setSelectedResources] = useState({});
  const [selectedType, setSelectedType] = useState([]);
  const [selectedSku, setSelectedSku] = useState([]);
  const [selectedVg, setSelectedVg] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState(1);

  const [isDisabledRemainning, setIsDisabledRemainning] = useState(true)
  const [remainingNumber, setRemainingNumber] = useState(0)


  // - methods
  /**
   * @author odin
   * @param {string} text -- 該 option 的 key
   * @description 根據 目前選擇的叢集名稱 | 資源型別 | 可使用得子資源詳細列表 計算出目前可使用的資源數量，進一步控制選擇資源分配的數量上限，以及 "選擇資源" 最後面可分配資源的數量顯示
   * @return {number} 剩餘的資源數量
  */
  const handleRemaingNumber = (key) => {
    // 依照型號字串取得剩餘的可用資源數量
    const canUseResourceNumber = getCanUseResourceNumber(key, selectedVgName, vgInfos)

    // 設定可使用的資源數量
    setRemainingNumber(canUseResourceNumber)
  }

  /**
   * @author odin
   * @description 依據剩餘的資源數量來判斷是否要 disabled 選擇資源數量的 input
  */
  useEffect(() => {
    if(remainingNumber === 0) {
      setIsDisabledRemainning(true)
    } else {
      setIsDisabledRemainning(false)
    }
  }, [remainingNumber])

  /**
   * @author odin
   * @description 產出可以用的 "選擇資源" 的 option
  */
  const skuOptions = useMemo(
    () =>
      hivedSkuTypes.reduce((options, hivedSku) => {
        if (isEmpty(resourceUnitObject)) return [];
        const { gpu, cpu, memory } = resourceUnitObject[hivedSku.resourceUnit];
        const [ vg, pinnedOrVirtual, type ] = hivedSku.sku.split('.');
        const sku = pinnedOrVirtual === 'pinned' ? 'pinnedCellId' : 'skuType';

        return [
          ...options,
          {
            key: hivedSku.sku,
            sku,
            vg,
            resource: resourceUnitObject[hivedSku.resourceUnit],
            type,
            text: `${hivedSku.name} (${gpu !== null ? gpu : 0} GPU, ${cpu} CPU, ${formatBytes(memory * MB)} ${t('Memory')})`,
            customKey: hivedSku.sku
          }
        ];
      }, []),
    [hivedSkuTypes, resourceUnitObject],
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
      handleRemaingNumber(optionObj.customKey)
    } else {
      setSelectedKey([])
      setSelectedType([])
      setSelectedSku([])
      setSelectedVg([])

      setSelectedResources({})

      setRemainingNumber(0)
    }

    if (skuNum >= 1) {
      setSelectedUnits(skuNum)
    } else {
      setSelectedUnits(1)
    }
  }, [hivedScheduler])

  return (
    <Grid
      container
      item
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <Grid
        alignItems={'center'}
        container
        item
        justify={'flex-end'}
        lg={3}
        md={3}
        sm={3}
        style={{ marginRight: 10 }}
        xl={3}
        xs={3}
      >
        <FormLabel className={classes.formLabel}>{`${t('Select')}${t('enSpace')}${t('resource')}`}</FormLabel>
      </Grid>
      <Grid
        container
        item
        lg={9}
        md={9}
        sm={9}
        spacing={3}
        xl={9}
        xs={9}
      >
        <Grid
          item
          lg={isTablet ? 6 : 4}
          md={isTablet ? 6 : 4}
          sm={isTablet ? 6 : 4}
          xl={isTablet ? 6 : 4}
          xs={isTablet ? 6 : 4}
        >
          <FormControl
            error={isEmpty(selectedResources)}
            style={{ width: '100%' }}
          >
            <Select
              input={<OutlinedInput margin="dense" />}
              onChange={(e, child) => {
                const { vg, type, sku, resource, customKey } = child.props;
                const value = e.target.value

                // 設定選擇的內容
                setSelectedKey(value)
                setSelectedType(type)
                setSelectedSku(sku)
                setSelectedVg(vg)
                setSelectedResources(resource)

                // 處理剩餘數量的資源
                handleRemaingNumber(customKey)
              }}
              value={selectedKey}
              variant="outlined"
            >
              {skuOptions.map((item) => {
                return (
                  <MenuItem
                    key={item.text}
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
          lg={isTablet ? 6 : 4}
          md={isTablet ? 6 : 4}
          sm={isTablet ? 6 : 4}
          xl={isTablet ? 6 : 4}
          xs={isTablet ? 6 : 4}
        >
          {/* 有限制範圍的 Number Input */}
          <DebounceRestrictRangeNumberInput
            classNameProps={classes.debounceRestrictRangeFieldInput}
            max={remainingNumber}
            min={1}
            onChange={(value) => {
              setSelectedUnits(value)
            }}
            textInputProps={{
              variant: 'outlined',
              disabled: isDisabledRemainning
            }}
            value={selectedUnits}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

SelectSkuResource.propTypes = {
  hivedScheduler: PropTypes.object.isRequired,
  onChange: PropTypes.func
};

export default SelectSkuResource;
