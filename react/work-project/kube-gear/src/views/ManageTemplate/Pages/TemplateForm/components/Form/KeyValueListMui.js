import React, {
  useState,
  useContext,
  useCallback,
  useMemo
} from 'react';

// % context
import context from '../../Context';

// ^ Material-ui Componets(Functions)
import Icon from '@material-ui/core/Icon';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';


// ? Self-packed Components || Functions
import { DebouncedTextField } from './debounced-text-field';
import { DefaultButton, IconButton } from 'components/BaseButton';
import { DebounceRestrictRangeNumberInput } from 'components/Debounce/DebounceRestrictRangeNumberInput';

// ^ Plugins
import PropTypes from 'prop-types';
import { isEmpty, isNil } from 'lodash';
import { useTranslation } from 'react-i18next';

// import { countRestrictRange } from 'common/commonMethods'

export const KeyValueListMui = ({ name, value, onChange, keyName, keyField, valueName, valueField, onValidateKey, onValidateValue, isFieldOnlyNumber = false }) => {

  const { t } = useTranslation();
  const isTablet = useMediaQuery('(max-width: 1280px)');
  const [dupList, setDupList] = useState([]);
  const [keyFormatError, setKeyFormatError] = useState('');
  const { classes, setErrorMessage } = useContext(context);

  const rules = {
    keyFormat: (key) => {
      const keyValidation = RegExp(/^[a-zA-Z_]+[a-zA-Z0-9_]*$/, 'g');
      return keyValidation.test(key) ? '' : t('userNameInvalid');
    }
  }

  useMemo(() => {
    const keyCount = value.reduce((res, x) => {
      if (res[x[keyField]] === undefined) {
        res[x[keyField]] = 0;
      }
      res[x[keyField]] += 1;
      return res;
    }, {});
    const newDupList = value.filter(x => keyCount[x[keyField]] > 1).map(x => x[keyField]);

    const msgId = `KeyValueList ${name}`;
    let errorMessage = '';
    if (newDupList.length > 0) {
      errorMessage = `${name || 'KeyValueList'} has duplicated keys.`;
    }
    if (value.some(x => isEmpty(x[keyField]) && !isEmpty(x[valueField]))) {
      errorMessage = `${name || 'KeyValueList'} has value with empty key.`;
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
    onChange([...value, { [keyField]: '', [valueField]: '' }]);
  }, [onChange, value, keyField, valueField]);

  const onRemove = useCallback(idx => {
    onChange([...value.slice(0, idx), ...value.slice(idx + 1)]);
  }, [onChange, value]);

  const onKeyChange = useCallback((idx, val) => {
    onChange([...value.slice(0, idx), { ...value[idx], [keyField]: val }, ...value.slice(idx + 1)]);
  }, [onChange, value, keyField]);

  /**
   * @author elvis
   * @param {boolean} bool - 是否切換為高級狀態
   * @description 設定是否切換為高級狀態的 state，如果為高級狀態則顯示錯物提示該錯誤提示的類別會經由context傳下去給子component
  */
  const onValueChange = useCallback((idx, val) => {
    // ! 順序不能改
    onChange([
      ...value.slice(0, idx),
      { ...value[idx], [valueField]: val },
      ...value.slice(idx + 1)
    ]);
  }, [onChange, value, valueField]);

  return (
    <>
      <Grid
        container
        item
        spacing={3}
      >
        {
          value.map((item, index) => {
            return (
              <Grid
                container
                item
                key={index}
                spacing={3}
              >
                <Grid
                  item
                  lg={isTablet ? 5 : 4}
                  md={isTablet ? 5 : 4}
                  sm={isTablet ? 5 : 4}
                  xl={isTablet ? 5 : 4}
                  xs={isTablet ? 5 : 4}
                >
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
                </Grid>
                <Grid
                  item
                  lg={isTablet ? 5 : 4}
                  md={isTablet ? 5 : 4}
                  sm={isTablet ? 5 : 4}
                  xl={isTablet ? 5 : 4}
                  xs={isTablet ? 5 : 4}
                >
                  {/* 有限制範圍的 Number Input */}
                  {
                    isFieldOnlyNumber
                      ?
                      <DebounceRestrictRangeNumberInput
                        classNameProps={classes.debounceRestrictRangeFieldInput}
                        max={100}
                        min={1}
                        onChange={(value) => {
                          // 當值改變時，利用props傳進來的 function 對父元件的 state 做變更，index 為 map 的 index
                          onValueChange(index, value)
                        }}
                        textInputProps={{
                          InputLabelProps: { shrink: true },
                          label: valueName
                        }}
                        value={item.value}
                      />
                      :
                      <DebouncedTextField
                        InputLabelProps={{ shrink: true }}
                        label={valueName}
                        onChange={(value) => {
                          onValueChange(index, value)
                        }}
                        value={item.value}
                      />
                  }
                </Grid>
                <Grid item>
                  <IconButton
                    children={<Icon>delete_outline</Icon>}
                    onClick={() => {
                      onRemove(index)
                    }}
                  />
                </Grid>
              </Grid>
            )
          })
        }
      </Grid>
      <Grid
        className={classes.KeyValueListMuiGridContainer}
        container
        item
      >
        <DefaultButton
          onClick={onAdd}
          startIcon={<Icon>add</Icon>}
        >
          {t('Add')}
        </DefaultButton>
      </Grid>
    </>
  );
};

KeyValueListMui.propTypes = {
  name: PropTypes.string,
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onError: PropTypes.func,
  // custom field
  secret: PropTypes.bool,
  // columnWidth: PropTypes.number,
  keyName: PropTypes.string,
  keyField: PropTypes.string,
  valueName: PropTypes.string,
  valueField: PropTypes.string,
  // validation
  onValidateKey: PropTypes.func,
  onValidateValue: PropTypes.func,
  isFieldOnlyNumber: PropTypes.bool
};

export default KeyValueListMui;
