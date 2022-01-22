import React, { useState, useEffect, useCallback } from 'react';

// # API
import { getLoginInfo } from 'utils/api';

// ? context
import LogingLogContext from './components/Context';

// ^ Material-ui Componets(Functions)
import { Refresh } from '@material-ui/icons';
import Icon from '@material-ui/core/Icon';
import { Grid } from '@material-ui/core';

// ? Self-packed Components || Functions
import Table from './components/Table';
import BreadCrumbs from 'components/BreadCrumbs';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import MuiDropdown from 'components/BaseMuiDropdown';
import Ordering from './components/Ordering';
import BaseKeyboardDatePicker from 'components/BaseKeyboardDatePicker'


// ? styles
import { makeStyles } from '@material-ui/core/styles'
import commonStyle from 'common/commonStyles'
import loginLogStyle from './loginLogStyle'

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme),
  ...loginLogStyle(theme)
}))

// ^ plugins
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import moment from 'moment';

/**
 * @author odin
 * @level views/LoginLog
 * @component LoginLog
 * @description Contains accounts logging information
*/
export default function LoginLog() {
  // $ init data
  const { t } = useTranslation();
  const defaultData = {
    startDateForPicker: null,
    endDateForPicker: null
  };

  // = style
  const classes = useStyles();

  // # states
  const [loginLogList, setLoginLogList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalListNum, setTotalListNum] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [ordering, setOrdering] = useState(new Ordering());
  const [filterInfo, setFilterInfo] = useState(defaultData);

  // - methods
  const addDropDownOptionKeys = optionItems => {
    return optionItems.map((item) => ({
      key: item.name,
      text: item.name,
      ...item
    }));
  };

  const getData = useCallback(() => {
    setIsLoading(true);
    const { username, clientIp, success, startDate, endDate, sort } = filterInfo;

    let data = {};
    if (username) data.username = username;
    if (clientIp) data.clientIp = clientIp;
    if (success !== null) data.success = success;
    if (startDate) data.startDate = startDate;
    if (endDate) data.endDate = endDate;
    if (sort) data.sort = sort;

    data = {
      sort: 'createdDate,DESC',
      page: pageIndex,
      size: rowsPerPage,
      ...data
    };
    getLoginInfo(data)
      .then(json => {
        setLoginLogList(json.content);
        setTotalListNum(json.totalElements);
        setIsLoading(false);
      })
      .catch(err => {
        toast.error(err.message ? err.message : err.toString())
        setIsLoading(false);
      });
  }, [filterInfo, pageIndex, rowsPerPage]);

  // handled data
  const dropdownOptions = [
    { name: t('success'), data: { icon: 'Accept' }, optionkey: true },
    { name: t('fail'), data: { icon: 'Cancel' }, optionkey: false },
    { name: t('allShow'), data: { icon: '6PointStar' }, optionkey: '' }
  ];

  // % context
  const context = {
    pageIndex,
    rowsPerPage,
    ordering,
    setOrdering,
    setPageIndex,
    setRowsPerPage,
    filterInfo,
    setFilterInfo,
    isLoading,
    totalListNum
  };

  // * hooks
  useEffect(() => {
    getData()
  }, [pageIndex, rowsPerPage, ordering]);

  return (
    <LogingLogContext.Provider value={context}>
      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', padding: '0 20px 20px', height: '100%', overflow: 'hidden' }}>
        <BreadCrumbs />
        <div>
          <DefaultButton
            children={t('refresh')}
            classes={{ root: `${classes.mb_10}` }}
            disabled={isLoading}
            onClick={() => {
              getData();
            }}
            startIcon={<Refresh />}
          />
        </div>
        <Grid
          container
        >
          <Grid item>
            <MuiAutocomplete
              classes={{ root: `${classes.mr_20} ${classes.mb_20} ${classes.h_auto}` }}
              onInputChange={(e, username) => {
                setFilterInfo(defaultData => {
                  return {
                    ...defaultData,
                    username: `%${username}%`,
                    usernameValue: username
                  };
                });
              }}
              placeholder={`${t('search')}${t('enSpace')}${t('User')}`}
              value={filterInfo.usernameValue}
            />
          </Grid>

          <Grid item>
            <MuiAutocomplete
              classes={{ root: `${classes.mr_20} ${classes.mb_20} ${classes.h_auto}` }}
              onInputChange={(e, clientIp) => {
                setFilterInfo(defaultData => {
                  return {
                    ...defaultData,
                    clientIp: `%${clientIp}%`,
                    clientIpValue: clientIp
                  };
                });
              }}
              placeholder={`${t('search')} IP`}
              value={filterInfo.clientIpValue}
            />
          </Grid>

          <Grid item>
            <MuiDropdown
              classes={{ root: `${classes.mr_20} ${classes.mb_20}` }}
              list={addDropDownOptionKeys(dropdownOptions)}
              onChange={(e, option) => {
                setFilterInfo(defaultData => {
                  return {
                    ...defaultData,
                    success: option.props.optionkey,
                    name: option.props.value
                  };
                });
              }}
              onRenderOption={(data) => {
                return (
                  <div style={{ color: data.color, display: 'flex', alignItems: 'center' }}>
                    <div>{data.name}</div>
                  </div>
                )
              }}
              text={`${t('select')}${t('enSpace')}${t('type')}`}
              value={filterInfo.name}
            />
          </Grid>
          <Grid
            className={`${classes.flex_align_center}`}
            item
          >
            {/* 開始日期 */}
            <div className={`${classes.ctrlBarDatePicker} ${classes.mr_20} ${classes.mb_20}`}>
              <BaseKeyboardDatePicker
                id="startDate"
                label={t('selectastartdate')}
                maxDate={new Date()}
                onChange={(date) => {
                  // Unix Millisecond Timestamp
                  // console.log(moment(new Date(date)).format('x'));
                  setFilterInfo(defaultData => {
                    const copyObj = { ...defaultData }
                    if (date === null) {
                      delete copyObj['startDate']
                      return {
                        ...copyObj,
                        startDateForPicker: date
                      }
                    }
                    return {
                      ...defaultData,
                      startDate: moment(new Date(date)).format('x'),
                      startDateForPicker: date
                    };
                  });
                }}
                value={filterInfo.startDateForPicker}
              />
            </div>

            {/* 結束日期 */}
            <div className={`${classes.ctrlBarDatePicker} ${classes.mr_20} ${classes.mb_20}`}>
              <BaseKeyboardDatePicker
                disabled={!filterInfo.startDate}
                id="endDate"
                label={t('selectaenddate')}
                maxDate={new Date()}
                minDate={filterInfo.startDateForPicker}
                onChange={(date) => {
                  // Unix Millisecond Timestamp
                // console.log(moment(new Date(date)).format('x'));
                  setFilterInfo(defaultData => {
                    const copyObj = { ...defaultData }
                    if (date === null) {
                      delete copyObj['endDate']
                      return {
                        ...copyObj,
                        endDateForPicker: date
                      }
                    }
                    return {
                      ...defaultData,
                      endDate: moment(new Date(date)).format('x'),
                      endDateForPicker: date
                    };
                  });
                }}
                value={filterInfo.endDateForPicker}
              />
            </div>
          </Grid>

          <Grid item>
            <PrimaryButton
              children={t('search')}
              onClick={()=>{
                getData();
              }}
              startIcon={<Icon>search</Icon>}
            />
          </Grid>
        </Grid>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Table loginLogList={loginLogList} />
        </div>
      </div>
    </LogingLogContext.Provider>
  );
}
