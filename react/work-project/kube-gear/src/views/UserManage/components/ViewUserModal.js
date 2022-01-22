import React, { useContext } from 'react';
import { DefaultButton } from 'components/BaseButton';
import BaseModal from 'components/BaseModal';
import PropTypes from 'prop-types';
import Context from '../utils/Context';
import { useTranslation } from 'react-i18next';
import styles from './index.module.scss';
import { isEmpty } from 'lodash';
import Title from './Title';

const formatTimeString = mseconds => {
  const totalSeconds = mseconds / 1000;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
  const seconds = Math.floor(totalSeconds - hours * 3600 - minutes * 60);
  const timeString =
    hours.toString().padStart(2, '0') +
    ':' +
    minutes.toString().padStart(2, '0') +
    ':' +
    seconds.toString().padStart(2, '0');
  return timeString;
};

function ViewUserModal() {
  const { t } = useTranslation();
  const { userInfo, showViewUserModal: isOpen, setShowViewUserModal: onClose } = useContext(Context);

  const statusLabelStyle = state => {
    const stateRef = [1, 0, -1];
    const fontColors = ['green', 'orange', 'red'];
    const backgroundColors = ['#D6F8C5', '#FFF8EA', '#FDE7E9'];
    return {
      color: fontColors[stateRef.indexOf(state)],
      background: backgroundColors[stateRef.indexOf(state)],
      padding: '5px 10px',
      marginLeft: 10
    }
  }

  const combineGroupData = (leader, member) => {
    if (!leader || !member) return [];
    const leaderWithText = leader.map(v => ({ text: t('TeamLeader'), name: v }))
    const memberWithText = member.map(v => ({ text: t('TeamMember'), name: v }))
    return [...leaderWithText, ...memberWithText].reduce((acc, curr) => {
      if (acc.find(v => v.name === curr.name)) {
        acc.find(v => v.name === curr.name).text += ` ${curr.text}`
        return acc
      }
      return [...acc, curr]
    }, [])
  }

  return (
    <BaseModal
      isOpen={isOpen}
      style={{ width: '800px', height: '700px', overflow: 'auto' }}
      title={`${t('User')}${t('enSpace')}${t('info')}`}
    >
      <Title
        text={<div style={{ display: 'flex', alignItems: 'center' }}>
          {userInfo.username}
          <div style={statusLabelStyle(userInfo.state)}>
            {userInfo.state === 1
              ? t('verified')
              : userInfo.state === 0 ? t('verifying') : t('denied')}
          </div>
        </div>}
      />
      <div className={styles.viewBox}>
        <div className={styles.content}>
          <div className={styles.field25}>
            <p>{`${t('jobNumber')}/${t('studentNumber')}`}</p>
            <p>{userInfo.userCode}</p>
          </div>
          <div className={styles.field25}>
            <p>{t('fullName')}</p>
            <p>{userInfo.name}</p>
          </div>
          <div className={styles.field25}>
            <p>{`${t('mobileNumber')}`}</p>
            <p>{userInfo.phone}</p>
          </div>
          <div className={styles.field25}>
            <p>{`${t('email')}`}</p>
            <p>{userInfo.email}</p>
          </div>
          <div className={styles.field50}>
            <p>{`${t('note')}`}</p>
            <p>{userInfo.description}</p>
          </div>
          <div className={styles.field25}>
            <p>{`${t('group2')}`}</p>
            {
              combineGroupData(userInfo.leaderGroups, userInfo.userGroups).map(item => (
                <div key={item}>
                  {item.name} <span>( {item.text} )</span>
                </div>
              ))
            }
          </div>
        </div>
      </div>
      <Title text={`${t('resource')}${t('enSpace')}${t('configuration')}`} />
      <div className={styles.viewBox}>
        <div className={styles.content}>
          <div className={styles.field25}>
            <p>{t('jobUseTime')}</p>
            <p>{formatTimeString(userInfo.totalUsedTime)}</p>
          </div>
          <div className={styles.field75}>
            <p>{t('jobTimeLimit')}</p>
            <p>{isEmpty(userInfo.roles) ? 'N/A' : userInfo.jobLifeHour}</p>
          </div>
          <div className={styles.field25}>
            <p>{t('role')}</p>
            {
              isEmpty(userInfo.roles)
                ? <div>N/A</div>
                : userInfo.roles.map(v => <div key={v}>{v}</div>)
            }
          </div>
          <div className={styles.field25}>
            <p>{t('privilege')}</p>
            {
              isEmpty(userInfo.privileges)
                ? <div>N/A</div>
                : userInfo.privileges.map(v => <div key={v}>{v}</div>)
            }
          </div>
          <div className={styles.field25}>
            <p>{t('mount')}</p>
            {
              isEmpty(userInfo.nfsList)
                ? <div>N/A</div>
                : userInfo.nfsList.map(v => <div key={v}>{v}</div>)
            }
          </div>
          <div className={styles.field25}>
            <p>{`${t('PhysicalGlusterFS')}${t('enSpace')}${t('volumeGlusterFS')}`}</p>
            {
              isEmpty(userInfo.glusterfsList)
                ? <div>N/A</div>
                : userInfo.glusterfsList.map(v => <div key={v}>{v}</div>)
            }
          </div>
          <div className={styles.field25}>
            <p>{t('group')}</p>
            {
              isEmpty(userInfo.virtualGroups)
                ? <div>N/A</div>
                : userInfo.virtualGroups.map(v => <div key={v}>{v}</div>)
            }
          </div>
        </div>
      </div>
      {
        !isEmpty(userInfo.limitResource) &&
          <Title
            text={`${t('allocatable')}${t('enSpace')}${t('resource')} / ${userInfo.limitResource.enabled === true
              ? t('userLevel')
              : userInfo.limitResource.enabled === false ? `${t('no2')}${t('enSpace')}${t('limit')}` : t('systemLevel') }`}
          />
      }
      <div className={styles.viewBox}>
        <div className={styles.content}>
          {
            !isEmpty(userInfo.limitResource) && userInfo.limitResource.enabled !== false &&
                <>
                  <div className={styles.field25}>
                    <p>CPU</p>
                    <p>{userInfo.limitResource.cpu !== null ? userInfo.limitResource.cpu : `${t('no2')}${t('enSpace')}${t('limit')}`}</p>
                  </div>
                  <div className={styles.field25}>
                    <p>{`${t('memory')} (MB)`}</p>
                    <p>{userInfo.limitResource.memory !== null ? userInfo.limitResource.memory : `${t('no2')}${t('enSpace')}${t('limit')}`}</p>
                  </div>
                  <div className={styles.field25}>
                    <p>{`${t('disk')} (GB)`}</p>
                    <p>{userInfo.limitResource.storage !== null ? userInfo.limitResource.storage : `${t('no2')}${t('enSpace')}${t('limit')}`}</p>
                  </div>
                  {
                    !isEmpty(userInfo.limitResource.gpu) ? Object.entries(userInfo.limitResource.gpu).map(([key, value]) => {
                      return (
                        <div
                          className={styles.field25}
                          key={key}
                        >
                          <p>{`GPU ${key}`}</p>
                          <p>{value}</p>
                        </div>
                      )
                    })
                      :
                      <div className={styles.field25}>
                        <p>GPU</p>
                        <p>{`${t('no2')}${t('enSpace')}${t('limit')}`}</p>
                      </div>
                  }
                </>
          }
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 15 }}>
        <DefaultButton
          children={t('close')}
          onClick={() => {
            onClose(false);
          }}
        />
      </div>
    </BaseModal>
  );
}

ViewUserModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default ViewUserModal;
