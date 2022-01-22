import React, { useState, useEffect } from 'react';
import BaseCalendar from 'components/BaseCalendar';
import BreadCrumbs from 'components/BreadCrumbs';
import { Stack, StackItem } from 'office-ui-fabric-react';
import { TooltipHost, DirectionalHint } from 'office-ui-fabric-react/lib/Tooltip';

import { getJobSchedule } from 'utils/api';
import { toast } from 'react-toastify';
import moment from 'moment';

const Calendar = () => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    getJobSchedule({ virtualGroup: 'test' })
      .then(data => {
        setSchedules(data.map(item => ({
          ...item,
          start: item.startAt,
          end: item.endAt
        })))
      })
      .catch(err => toast.error('Error: ' + err.data ? err.data.message : err.message))
  }, [])

  return (
    <Stack
      styles={{
        root: {
          padding: '0 20px 20px',
          height: '100%'
        }
      }}
    >
      <StackItem>
        <BreadCrumbs />
      </StackItem>
      <StackItem
        grow
        styles={{ root: { padding: '20px', background: '#FBFBFB', overflow: 'auto' } }}
      >
        <BaseCalendar
          dayMaxEventRows={4}
          eventContent={arg => {
            const eventData = schedules.find(item => String(item.id) === arg.event.id)

            return (
              <TooltipHost
                directionalHint={DirectionalHint.leftCenter}
                styles={{ root: { width: '100%', display: 'flex', alignItems: 'center', cursor: 'pointer' } }}
                tooltipProps={{
                  onRenderContent() {
                    return (
                      <div>
                        <p>{moment(eventData.startAt).format('MM/DD HH:mm')} - {moment(eventData.endAt).format('MM/DD HH:mm')}</p>
                      </div>
                    );
                  }
                }}
              >
                <div className={'fc-event-time'}>
                  {arg.timeText}
                </div>
                <div className={'fc-event-title'}> 
                  {eventData.users.join(', ')}
                </div>
              </TooltipHost>
            )
          }}
          eventDisplay={'block'}
          events={schedules}
        />
      </StackItem>
    </Stack>
  );
};


export default Calendar;