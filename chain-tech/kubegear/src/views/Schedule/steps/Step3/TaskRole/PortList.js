import React, {
  useState,
  // useEffect,
  useContext,
  useCallback,
  useMemo
} from 'react';

// % context
import ScheduleContext from '../../../ScheduleContext';

// ^ Material-ui Componets(Functions)
import Icon from '@material-ui/core/Icon';

// ? Self-packed Components || Functions
import { DebouncedTextField } from './DebouncedTextField';
import { DefaultButton, IconButton } from 'components/BaseButton';
import { DebounceRestrictRangeNumberInput } from 'components/Debounce/DebounceRestrictRangeNumberInput';
// import { countRestrictRange } from 'common/commonMethods'

// ^ Plugins
import PropTypes from 'prop-types';
import { isEmpty, isNil } from 'lodash';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/Schedule/CreateSchedule/Step3/TaskRole/Content/PortList
 * @component PortList
 * @prop {string} name -- 用於錯誤顯示的字串
 * @prop {array} value -- 在 Step2 將原本為物件的端口資料轉換為陣列使用
 * @prop {function} onChange -- 修改當前 taskRole ports 屬性的 value 的 setState
 * @prop {string} keyName -- key Input 的 label
 * @prop {string} keyField -- 要取得或是寫入原始物件資料中的 key 字串
 * @prop {string} valueName -- value Input 的 label
 * @prop {string} valueField -- 要取得或是寫入原始物件資料中的 value 的 key字串
 * {
 *  key: xxx,
 *  value: xxx
 * }
 * @prop {string} onValidateKey -- 驗證 key 的正則
 * @prop {function} onValidateValue -- 驗證 key 的函式
 * @prop {function} onValidateKey -- 驗證 key 字串的函式
 * @prop {function} setErrorMessage -- 紀錄錯誤訊息的函式
 * @description PortList 的區塊
