import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    '& .MuiInputLabel-formControl': {
      top: -5
    },
    '& .Mui-focused':{
      top: 0
    },
    '& .MuiAutocomplete-endAdornment': {
      top: 'initial'
    }
  }
}))

export const ComboBox = ({ options, label, ...props }) => {
  const classes = useStyles();
  return (
    <Autocomplete
      className={`${classes.root}`}
      noOptionsText={'No Options'}
      options={options}
      renderInput={
        (params) =>
          <TextField
            {...params}
            label={label}
            variant="outlined"
          />
      }
      {...props}
    />
  );
}

ComboBox.propTypes = {
  options: PropTypes.array.isRequired,
  label: PropTypes.string
}

export default ComboBox;
