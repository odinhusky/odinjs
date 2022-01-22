import React, { useState, useCallback, useMemo, useContext } from 'react';

// % context
import context from '../context';

// ^ Material-ui Components(Functions)
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// ? Self-packed Components || Functions
import { IconButton } from 'components/BaseButton';
import { DebouncedTextField } from '../controls/debounced-text-field';
import { DefaultButton } from 'components/BaseButton';

// ^ Plugins
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export const Environment = ({ name, parameters, onChange, classNameObj }) => {

  // $ init data
  const { t } = useTranslation();
  const isTablet = useMediaQuery('(max-width: 1280px)');
  const rules = {
    keyFormat: (key) => {
      const keyValidation = RegExp(/^[a-zA-Z_]+[a-zA-Z0-9_]*$/, 'g');
      return keyValidation.test(key) ? '' : t('userNameInvalid');
    }
  }

  // ? context
  const { setErrorMessage, classes } = useContext(context);

  // # states
  const [dupList, setDupList] = useState([]);
  const [keyFormatError, setKeyFormatError] = useState('');

  // - methods
  useMemo(() => {
    const keyCount = parameters.reduce((res, x) => {
      if (res[x['key']] === undefined) {
        res[x['key']] = 0;
      }
      res[x['key']] += 1;
      return res;
    }, {});
    const newDupList = parameters.filter(x => keyCount[x['key']] > 1).map(x => x['key']);

    const msgId = `KeyValueList ${name}`;
    let errorMessage = '';
    if (newDupList.length > 0) {
      errorMessage = `${name || 'KeyValueList'} has duplicated keys.`;
    }
    if (parameters.some(x => isEmpty(x['key']) && !isEmpty(x['value']))) {
      errorMessage = `${name || 'KeyValueList'} has value with empty key.`;
    }
    if (keyFormatError !== '') {
      errorMessage = keyFormatError
    }
    setErrorMessage(msgId, errorMessage);
    setDupList(newDupList);
  }, [parameters]);

  const onAdd = useCallback(() => {
    onChange([...parameters, { 'key': '', 'value': '' }]);
  }, [onChange, parameters]);

  const onKeyChange = useCallback((idx, val) => {
    onChange([...parameters.slice(0, idx), { ...parameters[idx], key: val }, ...parameters.slice(idx + 1)]);
  }, [onChange, parameters]);

  const onValueChange = useCallback((idx, val) => {
    onChange([...parameters.slice(0, idx), { ...parameters[idx], value: val }, ...parameters.slice(idx + 1)]);
  }, [onChange, parameters]);

  const onRemove = useCallback(idx => {
    onChange([...parameters.slice(0, idx), ...parameters.slice(idx + 1)]);
  }, [onChange, parameters]);

  const optionsGrid = isTablet ? {} : { xs: 9, sm: 9, md: 9, lg: 9, xl: 9 }

  return (
    <div className={`${classes.nfsMountContainer}`}>
      <Grid
        container
        item
        spacing={2}
      >
        <Grid
          container
          item
          spacing={2}
        >
          {
            parameters.map((item, index) => {
              return (
                <Grid
                  className={`${classes.py_18}`}
                  container
                  item
                  key={index}
                >
                  {
                    isTablet
                      ? <></>
                      :
                      <Grid
                        container
                        item
                        lg={3}
                        md={3}
                        sm={3}
                        xl={3}
                        xs={3}
                      />
                  }
                  <Grid
                    container
                    item
                    spacing={3}
                    {...optionsGrid}
                  >
                    <Grid
                      className={`${classes.unlimitWidthInput}`}
                      item
                      lg={isTablet ? 5 : 4}
                      md={isTablet ? 5 : 4}
                      sm={isTablet ? 5 : 4}
                      xl={isTablet ? 5 : 4}
                      xs={isTablet ? 5 : 4}
                    >
                      <DebouncedTextField
                        classNameProps={`${classNameObj?.firstInput}`}
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
                        label={t('keyword')}
                        onChange={(value) => {
                          const checkField = rules.keyFormat(value)
                          setKeyFormatError(value === '' ? '' : checkField)
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
                      <DebouncedTextField
                        classNameProps={`${classNameObj?.secondInput}`}
                        InputLabelProps={{ shrink: true }}
                        label={t('Value')}
                        onChange={(value) => {
                          onValueChange(index, value)
                        }}
                        value={item.value}
                      />
                    </Grid>
                    <Grid
                      item
                      style={{ display: 'flex' }}
                    >
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
        </Grid>
        <Grid
          container
          item
        >
          {
            isTablet
              ? <></>
              :
              <Grid
                item
                lg={3}
                md={3}
                sm={3}
                xl={3}
                xs={3}
              />
          }
          <Grid
            container
            item
            lg={9}
            md={9}
            sm={9}
            xl={9}
            xs={9}
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
    </div>
  )
}

Environment.propTypes = {
  name: PropTypes.string,
  parameters: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  classNameObj: PropTypes.object
}

export default Environment

