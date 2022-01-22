import React, { useContext } from 'react';

// % context
import GlobalContext from 'layouts/Main/GlobalContext';

// ^ Material-ui Componets(Functions)
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import palette from '../../theme/palette';

// ? Self-packed Components || Functions
import { mapLoacle } from 'common/commonMethods'

// ^ Plugins
import PropTypes from 'prop-types';

// % Style
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles'

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme),
  datepicker: {
    width: '100%',
    '& .MuiInputBase-root': {
      height: 40,
      borderRadius: 4,
      padding: 0,
      cursor: 'pointer',
      '& > input': {
        cursor: 'pointer'
      }
    },

    '& .MuiOutlinedInput-input': {
      padding: '8px 15px'
    },

    '& .MuiInputLabel-outlined': {
      transform: 'translate(14px, 14px) scale(1)'
    },

    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
      transform: 'translate(14px, -6px) scale(0.75)'
    }
  }
}));


export const BaseDateTimePicker = ({ classNameProps, ...props }) => {

  // $ init data
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: palette.themePrimary
      }
    }
  });

  // ? context
  const { locale } = useContext(GlobalContext);

  // = styles
  const classes = useStyles();

  return (
    <MuiPickersUtilsProvider
      locale={mapLoacle(locale)}
      themes={theme}
      utils={DateFnsUtils}
    >
      <KeyboardDatePicker
        autoOk
        className={`${classes.datepicker} ${classNameProps}`}
        disableToolbar
        format="yyyy/MM/dd"
        inputVariant="outlined"
        variant="inline"
        {...props}
      />
    </MuiPickersUtilsProvider>
  );
};

BaseDateTimePicker.propTypes = {
  classNameProps: PropTypes.string
};

export default BaseDateTimePicker;
