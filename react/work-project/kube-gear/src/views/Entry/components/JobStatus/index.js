import React, {
  useState,
  useEffect,
  useContext
} from 'react'

// ^ Material-ui Componets(Functions)
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon'

// ? Self-packed Components || Functions
import BaseSimpleCard from 'components/BaseCard/BaseSimpleCard'
import BaseNoData from 'components/BaseNoData'
import { PieChart } from 'components/BaseChart';
import { theme } from 'theme'

// ? context
import EntryContext from '../../EntryContext';

// ^ plugins
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
// import { toast } from 'react-toastify';
// import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * @author odin
 * @level views/Entry/JobStatus
 * @component JobStatus
 * @description Online number component
*/
export default function JobStatus() {

  // $ init data
  const { t } = useTranslation();

  // % context
  const {
    classes,
    history,
    jobList,
    jobStatusList,
    jobListKeys
  } = useContext(EntryContext);

  // # states
  // 要顯示在圓餅圖上的資料結構
  const [jobStatusChartData, setJobStatusChartData] = useState([])


  // 包含 運行作業 | 停止作業 | 失敗作業 的內容
  const jobLines = [
    // 運行作業
    {
      icon: <Icon style={{ color: theme.runningJobsIconColor }}>donut_large</Icon>,
      title: `${t('running')}${t('job')}`,
      num: jobStatusList.RUNNING.y,
      keyValue: 'RUNNING',
      event: () => {naviToFiltedJobStatusPage('Running')}
    },
    // 停止作業
    {
      icon: <Icon style={{ color: theme.stopJobsIconColor }}>remove_circle_outline</Icon>,
      title: `${t('stopped')}${t('job')}`,
      num: jobStatusList.STOPPED.y,
      keyValue: 'STOPPED',
      event: () => {naviToFiltedJobStatusPage('Stopped')}
    },
    // 失敗作業
    {
      icon: <Icon style={{ color: theme.failJobsIconColor }}>highlight_off</Icon>,
      title: `${t('fail')}${t('job')}`,
      num: jobStatusList.FAILED.y,
      keyValue: 'FAILED',
      event: () => {naviToFiltedJobStatusPage('Failed')}
    }
  ]

  /**
   * @author odin
   * @description 判斷是否作業數都為0
   * @returns {boolean}
  */
  const isZeroJob = (() => {
    let result = false;

    if(
      jobStatusList.RUNNING.y === 0 &&
      jobStatusList.STOPPED.y === 0 &&
      jobStatusList.FAILED.y === 0 &&
      jobList.length === 0
    ) {
      result = true;
    }

    return result;
  })()


  // - methods

  /**
   * @author odin
   * @description Navigate to job status page
  */
  const naviToJobStatusPage = () => {
    history.push('/job-detail?status')
  }

  /**
   * @author odin
   * @param {String} status -- 開頭為大小其他為小寫字母的 status => (Stopped)
   * @description 依據傳入的 status 導頁進行過濾內容
  */
  const naviToFiltedJobStatusPage = (status) => {
    history.push(`/job-detail?status=${status}`)
  }

  // * hooks
  /**
   * @author odin
   * @description Component chart data handling
  */
  useEffect(()=> {

    const data = jobListKeys.map(item => ({
      name: jobStatusList[item]['name'],
      y: jobStatusList[item]['y']
    }))

    setJobStatusChartData(data)

  }, [jobStatusList, jobListKeys])


  return (
    <div className={classes.jobStatusContainer}>
      <BaseSimpleCard
        cardLinkEvent={naviToJobStatusPage}
        cardLinkText={`${t('viewCheck')}`}
        cardTitle={`${t('job')}${t('status')}`}
        contentClass={classes.jobCardContent}
      >
        <div className={classes.jobStatusContent}>

          {/* 作業總數 */}
          <div className={classes.jobStatusLine}>

            <div className={classes.jobStatusLineName}>

              <Typography
                className={classes.jobStatusLineText}
                component="div"
                variant="body2"
              >
                {`${t('totalJobs')}`}
              </Typography>

            </div>

            <div className={classes.jobStatusLineValue}>
              {jobList.length}
            </div>

          </div>

          { !isEmpty(jobLines) && (
            jobLines.map(item => (
              // 單一個可以點選導頁的項目內容
              <div
                className={`${classes.jobStatusLine} ${classes.jobStatusLineClickable}`}
                key={item.keyValue}
                onClick={
                  item.num === 0 ? (() => {}) : item.event
                }
              >

                <div className={classes.jobStatusLineName}>

                  <div className={classes.jobStatusLineIcon}>
                    {item.icon}
                  </div>

                  <Typography
                    className={classes.jobStatusLineText}
                    component="div"
                    variant="body2"
                  >
                    {item.title}
                  </Typography>

                </div>

                <div className={classes.jobStatusLineValue}>
                  {item.num}
                </div>

              </div>
            ))
          )}

          {/* 作業狀態圓餅圖 */}
          <div
            className={clsx(
              classes.jobStatusPieContainer,
              {
                [classes.flex_center]: isZeroJob
              }
            )}
          >
            {
              isZeroJob ? (
                <BaseNoData
                  text={`${t('thereIsNo', { name: t('data') })}`}
                />
              ) : (
                <PieChart
                  options={{
                    chart: {
                      type: 'pie',
                      height: 200
                    },
                    plotOptions: {
                      pie: {
                        allowPointSelect: false,
                        cursor: 'pointer',
                        size: 80,
                        colors: [
                          theme.pieStop,
                          theme.pieStopping,
                          theme.pieWait,
                          theme.pieFail,
                          theme.pieRuning,
                          theme.pieSuccess
                        ],
                        dataLabels: {
                          enabled: true,
                          format: '<b>{point.name}</b>: {point.y}'
                        },
                        showInLegend: false,
                        tooltip: {
                          pointFormatter() {
                            return `<span style="color:${this.color}">●</span> ${this.name}: <b>${(this.y)}</b><br/>`
                          }
                        }
                      }
                    },
                    series: [{
                      // name: '',
                      data: jobStatusChartData
                    }]
                  }}
                />
              )
            }
          </div>

        </div>
      </BaseSimpleCard>
    </div>
  )
}

JobStatus.propTypes = {
  // jobStatusList: PropTypes.array.isRequired
  // history: PropTypes.object
}