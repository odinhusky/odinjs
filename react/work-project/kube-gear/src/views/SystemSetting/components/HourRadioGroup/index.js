import React, {
// useState,
} from 'react'

// ^ Material-ui Components(Functions)
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControl from '@material-ui/core/FormControl'
import { BaseRadio } from 'components/BaseMuiInput'
import { DebounceRestrictRangeNumberInput } from 'components/Debounce/DebounceRestrictRangeNumberInput'

// ? Self-packed Components || Functions
// import rules from 'common/commonValidation'

// ^ plugins
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

// % style
import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles'

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme),
  fullFormTitle: {
    width: '100%',
    color: theme.palette.customColor.black_87,
    marginBottom: 30
  },
  limitHour: {
    maxWidth: 200,
    marginRight: 20,

    '& .MuiInputBase-root': {
      height: 40
    },

    '& .MuiInputLabel-outlined': {
      transform: 'translate(14px, 14px) scale(1)'
    },

    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
      transform: 'translate(14px, -6px) scale(0.75)'
    }
  }
}))

/**
 * @author odin
 * @level views/SystemSetting/SystemSettingPanel/HourRadioGroup
 * @prop {object} showData -- 包含需要顯示的資料
 * # {
 * #  keyName: 要顯示的小標題,
 * #  option: radio 的行為值, 0 為自定義 | -1 為無限制的選項
 * #  value: 實際上要傳送給後端的值，有可能的範圍是 -1 ~ 無限制
 * # }
 * @prop {funciton} setFunc -- 設定對應外層 state 的 function
 * @component HourRadioGroup
 * @description Use Radio to decide the hour would be or unlimited
*/
export default function HourRadioGroup({
  showData,
  setFunc,
  textInputProps
}) {

  // $ init data
  const { t } = useTranslation()

  // = styles
  const classes = useStyles()

  // & handled data
  const isjobTimeHour = showData.isjobTimeHour ? true : false

  return (
    <div className={`${classes.w_full} ${classes.mb_24} ${classes.col_6} ${classes['largeAlpha:col_12']}`}>

      {/* 標題考慮到種類的不同特別有做 label 屬性的設計，來顯示不同的子標題 */}
      <div className={`${classes.fullFormTitle}`}>
        {
          `${
            isjobTimeHour
              ? t(showData.label)
              : `${showData.keyName} - ${showData.number}`
          }`
        }
      </div>

      {/* 內容 */}
      <div className={`${classes.flex_align_center} ${classes.w_full}`}>
        <FormControl className={`${classes.w_full}`}>
          <RadioGroup
            className={`${classes.w_full} ${classes.flex_align_center}`}
            name={'jobLifeHour'}
            onChange={(e) => {
              const option = +(e.target.value)

              if(isjobTimeHour) {
                setFunc((obj) => ({
                  ...obj,
                  option
                }))
              } else {
                setFunc((obj) => ({
                  ...obj,
                  [showData.keyName]: {
                    ...showData,
                    option
                  }
                }))
              }
            }}
            row
            value={showData.option}
          >
            {/* 自定義 */}
            <BaseRadio
              label={t('customize')}
              radioProps={{
                color: 'primary',
                className: classes.radioRoot
              }}
              value={0}
            />

            {/* 有限制範圍的 Number Input */}
            <DebounceRestrictRangeNumberInput
              classNameProps={`${classes.limitHour}`}
              max={showData.number ? showData.number : 9007199254740991}
              min={0}
              onChange={(jobLifeHour) => {
                // 更新 state
                if(isjobTimeHour) {
                  setFunc((obj) => ({
                    ...obj,
                    value: jobLifeHour
                  }))
                } else {
                  setFunc((obj) => ({
                    ...obj,
                    [showData.keyName]: {
                      ...showData,
                      value: jobLifeHour
                    }
                  }))
                }
              }}
              textInputProps={{
                variant: 'outlined',
                label: t(showData.inputLabel),
                disabled: showData.option === -1,
                ...textInputProps
              }}
              value={showData.value}
            />

            <BaseRadio
              label={t('Unlimited')}
              radioProps={{
                color: 'primary',
                className: classes.radioRoot
              }}
              value={-1}
            />
            {/* </div> */}
          </RadioGroup>
        </FormControl>
      </div>

    </div>
  )
}

HourRadioGroup.propTypes = {
  showData: PropTypes.object.isRequired,
  setFunc: PropTypes.func.isRequired,
  textInputProps: PropTypes.object
};