import React, { useContext } from 'react';

// % context
import GlobalContext from 'layouts/Main/GlobalContext';

// ^ Material-ui Componets(Functions)
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from '@material-ui/pickers';
import palette from '../../theme/palette';

// ^ plugins
import DateFnsUtils from '@date-io/date-fns';
// import { colors } from '@material-ui/core';
import { ja, zhCN, zhTW, enUS } from 'date-fns/locale';
import PropTypes from 'prop-types';

// % styles
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > .MuiInputBase-root': {
      height: 40,
      borderRadius: 4,
      cursor: 'pointer',
      '& > input': {
        cursor: 'pointer'
      }
    },

    '& .MuiInputBase-input': {
      padding: 12
    }
  },
  w_full: {
    width: '100%'
  },
  margin: {
    margin: theme.spacing(5)
  },
  titleStyle: {
    padding: '5px 0'
  }
}));

/**
 * @author elvis
 * @level any/BaseDateTimePicker
 * @component BaseDateTimePicker
 * @description Date and Time picker component
*/
export const BaseDateTimePicker = ({
  title,
  isRequired,
  classNameProps,
  ...props
}) => {

  // ? context
  const { locale } = useContext(GlobalContext);

  // - methods
  const mapLoacle = (locale) => {
    switch (locale) {
      case 'zh-CN':
        return zhCN
      case 'zh-TW':
        return zhTW
      case 'jp':
        return ja
      case 'en':
      default:
        return enUS
    }
  }

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: palette.themePrimary
        // contrastText: colors.green[500],
        // dark: colors.red[800],
        // light: colors.indigo[100]
      }
    }
  });

  // = styles
  const classes = useStyles();

  return (
    <div className={`${classes.w_full}`}>

      {
        title && (
          <div className={`${classes.titleStyle}`}>
            {title}
            { isRequired && <span style={{ color: 'red' }}> *</span> }
          </div>
        )
      }

      <MuiPickersUtilsProvider
        locale={mapLoacle(locale)}
        themes={theme}
        utils={DateFnsUtils}
      >
        <KeyboardDateTimePicker
          ampm={false}
          className={`${classes.root} ${classNameProps}`}
          format="yyyy/MM/dd HH:mm"
          // InputProps={{
          //   disableUnderline: true
          // }}
          {...props}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
};

BaseDateTimePicker.propTypes = {
  title: PropTypes.string,
  isRequired: PropTypes.bool,
  classNameProps: PropTypes.string
};

export default BaseDateTimePicker;
