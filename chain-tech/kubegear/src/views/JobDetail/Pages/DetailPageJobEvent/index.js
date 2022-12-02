import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// # API
import { getJobInfoEvent } from 'utils/api';

// ? context
import JobDetailContext from '../../JobDetailContext';

// ? Self-packed Components || Functions
import BasePaper from 'components/BaseMuiPaper';
import { DefaultButton } from 'components/BaseButton';
import BaseModalNew from 'components/BaseModalNew';
import Icon from 'components/BaseMuiIcon';
import Ordering from './Ordering';

// ^ Plugins
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import moment from 'utils/moment';
import { isNil } from 'lodash';

/**
 * @author odin
 * @prop {object}
 * @level views/JobDetail/DetailPageJobEvent
 * @component DetailPageJobEvent
 * @description DetailPageJobEvent Component
*/
const DetailPageJobEvent = () => {

  // $ init data
  const { t } = useTranslation();
  const { name: jobName } = useParams();
  const query = new URLSearchParams(location.search);

  // ? context
  const { classes } = useContext(JobDetailContext);

  // # states
  const [jobEvents, setJobEvents] = useState([]);
  const [detailString, setDetailString] = useState('');
  const [isSeeMoreModalOpen, setIsSeeMoreModalOpen] = useState(false);

  const [ordering, setOrdering] = useState(new Ordering());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // - methods
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

  // * hooks
  useEffect(() => {
    getData();
  }, [location.search])

  return (
    <>
      <div
        className={`
          ${classes.flex_justify_between}
          ${classes.pt_20}
          ${classes.mb_10}
        `}
      >
        <div className={`${classes.jobEventTitle}`}>{t('job')}{t('enSpace')}{t('event')}{t('enSpace')}{t('list')}</div>
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
                const { firstTimestamp } = job;
                const result = isNil(firstTimestamp) ? '-' : moment(firstTimestamp).format('YYYY/MM/DD HH:mm:ss');

                return <span>{result}</span>
              }
            },
            {
              id: 'lastTimestamp',
              key: 'lastTimestamp',
              label: t('endTime'),
              onTableCellRender: (job) => {
                const { lastTimestamp } = job;
                const result = isNil(lastTimestamp) ? '-' : moment(lastTimestamp).format('YYYY/MM/DD HH:mm:ss');

                return <span>{result}</span>
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