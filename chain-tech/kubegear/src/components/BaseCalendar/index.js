import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import GlobalContext from 'layouts/Main/GlobalContext';

const BaseCalendar = (props, ref) => {
  const { t } = useTranslation();
  const { locale } = useContext(GlobalContext);
  return (
    <FullCalendar
      buttonText={{
        today: t('today'),
        month: 'month',
        week: 'week',
        day: 'day',
        list: 'list'
      }}
      defaultView="dayGridMonth"
      headerToolbar={{
        start: 'prev,next today',
        center: 'title',
        end: ''
      }} // 日文語系是吃 'ja'
      height={'100%'}
      locale={locale === 'jp' ? 'ja' : locale}
      plugins={[ dayGridPlugin, interactionPlugin ]}
      ref={ref}
      {...props}
    />
  );
};

BaseCalendar.propTypes = {
  event: PropTypes.array
};

export default React.forwardRef(BaseCalendar);