import React, { useState } from 'react';

// ^ Material-ui Componets(Functions)
import Ordering from '../../Ordering';
import BasePaper from 'components/BaseMuiPaper';
import { applySortProps } from 'common/commonMethods'

// ^ plugins
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';


const Table = ({ data }) => {
  // data
  const { t } = useTranslation();

  // # states
  // const [pagination, setPagination] = useState(new Pagination(5, 0))
  const [ordering, setOrdering] = useState(new Ordering());
  const [pageIndex, setPageIndex] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // & handled data
  const muiColumns = [
    applySortProps({
      column: {
        id: 'name',
        key: 'name',
        label: t('tableName'),
        cellStyle: {
          th: {
            backgroundColor: '#ffffff'
          }
          // td: {
          //   backgroundColor: 'blue'
          // }
        },
        onTableCellRender: loginLogInfo => {
          return (
            <div>
              {loginLogInfo.name}
            </div>
          )
        }
      },
      Ordering,
      ordering,
      setOrdering
    }),
    applySortProps({
      column: {
        id: 'isLeader',
        key: 'isLeader',
        label: t('identity'),
        cellStyle: {
          th: {
            backgroundColor: '#ffffff'
          }
        },
        onTableCellRender: info => (
          <div>
            { info.isLeader ? t('TeamLeader') : t('TeamMember') }
          </div>
        )
      },
      Ordering,
      ordering,
      setOrdering
    }),
    applySortProps({
      column: {
        id: 'email',
        key: 'email',
        label: t('email'),
        cellStyle: {
          th: {
            backgroundColor: '#ffffff'
          }
        }
      },
      Ordering,
      ordering,
      setOrdering
    }),
    applySortProps({
      column: {
        id: 'phone',
        key: 'phone',
        label: t('mobileNumber'),
        cellStyle: {
          th: {
            backgroundColor: '#ffffff'
          }
        }
      },
      Ordering,
      ordering,
      setOrdering
    })
  ]

  return (
    <>
      <BasePaper
        columns={muiColumns}
        labelRowsPerPage={t('labelRowsPerPage')}
        ordering={ordering}
        page={pageIndex}
        rows={ordering.apply(data)}
        rowsPerPage={rowsPerPage}
        setPage={setPageIndex}
        setRowsPerPage={setRowsPerPage}
      />
    </>
  );
};

Table.propTypes = {
  data: PropTypes.array
};

export default Table;