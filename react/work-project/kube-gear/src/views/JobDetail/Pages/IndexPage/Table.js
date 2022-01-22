/* eslint-disable react/no-multi-comp */
import React, { useContext, useMemo, useState } from 'react';

import { CommandBarButton } from 'components/BaseButton';
import BaseTable from 'components/BaseTable';
import BaseLink from 'components/BaseLink';
import { ColumnActionsMode, Selection } from 'office-ui-fabric-react/lib/DetailsList';
import { FontClassNames } from 'office-ui-fabric-react/lib/Styling';
import StatusBadge from 'components/StatusBadge';
import moment from 'utils/moment';

import { convertDurationString } from './utils';
import { useTranslation } from 'react-i18next';
import TimeModal from './TimeModal';
import ConfirmModal from 'components/ConfirmModal';
import Context from './Context';
import Ordering from './Ordering';
import GlobalContext from 'layouts/Main/GlobalContext';
import { formatBytes } from 'utils'
import { MB } from 'constant';
import { DetailsRow } from 'office-ui-fabric-react/lib/DetailsList';

const zeroPaddingRowFieldStyle = {
  marginTop: -11,
  marginBottom: -11,
  marginLeft: -12,
  marginRight: -8
};

export default function Table() {
  const {
    allJobs,
    stopJob,
    deleteJob,
    filteredJobs,
    // refreshJobs,
    setSelectedJobs,
    filter,
    ordering,
    setOrdering,
    pagination
  } = useContext(Context);

  const {
    userInfo
  } = useContext(GlobalContext)

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [clickedJob, setClickedJob] = useState({});
  const { t } = useTranslation();

  const renderAction = job => {
    const isDelete = ['FAILED', 'STOPPED', 'SUCCEEDED'].includes(job.state);
    const isAdmin = userInfo.admin === 'true';

    return {
      iconProps: { iconName: isDelete ? 'Delete' : 'StopSolid', styles: { root: { color: '#333333' } } },
      menuProps: {
        shouldFocusOnMount: true,
        items: [
          isAdmin && job.state === 'RUNNING' && job.executionType === 'START' ? {
            key: 'setLifeHour',
            text: t('setLifeHour'),
            iconProps: { iconName: 'Clock' },
            canCheck: true,
            onClick: () => {
              setClickedJob(job);
              setIsOpen(true);
            }
          } : null
        ].filter(btnMenu => btnMenu !== null)
      },
      onClick: () => {
        setClickedJob(job);
        isDelete ? setIsDeleteModalOpen(true) : setIsStopModalOpen(true);
      },
      disabled: isDelete && !isAdmin,
      split: true,
      text: isDelete ? t('delete') : t('Stop')
    }
  }

  /**
   * @type {import('office-ui-fabric-react').Selection}
   */
  const selection = useMemo(() => {
    return new Selection({
      onSelectionChanged() {
        setSelectedJobs(selection.getSelection());
      }
    });
  }, []);

  /**
   * @param {React.MouseEvent<HTMLElement>} event
   * @param {import('office-ui-fabric-react').IColumn} column
   */
  function onColumnClick(event, column) {
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

  /**
   * @param {import('office-ui-fabric-react').IColumn} column
   */
  function applySortProps(column) {
    column.isSorted = ordering.field === column.key;
    column.isSortedDescending = ordering.descending;
    column.onColumnClick = onColumnClick;
    return column;
  }

  const nameColumn = applySortProps({
    key: 'name',
    minWidth: 150,
    name: t('name'),
    fieldName: 'name',
    className: FontClassNames.mediumPlus,
    headerClassName: FontClassNames.medium,
    isResizable: true,
    isFiltered: filter.keyword !== '',
    onRender(job) {
      const { name, namespace, username } = job;
      return <BaseLink to={`/job-detail/${name}?username=${namespace || username}&jobName=${name}`}>{name}</BaseLink>;
    }
  });
  const modifiedColumn = applySortProps({
    key: 'modified',
    minWidth: 150,
    // name: 'Date Modified',
    name: `${t('Submission')}${t('enSpace')}${t('time')}`,
    className: FontClassNames.mediumPlus,
    headerClassName: FontClassNames.medium,
    isResizable: true,
    isSorted: ordering.field === 'modified',
    isSortedDescending: !ordering.descending,
    onRender(job) {
      // getModified(job) from utils
      return <span>{moment(job.createdTime).format('YYYY/MM/DD HH:mm:ss')}</span>
    }
  });
  const userColumn = applySortProps({
    key: 'user',
    minWidth: 100,
    name: t('User'),
    fieldName: 'username',
    className: FontClassNames.mediumPlus,
    headerClassName: FontClassNames.medium,
    isResizable: true,
    isFiltered: filter.users.size > 0
  });
  const remainColumn = applySortProps({
    key: 'remain',
    minWidth: 120,
    name: t('remainTime'),
    className: FontClassNames.mediumPlus,
    headerClassName: FontClassNames.medium,
    isResizable: true,
    onRender(job) {
      if (job.lifeHour === '-') {
        return '-';
      } else {
        const createTime = moment(job.createdTime)
        const completeTime = moment(job.completedTime || moment());
        const durationTime =  moment.duration(completeTime.diff(createTime))
        const lifeHour = moment.duration(job.lifeHour, 'h')
        const remainTime = lifeHour.subtract(durationTime)
        const oneDay = moment.duration(1, 'd').valueOf();
        const color = remainTime.valueOf() <= oneDay ? 'red' : ''
        return (
          <div style={{ color }}>
            {convertDurationString(remainTime)}
          </div>
        );
      }
    }
  });
  const lifeHourColumn = applySortProps({
    key: 'lifeHour',
    fieldName: 'lifeHour',
    minWidth: 150,
    name: `${t('lifeHour')}(${t('hour')})`,
    className: FontClassNames.mediumPlus,
    headerClassName: FontClassNames.medium,
    isResizable: true,
    onRender(job) {
      return job.lifeHour;
    }
  });
  const virtualClusterColumn = applySortProps({
    key: 'virtualGroup',
    minWidth: 120,
    name: t('group'),
    fieldName: 'virtualGroup',
    className: FontClassNames.mediumPlus,
    headerClassName: FontClassNames.medium,
    isResizable: true,
    isFiltered: filter.virtualGroups.size > 0
  });
  const totalCPUColumn = applySortProps({
    key: 'totalCPU',
    minWidth: 100,
    name: 'CPU',
    fieldName: 'totalCPU',
    className: FontClassNames.mediumPlus,
    headerClassName: FontClassNames.medium,
    isResizable: true,
    onRender(job) {
      return job.description.totalCPU;
    }
  });
  const totalMemoryColumn = applySortProps({
    key: 'totalMemory',
    minWidth: 100,
    name: `${t('memory')}`,
    fieldName: 'totalMemory',
    className: FontClassNames.mediumPlus,
    headerClassName: FontClassNames.medium,
    isResizable: true,
    onRender(job) {
      return job.description.totalMemory ? formatBytes(job.description.totalMemory * MB) : '';
    }
  });
  const gpuCountColumn = applySortProps({
    key: 'gpuCount',
    minWidth: 60,
    name: t('GPU'),
    fieldName: 'totalGpuNumber',
    className: FontClassNames.mediumPlus,
    headerClassName: FontClassNames.medium,
    isResizable: true
  });
  const statusColumn = applySortProps({
    key: 'status',
    minWidth: 100,
    name: t('status'),
    headerClassName: FontClassNames.medium,
    isResizable: true,
    isFiltered: filter.statuses.size > 0,
    onRender(job) {
      const condition = ['WAITING', 'RUNNING']
      const status = condition.includes(job.state) && job.executionType === 'STOP' ? 'Stopping'
        : job.state[0] + job.state.toLowerCase().substring(1, job.state.length)
      return (
        <StatusBadge
          containerStyle={{ padding: '5px', alignItems: 'center', position: 'relative', width: '100%' }}
          status={status}
          trans={t}
        />
      );
    }
  });

  /**
   * @type {import('office-ui-fabric-react').IColumn}
   */
  const actionsColumn = {
    key: 'actions',
    minWidth: 100,
    name: t('Operations'),
    headerClassName: FontClassNames.medium,
    columnActionsMode: ColumnActionsMode.disabled,
    onRender(job) {
      /** @type {React.CSSProperties} */
      const wrapperStyle = { display: 'inline-block', verticalAlign: 'middle', width: '100%' };

      return (
        <div
          data-selection-disabled
          style={Object.assign(wrapperStyle, zeroPaddingRowFieldStyle)}
        >
          <CommandBarButton
            {...renderAction(job)}
          /> 
        </div>
      );
    }
  };

  const columns = [
    nameColumn,
    modifiedColumn,
    userColumn,
    remainColumn,
    lifeHourColumn,
    virtualClusterColumn,
    totalCPUColumn,
    totalMemoryColumn,
    gpuCountColumn,
    statusColumn,
    actionsColumn
  ];

  return (
    <React.Fragment>
      <BaseTable
        checkboxVisibility={1}
        columns={columns}
        enableShimmer={allJobs === null}
        items={pagination.apply(ordering.apply(filteredJobs || []))}
        onRenderRow={props => {
          return (
            <DetailsRow
              styles={{ 
                root: {
                  fontSize: '14px',
                  color: '#333'
                },
                cell: {
                  display: 'flex',
                  alignItems: 'center',
                  paddingTop: 5,
                  paddingBottom: 5
                },
                checkCell: {
                  display: 'flex',
                  alignItems: 'center'
                }
              }}
              {...props}
            />
          )
        }}
        selectAllVisibility={2}
        selection={selection}
        selectionMode={2}
        setKey="key"
        shimmerLines={pagination.itemsPerPage}
      />
      <TimeModal
        isOpen={isOpen}
        job={clickedJob}
        onClose={() => setIsOpen(false)}
      />
      <ConfirmModal
        confrimText={t('delete')}
        content={t('sureDelete', { name: clickedJob.name })}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteJob(clickedJob)}
        title={`${t('delete')}${t('enSpace')}${t('job')}`}
      />
      <ConfirmModal
        confrimText={t('Stop')}
        content={t('stopJobMsg')}
        isOpen={isStopModalOpen}
        onClose={() => setIsStopModalOpen(false)}
        onConfirm={() => stopJob(clickedJob)}
        title={`${t('Stop')}${t('enSpace')}${t('job')}`}
      />
    </React.Fragment>
  );
}

