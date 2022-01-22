import React, {
  useState,
  useContext,
  useEffect
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
import { isEmpty } from 'lodash';
// import moment from 'moment';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/ClusterReport/User/CycleBar
 * @component CycleBar
 * @description 用戶中的使用率
*/
const CycleBar = ({
  dropdownForUser,
  dropdownForVg,
  setSearchInfo
}) => {

  // $ init data
  const { t } = useTranslation();

  // # states
  const [selectedOption, setSelectedOption] = useState([t('last15min')]);
  const [selectedKey, setSelectedKey] = useState('15min');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedVg, setSelectedVg] = useState([]);

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

  // * hooks
  useEffect(() => {
    if (!isEmpty(dropdownForUser)) {
      setSelectedUser(dropdownForUser[0].text)
      setSearchInfo(prev => ({
        ...prev,
        vg: null,
        user: dropdownForUser[0]
      }))
    }
  }, [dropdownForUser])

  useEffect(() => {
    if (!isEmpty(dropdownForVg)) {
      setSelectedVg([dropdownForVg[0].text])
      setSearchInfo(prev => ({
        ...prev,
        vg: dropdownForVg[0]
      }))
    }
  }, [dropdownForVg])

  useEffect(() => {
    const textValue = options.find(item => item.key === selectedKey).text
    setSelectedOption([textValue])
  }, [t, selectedKey])

  return (
    <div className={`${classes.flex_align_center} ${classes.flex_wrap} ${classes.p_20} ${classes.pb_0}`}>
      <MuiDropdown
        classes={{ root: `${classes.mr_20} ${classes.mb_20} ${classes.defaultInput}` }}
        list={dropdownForVg}
        maxWidth={150}
        onChange={(e) => {
          const value = e.target.value
          setSelectedVg(value)
          setSearchInfo((param) => ({ ...param, vg: value }))
        }}
        // selectProps={{
        //   SelectDisplayProps: { style: { paddingTop: 17, paddingBottom: 13, fontSize: 16 } }
        // }}
        text={`${t('group')}`}
        value={selectedVg}
      />
      <MuiDropdown
        classes={{ root: `${classes.mr_20} ${classes.mb_20} ${classes.defaultInput}` }}
        list={dropdownForUser}
        maxWidth={150}
        onChange={(e) => {
          const value = e.target.value
          setSelectedUser(value)
          setSearchInfo((param) => ({ ...param, user: { key: value, name: value }, vg: null }))
        }}
        // selectProps={{
        //   SelectDisplayProps: { style: { paddingTop: 17, paddingBottom: 13, fontSize: 16 } }
        // }}
        text={`${t('User')}`}
        value={selectedUser}
      />
      <MuiDropdown
        classes={{ root: `${classes.mr_20} ${classes.mb_20} ${classes.defaultInput}` }}
        list={options}
        maxWidth={150}
        onChange={(e, child) => {
          const value = e.target.value;
          setSelectedOption(value)
          setSelectedKey(child.props.optionkey)
          setSearchInfo((param) => ({
            ...param,
            cycle: {
              key: child.props.optionkey
            }
          }))
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
                  setEndDate(date);
                  setSearchInfo((param) => ({
                    ...param,
                    cycle: {
                      key: 'custom',
                      start: startDate,
                      end: date
                    }
                  }))
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
        onClick={() => setSearchInfo((param) => ({ ...param, isClickSearch: true }))}
        startIcon={<Icon>search</Icon>}
      />
    </div>
  );
};

CycleBar.propTypes = {
  setSearchInfo: PropTypes.func,
  dropdownForUser: PropTypes.array,
  dropdownForVg: PropTypes.array
};

export default CycleBar;