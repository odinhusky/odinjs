import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListSubheader } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 120,
    '& .Mui-focused':{
      top: 0
    }
  },
  select: {
    height: 40
  },
  selectIcon: {
    top: '30%'
  },
  labelChange: {
    top: -5
  },
  labelChangeHasValue: {
    top: 0
  },
  textcolor: {
    color: theme.palette.customColor.themePrimary
  }
}))


const BaseDropdown = ({
  list,
  text,
  value = [],
  valueOrigin,
  onChange,
  onRenderOption,
  multiple = false,
  maxWidth,
  width,
  selectProps,
  inputLabelProps,
  onChangeChecked,
  classNameObj,
  ...props
}) => {
  const classes = useStyles();
  const defaultOptions = (item, multiple) => {
    const { itemType, onClick } = item;
    if (onRenderOption !== undefined) {
      return (
        <MenuItem
          key={item.key}
          optionkey={item.optionkey}
          value={item.text}
        >
          {onRenderOption(item)}
        </MenuItem>
      )
    }

    const defaultChecked = (item) => {
      // 沒有傳判斷的 function 才會 true 進來判斷
      if (!onChangeChecked) {
        return value.indexOf(item.text) > -1
      }

      // 有傳就直接用該 function 判斷是否要打勾
      return onChangeChecked(valueOrigin, item)
    }

    switch (itemType) {
      case 0:
        return (<Divider key={item.key} />);
      case 1:
        return (
          <MenuItem
            key={item.key}
            onClick={onClick}
            type={item.type}
            value={item.text}
          >
            {item.text}
          </MenuItem>
        );
      case 2:
        return (
          <ListSubheader
            className={classes.textcolor}
            disableSticky
            key={item.key}
          >
            {item.text}
          </ListSubheader>
        );
      default:
        return (
          <MenuItem
            key={item.key}
            optionkey={item.optionkey}
            value={item.text}
            {...item}
          >
            {
              multiple &&
              <Checkbox
                checked={defaultChecked(item)}
              />
            }
            {item.text}
          </MenuItem>
        );
    }
  }

  return (
    <FormControl
      className={`${classes.formControl} ${classNameObj?.container}`}
      style={{ maxWidth: maxWidth, width: width }}
      variant="outlined"
      {...props}
    >
      <InputLabel
        classes={{
          root: clsx(classes.labelChange, {
            [classes.labelChangeHasValue]: value.length > 0
          })
        }}
        htmlFor="select-privilege"
        {...inputLabelProps}
      >
        {text}
      </InputLabel>
      <Select
        classes={{ icon: classes.selectIcon }}
        className={`${classes.select} ${classNameObj?.select}`}
        displayEmpty
        label={text}
        labelId="select-privilege"
        multiple={multiple}
        onChange={onChange}
        renderValue={
          multiple
            ? (selected) => selected.join(', ')
            : (selected) => selected
        }
        // SelectDisplayProps={{ style: { paddingTop: 17, paddingBottom: 4, fontSize: 16 } }}
        value={value}
        {...selectProps}
      >
        {list.map((item) => defaultOptions(item, multiple))}
      </Select>
    </FormControl>
  );
};

BaseDropdown.propTypes = {
  list: PropTypes.array,
  text: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string
  ]),
  onChange: PropTypes.func,
  multiple: PropTypes.bool,
  maxWidth: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  width: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  onRenderOption: PropTypes.func,
  selectProps: PropTypes.object,
  inputLabelProps: PropTypes.object,
  onChangeChecked: PropTypes.func,
  valueOrigin: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string
  ]),
  classNameObj: PropTypes.object
};

export default BaseDropdown;
