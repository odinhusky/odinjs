import React, {
  useState,
  useContext
} from 'react';

// ? context
import JobDetailContext from '../../../JobDetailContext'

// ^ Material-ui Componets(Functions)
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Alert from '@material-ui/lab/Alert';

// ? Self-packed Components || Functions
import BaseLink from 'components/BaseLink';
import StatusBadge from 'components/StatusBadge';
import MonacoPanel from './MonacoPanel';

import {
  getHumanizedJobStateString,
  getHumanizedJobStateStringZH,
  getDurationString,
  getGPUUseTime
} from '../utils';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import yaml from 'js-yaml';
import { isNil, isEmpty, get } from 'lodash';
import moment from 'utils/moment';

const Summary = ({ jobInfo, jobConfig, username }) => {

  // $ init data
  const { t } = useTranslation();
  const isTablet = useMediaQuery('(max-width: 1280px)');

  // = style
  const { classes } = useContext(JobDetailContext);

  // # states
  const [monacoProps, setMonacoProps] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  const onDismiss = () => {
    setMonacoProps(null);
    setModalTitle('');
  }

  const showJobConfig = () => {
    setModalTitle('Job Config');
    setMonacoProps({
      language: 'json',
      value: JSON.stringify(jobConfig, null, 2)
    });
  }

  const showApplicationSummary = () => {
    setModalTitle('Application Summary');
    const result = [];
    result.push('[Exit Trigger Info]');
    result.push('');
    result.push(
      `ExitTriggerMessage: ${get(jobInfo, 'jobStatus.appExitTriggerMessage')}`,
    );
    result.push(
      `ExitTriggerTaskRole: ${get(
        jobInfo,
        'jobStatus.appExitTriggerTaskRoleName',
      )}`,
    );
    result.push(
      `ExitTriggerTaskIndex: ${get(
        jobInfo,
        'jobStatus.appExitTriggerTaskIndex',
      )}`,
    );
    const userExitCode = get(
      jobInfo,
      'jobStatus.appExitMessages.runtime.originalUserExitCode',
    );
    if (userExitCode) {
      // user exit code
      result.push(`UserExitCode: ${userExitCode}`);
    }
    result.push('');
    const spec = jobInfo?.jobStatus?.appExitSpec;
    if (spec) {
      // divider
      result.push(Array.from({ length: 80 }, () => '-').join(''));
      result.push('');
      // content
      result.push('[Exit Spec]');
      result.push('');
      result.push(yaml.safeDump(spec));
      result.push('');
    }
    const diag = jobInfo?.jobStatus?.appExitDiagnostics;
    if (diag) {
      // divider
      result.push(Array.from({ length: 80 }, () => '-').join(''));
      result.push('');
      // content
      result.push('[Exit Diagnostics]');
      result.push('');
      result.push(diag);
      result.push('');
    }
    setMonacoProps({
      language: 'text',
      value: result.join('\n')
    });
  }

  const renderHintMessage = () => {
    if (!jobInfo) {
      return;
    }

    const state = getHumanizedJobStateString(jobInfo);
    if (state === 'Failed') {
      const diag = jobInfo.jobStatus.appExitDiagnostics;
      const code = jobInfo.jobStatus.appExitCode;
      if (code === 177) {
        // user code error
        let userExitCode;
        if (diag) {
          const match = diag.match(/<Raw>\[ExitCode\]: (\d+)/);
          if (match) {
            userExitCode = parseInt(match[1], 10);
          }
        }
        // container id
        let containerId;
        if (diag) {
          const match = diag.match(/^\s*"containerId"\s*:\s*"(.*?)",?\s*$/m);
          if (match) {
            containerId = match[1];
          }
        }

        return (
          <Alert
            className={`${classes.summaryAlert}`}
            severity="error"
          >
            <>
              <div>
                <span className={`${classes.summaryTitle}`}>
                  {t('error')}{t('enSpace')}{t('type')}:
                </span>
                <span>{t('User')}{t('enSpace')}{t('error')}</span>
              </div>
              {containerId && (
                <div>
                  <span className={`${classes.summaryTitle}`}>
                    {t('container')}{t('enSpace')} ID:
                  </span>
                  <span>{containerId}</span>
                </div>
              )}
              {userExitCode && (
                <div>
                  <span className={`${classes.summaryTitle}`}>
                    {t('exitCode')}:
                  </span>
                  <span>{userExitCode}</span>
                </div>
              )}
              <div>
                <span className={`${classes.summaryTitle}`}>
                  {t('resolution')}:
                </span>
                <span>{t('pleaseCheckContainerStdoutAnderr')}</span>
              </div>
            </>
          </Alert>
        );
      } else {
        return (
          <Alert
            className={`${classes.summaryAlert}`}
            severity="error"
          >
            <div>
              <div>
                <span className={`${classes.summaryTitle}`}>
                  {t('error')}{t('enSpace')}{t('type')}:
                </span>
                <span>{t('system')}{t('enSpace')}{t('error')}</span>
              </div>
              <div>
                <span className={`${classes.summaryTitle}`}>
                  {t('resolution')}:
                </span>
                <span>
                  {t('pleaseSendThe')}
                  <a
                    className={classes.link}
                    onClick={showApplicationSummary}
                  >{t('applicationSummary')}</a>
                  {t('toYourAdministratorForFurtherInvestigation')}
                </span>
              </div>
            </div>
          </Alert>
        );
      }
    } else if (state === 'Waiting') {
      const resourceRetries = jobInfo.jobStatus.retryDetails.resource;
      if (resourceRetries >= 3) {
        return (
          <Alert
            className={`${classes.alignItemsCenter}`}
            severity="warning"
          >
            <div>
              <div>
                <span className={`${classes.summaryTitle}`}>
                  {t('error')}{t('enSpace')}{t('type')}:
                </span>
                <span>
                  {t('resourceConflicts')}
                </span>
              </div>
              <div>
                <span className={`${classes.summaryTitle}`}>
                  {t('conflictCount')}:
                </span>
                <span>
                  {resourceRetries}
                </span>
              </div>
              <div>
                <span className={`${classes.summaryTitle}`}>
                  {t('resolution')}:
                </span>
                <span>
                  {t('pleaseAdjustTheResourceRequirementInYour')}
                  <a
                    className={classes.link}
                    onClick={showJobConfig}
                  >{t('jobConfig')}</a>,
                  {t('orWaitTillOtherJobsReleaseMoreResourcesBackToTheSystem')}
                </span>
              </div>
            </div>
          </Alert>
        );
      }
    }
  }

  return (
    <>
      <div
        className={`
        ${classes.summaryContainer}
        ${isTablet ? classes.isTabletContainer : ''}
        `}
      >
        <p className={`${classes.summaryJobName}`}>
          {jobInfo.name}
        </p>
        <div
          className={`
          ${classes.summaryRow}
          ${isTablet ? classes.flexDirectionColumn : ''}
          `}
        >
          <div className={`${classes.summaryColumn}`}>
            <div>
              {t('status')}
            </div>
            <div>
              <StatusBadge
                status={getHumanizedJobStateStringZH(jobInfo)}
                trans={t}
              />
            </div>
          </div>
          <div className={`${classes.summaryColumn}`}>
            <div>
              {t('startTime')}
            </div>
            <div>
              {moment(jobInfo.jobStatus.createdTime).format('YYYY/MM/DD HH:mm:ss')}
            </div>
          </div>
          <div className={`${classes.summaryColumn}`}>
            <div>
              {t('User')}
            </div>
            <div>
              {jobInfo.jobStatus.username}
            </div>
          </div>
          <div className={`${classes.summaryColumn}`}>
            <div>
              {t('group')}
            </div>
            <div>
              {jobConfig.extras.virtualGroup}
            </div>
          </div>
          <div className={`${classes.summaryColumn}`}>
            <div>
              {t('duration')}
            </div>
            <div>
              {getDurationString(jobInfo)}
            </div>
          </div>
          <div className={`${classes.summaryColumn}`}>
            <div>
              {`${t('GPU')}${t('enSpace')}${t('usageTime')}`}
            </div>
            <div>
              {getGPUUseTime(jobInfo, jobConfig)}
            </div>
          </div>
          <div className={`${classes.summaryColumn}`}>
            <div>
              {t('retries')}
            </div>
            <div>
              {jobInfo.jobStatus.retries}
            </div>
          </div>
          <div className={`${classes.summaryColumn}`}>
            <div>
              {t('check')}
            </div>
            <div>
              <ul className={`${classes.summaryToolBox}`}>
                <li className={`${classes.summaryToolBoxLi}`}>
                  <a
                    className={classes.link}
                    disabled={isNil(jobConfig)}
                    href="#"
                    onClick={showJobConfig}
                  >
                    {t('JSONConfig')}
                  </a>
                </li>
                <li className={`${classes.summaryToolBoxLi}`}>

                  <a
                    className={classes.link}
                    disabled={isEmpty(jobInfo.jobStatus.appExitDiagnostics)}
                    href="#"
                    onClick={showApplicationSummary}
                  >
                    {t('job')}{t('enSpace')}{t('summary')}
                  </a>
                </li>
                <li className={`${classes.summaryToolBoxLi}`}>
                  <BaseLink
                    className={`${classes.p_0}`}
                    to={`/cluster-report?tab=job&jobName=${jobInfo.name}&vg=${!isEmpty(jobInfo.jobStatus) && jobInfo.jobStatus.description.virtualGroup}&createdTime=${!isEmpty(jobInfo.jobStatus) && jobInfo.jobStatus.createdTime}`}
                  >
                    {t('job')}{t('enSpace')}{t('monitor')}
                  </BaseLink>
                </li>
                <li>
                  <BaseLink
                    className={`
                    ${classes.summaryToolBoxLi}
                    ${classes.p_0}
                    ${getHumanizedJobStateStringZH(jobInfo) === '等待中'
                        && `${classes.bouncing} ${classes.textWaiting}`}
                  `}
                    to={`/job-detail/${jobInfo.name}/jobevent?username=${username}`}
                  >
                    {t('job')}{t('enSpace')}{t('event')}
                  </BaseLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {renderHintMessage()}
      </div>
      <MonacoPanel
        isOpen={!isNil(monacoProps)}
        monacoProps={monacoProps}
        onDismiss={onDismiss}
        title={modalTitle}
      />
    </>
  );
};

Summary.propTypes = {
  jobInfo: PropTypes.object,
  jobConfig: PropTypes.object,
  username: PropTypes.string
};

export default Summary;
