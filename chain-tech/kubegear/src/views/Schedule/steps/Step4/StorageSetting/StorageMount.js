import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useContext
} from 'react';

// % context
import ScheduleContext from '../../../ScheduleContext';

// ^ Material-ui Componets(Functions)
import Icon from '@material-ui/core/Icon';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

// ? Self-packed Components || Functions
import { DefaultButton } from 'components/BaseButton';
import { DebouncedTextField } from 'components/Debounce/DebouncedTextField';
import { IconButton } from 'components/BaseButton';

// ^ Plugins
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/Schedule/{CreateSchedule | EditSchedule}/Step4/StorageSetting
 * @prop {function} setErrorMessage -- 紀錄錯誤訊息的函式
 * @component StorageSetting
 * @description 存儲的
*/
const StorageMount = ({
  name,
  mounts,
  onChange,
  keyOptions,
  title,
  keyName,
  valueName,
  setErrorMessage
}) => {

  // $ init data
  const defaultMountUnit = { name: '', mountPoint: '' }
  const { t } = useTranslation();

  // = styles
  const { classes } = useContext(ScheduleContext);

  // # states
  const [dupList, setDupList] = useState([]);
  const [mountsState, setMountsState] = useState([]);

  // - methods
  useMemo(() => {
    const valueCount = mountsState.reduce((res, x) => {
      if (res[x['mountPoint']] === undefined) {
        res[x['mountPoint']] = 0;
      }
      res[x['mountPoint']] += 1;
      return res;
    }, {});
    const newDupList = mountsState.filter(x => valueCount[x['mountPoint']] > 1).map(x => x['mountPoint']);

    const msgId = `KeyValueList ${name}`;
    let errorMessage = '';
    if (newDupList.length > 0) {
      errorMessage = `${name || 'KeyValueList'} has duplicated values.`;
    }

    if (mountsState.some(x => isEmpty(x['name']) && !isEmpty(x['mountPoint']))) {
      errorMessage = `${name || 'KeyValueList'} has key with empty value.`;
    }
    if (mountsState.some(x => isEmpty(x['mountPoint']) && !isEmpty(x['name']))) {
      errorMessage = `${name || 'KeyValueList'} has value with empty key.`;
    }

    setErrorMessage(msgId, errorMessage);
    setDupList(newDupList);
  }, [mountsState]);

  const onAdd = useCallback(() => {
    onChange([...mountsState, { ...defaultMountUnit }]);
  }, [onChange, mountsState]);

  const onKeyChange = useCallback((idx, val) => {
    onChange([...mountsState.slice(0, idx), { ...mountsState[idx], name: val, mountPoint: `/root/${val}` }, ...mountsState.slice(idx + 1)]);
  }, [onChange, mountsState]);

  const onValueChange = useCallback((idx, val) => {
    onChange([...mountsState.slice(0, idx), { ...mountsState[idx], mountPoint: val }, ...mountsState.slice(idx + 1)]);
  }, [onChange, mountsState]);

  const onRemove = useCallback(idx => {
    const result = [...mountsState.slice(0, idx), ...mountsState.slice(idx + 1)]

    // 刪完都沒有東西了以後，補一個預設的結構讓畫面不是空的
    if(result.length === 0) {
      result.push({ ...defaultMountUnit })
    }

    onChange(result);
  }, [onChange, mountsState]);

  // * hooks
  /**
   * @author elvis & odin
   * @description
   * 1. 防止外部傳來的 mounts 是空值或是 undefined
   * 2. 同時過濾掉不符合這個使用者目前可以選擇的掛載點選項的掛載點
   * 3. 過濾的條件如果都是空的則不過濾掉，代表新增的組合
  */
  useEffect(() => {
    if(mounts && !isEmpty(mounts)){
      const keyOptionsCheckArr = keyOptions.map(item => item.text)
      const filteredMounts = mounts.filter(item => {
        return keyOptionsCheckArr.includes(item.name)
        || (item.name === '' && item.mountPoint === '')
      })
      const result = filteredMounts.length > 0 ? filteredMounts : [{ ...defaultMountUnit }]

      setMountsState(result)
    }
  }, [mounts])

  return (
    <>
      <div className={`${classes.w_full}`}>
        <div className={`${classes.fz_14} ${classes.black_87} ${classes.mb_16} ${classes.w_full}`}>
          { title }
        </div>
        {
          mountsState.map((item, index) => {
            return (
              <div
                className={`${classes.d_flex} ${classes.w_full} ${classes.mb_30}`}
                key={`${item.key}-${index}`}
              >
                <div className={`${classes.flexFrontInput} ${classes.pr_10}`}>
                  <FormControl className={`${classes.w_full} ${classes.formControl}`}>
                    <Select
                      classes={{ root: classes.select, outlined: classes.w_full }}
                      label={keyName}
                      onChange={(e) => {
                        const value = e.target.value;
                        onKeyChange(index, value)
                      }}
                      value={item.name}
                      variant="outlined"
                    >
                      {keyOptions.map((item) => {
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
                  </FormControl>
                </div>
                <div className={`${classes.flexBackInput} ${classes.pl_10}`}>
                  <DebouncedTextField
                    error={dupList.includes(item.mountPoint) || (isEmpty(item.name) && !isEmpty(item.mountPoint))}
                    helperText={
                      dupList.includes(item.name)
                        ? t('sameMountPoint')
                        : isEmpty(item.name) && !isEmpty(item.mountPoint) ? `${t('Select')}${'enSpace'}${t('storage')}` : ''
                    }
                    InputLabelProps={{ shrink: true }}
                    label={valueName}
                    onChange={(value) => {
                      onValueChange(index, value)
                    }}
                    value={item.mountPoint}
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
  );
};

StorageMount.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  mounts: PropTypes.array.isRequired,
  keyOptions: PropTypes.array,
  title: PropTypes.string,
  keyName: PropTypes.string,
  valueName: PropTypes.string,
  setErrorMessage: PropTypes.func
};

export default StorageMount;