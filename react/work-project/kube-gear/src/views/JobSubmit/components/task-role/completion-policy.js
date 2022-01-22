import React, { useContext } from 'react';

// ? context
import Context from '../context'

// ^ Material-ui Componets(Functions)
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';

// ? Self-packed Components || Functions
import { BasicSection } from '../basic-section';
import { SpinButton } from './spin-button';
import { Completion } from '../../models/completion';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';


export const CompletionPolicy = React.memo(({ onChange, value, classNameObj }) => {

  // $ init data
  const { t } = useTranslation();
  const isTablet = useMediaQuery('(max-width: 1280px)');
  const { minFailedInstances, minSucceededInstances } = value;

  // ? context
  const {
    classes
  } = useContext(Context);

  // -methods
  const _onChange = (keyName, newValue) => {
    if (newValue === 0) newValue = null
    const completion = new Completion(value);
    completion[keyName] = newValue;
    if (onChange !== undefined) {
      onChange(completion);
    }
  };

  return (
    <BasicSection
      childrenGrid={isTablet ? 12 : 9}
      classNameObj={{
        container: `${classes.completePolicyContainer}`,
        formlabeGrid: `${classes.completePolicyFormLabeGrid}`
      }}
      containerItem
      sectionLabel={`${t('conditionsOfCompletion')}(${t('optional')})`}
      titleGrid={isTablet ? 12 : 3}
      titleOptions={isTablet ? { justify: 'flex-start' } : { justify: 'flex-end', alignItems: 'center' }}
    >
      <Grid
        className={`${isTablet && classes.mt_6}`}
        container
        spacing={3}
      >
        <Grid
          className={`${classes.unlimitWidthInput}`}
          item
          lg={isTablet ? 6 : 4}
          md={isTablet ? 6 : 4}
          sm={isTablet ? 6 : 4}
          xl={isTablet ? 6 : 4}
          xs={isTablet ? 6 : 4}
        >
          <SpinButton
            className={`${classNameObj?.firstInput}`}
            InputLabelProps={{ shrink: true }}
            InputProps={{ inputProps: { min: 0 } }}
            label={t('minimumCountOfFailedInstances')}
            onChange={value => _onChange('minFailedInstances', value)}
            sectionLabel={`${t('retryCount')}(${t('optional')})`}
            style={{ width: '100%' }}
            value={minFailedInstances}
          />
        </Grid>
        <Grid
          className={`${classes.unlimitWidthInput} ${classNameObj?.secondInputGrid}`}
          item
          lg={isTablet ? 6 : 4}
          md={isTablet ? 6 : 4}
          sm={isTablet ? 6 : 4}
          xl={isTablet ? 6 : 4}
          xs={isTablet ? 6 : 4}
        >
          <SpinButton
            className={`${classNameObj?.secondInput}`}
            InputLabelProps={{ shrink: true }}
            InputProps={{ inputProps: { min: 0 } }}
            label={t('minimumCountOfSuccessfulInstances')}
            onChange={value => _onChange('minSucceededInstances', value)}
            sectionLabel={`${t('retryCount')}(${t('optional')})`}
            style={{ width: '100%' }}
            value={minSucceededInstances}
          />
        </Grid>
      </Grid>
    </BasicSection>
  );
});

CompletionPolicy.propTypes = {
  value: PropTypes.instanceOf(Completion).isRequired,
  onChange: PropTypes.func,
  classNameObj: PropTypes.object
};
