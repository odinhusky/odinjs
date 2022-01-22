/* eslint-disable react/no-multi-comp */
import React from 'react';

// ? Self-packed Components || Functions
import BaseTable from 'components/BaseTable';
import BaseStatusBadge from 'components/BaseBadge/BaseStatusBadge';
import Ordering from './Ordering';

// ^ Plugins
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';


const Table = ({ isLoading, licenseList, ordering, setOrdering }) => {
  const { t } = useTranslation();
  const applySortProps = column => {
    column.isSorted = ordering.field === column.key;
    column.isSortedDescending = ordering.descending;
    column.onColumnClick = (event, column) => {
      const { field, descending } = ordering;
      if (field === column.key) {
        if (descending) {
          setOrdering(new Ordering());
        } else {
          setOrdering(new Ordering(field, true));
        }
      } else {
        setOrdering(new Ordering(column.key));
      }
    }
    return column;
  }

  const columns = [
    applySortProps({
      key: 'IP',
      name: 'IP',
      fieldName: 'ip',
      minWidth: 10,
      maxWidth: 100,
      isResizable: true
    }),
    applySortProps({
      key: 'expiryDate',
      name: t('ExpirationTime'),
      fieldName: 'expiryDate',
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: licenseInfo =>
        licenseInfo.licenseDate
          ? moment(new Date(parseInt(licenseInfo.licenseDate) * 1000)).format('YYYY/MM/DD HH:mm:ss')
          : null
    }),
    applySortProps({
      key: 'gpuLimit',
      name: `${t('VGA')}${t('enSpace')}${ t('limit')}`,
      fieldName: 'gpuLimit',
      minWidth: 100,
      maxWidth: 150,
      isResizable: true
    }),
    applySortProps({
      key: 'gpuCount',
      name: `${t('GPU')}`,
      fieldName: 'gpuCount',
      minWidth: 100,
      maxWidth: 150,
      isResizable: true
    }),
    applySortProps({
      key: 'license',
      name: t('license'),
      fieldName: 'license',
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      // isMultiline: true,
      onRender: function getLicenseInfo(licenseInfo) {
        if (!licenseInfo.keyId) {
          return null;
        }
        return (
          <>{licenseInfo.keyId}</>
        );
      }
    }),
    applySortProps({
      key: 'error',
      name: t('status'),
      fieldName: 'error',
      minWidth: 200,
      maxWidth: 200,
      isResizable: true,
      onRender(licenseInfo) {
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
  ];
  return (
    <div>
      <BaseTable
        columns={columns}
        enableShimmer={isLoading}
        items={ordering.apply(licenseList)}
        setKey="license"
      />
    </div>
  )
}

Table.propTypes = {
  isLoading: PropTypes.bool,
  licenseList: PropTypes.array,
  ordering: PropTypes.object,
  setOrdering: PropTypes.func
}

export default Table;