import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import BaseLink from 'components/BaseLink';
import StatusBadge from 'components/StatusBadge';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import moment from 'utils/moment';
import yaml from 'js-yaml';
import { isNil, isEmpty, get } from 'lodash';
import { getHumanizedJobStateString, getHumanizedJobStateStringZH, getDurationString, getGPUUseTime } from '../utils';
import MonacoPanel from './MonacoPanel';

import styles from './Summary.module.scss';

const useStyles = makeStyles((theme) => ({
  link: {
    color: theme.palette.customColor.themePrimary,
    cursor: 'pointer'
  },
  alertIcon: {
    alignItems: 'center'
  }
}))

const Summary = ({ jobInfo, jobConfig, username }) => {
  const { t } = useTranslation();
  const isTablet = useMediaQuery('(max-width: 1280px)');
  const classes = useStyles();
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
            className={`${styles.errorMessage} ${classes.alertIcon}`}
            severity="error"
            style={{ fontSize: '14px' }}
          >
            <>
              <div>
                <span className={styles.title}>
                  {t('error')}{t('enSpace')}{t('type')}:
                </span>
                <span>{t('User')}{t('enSpace')}{t('error')}</span>
              </div>
              {containerId && (
                <div>
                  <span className={styles.title}>
                    {t('container')}{t('enSpace')} ID:
                  </span>
                  <span>{containerId}</span>
                </div>
              )}
              {userExitCode && (
                <div>
                  <span className={styles.title}>
                    {t('exitCode')}:
                  </span>
                  <span>{userExitCode}</span>
                </div>
              )}
              <div>
                <span className={styles.title}>
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
            className={`${styles.errorMessage} ${classes.alertIcon}`}
            severity="error"
            style={{ fontSize: '14px' }}
          >
            <div>
              <div>
                <span className={styles.title}>
                  {t('error')}{t('enSpace')}{t('type')}:
                </span>
                <span>{t('system')}{t('enSpace')}{t('error')}</span>
              </div>
              <div>
                <span className={styles.title}>
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
            className={`${classes.alertIcon}`}
            severity="warning"
          >
            <div>
              <div>
                <span className={styles.title}>
                  {t('error')}{t('enSpace')}{t('type')}:
                </span>
                <span>
                  {t('resourceConflicts')}
                </span>
              </div>
              <div>
                <span className={styles.title}>
                  {t('conflictCount')}:
                </span>
                <span>
                  {resourceRetries}
                </span>
              </div>
              <div>
                <span className={styles.title}>
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
      <div className={`${styles.container} ${isTablet ? styles.isTabletContainer : ''}`}>
        <p className={styles.jobName}>
          {jobInfo.name}
        </p>
        <div className={`${styles.row} ${isTablet ? styles.flexDirectionColumn : ''}`}>
          <div className={styles.column}>
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
          <div className={styles.column}>
            <div>
              {t('startTime')}
            </div>
            <div>
              {moment(jobInfo.jobStatus.createdTime).format('YYYY/MM/DD HH:mm:ss')}
            </div>
          </div>
          <div className={styles.column}>
            <div>
              {t('User')}
            </div>
            <div>
              {jobInfo.jobStatus.username}
            </div>
          </div>
          <div className={styles.column}>
            <div>
              {t('group')}
            </div>
            <div>
              {jobConfig.extras.virtualGroup}
            </div>
          </div>
          <div className={styles.column}>
            <div>
              {t('duration')}
            </div>
            <div>
              {getDurationString(jobInfo)}
            </div>
          </div>
          <div className={styles.column}>
            <div>
              {`${t('GPU')}${t('enSpace')}${t('usageTime')}`}
            </div>
            <div>
              {getGPUUseTime(jobInfo, jobConfig)}
            </div>
          </div>
          <div className={styles.column}>
            <div>
              {t('retries')}
            </div>
            <div>
              {jobInfo.jobStatus.retries}
            </div>
          </div>
          <div className={styles.column}>
            <div>
              {t('check')}
            </div>
            <div>
              <ul className={styles.toolBox}>
                <li>
                  <a
                    className={classes.link}
                    disabled={isNil(jobConfig)}
                    href="#"
                    onClick={showJobConfig}
                  >
                    {t('JSONConfig')}
                  </a>
                </li>
                <li>
                  <a
                    className={classes.link}
                    disabled={isEmpty(jobInfo.jobStatus.appExitDiagnostics)}
                    href="#"
                    onClick={showApplicationSummary}
                  >
                    {t('job')}{t('enSpace')}{t('summary')}
                  </a>
                </li>
                <li>
                  <BaseLink
                    style={{ padding: '0' }}
                    to={`/cluster-report?tab=job&jobName=${jobInfo.name}&vg=${!isEmpty(jobInfo.jobStatus) && jobInfo.jobStatus.description.virtualGroup}&createdTime=${!isEmpty(jobInfo.jobStatus) && jobInfo.jobStatus.createdTime}`}
                  >
                    {t('job')}{t('enSpace')}{t('monitor')}
                  </BaseLink>
                </li>
                <li>
                  <BaseLink
                    style={{ padding: '0' }}
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
