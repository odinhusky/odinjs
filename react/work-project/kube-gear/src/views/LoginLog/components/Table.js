import React, { useContext, useEffect } from 'react';
import BasePaper from 'components/BaseMuiPaper';
import { Label } from 'office-ui-fabric-react/lib/Label';

// import BaseTable from 'components/BaseTable';
import Context from './Context';
import { useTranslation } from 'react-i18next';
import Ordering from './Ordering';

import moment from 'moment';

import PropTypes from 'prop-types';


function Table({ loginLogList }) {
  const { t } = useTranslation();
  const { ordering, setOrdering, totalListNum, pageIndex, setPageIndex, rowsPerPage, setRowsPerPage } = useContext(Context);

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
      <Label>
        {loginLogInfo.username}
      </Label>
    )
  })

  const clientIpColumn = applySortProps({
    id: 'clientIp',
    key: 'clientIp',
    label: 'IP',
    onTableCellRender: loginLogInfo => {
      return (
        <Label key={loginLogInfo.clientIp}>
          {loginLogInfo.clientIp}
        </Label>
      );
    }
  })

  const successColumn = {
    id: 'success',
    key: 'success',
    label: t('status'),
    onTableCellRender: loginLogInfo => {
      return (
        <Label key={loginLogInfo.success}>
          {loginLogInfo.success ? t('success') : t('fail')}
        </Label>
      );
    }
  }

  const createDateColumn = applySortProps({
    id: 'createdDate',
    key: 'createdDate',
    label: t('time'),
    onTableCellRender: loginLogInfo => {
      return (
        <Label key={loginLogInfo.createdDate}>
          {moment(loginLogInfo.createdDate).format('YYYY/MM/DD HH:mm:ss')}
        </Label>
      );
    }
  })

  const columns = [
    namecolumn,
    clientIpColumn,
    successColumn,
    createDateColumn
  ];

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
