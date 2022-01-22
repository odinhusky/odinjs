import React, {
  useState,
  useContext,
  useCallback,
  useMemo
} from 'react';

// % context
import context from '../context';

// ^ Material-ui Componets(Functions)
import Icon from '@material-ui/core/Icon';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';

// ? Self-packed Components || Functions
import { DebouncedTextField } from '../controls/debounced-text-field';
import { DefaultButton, IconButton } from 'components/BaseButton';
import { DebounceRestrictRangeNumberInput } from 'components/Debounce/DebounceRestrictRangeNumberInput'

// ^ Plugins
import PropTypes from 'prop-types';
import { isEmpty, isNil } from 'lodash';
import { useTranslation } from 'react-i18next';

// import { countRestrictRange } from 'common/commonMethods'

// % styles
import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles'

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme),
  outlined: {
    maxWidth: '100px',
    width: '100px'
  },
  gridcontainer: {
    marginTop: 10
  },
  selectResourceFirstInput: {
    paddingRight: '12px !important'
  }
}))

export const KeyValueListMui = ({ name, value, onChange, keyName, keyField, valueName, valueField, onValidateKey, onValidateValue, classNameObj }) => {
  const { t } = useTranslation();
  const isTablet = useMediaQuery('(max-width: 1280px)');
  const classes = useStyles();
  const [dupList, setDupList] = useState([]);
  const { setErrorMessage } = useContext(context);

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

  // const judge = isTablet ? 5 : 4;

  return (
    <>
      {
        value.map((item, index) => {
          return (
            <Grid
              className={`
                ${isTablet && classes.mt_6}
                ${classes.py_12}
                ${(dupList.includes(item.key) || (isEmpty(item.key) && !isEmpty(item.value))) && classes.mb_12}
              `}
              container
              item
              key={`${item.name}${index}`}
              spacing={3}
            >
              <Grid
                container
                item
                spacing={3}
              >
                <Grid
                  className={`${classes.unlimitWidthInput} `}
                  item
                  lg={isTablet ? 5 : 4}
                  md={isTablet ? 5 : 4}
                  sm={isTablet ? 5 : 4}
                  xl={isTablet ? 5 : 4}
                  xs={isTablet ? 5 : 4}
                >
                  <DebouncedTextField
                    classNameProps={`${classNameObj?.firstInput}`}
                    error={dupList.includes(item.key) || (isEmpty(item.key) && !isEmpty(item.value))}
                    helperText={
                      dupList.includes(item.key)
                        ? t('duplicateKeyword')
                        : isEmpty(item.key) && !isEmpty(item.value) ? t('keywordCannotBeEmpty') : ''
                    }
                    InputLabelProps={{ shrink: true }}
                    label={keyName}
                    onChange={(value) => {
                      onKeyChange(index, value)
                    }}
                    value={item.key}
                  />
                </Grid>
                <Grid
                  className={`${classes.unlimitWidthInput} ${classNameObj?.secondInputGrid}`}
                  item
                  lg={isTablet ? 5 : 4}
                  md={isTablet ? 5 : 4}
                  sm={isTablet ? 5 : 4}
                  xl={isTablet ? 5 : 4}
                  xs={isTablet ? 5 : 4}
                >
                  {/* 有限制範圍的 Number Input */}
                  <DebounceRestrictRangeNumberInput
                    classNameProps={`${classNameObj?.secondInput}`}
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
                </Grid>
                <Grid
                  className={`${classes.flex_align_center} ${classes.directionRow} ${classes.pl_0}`}
                  item
                >
                  <IconButton
                    children={<Icon>delete_outline</Icon>}
                    className={`${classes.pl_0}`}
                    onClick={() => {
                      onRemove(index)
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          )
        })
      }
      <Grid container>
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
  classNameObj: PropTypes.object,
  // custom field
  secret: PropTypes.bool,
  // columnWidth: PropTypes.number,
  keyName: PropTypes.string,
  keyField: PropTypes.string,
  valueName: PropTypes.string,
  valueField: PropTypes.string,
  // validation
  onValidateKey: PropTypes.func,
  onValidateValue: PropTypes.func
};
