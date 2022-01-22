import React, { useCallback, useMemo, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
// import styles from '../Form/index.module.scss';

import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { BaseTooltip } from 'components/BaseTooltip';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { DebouncedTextField } from '../Form/debounced-text-field';
import { IconButton } from 'components/BaseButton';
import FormControl from '@material-ui/core/FormControl';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { isEmpty } from 'lodash';
import { DefaultButton } from 'components/BaseButton';
import Context from '../../Context';

const useStyles = makeStyles(() => ({
  iconButton: {
    padding: 0,
    marginLeft: 10,
    fontSize: 18,
    cursor: 'pointer'
  },
  outlined: {
    maxWidth: '100%',
    width: '100%'
  },
  formLabel: {
    marginBottom: 0,
    fontSize: 14,
    paddingRight: 0
  },
  formControl: {
    width: '100%',
    '& > div': {
      height: 40
    }
  }
}));

const NFSMount = ({ title, hint, name, nfsMounts, onChange, keyOptions }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const isTablet = useMediaQuery('(max-width: 1280px)');
  const { setErrorMessage } = useContext(Context);

  const [dupList, setDupList] = useState([]);

  useMemo(() => {
    const valueCount = nfsMounts.reduce((res, x) => {
      if (res[x['mountPoint']] === undefined) {
        res[x['mountPoint']] = 0;
      }
      res[x['mountPoint']] += 1;
      return res;
    }, {});
    const newDupList = nfsMounts.filter(x => valueCount[x['mountPoint']] > 1).map(x => x['mountPoint']);

    const msgId = `KeyValueList ${name}`;
    let errorMessage = '';
    if (newDupList.length > 0) {
      errorMessage = `${name || 'KeyValueList'} has duplicated values.`;
    }

    if (nfsMounts.some(x => isEmpty(x['name']) && !isEmpty(x['mountPoint']))) {
      errorMessage = `${name || 'KeyValueList'} has key with empty value.`;
    }
    if (nfsMounts.some(x => isEmpty(x['mountPoint']) && !isEmpty(x['name']))) {
      errorMessage = `${name || 'KeyValueList'} has value with empty key.`;
    }

    setErrorMessage(msgId, errorMessage);
    setDupList(newDupList);
  }, [nfsMounts]);

  const onAdd = useCallback(() => {
    onChange([...nfsMounts, { name: '', mountPoint: '' }]);
  }, [onChange, nfsMounts]);

  const onKeyChange = useCallback((idx, val) => {
    onChange([...nfsMounts.slice(0, idx), { ...nfsMounts[idx], name: val, mountPoint: `/root/${val}` }, ...nfsMounts.slice(idx + 1)]);
  }, [onChange, nfsMounts]);

  const onValueChange = useCallback((idx, val) => {
    onChange([...nfsMounts.slice(0, idx), { ...nfsMounts[idx], mountPoint: val }, ...nfsMounts.slice(idx + 1)]);
  }, [onChange, nfsMounts]);

  const onRemove = useCallback(idx => {
    onChange([...nfsMounts.slice(0, idx), ...nfsMounts.slice(idx + 1)]);
  }, [onChange, nfsMounts]);

  return (
    <Grid
      container
      item
    >
      <Grid
        container
        item
        lg={3}
        md={3}
        sm={3}
        xl={3}
        xs={3}
      >
        <Grid
          container
          spacing={2}
          style={{ display: 'flex', justifyContent: 'flex-end', padding: '22px 10px 0 0' }}
        >
          <FormLabel className={classes.formLabel}>{title}</FormLabel>
          <BaseTooltip
            arrow
            title={hint}
          >
            <InfoOutlinedIcon classes={{ root: classes.iconButton }} />
          </BaseTooltip>
        </Grid>
      </Grid>
      <Grid
        item
        lg={9}
        md={9}
        sm={9}
        style={{ paddingLeft: 10 }}
        xl={9}
        xs={9}
      >
        <Grid
          container
          direction="column"
          spacing={2}
        >
          {
            nfsMounts.map((item, index) => {
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
                    <FormControl classes={{ root: classes.formControl }}>
                      <Select
                        classes={{ root: classes.select, outlined: classes.outlined }}
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
                  </Grid>
                  <Grid
                    item
                    lg={isTablet ? 5 : 4}
                    md={isTablet ? 5 : 4}
                    sm={isTablet ? 5 : 4}
                    xl={isTablet ? 5 : 4}
                    xs={isTablet ? 5 : 4}
                  >
                    <DebouncedTextField
                      error={dupList.includes(item.mountPoint) || (isEmpty(item.name) && !isEmpty(item.mountPoint))}
                      helperText={
                        dupList.includes(item.name)
                          ? t('sameMountPoint')
                          : isEmpty(item.name) && !isEmpty(item.mountPoint) ? `${t('Select')}${'enSpace'}${t('storage')}` : ''
                      }
                      InputLabelProps={{ shrink: true }}
                      label={t('mountPoint')}
                      onChange={(value) => {
                        onValueChange(index, value)
                      }}
                      value={item.mountPoint}
                    />
                  </Grid>
                  <Grid
                    item
                    lg={isTablet ? 2 : 4}
                    md={isTablet ? 2 : 4}
                    sm={isTablet ? 2 : 4}
                    xl={isTablet ? 2 : 4}
                    xs={isTablet ? 2 : 4}
                  >
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
        <Grid>
          <DefaultButton
            onClick={onAdd}
            startIcon={<Icon>add</Icon>}
            style={{ marginTop: 15 }}
          >
            {t('Add')}
          </DefaultButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

NFSMount.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  hint: PropTypes.string,
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  onError: PropTypes.func,
  nfsMounts: PropTypes.array.isRequired,
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

export default NFSMount;