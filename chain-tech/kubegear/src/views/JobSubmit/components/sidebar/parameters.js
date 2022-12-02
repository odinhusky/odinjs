import React, { useContext } from 'react';

// ? context
import Context from '../context';

// ^ Material-ui Components(Functions)
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';

// ? Self-packed Components || Functions
import { BaseTooltip } from 'components/BaseTooltip';
import { Environment } from '../controls/environment';

// ^ Plugins
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export const Parameters = React.memo(
  ({ parameters, onChange }) => {

    // $ init data
    const { t } = useTranslation();
    const isTablet = useMediaQuery('(max-width: 1280px)');

    // ? context
    const { classes } = useContext(Context);

    return (
      <div className={`${classes.pt_20}`}>
        <div className={`${classes.tabFormContainer} ${classes.flex_align_center}`}>
          <div className={`${classes.fz_18} ${classes.pr_8}`}>
            {t('environmentVariable')}
          </div>
          <BaseTooltip
            arrow
            onClick={() => {}}
            title={t('toolTipsParameters')}
          >
            <IconButton
              aria-label="info"
              children={<Icon classes={{ root: classes.fz_18 }}>info_outlined</Icon>}
              className={classes.p_0}
            />
          </BaseTooltip>
        </div>
        <Grid
          className={`${classes.directionColumn} ${classes.m_0}`}
          container
          spacing={2}
        >
          <Environment
            classNameObj={{
              firstInput: `${isTablet ? classes.pr_10 : classes.pr_8}`,
              secondInputGrid: `${isTablet ? classes.pl_2 : classes.pl_4}`,
              secondInput: `${isTablet ? classes.pr_20 : classes.pr_16}`
            }}
            name="Parameter List"
            onChange={onChange}
            parameters={parameters}
          />
        </Grid>
      </div>
    );
  },
);

Parameters.propTypes = {
  parameters: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};
