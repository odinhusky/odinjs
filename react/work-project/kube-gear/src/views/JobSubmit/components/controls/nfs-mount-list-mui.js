import React, { useCallback, useMemo, useState, useContext } from 'react';

// % context
import context from '../context';

// ^ Material-ui Components(Functions)
import Grid from '@material-ui/core/Grid';

import FormLabel from '@material-ui/core/FormLabel';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Icon from '@material-ui/core/Icon';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// ? Self-packed Components || Functions
import { DebouncedTextField } from './debounced-text-field';
import { BaseTooltip } from 'components/BaseTooltip';
import { IconButton } from 'components/BaseButton';
import { DefaultButton } from 'components/BaseButton';

// ? styles
// const useStyles = makeStyles(() => ({
//   iconButton: {
//     padding: 0,
//     marginLeft: 10,
//     marginRight: 5,
//     fontSize: 18,
//     cursor: 'pointer'
//   },
//   formLabel: {
//     marginBottom: 0,
//     marginTop: 2,
//     fontSize: 14,
//     paddingRight: 0
//   },
//   select: {
//     maxWidth: '100%',
//     width: '100%'
//   },
//   outlined: {
//     maxWidth: '100px',
//     width: '100px'
//   }
// }))

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';

export const NfsMountLists = ({
  name,
  nfsMounts,
  onChange,
  keyOptions,
  hint,
  title,
  classNameObj
}) => {

  // $ init data
  const { t } = useTranslation();
  const isTablet = useMediaQuery('(max-width: 1280px)');

  // ? context
  const { setErrorMessage, classes } = useContext(context);

  // # states
  const [dupList, setDupList] = useState([]);

  // - methods
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
        lg={isTablet ? 12 : 3}
        md={isTablet ? 12 : 3}
        sm={isTablet ? 12 : 3}
        spacing={1}
        xl={isTablet ? 12 : 3}
        xs={isTablet ? 12 : 3}
      >
        <Grid
          className={`${isTablet
            ? `${classes.py_10}`
            : `${classes.d_flex} ${classes.justify_end} ${classes.pr_10} ${classes.pt_16}`
          }`}
          container
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
        lg={isTablet ? 12 : 9}
        md={isTablet ? 12 : 9}
        sm={isTablet ? 12 : 9}
        // style={{ paddingLeft: 10 }}
        xl={isTablet ? 12 : 9}
        xs={isTablet ? 12 : 9}
      >
        <Grid
          container
          direction="column"
          spacing={2}
        >
          {
            nfsMounts.map((item, index) => {
              const isError = dupList.includes(item.mountPoint) || (!isEmpty(item.name) && isEmpty(item.mountPoint))

              return (
                <Grid
                  className={`${isError && classes.mb_12} ${classes.p_12}`}
                  container
                  item
                  key={`${item.name}${index}`}
                >
                  <Grid
                    container
                    item
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
                      <FormControl
                        className={`${classes.unlimitWidthSelect} ${classNameObj?.firstInput}`}
                        fullWidth
                      >
                        <Select
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
                      className={`${classes.unlimitWidthInput}  ${classNameObj?.secondInputGrid}`}
                      item
                      lg={isTablet ? 5 : 4}
                      md={isTablet ? 5 : 4}
                      sm={isTablet ? 5 : 4}
                      xl={isTablet ? 5 : 4}
                      xs={isTablet ? 5 : 4}

                    >
                      <DebouncedTextField
                        classNameProps={`${classNameObj?.secondInput}`}
                        error={isError}
                        helperText={
                          dupList.includes(item.name)
                            ? t('sameMountPoint')
                            : !isEmpty(item.name) && isEmpty(item.mountPoint) ? `${t('Select')}${t('enSpace')}${t('mountPoint')}` : ''
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
          <Grid
            container
            item
          >
            <Grid
              item
              spacing={3}
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
      </Grid>
    </Grid>
  );
};

NfsMountLists.propTypes = {
  title: PropTypes.string,
  hint: PropTypes.string,
  name: PropTypes.string,
  nfsMounts: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  keyOptions: PropTypes.array,
  classNameObj: PropTypes.object
};
