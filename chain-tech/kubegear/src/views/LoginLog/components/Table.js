import React, {
  useContext,
  useEffect
} from 'react';

// ? context
import LogingLogContext from '../LogingLogContext';

// ? Self-packed Components || Functions
import BasePaper from 'components/BaseMuiPaper';
import Ordering from './Ordering';
// import BaseTable from 'components/BaseTable';

// ^ Plugins
import moment from 'moment';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/LoginLog/Table
 * @component Table
 * @description Loging list
*/
function Table({ loginLogList }) {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const {
    ordering,
    setOrdering,
    totalListNum,
    pageIndex,
    setPageIndex,
    rowsPerPage,
    setRowsPerPage
  } = useContext(LogingLogContext);

  // - methods
  // isLoading filterInfo setFilterInfo
  function applySortProps(column) {
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

  const namecolumn = applySortProps({
    id: 'username',
    key: 'username',
    label: t('User'),
    onTableCellRender: loginLogInfo => (
      <div>
        {loginLogInfo.username}
      </div>
    )
  })

  const clientIpColumn = applySortProps({
    id: 'clientIp',
    key: 'clientIp',
    label: 'IP',
    onTableCellRender: loginLogInfo => {
      return (
        <div key={loginLogInfo.clientIp}>
          {loginLogInfo.clientIp}
        </div>
      );
    }
  })

  // & handled data
  const successColumn = {
    id: 'success',
    key: 'success',
    label: t('status'),
    onTableCellRender: loginLogInfo => {
      return (
        <div key={loginLogInfo.success}>
          {loginLogInfo.success ? t('success') : t('fail')}
        </div>
      );
    }
  }

  const createDateColumn = applySortProps({
    id: 'createdDate',
    key: 'createdDate',
    label: t('time'),
    onTableCellRender: loginLogInfo => {
      return (
        <div key={loginLogInfo.createdDate}>
          {moment(loginLogInfo.createdDate).format('YYYY/MM/DD HH:mm:ss')}
        </div>
      );
    }
  })

  const columns = [
    namecolumn,
    clientIpColumn,
    successColumn,
    createDateColumn
  ];

  // * hooks
  useEffect(() => {
    // onColumnClick(event, createDateColumn);
  }, []);

  // console.log('table loginLogList', loginLogList);
  // console.log('table loginLogList ordering', ordering.apply(loginLogList));

  return (
    <BasePaper
      columns={columns}
      exceptionActionGivenTotalCount={totalListNum}
      labelRowsPerPage={t('labelRowsPerPage')}
      onChangePage={(event, newPageIndex) => setPageIndex(newPageIndex)}
      onChangeRowsPerPage={(event) => {
        setRowsPerPage(+event.target.value)
        setPageIndex(0)
      }}
      ordering={ordering}
      page={pageIndex}
      rows={ordering.apply(loginLogList)}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={[10, 50, 100]}
      rowsPerPageOptionsRemoveAll
    />
  );
}

Table.propTypes = {
  loginLogList: PropTypes.array
};

export default Table;
