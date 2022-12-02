import React, { useState, useEffect, useCallback } from 'react';

// # API
import { getLicense } from 'utils/api';

// ^ Material-ui Componets(Functions)
import { makeStyles } from '@material-ui/core/styles';
import { Refresh } from '@material-ui/icons';
import CircularProgress from '@material-ui/core/CircularProgress';

// ? Self-packed Components || Functions
import Ordering from './Ordering';
import Filter from './Filter';
import BreadCrumbs from 'components/BreadCrumbs';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import MuiDropdown from 'components/BaseMuiDropdown';
import BasePaper from 'components/BaseMuiPaper';
import ErrorMessageBar from 'components/ErrorMessageBar';
import { DefaultButton } from 'components/BaseButton';
import BaseStatusBadge from 'components/BaseBadge/BaseStatusBadge';

// ^ Plugins
import moment from 'moment';
import { useTranslation } from 'react-i18next';

// ? styles
import commonStyle from 'common/commonStyles';
import licenseListStyles from './licenseListStyles';

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme),
  ...licenseListStyles(theme)
}))

const LicenseList = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [error, setError] = useState(null);
  const [licenseList, setLicenseList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [selectedValue, setSelectedValue] = useState([])
  const [selectedKey, setSelectedKey] = useState();
  const [filter, setFilter] = useState(new Filter())
  const [ordering, setOrdering] = useState(new Ordering());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const addDropDownOptionKeys = optionItems => {
    return optionItems.map((item) => ({
      key: item.name,
      text: item.name,
      ...item
    }));
  };

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

  const getData = useCallback(() => {
    setIsLoading(true);
    getLicense()
      .then(jsonData => {
        setLicenseList(jsonData);
        setError(null);
      })
      .catch(err => setError(err?.message ? err.message : err.toString()))
      .finally(() => setIsLoading(false))
  }, []);


  useEffect(getData, []);

  useEffect(() => {
    setFilter(new Filter(keyword, selectedKey))
  }, [keyword, selectedKey])

  return (
    <div className={`${classes.licenseListContainer}`}>
      <BreadCrumbs />
      {error !== null ? <ErrorMessageBar error={error}/> : null}
      <div className={`${classes.licenseListTopBar}`}>
        <DefaultButton
          children={t('refresh')}
          onClick={() => getData()}
          startIcon={<Refresh />}
        />
        <div className={`${classes.d_flex}`}>
          <MuiAutocomplete
            classes={{ root: `${classes.mr_10} ${classes.h_auto}` }}
            onInputChange={(e, value) => setKeyword(value)}
            placeholder={`${t('search')} IP`}
            value={keyword}
          />
          <MuiDropdown
            list={addDropDownOptionKeys([
              { name: t('allShow'), data: { icon: '6PointStar' }, color: '#001EF5', optionkey: 0 },
              { name: t('normal'), data: { icon: 'CheckMark' }, color: '#008756', optionkey: 1 },
              { name: t('error'), data: { icon: 'Cancel' }, color: '#DD4B39',  optionkey: 2 }
            ])}
            maxWidth={150}
            onChange={(e, child) => {
              setSelectedValue([e.target.value]);
              setSelectedKey(child.props.optionkey)
            }}
            onRenderOption={(data) => {
              return (
                <div style={{ color: data.color, display: 'flex', alignItems: 'center' }}>
                  <div>{data.name}</div>
                </div>
              )
            }}
            text={`${t('select')}${t('type')}`}
            value={selectedValue}
          />
        </div>
      </div>
      <div
        className={`
          ${classes.flexGrow1}
          ${classes.overflowHidden}
          ${isLoading && classes.licenseListIsLoading}
        `}
      >
        {
          isLoading
            ? <CircularProgress />
            :
            <BasePaper
              columns={[
                applySortProps({
                  id: 'ip',
                  key: 'ip',
                  label: 'IP'
                }),
                applySortProps({
                  id: 'expiryDate',
                  key: 'expiryDate',
                  label: t('ExpirationTime'),
                  onTableCellRender: licenseInfo =>
                    licenseInfo.licenseDate
                      ? moment(new Date(parseInt(licenseInfo.licenseDate) * 1000)).format('YYYY/MM/DD HH:mm:ss')
                      : null
                }),
                applySortProps({
                  id: 'gpuLimit',
                  key: 'gpuLimit',
                  label: `${t('VGA')}${t('enSpace')}${ t('limit')}`
                }),
                applySortProps({
                  id: 'gpuCount',
                  key: 'gpuCount',
                  label: `${t('GPU')}`
                }),
                applySortProps({
                  id: 'license',
                  key: 'license',
                  label: t('license'),
                  onTableCellRender: function getLicenseInfo(licenseInfo) {
                    if (!licenseInfo.keyId) {
                      return null;
                    }
                    return (
                      <>{licenseInfo.keyId}</>
                    );
                  }
                }),
                applySortProps({
                  id: 'error',
                  key: 'error',
                  label: t('status'),
                  onTableCellRender (licenseInfo) {
                    let { error } = licenseInfo;
                    if (typeof(error) === 'object') {
                      error = JSON.stringify(error);
                    }
                    return (
                      <>
                        {
                          error ?
                            <BaseStatusBadge
                              maxW={75}
                              status={'fail'}
                            >
                              {error}
                            </BaseStatusBadge>
                            :
                            <BaseStatusBadge
                              maxW={75}
                              status={'success'}
                            >
                              {t('normal')}
                            </BaseStatusBadge>
                        }
                      </>
                    );
                  }
                })
              ]}
              labelRowsPerPage={t('labelRowsPerPage')}
              ordering={ordering}
              page={page}
              rows={filter.apply(ordering.apply(licenseList))}
              rowsPerPage={rowsPerPage}
              setPage={setPage}
              setRowsPerPage={setRowsPerPage}
            />
        }
      </div>
    </div>
  );
};

export default LicenseList;
