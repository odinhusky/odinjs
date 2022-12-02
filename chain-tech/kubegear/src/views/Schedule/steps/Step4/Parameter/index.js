import React, {
  useContext
} from 'react';

// % context
import ScheduleContext from '../../../ScheduleContext';

// ? Self-packed Components || Functions
import { Environment } from './Environment';

// ^ Plugins
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/Schedule/{CreateSchedule | EditSchedule}/Step4/ParametersList
 * @prop {array} parameters -- 關鍵字的陣列
 * @prop {funciton} setParameters -- 設定關鍵字的函式
 * @prop {function} setErrorMessage -- 紀錄錯誤訊息的函式
 * @component ParametersList
 * @description 關鍵字的設定區塊
*/
const Parameters = ({
  parameters,
  setParameters,
  setErrorMessage
}) => {

  // $init data
  const { t } = useTranslation();

  // = styles
  const { classes } = useContext(ScheduleContext);

  // - methods
  const onPortChange = v => setParameters(v);
  return (
    <div
      className={`${classes.d_flex} ${classes.flexInputTotal} ${classes.directionColumn}`}
    >
      <Environment
        keyField="key"
        keyName={t('keyword')}
        name="Parameter List"
        onChange={onPortChange}
        parameters={parameters}
        setErrorMessage={setErrorMessage}
        title={t('keyword')}
        valueField="value"
        valueName={t('Value')}
      />
    </div>
  );
};

Parameters.propTypes = {
  parameters: PropTypes.array,
  setParameters: PropTypes.func,
  setErrorMessage: PropTypes.func
}

export default Parameters;