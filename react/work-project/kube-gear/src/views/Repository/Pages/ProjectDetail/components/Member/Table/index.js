/* eslint-disable react/no-multi-comp */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Label } from 'office-ui-fabric-react';
import { useTranslation } from 'react-i18next';
import BaseTable from 'components/BaseTable';
import { isEqual } from 'lodash';
import Ordering from '../../../../../Ordering';


const Table = React.memo(({ isLoading, items, selection }) => {
  const { t } = useTranslation();
  const [ordering, setOrdering] = useState(new Ordering());

  const onColumnClick = (event, column) => {
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

  const applySortProps = column => {
    column.isSorted = ordering.field === column.key;
    column.isSortedDescending = ordering.descending;
    column.onColumnClick = onColumnClick;
    return column;
  }

  const columns = [
    applySortProps({
      key: 'entity_name',
      name: t('name'),
      fieldName: 'entity_name',
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender(repoData) {
        return (
          <Label>
            {repoData.entity_name}
          </Label>
        )
      }
    }),
    applySortProps({
      key: 'role_name',
      fieldName: 'role_name',
      name: t('role'),
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: item => {
        switch (item.role_id) {
          case 1:
            return <Label>{t('project')}{t('enSpace')}{t('admin')}</Label>;
          case 2:
            return <Label>{t('maintainer')}</Label>;
          case 3:
            return <Label>{t('Guest')}</Label>
        }
      }
    })
  ]
  return (
    <BaseTable
      checkboxVisibility={1}
      columns={columns}
      enableShimmer={isLoading}
      items={ordering.apply(items)}
      key="set"
      selection={selection}
      selectionMode={2}
      selectionPreservedOnEmptyClick
    />
  );
}, (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps)
});

Table.propTypes = {
  isLoading: PropTypes.bool,
  items: PropTypes.array,
  selection: PropTypes.object
};

export default Table;