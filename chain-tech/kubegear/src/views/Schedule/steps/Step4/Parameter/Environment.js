import React, {
  useState,
  useCallback,
  useMemo,
  useContext
} from 'react';

// % context
import ScheduleContext from '../../../ScheduleContext';

// ^ Material-ui Componets(Functions)
import Icon from '@material-ui/core/Icon';

// ? Self-packed Components || Functions
import { IconButton } from 'components/BaseButton';
import { DebouncedTextField } from 'components/Debounce/DebouncedTextField';
import { DefaultButton } from 'components/BaseButton';
import Step4Title from '../Step4Title';

// ^ Plugins
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/Schedule/{CreateSchedule | EditSchedule}/Step4/ParametersList
 * @prop {string} name -- 紀錄錯誤訊息的函式
 * @prop {function} parameters -- 紀錄錯誤訊息的函式
 * @prop {function} onChange -- 紀錄錯誤訊息的函式
 * @prop {function} keyField -- 紀錄錯誤訊息的函式
 * @prop {function} valueField -- 紀錄錯誤訊息的函式
 * @prop {function} keyName -- 紀錄錯誤訊息的函式
 * @prop {function} setErrorMessage -- 紀錄錯誤訊息的函式
 * @prop {string}} title -- 紀錄錯誤訊息的函式
 * @component ParametersList
 * @description 關鍵字的設定區塊
*/
export const Environment = ({
  name,
  parameters,
  onChange,
  keyField,
  valueField,
  valueName,
  keyName,
  setErrorMessage,
  title
}) => {

  // $ init data
  const { t } = useTranslation();
  const defaultParameterUnit = { [keyField]: '', [valueField]: '' }

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

  // - methods
  useMemo(() => {
    const keyCount = parameters.reduce((res, x) => {
      if (res[x[keyField]] === undefined) {
        res[x[keyField]] = 0;
      }
      res[x[keyField]] += 1;
      return res;
    }, {});
    const newDupList = parameters.filter(x => keyCount[x[keyField]] > 1).map(x => x[keyField]);

    const msgId = `KeyValueList ${name}`;
    let errorMessage = '';
    if (newDupList.length > 0) {
      errorMessage = `${name || 'KeyValueList'} has duplicated keys.`;
    }
    if (parameters.some(x => isEmpty(x[keyField]) && !isEmpty(x[valueField]))) {
      errorMessage = `${name || 'KeyValueList'} has value with empty key.`;
    }
    if (keyFormatError !== '') {
      errorMessage = keyFormatError
    }
    setErrorMessage(msgId, errorMessage);
    setDupList(newDupList);
  }, [parameters]);

  const onAdd = useCallback(() => {
    onChange([...parameters, { ...defaultParameterUnit }]);
  }, [onChange, parameters]);

  const onKeyChange = useCallback((idx, val) => {
    onChange([...parameters.slice(0, idx), { ...parameters[idx], key: val }, ...parameters.slice(idx + 1)]);
  }, [onChange, parameters]);

  const onValueChange = useCallback((idx, val) => {
    onChange([...parameters.slice(0, idx), { ...parameters[idx], value: val }, ...parameters.slice(idx + 1)]);
  }, [onChange, parameters]);

  const onRemove = useCallback(idx => {
    const result = [...parameters.slice(0, idx), ...parameters.slice(idx + 1)]

    // 刪完都沒有東西了以後，補一個預設的結構讓畫面不是空的
    if(result.length === 0) {
      result.push({ ...defaultParameterUnit })
    }

    onChange(result);
  }, [onChange, parameters]);

  return (
    <>
      <Step4Title
        title={t('EnvParam')}
      />

      <div className={`${classes.w_full}`}>
        <div className={`${classes.fz_14} ${classes.black_87} ${classes.mb_16} ${classes.w_full}`}>
          { title }
        </div>
        {
          parameters.map((item, index) => {
            return (
              <div
                className={`${classes.d_flex} ${classes.w_full} ${classes.mb_30}`}
                key={`${index}`}
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
                      onKeyChange(index, value)
                    }}
                    value={item.key}
                  />
                </div>
                <div className={`${classes.flexBackInput} ${classes.pl_10}`}>
                  <DebouncedTextField
                    InputLabelProps={{ shrink: true }}
                    label={valueName}
                    onChange={(value) => {
                      onValueChange(index, value)
                    }}
                    value={item.value}
                  />
                </div>
                <div className={`${classes.flex_align_center} ${classes.flexEndSection} ${classes.pl_20}`}>
                  <IconButton
                    children={<Icon>delete_outline</Icon>}
                    onClick={() => {
                      onRemove(index)
                    }}
                  />
                </div>
              </div>
            )
          })
        }
      </div>
      <div className={`${classes.w_full}`}>
        <DefaultButton
          onClick={onAdd}
          startIcon={<Icon>add</Icon>}
        >
          {`${t('Add')}${title}`}
        </DefaultButton>
      </div>
    </>
  )
}

Environment.propTypes = {
  name: PropTypes.string,
  parameters: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  keyField: PropTypes.string,
  valueField: PropTypes.string,
  valueName: PropTypes.string,
  keyName: PropTypes.string,
  setErrorMessage: PropTypes.func,
  title: PropTypes.string
}

export default Environment

