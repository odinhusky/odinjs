import React, {
  useState,
  useEffect,
  useContext
} from 'react'


// ^ Material-ui Componets(Functions)
// import Typography from '@material-ui/core/Typography';

// ? Self-packed Components || Functions
import BaseSimpleCard from 'components/BaseCard/BaseSimpleCard'
import BaseNoData from 'components/BaseNoData'
import { useMomentWithLocale } from 'utils/hooks/useMomentWithLocale';

import {
// computeDayRange
} from 'common/commonMethods';

// ? context
import EntryContext from '../../EntryContext';

// ^ plugins
import { useTranslation } from 'react-i18next';
// import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';
// import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/Entry/GeneralPanels/RunningJobs
 * @component RunningJobs
 * @description Runing jobs component
*/
export default function RunningJobs() {

  // $ init data
  const { t } = useTranslation();
  const moment = useMomentWithLocale();

  // % context
  const {
    classes,
    history,
    jobStatusList,
    isShowGuide,
    currentStep,
    isSmallTablet
  } = useContext(EntryContext);

  // # states
  const [topSixRunnungJobs, setTopSixRunnungJobs] = useState([])

  // - methods
  /**
   * @author odin
   * @description Navigate to job manage page filter by tab = Runing
  */
  const naviToRunningJobs = () => {
    history.push('/job-detail?status=Running')
  }

  // * hooks
  /**
   * @author odin
   * @description 取出最新的前6筆資料
  */
  useEffect(()=> {
    const { list } = jobStatusList['RUNNING']

    if(!isEmpty(list)) {
      setTopSixRunnungJobs(list.slice(0, 6))
    }
  }, [jobStatusList])

  return (
    <div
      className={`
        ${classes.runningJobsContainer}
        ${(isShowGuide === true && currentStep === 2 && isSmallTablet === false) && classes.guideShow}
      `}
    >
      <BaseSimpleCard
        cardLinkEvent={naviToRunningJobs}
        cardLinkText={`${t('view')}`}
        cardTitle={`${t('runningjobs')}`}
        contentClass={`${classes.p_8} ${classes.runningCardContent}`}
      >
        <div className={`${classes.runningJobsContent}`}>
          {
            isEmpty(topSixRunnungJobs) ? (
              <div className={`${classes.flex_center} ${classes.w_full}`}>
                <BaseNoData
                  text={`${t('thereIsNo', { name: t('data') })}`}
                />
              </div>
            ) : (
              topSixRunnungJobs.map(job => (
                <div
                  className={classes.runnungItem}
                  onClick={() => {
                    history.push(`/job-detail/${job.name}?username=${job.username}&jobName=${job.name}`)
                  }}
                >
                  <h5 className={classes.runningTitle}>
                    {job.name}
                  </h5>

                  <span className={classes.runningLanuchTime}>
                    {moment(job.launchedTime).fromNow()}
                  </span>
                </div>
              ))
            )
          }
        </div>
      </BaseSimpleCard>
    </div>
  )
}

RunningJobs.propTypes = {
  // history: PropTypes.object
}