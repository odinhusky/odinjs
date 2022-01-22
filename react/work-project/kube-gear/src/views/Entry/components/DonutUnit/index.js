import React from 'react'


// ^ Material-ui Componets(Functions)
import Typography from '@material-ui/core/Typography';

// ? Self-packed Components || Functions
import { DonutsProgress } from 'components/BaseChart';

// ? styles
import { makeStyles } from '@material-ui/core/styles'
import commonStyle from 'common/commonStyles'

const useStyles = makeStyles((theme) => {
  return {
    ...commonStyle(theme),
    donutUnit: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    donutUnitLabel: {
      fontSize: 14,
      fontWeight: 500,
      marginBottom: 8
    }
  }
});

// ^ plugins
import PropTypes from 'prop-types';

/**
 * @author odin
 * @param {string} labelText -- Label text
 * @param {string} donutProgressProps -- donutProgress related props
 * @level views/Entry/BaseSimpleCard/DonutUnit
 * @component DonutUnit
 * @description DonutProgress set with label text
*/
export default function DonutUnit({
  containerClass,
  labelClass,
  labelText,
  donutProgressProps
}) {

  // = styles
  const classes = useStyles();

  return (
    <div className={`${classes.donutUnit} ${containerClass}`}>

      <Typography
        className={`${classes.donutUnitLabel} ${labelClass}`}
        component="div"
        variant="body2"
      >
        {labelText}
      </Typography>

      <DonutsProgress
        {...donutProgressProps}
      />

    </div>
  )
}

DonutUnit.propTypes = {
  containerClass: PropTypes.string,
  labelClass: PropTypes.string,
  labelText: PropTypes.string.isRequired,
  donutProgressProps: PropTypes.object.isRequired
}