import React, {
  useContext
} from 'react';

// % context
import ScheduleContext from '../../../ScheduleContext';

// ^ Plugins
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/Schedule/{CreateSchedule | EditSchedule}/Step4/Step4Title
 * @prop {string} title -- 標題內容
 * @component Step4Title
 * @description 關鍵字的設定區塊
*/
const Step4Title = ({
  title
}) => {

  // = styles
  const { classes } = useContext(ScheduleContext);

  // - methods
  return (
    <div
      className={`${classes.w_full} ${classes.step4Title} ${classes.mb_16}`}
    >
      { title }
    </div>
  );
};

Step4Title.propTypes = {
  title: PropTypes.string
}

export default Step4Title;