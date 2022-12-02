import React, { useState, useCallback, useMemo, useContext } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import { IconButton } from 'components/BaseButton';
import { DebouncedTextField } from './debounced-text-field';
import { useTranslation } from 'react-i18next';
import { DefaultButton } from 'components/BaseButton';
import context from '../../Context';
import { isEmpty } from 'lodash';

const useStyles = makeStyles(() => ({
  gridcontainer: {
    marginTop: 10
  }
}));

export const KeyValueList = ({ name, value, onChange, keyName, keyField, valueName, valueField }) => {
  keyName = keyName || 'Key';
  valueName = valueName || 'Value';

  const { t } = useTranslation();
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
    setErrorMessage(msgId, errorMessage);
    setDupList(newDupList);
  }, [value]);

  const onAdd = useCallback(() => {
    onChange([...value, { [keyField]: '', [valueField]: '' }]);
  }, [onChange, value]);

  const onKeyChange = useCallback((idx, val) => {
    onChange([...value.slice(0, idx), { ...value[idx], key: val }, ...value.slice(idx + 1)]);
  }, [onChange, value, valueField]);

  const onValueChange = useCallback((idx, val) => {
    onChange([...value.slice(0, idx), { ...value[idx], value: val }, ...value.slice(idx + 1)]);
  }, [onChange, value, valueField]);

  const onRemove = useCallback(idx => {
    onChange([...value.slice(0, idx), ...value.slice(idx + 1)]);
  }, [onChange, value]);

  return (
    <Grid style={{ width: '80%' }}>
      {
        value.map((item, index) => {
          return (
            <Grid
              classes={{ root: classes.gridcontainer }}
              container
              key={index}
            >
              <Grid
                container
                itemProp
                spacing={3}
              >
                <Grid item>
                  <DebouncedTextField
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
                <Grid item>
                  <DebouncedTextField
                    InputLabelProps={{ shrink: true }}
                    label={valueName}
                    onChange={(value) => {
                      onValueChange(index, value)
                    }}
                    value={item.value}
                  />
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
            </Grid>
          )
        })
      }
      <Grid
        classes={{ root: classes.gridcontainer }}
        container
      >
        <Grid
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
      </Grid>
    </Grid>
  )
};

KeyValueList.propTypes = {
  name: PropTypes.string,
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  //custom field
  keyName: PropTypes.string,
  keyField: PropTypes.string,
  valueName: PropTypes.string,
  valueField: PropTypes.string
};
