import React, {
  useCallback,
  useEffect,
  useState,
  useContext
} from 'react';

// ? context
import Context from '../../Context';
import ManageTemplateContext from '../../../../Context';

// ^ Material-ui Components(Functions)
import FormControl from '@material-ui/core/FormControl';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormLabel from '@material-ui/core/FormLabel';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

// ? Self-packed Components || Functions
import { BaseTooltip } from 'components/BaseTooltip';
import { DebouncedTextField } from '../Form/debounced-text-field';
import { IconButton } from 'components/BaseButton';
import { DefaultButton } from 'components/BaseButton';

// ^ Plugins
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { isEmpty, isUndefined } from 'lodash';

/**
 * @author odin
 * @level views/ManageTemplate/TemplateForm/StorageSetting/StorageMount
 * @component StorageMount
 * @description Storage Mounts Setting
*/
const StorageMount = ({
  title,
  hint,
  name,
  storageMounts,
  onChange,
  keyOptions
}) => {

  // $ init data
  const { t } = useTranslation();
  const isTablet = useMediaQuery('(max-width: 1280px)');

  // ? context
  const { setErrorMessage } = useContext(Context);
  const { classes } = useContext(ManageTemplateContext);

  // # states
  const [dupList, setDupList] = useState([]);

  useEffect(() => {
    if(isUndefined(storageMounts)) return;

    const valueCount = storageMounts.reduce((res, x) => {
      if (res[x['mountPoint']] === undefined) {
        res[x['mountPoint']] = 0;
      }
      res[x['mountPoint']] += 1;
      return res;
    }, {});
    const newDupList = storageMounts.filter(x => valueCount[x['mountPoint']] > 1).map(x => x['mountPoint']);

    const msgId = `KeyValueList ${name}`;
    let errorMessage = '';
    if (newDupList.length > 0) {
      errorMessage = `${name || 'KeyValueList'} has duplicated values.`;
    }

    if (storageMounts.some(x => isEmpty(x['name']) && !isEmpty(x['mountPoint']))) {
      errorMessage = `${name || 'KeyValueList'} has key with empty value.`;
    }
    if (storageMounts.some(x => isEmpty(x['mountPoint']) && !isEmpty(x['name']))) {
      errorMessage = `${name || 'KeyValueList'} has value with empty key.`;
    }

    setErrorMessage(msgId, errorMessage);
    setDupList(newDupList);
  }, [storageMounts]);

  const onAdd = useCallback(() => {
    onChange([...storageMounts, { name: '', mountPoint: '' }]);
  }, [onChange, storageMounts]);

  const onKeyChange = useCallback((idx, val) => {
    onChange([...storageMounts.slice(0, idx), { ...storageMounts[idx], name: val, mountPoint: `/root/${val}` }, ...storageMounts.slice(idx + 1)]);
  }, [onChange, storageMounts]);

  const onValueChange = useCallback((idx, val) => {
    onChange([...storageMounts.slice(0, idx), { ...storageMounts[idx], mountPoint: val }, ...storageMounts.slice(idx + 1)]);
  }, [onChange, storageMounts]);

  const onRemove = useCallback(idx => {
    onChange([...storageMounts.slice(0, idx), ...storageMounts.slice(idx + 1)]);
  }, [onChange, storageMounts]);

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
        className={`${classes.pl_10}`}
        item
        lg={9}
        md={9}
        sm={9}
        xl={9}
        xs={9}
      >
        <Grid
          container
          direction="column"
          spacing={2}
        >
          {
            !isUndefined(storageMounts) && (
              storageMounts.map((item, index) => {
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
                          classes={{ root: classes.select, outlined: `${classes.maxW_100} ${classes.w_full}` }}
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
                            : isEmpty(item.name) && !isEmpty(item.mountPoint) ? `${t('Select')}${t('enSpace')}${t('storage')}` : ''
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
            )
          }
        </Grid>
        <Grid>
          <DefaultButton
            classNameProps={`${classes.mt_16}`}
            onClick={onAdd}
            startIcon={<Icon>add</Icon>}
          >
            {t('Add')}
          </DefaultButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

StorageMount.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  hint: PropTypes.string,
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  onError: PropTypes.func,
  storageMounts: PropTypes.array.isRequired,
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

export default StorageMount;