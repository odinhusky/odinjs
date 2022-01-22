import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// % context
import Context from '../../../../../Context'

// ^ Material-ui Componets(Functions)
import Icon from '@material-ui/core/Icon';

// ? Self-packed Components || Functions
import MuiDropdown from 'components/BaseMuiDropdown';
import { PrimaryButton } from 'components/BaseButton';
import BaseKeyboardDatePicker from 'components/BaseKeyboardDatePicker'

// ^ plugins
import { isEmpty, isNull } from 'lodash';
// import moment from 'moment';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

/**
 * @author odin
 * @level views/ClusterReport/SingleNode/Pages/IndexPage/CycleBar
 * @component CycleBar
 * @description 單節點頁面最上方的控制bar
*/
const CycleBar = ({
  setCycle,
  totalHost,
  activeInstance,
  setActiveInstance,
  setIsIndexPage,
  isIndexPage,
  getUseRate,
  getTotalGpuCount
}) => {

  // $ init data
  const { t } = useTranslation();
  const history = useHistory();

  // # states
  const [selectedOption, setSelectedOption] = useState([t('last15min')]);
  const [selectedHost, setSelectedHost] = useState([]);
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

  useEffect(() => {
    if (!isEmpty(totalHost)) {
      if (isNull(activeInstance)) {
        setSelectedHost(totalHost[0].text)
      } else {
        setSelectedHost([activeInstance])
      }
    }
  }, [totalHost, activeInstance])

  useEffect(() => {
    const textValue = options.find(item => item.key === selectedKey).text
    setSelectedOption([textValue])
  }, [t, selectedKey])

  return (
    <div className={`${classes.flex_align_center} ${classes.flex_wrap}`}>
      <MuiDropdown
        classes={{ root: `${classes.mr_20} ${classes.mb_20} ${classes.defaultInput}` }}
        list={totalHost}
        maxWidth={150}
        onChange={(e) => {
          const value = e.target.value;
          setSelectedHost(value)
          setIsIndexPage({
            ...isIndexPage,
            host: value
          })
          setActiveInstance(value)
        }}
        // selectProps={{
        //   SelectDisplayProps: { style: { paddingTop: 17, paddingBottom: 13, fontSize: 16 } }
        // }}
        text={`${t('host')}`}
        value={selectedHost}
      />
      <MuiDropdown
        classes={{ root: `${classes.mr_20} ${classes.mb_20} ${classes.defaultInput}` }}
        list={options}
        maxWidth={150}
        onChange={(e, child) => {
          const value = e.target.value;
          setSelectedOption(value)
          setSelectedKey(child.props.optionkey)
          setCycle(item => ({ ...item, key: child.props.optionkey }))
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
        disabled={selectedKey === 'custom' ? !(startDate && endDate) : false}
        onClick={() => {
          setCycle(item => ({ ...item, key: selectedKey }))
          getUseRate(isIndexPage.host)
          getTotalGpuCount(isIndexPage.host)
          setActiveInstance(isIndexPage.host)
          history.push({
            pathname: '/cluster-report',
            search: '?tab=singleNode&' + new URLSearchParams({ instance: isIndexPage.host }).toString()
          })
        }}
        startIcon={<Icon>search</Icon>}
      />
    </div>
  );
};

CycleBar.propTypes = {
  setCycle: PropTypes.func.isRequired,
  isIndexPage: PropTypes.object,
  totalHost: PropTypes.array,
  setIsIndexPage: PropTypes.func,
  getUseRate: PropTypes.func,
  getTotalGpuCount: PropTypes.func,
  activeInstance: PropTypes.string,
  setActiveInstance: PropTypes.func
};

export default CycleBar;