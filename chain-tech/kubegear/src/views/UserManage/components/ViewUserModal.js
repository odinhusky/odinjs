import React, { useContext } from 'react';

// ? context
import UserManageContext from '../UserManageContext';

// ? Self-packed Components || Functions
import { DefaultButton } from 'components/BaseButton';
import BaseModalNew from 'components/BaseModalNew';
import Title from './Title';

// ^ Plugin
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/UserManage/ViewUserModal
 * @component ViewUserModal
 * @description ViewUserModal component
*/
function ViewUserModal() {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const {
    userInfo,
    showViewUserModal: isOpen,
    setShowViewUserModal:
    onClose,
    classes,
    combineGroupData,
    formatTimeString
  } = useContext(UserManageContext);

  // - methods
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

  return (
    <BaseModalNew
      classNameObj={{
        modalContainer: `
          ${classes.w_800px}
          ${classes.h_700px}
          ${classes.overflowAuto}
          ${classes.d_flex}
          ${classes.directionColumn}`,
        modalFoot: `${classes.mt_auto}`
      }}
      isOpen={isOpen}
      modalFoot={
        <>
          <DefaultButton
            children={t('close')}
            onClick={() => {
              onClose(false);
            }}
          />
        </>
      }
      onClose={() => { onClose(false); }}
      size="md"
      title={`${t('User')}${t('enSpace')}${t('info')}`}
    >
      <Title
        text={<div className={`${classes.flex_align_center}`}>
          {userInfo.username}
          <div style={statusLabelStyle(userInfo.state)}>
            {userInfo.state === 1
              ? t('verified')
              : userInfo.state === 0 ? t('verifying') : t('denied')}
          </div>
        </div>}
      />
      <div>
        <div className={`${classes.viewBoxContent}`}>
          <div className={`${classes.w_25}`}>
            <p>{`${t('jobNumber')}/${t('studentNumber')}`}</p>
            <p>{userInfo.userCode}</p>
          </div>
          <div className={`${classes.w_25}`}>
            <p>{t('fullName')}</p>
            <p>{userInfo.name}</p>
          </div>
          <div className={`${classes.w_25}`}>
            <p>{`${t('mobileNumber')}`}</p>
            <p>{userInfo.phone}</p>
          </div>
          <div className={`${classes.w_25}`}>
            <p>{`${t('email')}`}</p>
            <p>{userInfo.email}</p>
          </div>
          <div className={`${classes.w_50}`}>
            <p>{`${t('note')}`}</p>
            <p>{userInfo.description}</p>
          </div>
          <div className={`${classes.w_25}`}>
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

      <div>
        <div className={`${classes.viewBoxContent}`}>
          <div className={`${classes.w_25}`}>
            <p>{t('jobUseTime')}</p>
            <p>{formatTimeString(userInfo.totalUsedTime)}</p>
          </div>
          <div className={`${classes.w_75}`}>
            {/* <p>{t('jobTimeLimit')}</p>
            <p>{isEmpty(userInfo.roles) ? 'N/A' : userInfo.jobLifeHour}</p> */}
          </div>
          <div className={`${classes.w_25}`}>
            <p>{t('role')}</p>
            {
              isEmpty(userInfo.roles)
                ? <div>N/A</div>
                : userInfo.roles.map(v => <div key={v}>{v}</div>)
            }
          </div>
          <div className={`${classes.w_25}`}>
            <p>{t('privilege')}</p>
            {
              isEmpty(userInfo.privileges)
                ? <div>N/A</div>
                : userInfo.privileges.map(v => <div key={v}>{v}</div>)
            }
          </div>
          <div className={`${classes.w_25}`}>
            <p>{t('mount')}</p>
            {
              isEmpty(userInfo.nfsList)
                ? <div>N/A</div>
                : userInfo.nfsList.map(v => <div key={v}>{v}</div>)
            }
          </div>
          <div className={`${classes.w_25}`}>
            <p>{`${t('PhysicalGlusterFS')}${t('enSpace')}${t('volumeGlusterFS')}`}</p>
            {
              isEmpty(userInfo.glusterfsList)
                ? <div>N/A</div>
                : userInfo.glusterfsList.map(v => <div key={v}>{v}</div>)
            }
          </div>
          <div className={`${classes.w_25}`}>
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
      <div>
        <div className={`${classes.viewBoxContent}`}>
          {
            !isEmpty(userInfo.limitResource) && userInfo.limitResource.enabled !== false &&
                <>
                  <div className={`${classes.w_25}`}>
                    <p>CPU</p>
                    <p>{userInfo.limitResource.cpu !== null ? userInfo.limitResource.cpu : `${t('no2')}${t('enSpace')}${t('limit')}`}</p>
                  </div>
                  <div className={`${classes.w_25}`}>
                    <p>{`${t('memory')} (MB)`}</p>
                    <p>{userInfo.limitResource.memory !== null ? userInfo.limitResource.memory : `${t('no2')}${t('enSpace')}${t('limit')}`}</p>
                  </div>
                  <div className={`${classes.w_25}`}>
                    <p>{`${t('disk')} (GB)`}</p>
                    <p>{userInfo.limitResource.storage !== null ? userInfo.limitResource.storage : `${t('no2')}${t('enSpace')}${t('limit')}`}</p>
                  </div>
                  {
                    !isEmpty(userInfo.limitResource.gpu) ? Object.entries(userInfo.limitResource.gpu).map(([key, value]) => {
                      return (
                        <div
                          className={`${classes.w_25}`}
                          key={key}
                        >
                          <p>{`GPU ${key}`}</p>
                          <p>{value}</p>
                        </div>
                      )
                    })
                      :
                      <div className={`${classes.w_25}`}>
                        <p>GPU</p>
                        <p>{`${t('no2')}${t('enSpace')}${t('limit')}`}</p>
                      </div>
                  }
                </>
          }
        </div>
      </div>
    </BaseModalNew>
  );
}

ViewUserModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default ViewUserModal;
