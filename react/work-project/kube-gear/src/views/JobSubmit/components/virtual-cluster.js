import React, { useMemo, useCallback, useContext } from 'react';

// % context
import Context from './context';

// ^ Material-ui Componets(Functions)
import { BasicSection } from './basic-section';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';

export const VirtualCluster = React.memo(
  ({ sectionTooltip, sectionShowUnderVg, onChange, virtualCluster, classNameObj,  breakpoint }) => {

    // $ init data
    const { t } = useTranslation();

    // ? context
    const { vcNamesWithSchedulable, classes } = useContext(Context);

    // & handled data
    const options = useMemo(() => {
      const hasSchedulable = vcNamesWithSchedulable.filter(item => item.schedulable !== false).map((item) => ({ key: item.name, text: item.name }))
      const notHasSchedulable = vcNamesWithSchedulable.filter(item => item.schedulable === false).map((item) => ({ key: item.name, text: item.name }))

      if (isEmpty(vcNamesWithSchedulable)) return [];

      if (!isEmpty(hasSchedulable)) {
        return [
          { key: 'group', text: t('group'), itemType: 2 },
          ...notHasSchedulable,
          { key: 'divider_1', text: '-', itemType: 0 },
          { key: 'scheduleGroup', text: `${t('schedule')}${t('enSpace')}${t('group')}`, itemType: 2 },
          ...hasSchedulable
        ]
      } else {
        return [ ...notHasSchedulable ]
      }
    }
    , [vcNamesWithSchedulable]);

    const _onChange = useCallback((e) => {
      const value = e.target.value;
      if (onChange !== undefined) {
        onChange(value);
      }
    }, [onChange]);


    return (
      <>
        <BasicSection
          childrenGrid={breakpoint ? 12 : 3}
          className={`${classes.vgCtrl}`}
          classNameObj={classNameObj}
          containerItem
          sectionLabel={t('group')}
          sectionTooltip={sectionTooltip}
          titleOptions={breakpoint ? { justify: 'flex-start' } : { justify: 'flex-end', alignItems: 'center' }}
        >
          <TextField
            classes={{ root: classes.w_full }}
            id="outlined-virtual-cluster"
            onChange={_onChange}
            select
            value={virtualCluster}
            variant="outlined"
          >
            {options.map((item) => {
              if (item.itemType === 0) {
                return (<Divider key={item.key} />)
              }
              if (item.itemType === 2) {
                return (
                  <MenuItem
                    className={classes.textColor}
                    disabled
                    key={item.key}
                    style={{ opacity: 1, fontWeight: 700 }}
                  >
                    {item.text}
                  </MenuItem>
                )
              }
              return (
                <MenuItem
                  key={item.key}
                  value={item.text}
                >
                  {item.text}
                </MenuItem>
              )
            })}
          </TextField>

        </BasicSection>
        <div className={`${classes.vgDetail}`}>
          { sectionShowUnderVg }
        </div>
      </>
    );
  });

VirtualCluster.propTypes = {
  sectionTooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  sectionShowUnderVg: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onChange: PropTypes.func,
  virtualCluster: PropTypes.string,
  breakpoint: PropTypes.bool,
  classNameObj: PropTypes.object
};
