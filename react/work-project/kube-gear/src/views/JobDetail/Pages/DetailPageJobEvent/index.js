import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import BasePaper from 'components/BaseMuiPaper';
import { DefaultButton } from 'components/BaseButton';
import BaseModalNew from 'components/BaseModalNew';
import Icon from 'components/BaseMuiIcon';

import { getJobInfoEvent } from 'utils/api';
import moment from 'utils/moment';
import { toast } from 'react-toastify';

import indexStyles from './index.module.scss';
import Ordering from './Ordering';

const DetailPageJobEvent = () => {
  const { t } = useTranslation();
  const { name: jobName } = useParams();
  const query = new URLSearchParams(location.search)

  const [jobEvents, setJobEvents] = useState([]);
  const [detailString, setDetailString] = useState('');
  const [isSeeMoreModalOpen, setIsSeeMoreModalOpen] = useState(false);

  const [ordering, setOrdering] = useState(new Ordering());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const getData = () => {
    const username = query.get('username');
    getJobInfoEvent(username, jobName)
      .then(res => setJobEvents(res.data))
      .catch(err => toast.error(err?.data ? err.data?.message : err?.message));
  }

  useEffect(() => {
    getData();
  }, [location.search])

  return (
    <>
      <div className={indexStyles.topBar}>
        <div className={indexStyles.title}>{t('job')}{t('enSpace')}{t('event')}{t('enSpace')}{t('list')}</div>
        <DefaultButton
          children={t('back')}
          onClick={() => window.history.go(-1)}
          startIcon={<Icon>arrow_back</Icon>}
        />
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <BasePaper
          columns={[
            applySortProps({
              id: 'taskroleName',
              key: 'taskroleName',
              label: `${t('task')}${t('enSpace')}${t('role')}`
            }),
            applySortProps({
              id: 'taskIndex',
              key: 'taskIndex',
              label: t('number')
            }),
            applySortProps({
              id: 'type',
              key: 'type',
              label: t('type')
            }),
            {
              id: 'reason',
              key: 'reason',
              label: t('reason')
            },
            {
              id: 'message',
              key: 'message',
              label: t('detail'),
              cellStyle: {
                td: {
                  display: 'flex',
                  alignItems: 'center'
                }
              },
              width: '300px',
              onTableCellRender: (job) => {
                const { message } = job;
                return (
                  <>
                    <Icon
                      onClick={() => {
                        setDetailString(message)
                        setIsSeeMoreModalOpen(true)
                      }}
                      style={{ margin: 2, cursor: 'pointer' }}
                    >text_snippet</Icon>
                    <div style={{ overflow:'hidden', textOverflow: 'ellipsis' }}>{message}</div>
                  </>
                )
              }
            },
            {
              id: 'firstTimestamp',
              key: 'firstTimestamp',
              label: t('startTime'),
              onTableCellRender: (job) => {
                return <span>{moment(job.firstTimestamp).format('YYYY/MM/DD HH:mm:ss')}</span>
              }
            },
            {
              id: 'lastTimestamp',
              key: 'lastTimestamp',
              label: t('endTime'),
              onTableCellRender: (job) => {
                return <span>{moment(job.lastTimestamp).format('YYYY/MM/DD HH:mm:ss')}</span>
              }
            },
            {
              id: 'count',
              key: 'count',
              label: t('amount')
            }
          ]}
          labelRowsPerPage={t('labelRowsPerPage')}
          ordering={ordering}
          page={page}
          rows={ordering.apply(jobEvents || [])}
          rowsPerPage={rowsPerPage}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
        />
        {
          isSeeMoreModalOpen &&
          <BaseModalNew
            children={detailString}
            isOpen={isSeeMoreModalOpen}
            onClose={() => setIsSeeMoreModalOpen(false)}
            size={'md'}
            title={t('detail')}
          />
        }
      </div>
    </>
  );
};

DetailPageJobEvent.propTypes = {
};

export default DetailPageJobEvent;