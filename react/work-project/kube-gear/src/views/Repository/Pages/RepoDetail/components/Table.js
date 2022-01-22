/* eslint-disable react/no-multi-comp */
import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import BaseTable from 'components/BaseTable';
import { Label, TooltipHost, DirectionalHint } from 'office-ui-fabric-react';
import { useTranslation } from 'react-i18next';
import { isEqual } from 'lodash';
import { IconButton } from 'components/BaseButton';
import moment from 'utils/moment';
import Ordering from '../../../Ordering';
import Context from '../../../Context';
import DownloadModalOpen from './DownloadModal';

import { formatBytes } from 'utils';

import styles from './Table.module.scss'

const Table = React.memo(({ data, isLoading, selection }) => {
  const { t } = useTranslation();
  const { currentProject } = useContext(Context);
  const [ordering, setOrdering] = useState(new Ordering());
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [filename, setFilename] = useState();

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

  const handleCopy = command => {
    const tempInput = document.createElement('input');
    tempInput.style = 'position: absolute; left: -1000px; top: -1000px';
    tempInput.value = command;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  }

  const columns = [
    applySortProps({
      key: 'name',
      fieldName: 'name',
      name: t('name'),
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender(data) {
        return <Label>{data.name}</Label>;
      }
    }),
    applySortProps({
      key: 'size',
      fieldName: 'size',
      name: t('size'),
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender(data) {
        return <Label>{formatBytes(data.size)}</Label>;
      }
    }),
    {
      key: 'operations',
      name: `${t('Operations')}`,
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender(repoData) {
        const commandString = `docker pull ${repoData.fullname}`;
        return (
          <>
            <TooltipHost
              directionalHint={DirectionalHint.topCenter}
              tooltipProps={{
                onRenderContent() {
                  return (
                    <p>Pull{t('command')}</p>
                  );
                }
              }}
            >
              <IconButton
                className={styles.copyIcon}
                iconProps={{ iconName: 'Copy' }}
                onClick={() => handleCopy(commandString)}
              />
            </TooltipHost>
            <IconButton
              className={styles.copyIcon}
              iconProps={{ iconName: 'Download' }}
              onClick={() => {
                setFilename(repoData.fullname)
                setIsDownloadModalOpen(true)
              }}
            />
          </>
        );
      }
    },
    applySortProps({
      key: 'created',
      fieldName: 'created',
      name: t('createTime'),
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender(data) {
        return <Label>{moment(data.created).format('YYYY/MM/DD HH:mm:ss')}</Label>;
      }
    })
  ];

  return (
    <>
      {
        currentProject &&
        currentProject.current_user_role_id === 1 ?
          <BaseTable
            checkboxVisibility={1}
            columns={columns}
            enableShimmer={isLoading}
            items={ordering.apply(data)}
            selection={selection}
            selectionMode={2}
            selectionPreservedOnEmptyClick
          />
          :
          <BaseTable
            columns={columns}
            enableShimmer={isLoading}
            items={ordering.apply(data)}
          />
      }
      {
        isDownloadModalOpen &&
        <DownloadModalOpen
          filename={filename}
          isOpen={isDownloadModalOpen}
          onClose={() => {
            setIsDownloadModalOpen(false)
            setFilename();
          }}
        />
      }
    </>
  );
}, (prevProps, nextProps) => {
  return isEqual(prevProps.data, nextProps.data) && isEqual(prevProps.isLoading, nextProps.isLoading)
});

Table.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  repoName: PropTypes.string,
  setRepoTags: PropTypes.func,
  selection: PropTypes.object
};

export default Table;
