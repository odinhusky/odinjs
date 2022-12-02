import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// % context
import ScheduleContext from '../../../ScheduleContext';

// ? Self-packed Components || Functions
import { DebounceRestrictRangeNumberInput } from 'components/Debounce/DebounceRestrictRangeNumberInput';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isEmpty, isNil } from 'lodash';

/**
 * @author odin
 * @level views/Schedule/CreateSchedule/Step3/TaskRole/Content/AtLeastNum
 * @component AtLeastNum
 * @prop {function} onChange -- 修改當前 taskRole completion 屬性的 value 的 setState
 * @prop {object} completionObj -- 驗證 key 字串的函式
 * @description AtLeastNum 的區塊
*/
export const AtLeastNum = ({
  onChange,
  completionObj
}) => {

  // $ init data
  const { t } = useTranslation();

  // = styles
  const { classes } = useContext(ScheduleContext);

  // # states
  const [failNum, setFailNum] = useState(0);
  const [successNum, setSuccessNum] = useState(0);

  // * hooks
  useEffect(() => {
    if(
      !isEmpty(completionObj)
        && !isNil(completionObj.minFailedInstances)
        && !isNil(completionObj.minSucceededInstances)
    ) {
      const { minFailedInstances, minSucceededInstances } = completionObj
      setFailNum(minFailedInstances)
      setSuccessNum(minSucceededInstances)
    }
  }, [completionObj])

  return (
    <div className={`${classes.flex_align_center} ${classes.w_full} ${classes.mb_30}`}>
      {/* 至多容許任務失敗數量 */}
      <div className={`${classes.flexFrontInput} ${classes.pr_10}`}>
        <DebounceRestrictRangeNumberInput
          classNameProps={classes.unlimitWidthInput}
          max={1}
          min={0}
          onChange={(value) => {
            setFailNum(value)
            onChange('completion', { ...completionObj, minFailedInstances: value })
          }}
          textInputProps={{
            InputLabelProps: { shrink: true },
            label: t('minimumCountOfFailedInstances')
          }}
          value={failNum}
        />
      </div>

      {/* 至少要求任務成功數量 */}
      <div className={`${classes.flexBackInput} ${classes.pl_10}`}>
        <DebounceRestrictRangeNumberInput
          classNameProps={classes.unlimitWidthInput}
          max={1}
          min={0}
          onChange={(value) => {
            setSuccessNum(value)
            onChange('completion', { ...completionObj, minSucceededInstances: value })
          }}
          textInputProps={{
            InputLabelProps: { shrink: true },
            label: t('minimumCountOfSuccessfulInstances')
          }}
          value={successNum}
        />
      </div>
    </div>
  );
};

AtLeastNum.propTypes = {
  onChange: PropTypes.func.isRequired,
  completionObj: PropTypes.object.isRequired
};

export default AtLeastNum;
