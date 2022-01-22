import React, {
  useEffect,
  useState,
  useContext
} from 'react';

// # API
import { getTotalHostInfo } from 'utils/api';

// % context
import Context from '../../../../Context'

// ^ Material-ui Componets(Functions)
import Icon from '@material-ui/core/Icon';

// ? Self-packed Components || Functions
import MuiDropdown from 'components/BaseMuiDropdown';
import { PrimaryButton } from 'components/BaseButton';
import BaseKeyboardDatePicker from 'components/BaseKeyboardDatePicker'
import { computeDayRange } from '../../../../utils';

// ^ plugins
import { useLocation, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { uniqBy, isEmpty, isNull } from 'lodash';

const CycleBar = ({
  jobs,
  onChange,
  searchInfo
}) => {

  // $ init data
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  // # states
  const [selectedVg, setSelectedVg] = useState([]);
  const [selectedJob, setSelectedJob] = useState([]);
  const [vgOption, setVgOption] = useState([]);
  const [jobOption, setJobOption] = useState([]);
  const [selectedOption, setSelectedOption] = useState([t('last15min')]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalJobFromGrafana, setTotalJobFromGrafana] = useState([]);
  const [totalJobFilterByGrafana, setTotalJobFilterByGrafana] = useState([]);
  const [settingVgJobByQuery, setSettingVgJobByQuery] = useState(false);
  const [selectedPeriodKey, setSelectedPeriodKey] = useState();

  // = styles
  const { classes } = useContext(Context);

  // & handled data
  const options = [
    { key: '15min', text: t('last15min'), optionkey: '15min' },
    { key: '4hr', text: t('last4hr'), optionkey: '4hr' },
    { key: 'today', text: t('today'), optionkey: 'today' },
    { key: 'week', text: t('thisWeek'), optionkey: 'week' },
    { key: 'month', text: t('thisMonth'), optionkey: 'month' },
    { key: 'custom', text: t('Custom'), optionkey: 'custom' }
  ]

  // - methods
  const getTotalJob = async(type = 'default',) => {
    const range = computeDayRange(selectedOption);
    const { start, end } = range;
    if (type === 'default') {
      const res = await getTotalHostInfo({
        'match[]': 'task_cpu_percent',
        start,
        end
      })

      return res && res.data
    } else {
      const res = await getTotalHostInfo({
        'match[]': 'task_cpu_percent',
        start,
        end
      })

      return res && res.data
    }
  }

  // * hooks
  useEffect(() => {
    if (!isEmpty(selectedVg)) {
      const options = totalJobFilterByGrafana
        .filter(job => (job.description.virtualGroup === selectedVg[0]))
        .map(job => ({ key: job.name, text: job.name, username: job.username }))
      if (!isEmpty(options) && settingVgJobByQuery) {
        setJobOption(options);
        const findJob = options.find(item => item.key === query.get('jobName'));
        setSelectedJob(findJob !== undefined ? [findJob.text] : []);
        setSettingVgJobByQuery(false);
      } else {
        setJobOption(options);
        setSelectedJob(isEmpty(options[0]) ? [] : [options[0].text]);
      }
    }
  }, [selectedVg])

  useEffect(() => {
    if (!isEmpty(totalJobFromGrafana)) {
      const jobsFilterDescriptionNull = jobs.filter(job => {
        if (isNull(job.description)) return false
        if (job.description.virtualGroup === undefined) return false
        return true
      })
      const jobsExistGrafana = jobsFilterDescriptionNull.filter(job => {
        const jobName = job.name
        return totalJobFromGrafana.some(j => j.job_name.split('~')[1] === jobName)
      })
      setTotalJobFilterByGrafana(jobsExistGrafana);
      const vg = uniqBy(jobsExistGrafana.map(job => ({ text: job.description.virtualGroup, key: job.description.virtualGroup })), 'key')
      if (!isEmpty(vg) && settingVgJobByQuery) {
        setVgOption(vg);
        const findVg = vg.find(item => item.key === query.get('vg'))
        setSelectedVg(findVg !== undefined ? [findVg.text] : []);
      } else if (!isEmpty(vg) && settingVgJobByQuery === false) {
        setVgOption(vg);
        setSelectedVg([vg[0].text]);
      } else {
        setVgOption([]);
        setSelectedVg([]);
        setJobOption([]);
        setSelectedJob([]);
      }
    } else {
      setVgOption([]);
      setSelectedVg([]);
      setJobOption([]);
      setSelectedJob([]);
    }
  }, [totalJobFromGrafana, jobs])

  useEffect(() => {
    (async() => {
      let totalJob = [];
      if (selectedPeriodKey === 'custom') {
        if (!endDate) return
        totalJob = await getTotalJob('custom');
      } else {
        totalJob = await getTotalJob();
      }
      setTotalJobFromGrafana(totalJob)
    })()
  }, [selectedOption, endDate])

  useEffect(() => {
    if (query.get('createdTime')) {
      setStartDate(moment(new Date(Number(query.get('createdTime')))).format('YYYY-MM-DD'));
      setEndDate(moment(new Date()).format('YYYY-MM-DD'));
      setSelectedOption([t('customize')])
      setSelectedPeriodKey('custom')
      setSettingVgJobByQuery(true)
    }
  }, [])

  const isDisabled = () => {
    if (!selectedJob) return true
    return selectedPeriodKey === 'custom' ? !(startDate && endDate) : false
  }

  useEffect(() => {
    const isInitState = searchInfo.vg === null && searchInfo.job === null;
    const hasSelectedVg = !isEmpty(selectedVg);
    const hasSelectedJob = !isEmpty(selectedJob);
    const optionsSelected = hasSelectedVg && hasSelectedJob;
    if (isInitState && optionsSelected) {
      onChange(
        {
          vg: selectedVg[0],
          job: selectedJob[0],
          username: jobOption.find(item => item.text === selectedJob[0]) ? jobOption.find(item => item.text === selectedJob[0]).username : undefined,
          cycle: {
            key: selectedPeriodKey,
            start: startDate,
            end: endDate
          }
        }
      )
    }
  }, [searchInfo, selectedJob, selectedVg])

  useEffect(() => {
    if (selectedPeriodKey) {
      const textValue = options.find(item => item.key === selectedPeriodKey).text
      setSelectedOption([textValue])
    }
  }, [t, selectedPeriodKey])

  return (
    <div className={`${classes.flex_align_center} ${classes.flex_wrap} ${classes.p_20} ${classes.pb_0}`}>
      <MuiDropdown
        classes={{ root: `${classes.mr_20} ${classes.mb_20} ${classes.defaultInput}` }}
        list={vgOption}
        maxWidth={150}
        onChange={(e) => {
          const value = e.target.value;
          setSelectedVg([value])
        }}
        // selectProps={{
        //   SelectDisplayProps: { style: { paddingTop: 17, paddingBottom: 13, fontSize: 16 } }
        // }}
        text={`${t('group')}`}
        value={selectedVg}
      />
      <MuiDropdown
        classes={{ root: `${classes.mr_20} ${classes.mb_20} ${classes.defaultInput}` }}
        list={jobOption}
        maxWidth={150}
        onChange={(e) => {
          const value = e.target.value;
          setSelectedJob([value])
        }}
        // selectProps={{
        //   SelectDisplayProps: { style: { paddingTop: 17, paddingBottom: 13, fontSize: 16 } }
        // }}
        text={`${t('job')}`}
        value={selectedJob}
      />
      <MuiDropdown
        classes={{ root: `${classes.mr_20} ${classes.mb_20} ${classes.defaultInput}` }}
        list={options}
        maxWidth={150}
        onChange={(e, child) => {
          const value = e.target.value;
          setSelectedOption(value)
          setSelectedPeriodKey(child.props.optionkey)
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
                }}
                value={endDate}
              />
            </div>
          </>
      }
      <PrimaryButton
        children={t('search')}
        classNameProps={`${classes.mb_20}`}
        disabled={isDisabled()}
        onClick={() => {
          onChange({
            vg: selectedVg[0],
            job: selectedJob[0],
            username: jobOption.find(item => item.text === selectedJob[0]) ? jobOption.find(item => item.text === selectedJob[0]).username : undefined,
            cycle: {
              key: selectedPeriodKey,
              start: startDate,
              end: endDate
            }
          })
          if (query.get('createdTime')) {
            history.replace({ search: '?tab=job' })
          }
        }}
        startIcon={<Icon>search</Icon>}
      />
    </div>
  );
};

CycleBar.propTypes = {
  jobs: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  searchInfo: PropTypes.object
};

export default CycleBar;