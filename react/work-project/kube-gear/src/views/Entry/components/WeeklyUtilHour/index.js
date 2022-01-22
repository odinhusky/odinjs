import React, {
  useState,
  useEffect,
  useContext
} from 'react'

// # API
import { getUserUsedResource } from 'utils/api'

// ^ Material-ui Componets(Functions)
import Typography from '@material-ui/core/Typography'

// ? Self-packed Components || Functions
import BaseSimpleCard from 'components/BaseCard/BaseSimpleCard'
import { BaseTextBadge } from 'components/BaseBadge'
import { timestampToDurationString } from 'utils'
import BaseNoData from 'components/BaseNoData'

// ? context
import EntryContext from '../../EntryContext'

// ^ plugins
// import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import clsx from 'clsx';
import moment from 'moment';
import { toast } from 'react-toastify';

/**
 * @author odin
 * @level views/Entry/WeeklyUtilHour
 * @component WeeklyUtilHour
 * @description Online number component
*/
export default function WeeklyUtilHour() {

  // $ init data
  const { t } = useTranslation();

  // % context
  const { classes, history } = useContext(EntryContext)

  // # states
  const [userUsedResourceList, setUserUsedResourceList] = useState([])

  // - methods
  /**
   * @author odin
   * @description Get initialization data from API
  */
  const initData = async () => {

    try {
      // 取得本週的 jobSchedule
      const userUsedReq = await getUserUsedResource({
        startDate: (moment().startOf('week').unix() * 1000),
        endDate: (moment().endOf('week').unix() * 1000)
      });

      if(userUsedReq && !isEmpty(userUsedReq)){
        // 將資料儲存
        setUserUsedResourceList(userUsedReq)
      }

    } catch (err) {
    // } catch ({ message: msg }) {
      const msg = err.data.message
      toast.error(msg);
    }
  }

  /**
   * @author odin
   * @description Navigate to cluster report page filter by tab = usedTime
  */
  const naviToclusterReport = () => {
    history.push('/cluster-report?tab=usedTime&duration=week')
  }

  // * hooks
  /**
   * @author odin
   * @description Component Initialization
  */
  useEffect(() => {
    initData()
  }, [])

  return (
    <div className={classes.weeklyUtilHourContainer}>

      <BaseSimpleCard
        cardLinkEvent={naviToclusterReport}
        cardLinkText={`${t('viewCheck')}`}
        cardTitle={`${t('weeklyUsageTime')}`}
        contentClass={classes.jobCardContent}
      >
        <div
          className={clsx(
            classes.weeklyUtilHourContent,
            {
              [classes.flex_center]: isEmpty(userUsedResourceList)
            })
          }
        >

          {
            isEmpty(userUsedResourceList) ? (
              // 沒有資料的時候
              <BaseNoData
                text={`${t('thereIsNo', { name: t('data') })}`}
              />
            ) : (
              <>
                {/* 標題 */}
                <div
                  className={classes.weeklyUtilHourLine}
                  key={'title'}
                >

                  <Typography
                    className={`${classes.weeklyUtilHourLineUser} ${classes.weeklyUtilHourLineUserTitle}`}
                    component="div"
                    variant="h6"
                  >
                    {t('user')}
                  </Typography>

                  <div className={classes.weeklyUtilHourLineBadge}>
                    {`${t('GPU')} x ${t('timeLong')}`}
                  </div>

                </div>

                {
                  // 內容要跑的迴圈
                  userUsedResourceList.map(item => (

                    // 過濾掉使用時長為 0 的使用者
                    !isEmpty(item.resourceUsedTime.gpu) ?
                      <div
                        className={classes.weeklyUtilHourLine}
                        key={item.username}
                      >
                        <Typography
                          className={classes.weeklyUtilHourLineUser}
                          component="div"
                          variant="h6"
                        >
                          {item.username}
                        </Typography>

                        <BaseTextBadge
                          bgColor="#E6F7EF"
                          textClass={classes.weeklyUtilHourLineTime}
                        >
                          {timestampToDurationString(
                            Object.values(item.resourceUsedTime.gpu).reduce((acc, curr) => acc += curr, 0)
                          )}
                        </BaseTextBadge>

                      </div>
                      : null
                  ))
                }
              </>
            )
          }
        </div>
      </BaseSimpleCard>
    </div>
  )
}

WeeklyUtilHour.propTypes = {
  // history: PropTypes.object,
  // jobList:PropTypes.array
}