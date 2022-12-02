import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// % context
import ClusterReportContext from '../../../../../ClusterReportContext'

// ^ Material-ui Componets(Functions)
import Icon from '@material-ui/core/Icon';

// ? Self-packed Components || Functions
import MuiDropdown from 'components/BaseMuiDropdown';
import { PrimaryButton } from 'components/BaseButton';
import BaseKeyboardDatePicker from 'components/BaseKeyboardDatePicker'

// ^ plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
// import moment from 'moment';

/**
 * @author odin
 * @level views/ClusterReport/SingleNode/Pages/DetailPage/CycleBar
 * @component CycleBar
 * @description 單節點頁面，詳細主機內容頁面的 cyclebar
*/
const CycleBar = ({
  isIndexPage,
  totalOptionTask,
  setCycle,
  getSelectedUseRate,
  totalOptionJobandRole,
  getSelectedJob,
  selectedJobandRole,
  setSelectedJobandRole
}) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const { classes } = useContext(ClusterReportContext);

  // # states
  const [selectedOption, setSelectedOption] = useState([t('last15min')]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedJob, setSelectedJob] = useState([]);
  const [selectedJobTaskRoles, setSelectedJobTaskRoles] = useState([]);
  const [selectedPeriodKey, setSelectedPeriodKey] = useState('15min');

  // & handled data
  const options = [
    { key: '15min', text: t('last15min'), optionkey: '15min' },
    { key: '4hr', text: t('last4hr'), optionkey: '4hr' },
    { key: 'today', text: t('today'), optionkey: 'today' },
    { key: 'week', text: t('thisWeek'), optionkey: 'week' },
    { key: 'month', text: t('thisMonth'), optionkey: 'month' },
    { key: 'custom', text: t('Custom'), optionkey: 'custom' }
  ]

  // * hooks
  useEffect(() => {
    setSelectedJobandRole(totalOptionJobandRole.filter(item => selectedJobTaskRoles.includes(item.text)))
  }, [selectedJobTaskRoles])

  useEffect(() => {
    if (selectedJob.length > 0) {
      setSelectedJob([])
    }
    if (selectedJobTaskRoles.length > 0) {
      setSelectedJobTaskRoles([])
    }
  }, [selectedOption])

  useEffect(() => {
    const textValue = options.find(item => item.key === selectedPeriodKey).text
    setSelectedOption([textValue])
  }, [t, selectedPeriodKey])

  return (
    <div className={`${classes.d_flex} ${classes.py_20}`}>
      <div className={`${classes.flex_align_center} ${classes.flex_wrap}`}>
        <MuiDropdown
          classes={{ root: `${classes.mr_20} ${classes.mb_20} ${classes.defaultInput}` }}
          list={totalOptionTask}
          maxWidth={200}
          onChange={(e) => {
            const value = e.target.value;
            getSelectedJob(isIndexPage.host, value)
            setSelectedJobTaskRoles([])
            setSelectedJobandRole([])
            setSelectedJob(value)
          }}
          // selectProps={{
          //   SelectDisplayProps: { style: { paddingTop: 17, paddingBottom: 13, fontSize: 16 } }
          // }}
          text={`${t('job')}`}
          value={selectedJob}
        />
        <MuiDropdown
          classes={{ root: `${classes.mr_20} ${classes.mb_20} ${classes.defaultInput}` }}
          list={totalOptionJobandRole}
          maxWidth={200}
          multiple
          onChange={(e) => {
            const value = e.target.value;
            setSelectedJobTaskRoles(value)
          }}
          // selectProps={{
          //   SelectDisplayProps: { style: { paddingTop: 17, paddingBottom: 13, fontSize: 16 } }
          // }}
          text={`${t('task')}${t('enSpace')}${t('role')}`}
          value={selectedJobTaskRoles}
        />
        <MuiDropdown
          classes={{ root: `${classes.mr_20} ${classes.mb_20} ${classes.defaultInput}` }}
          list={options}
          maxWidth={150}
          onChange={(e, child) => {
            const value = e.target.value;
            setSelectedOption(value)
            setSelectedPeriodKey(child.props.optionkey)
            setCycle(item => ({ ...item, key: child.props.optionkey }))
          }}
          // selectProps={{
          //   SelectDisplayProps: { style: { paddingTop: 17, paddingBottom: 13, fontSize: 16 } }
          // }}
          text={`${t('Period')}`}
          value={selectedOption}
        />
        {
          selectedPeriodKey === 'custom' &&
          <>
            <div className={`${classes.defaultInput} ${classes.mr_20} ${classes.mb_20}`}>
              <BaseKeyboardDatePicker
                id="startDate"
                label={t('selectastartdate')}
                maxDate={new Date()}
                onChange={(date) => {
                  setStartDate(date)
                  setEndDate(null);
                }}
                value={startDate}
              />
            </div>

            <div className={`${classes.defaultInput} ${classes.mr_20} ${classes.mb_20}`}>
              <BaseKeyboardDatePicker
                disabled={!startDate}
                label={t('selectaenddate')}
                maxDate={new Date()}
                minDate={startDate}
                onChange={(date) => {
                  setEndDate(date);
                  setCycle(item => ({
                    ...item,
                    start: startDate,
                    end: date
                  }));
                }}
                value={endDate}
              />
            </div>
          </>
        }
        <PrimaryButton
          children={t('search')}
          classNameProps={`${classes.mb_20}`}
          disabled={selectedPeriodKey === 'custom' ? !(startDate && endDate) : false}
          onClick={() => {
            setCycle(item => ({ ...item, key: selectedPeriodKey }))
            getSelectedUseRate(selectedJobandRole)
          }}
          startIcon={<Icon>search</Icon>}
        />
      </div>
    </div>
  );
};

CycleBar.propTypes = {
  isIndexPage: PropTypes.object,
  setCycle: PropTypes.func,
  totalOptionTask: PropTypes.array,
  getSelectedUseRate: PropTypes.func,
  selectedJobandRole: PropTypes.array,
  getSelectedJob: PropTypes.func,
  totalOptionJobandRole: PropTypes.array,
  setSelectedJobandRole: PropTypes.func
};

export default CycleBar;