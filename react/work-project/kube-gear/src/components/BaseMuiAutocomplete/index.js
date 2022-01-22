import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    width: 200,
    height: 40,
    '& .MuiFormLabel-root': {
      fontSize: 14
    },
    '& .MuiInputLabel-formControl': {
      top: -5
    },
    '& .Mui-focused':{
      top: 0
    }
  }
}))

const BaseAutocomplete = ({ placeholder, textFieldProps, ...props }) => {
  const classes = useStyles();
  return (
    <Autocomplete
      className={classes.root}
      disableClearable
      freeSolo
      options={[]}
      renderInput={(params) => (
        <TextField
          {...params}
          InputProps={{
            style: { height: 40, fontSize: 16 }
          }}
          // inputStyle={{ textAlign: 'center' }}
          label={placeholder}
          variant="outlined"
          {...textFieldProps}
        />
      )}
      {...props}
    />
  );
};

BaseAutocomplete.propTypes = {
  text: PropTypes.string,
  placeholder: PropTypes.string,
  textFieldProps: PropTypes.object
};

export default BaseAutocomplete;
