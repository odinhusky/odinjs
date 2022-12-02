import React, {
  memo,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useRef
} from 'react';

// ^ Material-ui Components(Functions)
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

// ? Self-packed Components || Functions
import { DebounceRestrictRangeNumberInput } from 'components/Debounce/DebounceRestrictRangeNumberInput';
import { maxSafeNumber } from 'common/commonConstant';
import { BaseTooltip } from 'components/BaseTooltip';

// ? styles
import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles'

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme),
  remainNumber: {
    width: '100%',
    position: 'absolute',
    right: 'calc(-100% - 30px)',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 4,
    fontSize: 16
  }
}));

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  isEqual,
  isFunction,
  isNil,
  isNumber
} from 'lodash';

/**
 * @author odin
 * @level any/BaseResource
 * @param {object} classNameObj -- 客製化樣式的物件
 * @param {object} maxObj -- 各個資源最大上限的數量，通常就是 remainObj ，沒有帶入的話 <DebounceRestrictRangeNumberInput> 內部有設定預設值為 9007199254740991
 * @param {object} minObj -- 各個資源至少的數量，沒有帶入的話 <DebounceRestrictRangeNumberInput> 內部有設定預設值為 1
 * @param {object} remainObj -- 各個資源單位的可用最大數量，等同於最大值
 * @param {object} limitObj -- 其他條件的限制因素(不一定會有)
 * @param {object} value -- 一開始要顯示的 CPU GPU Memory 數量
 * @param {function} handleUpdate -- 如果有必要，可以透過這個function的接口來同步更新父層的資料
 * @param {object} errorStatusObj -- 錯誤的
 * @param {boolean} canSplitGPU -- 是否能夠分割 GPU的懷敬
 * @param {boolean} hasGPUMemoryPercentageLimit -- gpuMemoryPercentage 是否要有100的上限機制
 * @param {boolean} isInFinite -- 是否為無限資源，如果是，則不需要限制上限，且不顯示剩餘資源
 * @component BaseResource
 * @description 選擇資源的基本component
*/
export const BaseResource = memo(forwardRef(({
  classNameObj,
  maxObj,
  minObj,
  remainObj,
  limitObj,
  value,
  handleUpdate,
  errorStatusObj,
  canSplitGPU,
  hasGPUMemoryPercentageLimit = true,
  isInFinite = false
}, ref) => {

  // $ init data
  const { t } = useTranslation();
  // init: 還沒傳入真正的 props | start: 傳入正確的 props，可以進行初始化 | end: 不要再更新 props 的內容
  const firstRendered = useRef('init');

  // gpuMemoryPercentage 的上限值，根據 hasGPUMemoryPercentageLimit 會有所不同。
  const gpuMemoryPercentageMax = hasGPUMemoryPercentageLimit ? 100 : maxObj?.gpuMemoryPercentage ?? maxSafeNumber;

  // = styles
  const classes = useStyles();

  // # states
  const [CPUNum, setCPUNum] = useState(0);
  const [GPUNum, setGPUNum] = useState(0);
  const [GPUMemoryPercentage, setGPUMemoryPercentage] = useState(100);
  const [memoryNum, setMemoryNum] = useState(0);

  // * hooks
  /**
   * @author odin
   * @description 提供對外 ref 可以操作的內部方法
  */
  useImperativeHandle(ref, () => ({
    getCPU: () => CPUNum,
    getGPU: () => GPUNum,
    getGPUMemoryPercentage: () => GPUMemoryPercentage,
    getMemory: () => memoryNum,

    getCPURemainNum: () => remainObj?.cpu ?? 0,
    getGPURemainNum: () => remainObj?.gpu ?? 0,
    getMemoryRemainNum: () => remainObj?.memoryMB ?? 0,

    setCPU: (num) => setCPUNum(() => isInFinite ? num : Math.min(num, (maxObj?.cpu ?? maxSafeNumber))),
    setGPU: (num) => setGPUNum(() => isInFinite ? num : Math.min(num, (maxObj?.gpu ?? maxSafeNumber))),
    setGPUMemoryPercentage: (num) => setGPUMemoryPercentage(() => {
      // 不在 taskRole 裡面的 gpuMemoryPercentage 就不受到 100% 的概念影響，所以同樣必須取用 maxObj 中的上限值當作參考
      const result = canSplitGPU ? parseInt(Math.min(gpuMemoryPercentageMax, (Math.max(num, 0)))) : gpuMemoryPercentageMax;

      return result;
    }),
    setMemory: (num) => setMemoryNum(() => isInFinite ? num : Math.min(num, (maxObj?.memoryMB ?? maxSafeNumber)))
  }));

  /**
   * @author odin
   * @description 只填入第一次的值: 如果 k8sResource 的跟預設的值不一樣的話，才填入預設的值，代表是編輯模式下要從外界帶入的值
   * - firstRendered.current => init: 還沒傳入真正的 props | start: 傳入正確的 props，可以進行 local states 的更新 | end: 不要再更新 local states 的內容
  */
  useEffect(() => {
    if(firstRendered.current === 'end') return;

    if(firstRendered.current === 'init') {
      firstRendered.current = 'start';
      return;
    }

    const defaultRemainObj = { cpu: 0, gpu: 0, memoryMB: 0 };
    const defaultMaxObj = { cpu: maxSafeNumber, gpu: maxSafeNumber, memoryMB: maxSafeNumber };

    // 檢查 maxObj 的狀態是否適合更新
    // 1. remainObj 不為預設值
    // 2. maxObj 不為預設值
    // 3. maxObj 的內容完全相等於 remainObj
    // 4. maxObj 不為 null 或是 undefined
    // 5. maxObj 中的 cpu gpu memoryMB 不得全部為 0(不然也沒有進行第一次更新的必要性)
    const isValidMaxObj = (
      !isEqual(defaultRemainObj, remainObj) &&
      !isEqual(defaultMaxObj, maxObj) &&
      isEqual(maxObj, remainObj) &&
      !isNil(maxObj) &&
      ((maxObj.cpu + maxObj.gpu + maxObj.memoryMB) !== 0)
    );

    const cpu = Math.min((value?.cpu ?? 0), maxObj.cpu);
    const gpu = Math.min((value?.gpu ?? 0), maxObj.gpu);
    const memoryMB = Math.min((value?.memoryMB ?? 0), maxObj?.memoryMB ?? 999);
    const total = cpu + gpu + memoryMB;

    const gpuMemoryPercentage = canSplitGPU ? value?.gpuMemoryPercentage ?? gpuMemoryPercentageMax : gpuMemoryPercentageMax;

    if(firstRendered.current === 'start' && isValidMaxObj) {

      // 更新傳進來的第一次的值
      if(total !== 0) {
        setCPUNum(cpu);
        setGPUNum(gpu);
        setMemoryNum(memoryMB);
      }

      // 更新 GPU 分配律
      setGPUMemoryPercentage(gpuMemoryPercentage)

      firstRendered.current = 'end';
    }
  }, [value, maxObj, remainObj]);

  /**
   * @author odin
   * @description 更新外部的值: 各個值變動的時候，就更新外部 taskRole 的 k8sResource 值
  */
  if(isFunction(handleUpdate)) {
    useEffect(() => {
      if(CPUNum + GPUNum + memoryNum <= 0 && GPUMemoryPercentage === 100) return;

      // 當 canSplitGPU === true 的時候才可以設定 GPU 分配律，不然預設都是 100%
      const gpuMemoryPercentage = canSplitGPU ? GPUMemoryPercentage : gpuMemoryPercentageMax;

      handleUpdate({
        cpu: CPUNum,
        gpu: GPUNum,
        gpuMemoryPercentage,
        memoryMB: memoryNum
      })
    }, [CPUNum, GPUNum, memoryNum, GPUMemoryPercentage]);
  }

  return (
    <>
      {/* CPU */}
      <div className={`${classes.w_full} ${classes.mb_20} ${classes.pos_rel} ${classes.unlimitWidthInput} ${classNameObj?.cpuContainer}`}>
        <DebounceRestrictRangeNumberInput
          max={isInFinite ? maxSafeNumber : limitObj?.cpu || maxObj?.cpu}
          min={minObj?.cpu ?? 0}
          onChange={(value) => {
            setCPUNum(value);
          }}
          textInputProps={{
            variant: 'outlined',
            label: 'CPU',
            className: `${classes.w_full} ${classNameObj?.cpuInput}`,
            error: !isNil(errorStatusObj) && (errorStatusObj?.cpu),
            helperText: !isNil(errorStatusObj) && (errorStatusObj?.cpu) ? `CPU${t('enSpace')}${t('overLimit')}` : '',
            disabled: isInFinite ? false : !remainObj?.cpu
          }}
          value={CPUNum}
        />

        {
          !isInFinite && (
            <div
              className={`
                ${classes.remainNumber}
                ${classes.cpuRemainingNumber}
                ${(!isNil(errorStatusObj) && (errorStatusObj?.cpu)) && classes.textRed}
              `}
            >{`/ ${remainObj?.cpu ?? 0}`}</div>
          )
        }
      </div>

      {/* GPU */}
      <div className={`${classes.w_full} ${classes.mb_20} ${classes.pos_rel} ${classes.unlimitWidthInput} ${classNameObj?.gpuContainer}`}>
        <DebounceRestrictRangeNumberInput
          max={isInFinite ? maxSafeNumber : limitObj?.gpu || maxObj?.gpu}
          min={minObj?.gpu ?? 0}
          onChange={(value) => {
            setGPUNum(value);
          }}
          textInputProps={{
            variant: 'outlined',
            label: `GPU (${t('Chip')})`,
            className: `${classes.w_full} ${classNameObj?.gpuInput}`,
            error: !isNil(errorStatusObj) && (errorStatusObj?.gpu),
            helperText:   !isNil(errorStatusObj) && (errorStatusObj?.gpu) ? `GPU${t('enSpace')}${t('overLimit')}` : '',
            disabled: isInFinite ? false : !remainObj?.gpu
          }}
          value={GPUNum}
        />

        {/* <div
          className={`
            ${classes.remainNumber}
            ${classes.gpuRemainingNumber}
            ${(!isNil(errorStatusObj) && (errorStatusObj?.gpu)) && classes.textRed}
          `}
        >{`/ ${remainObj?.gpu ?? 0}`}</div> */}

        {
          !isInFinite && (
            <div
              className={`
                ${classes.remainNumber}
                ${classes.gpuRemainingNumber}
                ${(!isNil(errorStatusObj) && (errorStatusObj?.gpu)) && classes.textRed}
              `}
            >
              {`${isNumber(limitObj?.gpu)
                ? `/ ${limitObj?.gpu} ( / ${remainObj?.gpu ?? 0}`
                : `/ ${remainObj?.gpu ?? 0}`}
          `}
              {
                // 提示的 icon
                isNumber(limitObj?.gpu) ? (
                  <BaseTooltip
                    arrow
                    className={`${classes.ml_10}`}
                    title={`${t('gpuTotalDescription')}`}
                  >
                    <InfoOutlinedIcon classes={{ root: classes.iconButton }} />
                  </BaseTooltip>
                ) : null
              }
              {/* 這個括號不是多的不要刪掉 */}
              { isNumber(limitObj?.gpu) && ')' }
            </div>
          )
        }
      </div>

      {/* GPU Percentage */}
      <div className={`${classes.w_full} ${classes.mb_20} ${classes.pos_rel} ${classes.unlimitWidthInput} ${classNameObj?.gpuContainer}`}>
        <DebounceRestrictRangeNumberInput
          max={
            hasGPUMemoryPercentageLimit
              ? 100
              : (limitObj?.gpuMemoryPercentage || maxObj?.gpuMemoryPercentage)
          }
          min={0}
          onChange={(value) => {
            setGPUMemoryPercentage(value);
          }}
          textInputProps={{
            variant: 'outlined',
            label: `${t('GPU Percentage')}${hasGPUMemoryPercentageLimit ? ` (${t('eachChip')})` : ''}`,
            className: `${classes.w_full} ${classNameObj?.gpuMemoryPercentageInput}`,
            error: !isNil(errorStatusObj) && (errorStatusObj?.gpuMemoryPercentage),
            helperText: !isNil(errorStatusObj) && (errorStatusObj?.gpuMemoryPercentage) ? `${t('GPU Percentage')}${t('enSpace')}${t('overLimit')}` : '',
            disabled: isInFinite ? false : (!remainObj?.gpu || !canSplitGPU)
          }}
          value={GPUMemoryPercentage}
        />

        <div
          className={`
                ${classes.remainNumber}
                ${classes.memoryRemainingNumber}
                ${(!isNil(errorStatusObj) && (errorStatusObj?.memoryMB)) && classes.textRed}
              `}
        >
          {`/ ${
            isInFinite
              ? '100'
              : hasGPUMemoryPercentageLimit
                ? `100 ( / ${remainObj?.gpuMemoryPercentage ?? 100}`
                : `${remainObj?.gpuMemoryPercentage ?? 100}`
          }`}
          {
            // 提示的 icon
            (hasGPUMemoryPercentageLimit && isInFinite === false) ? (
              <BaseTooltip
                arrow
                className={`${classes.ml_10}`}
                title={`${t('gpuMemoryPercentageDescription')}`}
              >
                <InfoOutlinedIcon classes={{ root: classes.iconButton }} />
              </BaseTooltip>
            ) : null
          }
          {/* 這個括號不是多的不要刪掉 */}
          { (hasGPUMemoryPercentageLimit && isInFinite === false) && ')' }
        </div>
      </div>

      {/* 記憶體 */}
      <div className={`${classes.w_full} ${classes.unlimitWidthInput} ${classes.pos_rel} ${classNameObj?.memoryContainer}`}>
        <DebounceRestrictRangeNumberInput
          max={isInFinite ? maxSafeNumber : limitObj?.memoryMB || maxObj?.memoryMB}
          min={minObj?.memoryMB ?? 0}
          onChange={(value) => {
            setMemoryNum(value);
          }}
          textInputProps={{
            variant: 'outlined',
            label: `${t('memory')}(MB)`,
            className: `${classes.w_full} ${classNameObj?.memoryInput}`,
            error: !isNil(errorStatusObj) && (errorStatusObj?.memoryMB),
            helperText: !isNil(errorStatusObj) && (errorStatusObj?.memoryMB) ? `${t('memory')}${t('enSpace')}${t('overLimit')}` : '',
            disabled: isInFinite ? false : !remainObj?.memoryMB
          }}
          value={memoryNum}
        />
        {
          !isInFinite && (
            <div
              className={`
                ${classes.remainNumber}
                ${classes.memoryRemainingNumber}
                ${(!isNil(errorStatusObj) && (errorStatusObj?.memoryMB)) && classes.textRed}
              `}
            >{`/ ${remainObj?.memoryMB ?? 0}`}</div>
          )
        }
      </div>
    </>
  );
}), (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps);
})

BaseResource.propTypes = {
  classNameObj: PropTypes.object,
  maxObj: PropTypes.object,
  minObj: PropTypes.object,
  remainObj: PropTypes.object,
  limitObj: PropTypes.object,
  value: PropTypes.object,
  handleUpdate: PropTypes.func,
  errorStatusObj: PropTypes.object,
  canSplitGPU: PropTypes.bool,
  hasGPUMemoryPercentageLimit: PropTypes.bool,
  isInFinite: PropTypes.bool
};

export default BaseResource;
