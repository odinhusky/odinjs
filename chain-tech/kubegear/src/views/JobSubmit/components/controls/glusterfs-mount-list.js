import { camelCase, isEmpty, isNil } from 'lodash';
import { IconButton, Stack, DetailsList, CheckboxVisibility, DetailsListLayoutMode, SelectionMode, DetailsHeader, Label } from 'office-ui-fabric-react';
import PropTypes from 'prop-types';
import React, { useCallback, useLayoutEffect, useMemo, useState, useContext } from 'react';
import { DebouncedTextField } from './debounced-text-field';
import { ComboBox } from 'office-ui-fabric-react';
import { dispatchResizeEvent } from '../../utils/utils';
import context from '../context';
import { useTranslation } from 'react-i18next';
import { DetailsRow } from 'office-ui-fabric-react/lib/DetailsList';
import { DefaultButton } from 'components/BaseButton';
import { TooltipIcon } from '../controls/tooltip-icon';

const onRenderDetailsHeader = ({ ...detailsHeaderProps }) => {
  const renderCustomHeaderTooltip = (tooltipHostProps, defaultRender) => {
    return (
      <span
        style={{
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        {
          defaultRender({ ...tooltipHostProps })
        }
      </span>
    );
  };
  return (
    <DetailsHeader
      {...detailsHeaderProps}
      onRenderColumnHeaderTooltip={renderCustomHeaderTooltip}
      styles={{
        root: {
          padding: '10px 0'
        }
      }}
    />
  );
};

export const GlusterfsMountList = ({ name, value, onChange, onError, columnWidth, keyName, keyField, keyOptions, valueName, valueField, secret, onValidateKey, onValidateValue }) => {
  columnWidth = columnWidth || 180;
  keyName = keyName || 'Key';
  keyField = keyField || camelCase(keyName);
  valueName = valueName || 'Value';
  valueField = valueField || camelCase(valueName);

  const { t } = useTranslation();
  const [dupList, setDupList] = useState([]);
  const { setErrorMessage } = useContext(context);

  useMemo(() => {
    const valueCount = value.reduce((res, x) => {
      if (res[x[valueField]] === undefined) {
        res[x[valueField]] = 0;
      }
      res[x[valueField]] += 1;
      return res;
    }, {});
    const newDupList = value.filter(x => valueCount[x[valueField]] > 1).map(x => x[valueField]);

    const msgId = `KeyValueList ${name}`;
    let errorMessage = '';
    if (newDupList.length > 0) {
      errorMessage = `${name || 'KeyValueList'} has duplicated values.`;
    }

    if (value.some(x => isEmpty(x[keyField]) && !isEmpty(x[valueField]))) {
      errorMessage = `${name || 'KeyValueList'} has key with empty value.`;
    }
    if (value.some(x => isEmpty(x[valueField]) && !isEmpty(x[keyField]))) {
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
    if (onError) {
      onError(errorMessage);
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
    onChange([...value.slice(0, idx), { [keyField]: val, [valueField]: `/root/${val}` }, ...value.slice(idx + 1)]);
  }, [onChange, value, keyField]);

  const onValueChange = useCallback((idx, val) => {
    onChange([...value.slice(0, idx), { ...value[idx], [valueField]: val }, ...value.slice(idx + 1)]);
  }, [onChange, value, valueField]);

  const getKey = useCallback((item, idx) => idx, []);

  // workaround for fabric's bug
  // https://github.com/OfficeDev/office-ui-fabric-react/issues/5280#issuecomment-489619108
  useLayoutEffect(() => {
    dispatchResizeEvent();
  });

  const columns = [
    {
      key: keyName,
      name: keyName,
      minWidth: columnWidth,
      onRender: (item, idx) => {
        let errorMessage = null;
        if (isEmpty(item[keyField]) && !isEmpty(item[valueField])) {
          errorMessage = 'empty key';
        }
        if (!isNil(onValidateKey)) {
          const res = onValidateKey(item[keyField]);
          if (!isEmpty(res)) {
            errorMessage = res;
          }
        }
        return (
          <ComboBox
            errorMessage={errorMessage}
            onChange={(e, opt) => onKeyChange(idx, opt.text)}
            options={keyOptions}
            styles={{
              root: {
                borderRadius: 3
              }
            }}
            text={item[keyField]}
          />
        );
      }
    },
    {
      key: valueName,
      name: valueName,
      minWidth: columnWidth,
      onRender: (item, idx) => {
        let errorMessage = null;
        if (dupList.includes(item[valueField])) {
          errorMessage = t('sameMountPoint');
        }
        if (!isNil(onValidateValue)) {
          const res = onValidateValue(item[valueField]);
          if (!isEmpty(res)) {
            errorMessage = res;
          }
        }
        return (
          <DebouncedTextField
            errorMessage={errorMessage}
            onChange={(e, val) => onValueChange(idx, val)}
            type={secret && 'password'}
            value={item[valueField]}
          />
        );
      }
    },
    {
      key: 'remove',
      name: `${t('delete')}`,
      minWidth: 50,
      style: { padding: 0 },
      onRender: (item, idx) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            height: '100%'
          }}
        >
          <IconButton
            iconProps={{ iconName: 'Delete' }}
            key={`remove-button-${idx}`}
            onClick={() => onRemove(idx)}
          />
        </div>
      )
    }
  ];

  return (
    <Stack
      horizontal
      styles={{ root: { backgroundColor: '#fff', paddingBottom: 20 } }}
    >
      <Stack.Item styles={{ root: { display: 'flex', width: '28%', lignItems: 'flex-start', justifyContent: 'flex-end', paddingTop: 10 } }}>
        <Label styles={{ root: { fontSize: 16, fontWeight: 'bold' } }}>
          {t('glusterfs')}
          <TooltipIcon
            content={t('toolTipsNFS')}
            styles={{ root: {
              marginLeft: 10,
              marginBottom: 5
            } }}
          />
        </Label>
      </Stack.Item>
      <Stack.Item styles={{ root: { display: 'flex', width: '80%', flexDirection: 'column', marginLeft: '16px !important' } }}>
        <DetailsList
          checkboxVisibility={CheckboxVisibility.hidden}
          columns={columns}
          compact
          getKey={getKey}
          items={value}
          layoutMode={DetailsListLayoutMode.fixedColumns}
          onRenderDetailsHeader={onRenderDetailsHeader}
          onRenderRow={props => {
            return (
              <DetailsRow
                styles={{
                  root: {
                    fontSize: '14px',
                    color: '#333'
                  },
                  cell: {
                    display: 'flex',
                    alignItems: 'center',
                    padding: '6px 0'
                  }
                }}
                {...props}
              />
            );
          }}
          selectionMode={SelectionMode.none}
          styles={{ root: { width: 500 } }}
        />
        <div style={{ width: 500 }}>
          <DefaultButton
            iconProps={{ iconName: 'Add' }}
            onClick={onAdd}
          >
            {t('Add')}
          </DefaultButton>
        </div>
      </Stack.Item>
    </Stack>
  );
};

GlusterfsMountList.propTypes = {
  name: PropTypes.string,
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onError: PropTypes.func,
  // custom field
  secret: PropTypes.bool,
  columnWidth: PropTypes.number,
  keyName: PropTypes.string,
  keyField: PropTypes.string,
  keyOptions: PropTypes.array,
  valueName: PropTypes.string,
  valueField: PropTypes.string,
  // validation
  onValidateKey: PropTypes.func,
  onValidateValue: PropTypes.func
};
