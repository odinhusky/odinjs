import React, {
  useState,
  useContext,
  useEffect
} from 'react';

// # API
import { getUserUsedResource } from 'utils/api';

// % context
import ClusterReportContext from 'views/ClusterReport/ClusterReportContext';

// ^ Material-ui Componets(Functions)
import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';
import { BaseTooltip } from 'components/BaseTooltip';

// ? Self-packed Components || Functions
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import BasePanel from 'components/BasePanel';
import BasePaper from 'components/BaseMuiPaper';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import MuiDropdown from 'components/BaseMuiDropdown';
import BaseKeyboardDatePicker from 'components/BaseKeyboardDatePicker'
import Ordering from './Ordering';
import { computeDayRange } from '../../utils';
import { dateConvertToDurationsObj } from 'utils';
import { useCheckPrivilege } from 'utils/hooks/useCheckPrivilege';

// ^ plugins
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import moment from 'moment';

// ^ plugins
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/ClusterReport/UsedTime
 * @component UsedTime
 * @description 報表分析中的使用時長頁面
*/
const UsedTime = ({
  duration
}) => {
  // $ init data
  const { t } = useTranslation();
  const permission = useCheckPrivilege('ADMIN');
  const history = useHistory();

  // ? context
  const { classes } = useContext(ClusterReportContext);

  // # states
  const [selectedCycle, setSelectedCycle] = useState('15min');
  const [selectedOption, setSelectedOption] = useState([t('last15min')]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [allUserUsedData, setAllUserUsedData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [ordering, setOrdering] = useState(new Ordering());
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // & handled data
  const cycleOption = [
    { key: '15min', text: t('last15min'), optionkey: '15min' },
    { key: '4hr', text: t('last4hr'), optionkey: '4hr' },
    { key: 'today', text: t('today'), optionkey: 'today' },
    { key: 'week', text: t('thisWeek'), optionkey: 'week' },
    { key: 'month', text: t('thisMonth'), optionkey: 'month' },
    { key: 'custom', text: t('Custom'), optionkey: 'custom' }
  ]

  // - methods
  const applySortProps = column => {
    column.isSorted = ordering.field === column.id;
    column.isSortedDescending = ordering.descending;
    column.onColumnClick = (event, column) => {
      const { field, descending } = ordering;
      if (field === column) {
        if (descending) {
          setOrdering(new Ordering());
        } else {
          setOrdering(new Ordering(field, true));
        }
      } else {
        setOrdering(new Ordering(column));
      }
    }
    return column;
  }

  /**
   * @author odin
   * @param {string} cycle -- today | week | month | custom
   * @description 依照不同的範圍去請求使用時長的資料
  */
  const getData = (cycle = selectedCycle) => {
    setIsLoading(true);

    const { start, end } = computeDayRange({
      start: startDate,
      end: endDate,
      key: cycle
    })

    getUserUsedResource({ startDate: moment.unix(start).valueOf(), endDate: moment.unix(end).valueOf() })
      .then(data => {
        setAllUserUsedData(data);
      })
      .catch(err => {
        const msg = err.data ? err.data.message : err.toString();
        toast.error(msg)
      })
      .finally(() => setIsLoading(false))
  }

  // * hooks
  /**
   * @author odin
   * @description Component data init
   * 有傳duration的 props 的話，則要判斷是否要設定 duration 的cycle，藉此獲得不同期間的資料
  */
  useEffect(() => {
    if (duration && duration !== ''){
      const durationObj = cycleOption.find((item) => duration === item.optionkey)

      setSelectedOption(durationObj.text)
      setSelectedCycle(durationObj.optionkey)

      getData(durationObj.optionkey)
    } else {
      // 如果沒有 duration 的 props 就預設取得今天的資料
      getData();
    }
  }, [duration])

  // useEffect(() => {
  //   console.log('selectedCycle effect', selectedCycle)
  // }, [selectedCycle])

  useEffect(() => {
    setTableData(() => {
      let res = ordering.apply(allUserUsedData);
      res = res.filter(item => {
        return item.username.toLowerCase().includes(keyword.toLowerCase());
      })
      return res
    })
  }, [allUserUsedData, ordering, keyword])

  useEffect(() => {
    if (permission === null) return;
    if (!permission) {
      history.push('entry')
    }
  }, [permission])

  useEffect(() => {
    const textValue = cycleOption.find(item => item.key === selectedCycle).text
    setSelectedOption([textValue])
  }, [t, selectedCycle])

  return (
    <div className={`${classes.clusterReportUsedTimeWrapper}`}>
      <div>
        <DefaultButton
          children={t('refresh')}
          disabled={isLoading}
          onClick={() => getData()}
          startIcon={<Refresh />}
        />
      </div>
      <BasePanel
        className={`${classes.clusterReportUsedTimeWrapper} ${classes.mt_16}`}
        contentStyle={{ flexGrow: 2, display: 'flex', overflow: 'hidden' }}
        title={t('usageTime')}
      >
        <div className={`${classes.clusterReportUsedTimeContainer}`}>
          <div className={`${classes.clusterReportUsedTimeSearchBar}`}>
            <div className={`${classes.flex_align_center}`}>
              <MuiDropdown
                classes={{ root: `${classes.mr_20} ${classes.defaultInput}` }}
                list={cycleOption}
                maxWidth={150}
                onChange={(e, child) => {
                  const value = e.target.value;

                  // console.log('value', value)
                  // console.log('optionkey', child.props.optionkey)

                  setSelectedOption(value)
                  setSelectedCycle(child.props.optionkey)
                }}
                // selectProps={{
                //   SelectDisplayProps: { style: { paddingTop: 17, paddingBottom: 13, fontSize: 16 } }
                // }}
                text={`${t('Period')}`}
                value={selectedOption}
              />
              {
                selectedCycle === 'custom' &&
                <>
                  <div className={`${classes.defaultInput} ${classes.mr_20}`}>
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

                  <div className={`${classes.defaultInput} ${classes.mr_20}`}>
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
                disabled={(selectedCycle === 'custom' && (!startDate || !endDate)) || isLoading}
                onClick={() => {
                  const durationTextsArray = ['today', 'week', 'month']
                  getData()
                  if (durationTextsArray.includes(selectedCycle)) {
                    history.replace({ search: `?tab=usedTime&duration=${selectedCycle}` })
                  } else {
                    history.replace({ search: '?tab=usedTime' })
                  }
                }}
                startIcon={<Icon>search</Icon>}
              />
            </div>
            <div>
              <MuiAutocomplete
                onInputChange={(e, value) => setKeyword(value)}
                placeholder={t('search')}
                value={keyword}
              />
            </div>
          </div>
          <div className={`${classes.overflowHidden} ${classes.mt_10}`}>
            <BasePaper
              columns={[
                applySortProps({
                  id: 'name',
                  key: 'name',
                  label: t('User'),
                  onTableCellRender: (item) => (item.username)
                }),
                applySortProps({
                  id: 'cpu',
                  key: 'cpu',
                  label: `${t('CPU')} x ${t('time')}`,
                  onTableCellRender: (item) => {
                    if (item.resourceUsedTime.cpu === undefined || item.resourceUsedTime.cpu === 0) return 0;
                    const { text } = dateConvertToDurationsObj(item.resourceUsedTime.cpu);
                    return text === '' ? 0 : text
                  }
                }),
                // MB 單位轉換成 GB
                applySortProps({
                  id: 'memory',
                  key: 'memory',
                  label: `${t('memory')}(GB) x ${t('time')}`,
                  onTableCellRender: (item) => {
                    if (item.resourceUsedTime.memory === undefined || item.resourceUsedTime.memory === 0) return 0;
                    const { text } = dateConvertToDurationsObj(item.resourceUsedTime.memory / 1024);
                    return text === '' ? 0 : text
                  }
                }),
                applySortProps({
                  id: 'storage',
                  key: 'storage',
                  label: `${t('disk')}(GB) x ${t('time')}`,
                  onTableCellRender: (item) => {
                    if (item.resourceUsedTime.storage === undefined || item.resourceUsedTime.storage === 0) return null;
                    const { text } = dateConvertToDurationsObj(item.resourceUsedTime.storage);
                    return text === '' ? 0 : text
                  }
                }),
                applySortProps({
                  id: 'gpu',
                  key: 'gpu',
                  label: `${t('GPU')} x ${t('time')}`,
                  onTableCellRender: item => {
                    let text = '';
                    if (item.resourceUsedTime.gpu !== 0 || item.resourceUsedTime.gpu !== undefined) {
                      const { text: result } = dateConvertToDurationsObj(Object.values(item.resourceUsedTime.gpu).reduce((acc, curr) => acc += curr, 0));
                      text = result
                    }
                    return (
                      <BaseTooltip
                        style={{ cursor: 'pointer' }}
                        title={
                          !isEmpty(item.resourceUsedTime.gpu)
                            ?
                            <div>
                              {
                                Object.entries(item.resourceUsedTime.gpu).map(([key, value]) => {
                                  if (value === 0 || value === undefined) return <div key={key} />
                                  const { text } = dateConvertToDurationsObj(value);
                                  return (
                                    <div key={key}>
                                      {key}: {text === '' ? 0 : text}
                                    </div>
                                  )
                                })
                              }
                            </div>
                            :
                            ''
                        }
                      >
                        <div>
                          {text === '' ? 0 : text}
                        </div>
                      </BaseTooltip>
                    );
                  }
                }),
                applySortProps({
                  id: 'jobCount',
                  key: 'jobCount',
                  label: `${t('Jobs')}`,
                  onTableCellRender: (item) => (item.resourceUsedTime.jobCount)
                }),
                applySortProps({
                  id: 'jobTime',
                  key: 'jobTime',
                  label: t('jobUseTime'),
                  onTableCellRender: (item) => {
                    if (item.resourceUsedTime.jobTime === undefined || item.resourceUsedTime.jobTime === 0) return 0;
                    const { text } = dateConvertToDurationsObj(item.resourceUsedTime.jobTime);
                    return text === '' ? 0 : text
                  }
                })
              ]}
              labelRowsPerPage={t('labelRowsPerPage')}
              ordering={ordering}
              page={page}
              rows={ordering.apply(tableData)}
              rowsPerPage={rowsPerPage}
              setPage={setPage}
              setRowsPerPage={setRowsPerPage}
            />
          </div>
        </div>
      </BasePanel>
    </div>
  );
};

export default UsedTime;

UsedTime.propTypes = {
  duration: PropTypes.string
}