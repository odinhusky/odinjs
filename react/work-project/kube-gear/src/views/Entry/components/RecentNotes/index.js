import React, {
  useState,
  useEffect,
  useContext
} from 'react'

// ^ Material-ui Componets(Functions)

// ? Self-packed Components || Functions
import BaseSimpleCard from 'components/BaseCard/BaseSimpleCard'
import BaseNoData from 'components/BaseNoData'
import { useMomentWithLocale } from 'utils/hooks/useMomentWithLocale';

// import theme from 'theme';

// ? context
import EntryContext from '../../EntryContext';

// ^ plugins
import { useTranslation } from 'react-i18next';
// import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import moment from 'moment'


/**
 * @author odin
 * @level views/Entry/GeneralPanels/RecentNotes
 * @component RecentNotes
 * @description Quick start component
*/
export default function RecentNotes() {

  // $ init data
  const { t } = useTranslation();
  const momentHook = useMomentWithLocale();

  // % context
  const { classes, noticeList, history } = useContext(EntryContext);

  // # states
  const [filteredNotes, setFilteredNotes] = useState([]);

  // * hooks
  /**
   * @author odin
   * @description 過濾當週的通知
  */
  useEffect(()=> {
    const weekStartStamp = moment().startOf('week').unix() * 1000;
    const weekEndStamp = moment().endOf('week').unix() * 1000;

    if(!isEmpty(noticeList)) {
      const filteredArr = noticeList.filter(notice => (
        notice.createdDate >= weekStartStamp && notice.createdDate < weekEndStamp
      ))

      setFilteredNotes(filteredArr);
    }
  }, [noticeList])

  return (
    <div className={classes.recentNotesContainer}>
      <BaseSimpleCard
        cardTitle={`${t('recentNotifications')}`}
        contentClass={`${classes.p_0} ${classes.recentNotesCardContent}`}
      >
        <div className={`${classes.recentNotesContent}`}>

          {
            isEmpty(filteredNotes) ? (
              <BaseNoData
                text={`${t('thereIsNo', { name: t('notification') })}`}
                type="noti"
              />
            ) : (
              filteredNotes.map(notice => (
                <div
                  className={`${classes.noticeLink} ${notice.link ? classes.hasLink : ''}`}
                  key={notice.id}
                  onClick={() => {
                    if (notice.link) {
                      history.push(notice.link)
                    }
                  }}
                >
                  <div className={`${classes.noticeMsg} ${notice.link ? classes.noticeMsgHovered : ''}`}>
                    {notice.content}
                  </div>

                  <div className={classes.noticeDuration}>
                    {momentHook(notice.createdDate).fromNow()}
                  </div>
                </div>
              ))
            )
          }
        </div>
      </BaseSimpleCard>
    </div>
  )
}

RecentNotes.propTypes = {
  history: PropTypes.object
}