*/
export const PortList = ({
  name,
  value,
  onChange,
  keyName,
  keyField,
  valueName,
  valueField,
  onValidateKey,
  onValidateValue,
  setErrorMessage
}) => {

  // $ init data
  const { t } = useTranslation();
  const rules = {
    keyFormat: (key) => {
      const keyValidation = RegExp(/^[a-zA-Z_]+[a-zA-Z0-9_]*$/, 'g');
      return keyValidation.test(key) ? '' : t('userNameInvalid');
    }
  }

  // = styles
  const { classes } = useContext(ScheduleContext);

  // # states
  const [dupList, setDupList] = useState([]);
  const [keyFormatError, setKeyFormatError] = useState('');

  // -methods
  useMemo(() => {
    const keyCount = value.reduce((res, x) => {
      if (res[x[keyField]] === undefined) {
        res[x[keyField]] = 0;
      }
      res[x[keyField]] += 1;
      return res;
    }, {});

    const newDupList = value.filter(x => keyCount[x[keyField]] > 1).map(x => x[keyField]);

    const msgId = `PortList ${name}`;
    let errorMessage = '';
    if (newDupList.length > 0) {
      errorMessage = `${name || 'PortList'} has duplicated keys.`;
    }
    if (value.some(x => isEmpty(x[keyField]) && !isEmpty(x[valueField]))) {
      errorMessage = `${name || 'PortList'} has value with empty key.`;
    }
    if (keyFormatError !== '') {
      errorMessage = keyFormatError
    }
    if (!isNil(onValidateKey) || !isNil(onValidateValue)) {
      for (const item of value) {
        if (!isNil(onValidateKey)) {
          const key = item[keyField];
          const res = onValidateKey(key);
          if (!isEmpty(res)) {
            errorMessage = res;
          }
        }
        if (!isNil(onValidateValue)) {
          const value = item[valueField];
          const res = onValidateValue(value);
          if (!isEmpty(res)) {
            errorMessage = res;
          }
        }
      }
    }
    setErrorMessage(msgId, errorMessage);
    setDupList(newDupList);
  }, [value]);

  const onAdd = useCallback(() => {
    // 取得最後一個 orderId + 1
    const newId = isEmpty(value) ? 1 : (value[value.length - 1].orderId) + 1
    onChange([...value, { [keyField]: '', [valueField]: 1, orderId: newId }]);
  }, [onChange, value, keyField, valueField]);

  const onRemove = useCallback(orderId => {
    const result = [...value].filter(item => !(item.orderId === orderId));

    if(isEmpty(result)) {
      result.push({ [keyField]: '', [valueField]: 1, orderId: 1 })
    }

    onChange(result);
  });

  const onKeyChange = useCallback((orderId, val) => {
    const result = [...value].map(item => {
      const { orderId: selfOrderId } = item
      return selfOrderId === orderId ? { ...item, [keyField]: val } : item
    });

    onChange(result);
  });

  /**
   * @author elvis
   * @param {boolean} bool - 是否切換為高級狀態
   * @description 設定是否切換為高級狀態的 state，如果為高級狀態則顯示錯物提示該錯誤提示的類別會經由context傳下去給子component
  */
  const onValueChange = useCallback((orderId, val) => {
    const result = [...value].map(item => {
      const { orderId: selfOrderId } = item
      return selfOrderId === orderId ? { ...item, [valueField]: val } : item
    });

    onChange(result);
  }, [onChange, value, valueField]);

  return (
    <>
      <div className={`${classes.w_full}`}>
        {
          value.map(item => {
            return (
              <div
                className={`${classes.d_flex} ${classes.w_full} ${classes.mb_30}`}
                key={item.orderId}
              >
                <div className={`${classes.flexFrontInput} ${classes.pr_10}`}>
                  <DebouncedTextField
                    error={dupList.includes(item.key) || (isEmpty(item.key) && !isEmpty(item.value)) || keyFormatError}
                    helperText={
                      dupList.includes(item.key)
                        ? t('duplicateKeyword')
                        :
                        (isEmpty(item.key) && !isEmpty(item.value))
                          ? t('keywordCannotBeEmpty')
                          : keyFormatError !== '' ? t('keyInvalid') : ''
                    }
                    InputLabelProps={{ shrink: true }}
                    label={keyName}
                    onChange={(value) => {
                      const checkField = rules.keyFormat(value)
                      setKeyFormatError(checkField)
                      onKeyChange(item.orderId, value)
                    }}
                    value={item.key}
                  />
                </div>
                <div className={`${classes.flexBackInput} ${classes.pl_10}`}>
                  {/* 有限制範圍的 Number Input */}
                  <DebounceRestrictRangeNumberInput
                    classNameProps={classes.unlimitWidthInput}
                    max={100}
                    min={1}
                    onChange={(value) => {
                      // 當值改變時，利用props傳進來的 function 對父元件的 state 做變更，index 為 map 的 index
                      onValueChange(item.orderId, value)
                    }}
                    textInputProps={{
                      InputLabelProps: { shrink: true },
                      label: valueName
                    }}
                    value={item.value}
                  />
                </div>
                <div className={`${classes.flex_align_center} ${classes.flexEndSection} ${classes.pl_20}`}>
                  <IconButton
                    children={<Icon>delete_outline</Icon>}
                    onClick={() => {
                      onRemove(item.orderId)
                    }}
                  />
                </div>
              </div>
            )
          })
        }
      </div>
      <div className={`${classes.mt_10}`}>
        <DefaultButton
          onClick={onAdd}
          startIcon={<Icon>add</Icon>}
        >
          {t('Add')}
        </DefaultButton>
      </div>
    </>
  );
};

PortList.propTypes = {
  name: PropTypes.string,
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func,
  // custom field
  keyName: PropTypes.string,
  keyField: PropTypes.string,
  valueName: PropTypes.string,
  valueField: PropTypes.string,
  // validation
  onValidateKey: PropTypes.func,
  onValidateValue: PropTypes.func
};

export default PortList;
