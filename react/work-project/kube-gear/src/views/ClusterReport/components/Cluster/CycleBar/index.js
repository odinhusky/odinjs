import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// % context
import Context from '../../../Context'

// ^ Material-ui Componets(Functions)
import Icon from '@material-ui/core/Icon';

// ? Self-packed Components || Functions
import MuiDropdown from 'components/BaseMuiDropdown';
import { PrimaryButton } from 'components/BaseButton';
import BaseKeyboardDatePicker from 'components/BaseKeyboardDatePicker'

// ^ plugins
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

/**
 * @author odin
 * @level views/ClusterReport/Cluster/CycleBar
 * @component CycleBar
 * @description 叢集中的使用率
*/
const CycleBar = ({
  duration,
  onChange
}) => {

  // $ init data
  const { t } = useTranslation();
  const history = useHistory();

  // # states
  const [selectedOption, setSelectedOption] = useState([t('last15min')]);
  const [selectedKey, setSelectedKey] = useState('15min');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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

  // * hook
  /**
   * @author odin
   * @description 如果有 duration 的 props 則設定 select 相關的文字以及key值
  */
  useEffect(() => {
    if (duration && duration !== ''){
      const textValue = options.find(item => item.key === duration).text
      setSelectedOption([textValue])
      setSelectedKey(duration)
    }
  }, [duration])

  useEffect(() => {
    const textValue = options.find(item => item.key === selectedKey).text
    setSelectedOption([textValue])
  }, [t, selectedKey])

  return (
    <div className={`${classes.flex_align_center} ${classes.flex_wrap} ${classes.p_20} ${classes.pb_0}`}>
      <MuiDropdown
        classes={{ root: `${classes.mr_20} ${classes.mb_20} ${classes.defaultInput}` }}
        list={options}
        maxWidth={150}
        onChange={(e, child) => {
          const value = e.target.value;
          setSelectedOption(value)
          setSelectedKey(child.props.optionkey)
        }}
        // selectProps={{
        //   SelectDisplayProps: { style: { paddingTop: 17, paddingBottom: 13, fontSize: 16 } }
        // }}
        text={`${t('Period')}`}
        value={selectedOption}
      />
      {
        selectedKey === 'custom' &&
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
                label={t('selectaenddate')}
                maxDate={new Date()}
                minDate={startDate}
                onChange={(date) => {
                  setEndDate(date)
                }}
                value={endDate}
              />
            </div>
          </>
      }
      <PrimaryButton
        children={t('search')}
        classNameProps={`${classes.mb_20}`}
        disabled={selectedKey === 'custom' ? !(startDate && endDate) : false}
        onClick={() => {
          const durationTextsArray = ['today', 'week', 'month']
          if (selectedKey === 'custom') {
            onChange({
              key: selectedKey,
              start: moment(startDate).format('YYYY/MM/DD'),
              end: moment(endDate).format('YYYY/MM/DD')
            })
          } else {
            onChange({ key: selectedKey })
          }
          if (durationTextsArray.includes(selectedKey)) {
            history.replace({ search: `?tab=cluster&duration=${selectedKey}` })
          } else {
            history.replace({ search: '?tab=cluster' })
          }
        }}
        startIcon={<Icon>search</Icon>}
      />
    </div>
  );
};

CycleBar.propTypes = {
  duration: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default CycleBar;