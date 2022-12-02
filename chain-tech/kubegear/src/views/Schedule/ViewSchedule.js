import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// # API
import { deleteJobSchedule } from 'utils/api';

// ? context
import ScheduleContext from './ScheduleContext';
// import GlobalContext from 'layouts/Main/GlobalContext';

// ^ Material-ui Componets(Functions)
import Icon from '@material-ui/core/Icon';

// ? Self-packed Components || Functions
import ConfirmModalNew from 'components/ConfirmModalNew';
import BaseModalNew from 'components/BaseModalNew';
import { ViewTemplateModal } from 'reuseContainers/ViewTemplateModal';
import {
  DefaultButton,
  PrimaryButton
} from 'components/BaseButton';
import { handleK8sResourceName } from 'common/commonMethods';

// ^ Plugins
import { useTranslation } from 'react-i18next';
import { isEmpty, isNil } from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

/**
 * @author odin
 * @level views/Schedule/ViewSchedule
 * @prop {function} refreshEvent -- 重新取得 schedule events 的 Func.
 * @prop {object} data -- 目前選擇的 排程(Event) 所有相關的內容
 * @prop {boolean} isOpen -- 是否要開啟這個 Modal
 * @prop {function} onClose -- 關閉的 Func.
 * @prop {string} selectedVg -- 選擇的集群名稱
 * @prop {boolean} isAdminEntry -- 是否是從排程管理進來的
 * @prop {function} goEdit -- 進入編輯模式的 Func.
 * @prop {function} onAcceptSchedule -- 批准特定的排程
 * @prop {function} onDenySchedule -- 拒絕特定的排程
 * @component ViewSchedule
 * @description ViewSchedule Modal
*/
function ViewSchedule({
  refreshEvent,
  eventData,
  isOpen,
  onClose,
  isAdminEntry,
  goEdit,
  onAcceptSchedule,
  onDenySchedule
}) {

  // $ init data
  const { t } = useTranslation();

  // = styles
  const { classes } = useContext(ScheduleContext)

  // # states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [templateInfo, setTemplateInfo] = useState({});
  const [isViewModalShow, setIsViewModalShow] = useState(false);

  const [isNotStart, setIsNotStart] = useState(false);
  const [isRunningPeriod, setIsRunningPeriod] = useState(false);

  // - methods
  const onDelete = () => {
    deleteJobSchedule(eventData.id)
      .then(() => {
        setShowDeleteModal(false);
        onClose();
        refreshEvent();
        toast.success(t('success'));
      })
      .catch(err => {
      // .catch(({ message: msg }) => {
        const msg = err.data.message
        toast.error(msg)
      });
  }

  const stateText = state => {
    switch (state) {
      case -1:
        return <div style={{ background: '#FFE4DD', display: 'inline-block' }}>{t('denied')}</div>;
      case 0:
        return <div style={{ background: '#FFF8EA', display: 'inline-block' }}>{t('verifying')}</div>;
      case 1:
        return <div style={{ background: '#D6F8C5', display: 'inline-block' }}>{t('verified')}</div>;
      default:
        return '';
    }
  };

  const stateBackground = state => {
    switch (state) {
      case -1:
        return `${classes['state--denied']}`;
      case 0:
        return `${classes['state--verifying']}`;
      case 1:
        return `${classes['state--verified']}`;
      default:
        return '';
    }
  }

  const stateColor = state => {
    switch (state) {
      case -1:
        return `${classes['info--red']}`;
      case 0:
        return `${classes['info--state']}`;
      case 1:
        return `${classes['info--green']}`;
      default:
        return 'green';
    }
  };

  // * hooks
  useEffect(() => {
    const now = new Date().getTime()
    const { startAt, endAt } = eventData

    setIsNotStart(startAt > now)
    setIsRunningPeriod(now > startAt && endAt > now)
  }, [eventData])

  return (
    <>
      <BaseModalNew
        classNameObj={{
          modalContainer: `${classes.eventModalContainer}`
        }}
        isCloseIcon
        isOpen={isOpen}
        modalFoot={
          <>
            {
              isAdminEntry ? (
                <>
                  {/* 透過 jobState 來決定是否要顯示 拒絕 或是 通過 的按鈕 */}
                  {
                    (eventData.state === 1 ||
                    eventData.state === 0) &&
                      <DefaultButton
                        children={t('Deny')}
                        classNameProps={classes.denyBtn}
                        onClick={() => {
                          // console.log('拒絕')
                          onDenySchedule(eventData.id);
                        }}
                      />
                  }
                  {
                    (eventData.state === -1 ||
                    eventData.state === 0) &&
                      <PrimaryButton
                        children={t('passed')}
                        classNameProps={classes.ml_20}
                        onClick={() => {
                          // console.log('通過')
                          onAcceptSchedule(eventData.id);
                        }}
                      />
                  }
                </>
              ) : null
            }
          </>
        }
        modalHeadNode={
          <div className={`${classes.flex_align_center}`}>
            {/* 檢視 */}
            {
              // isAdminEntry &&
              (isNotStart || isRunningPeriod) &&
              !isNil(eventData.jobConfig) &&
                <div
                  className={`${classes.iconUnit} ${classes.cursorPointer}`}
                  onClick={() => {
                    const templateInfo = {
                      owner: '',
                      description: '',
                      jobConfig: { ...eventData.jobConfig }
                    }

                    setTemplateInfo(templateInfo)
                    setIsViewModalShow(templateInfo)
                  }}
                >
                  <Icon
                    children="visibility"
                    className={`${classes.fz_14}`}
                    color="primary"
                  />
                </div>
            }

            {/* 延長時程 */}
            {/* {
              isTimeBeforeNow && data.state === -1 &&
                <Icon
                  children="icon1"
                  onClick={() => {
                    // onOpenModifyModal()
                    onClose()
                  }}
                />
            } */}

            {/* 編輯 */}
            <div
              className={`${classes.iconUnit} ${classes.cursorPointer}`}
              onClick={() => {
                goEdit(eventData)
                onClose()
              }}
            >
              <Icon
                children="edit"
                className={`${classes.fz_14}`}
                color="primary"
              />
            </div>

            {/* 刪除 */}
            <div
              className={`${classes.iconUnit} ${classes.cursorPointer}`}
              onClick={() => setShowDeleteModal(true)}
            >
              <Icon
                children="delete_outline"
                className={`${classes.fz_14}`}
                color="primary"
              />
            </div>
          </div>
        }
        onClose={onClose}
        title={''}
      >
        <div className={`${classes.p_20}`}>
          <div className={`${classes.d_flex} ${classes.directionColumn}`}>
            {/* 狀態文字: 排程名稱 */}
            <div className={`${classes.eventRow}`}>
              <div className={`${classes.eventTitle} ${stateColor(eventData.state)}`}>
                <div className={`${classes.eventTitleState} ${stateBackground(eventData.state)}`}>
                  {stateText(eventData.state)}
                </div>
              </div>
              <div className={`${classes.eventBoldText} ${classes.eventDescription}`}>{eventData.name}</div>
            </div>

            {/* 時間 */}
            <div className={`${classes.eventRow}`}>
              <div className={`${classes.eventTitle}`}>{t('time')}</div>
              <div className={`${classes.eventDescription}`}>{moment(eventData.startAt).format('MM/DD HH:mm')} - {moment(eventData.endAt).format('MM/DD HH:mm')}</div>
            </div>

            {/* 用戶 */}
            <div className={`${classes.eventRow}`}>
              <div className={`${classes.eventTitle}`}>{t('user')}</div>
              <div className={`${classes.eventDescription}`}>{eventData.user}</div>
            </div>

            {/* 叢集 | 集群 */}
            <div className={`${classes.eventRow}`}>
              <div className={`${classes.eventTitle}`}>{t('virtualCluster')}</div>
              <div className={`${classes.eventDescription}`}>{eventData.virtualGroup}</div>
            </div>

            {/* 資源 X 數量 */}
            {
              !isEmpty(eventData.cells) && Object.entries(eventData.cells).map(([cellName, { number }], index) => {

                return (
                  <div
                    className={`${classes.eventRow}`}
                    key={`${cellName}-${number}-${index}`}
                  >
                    <div className={`${classes.eventTitle} ${index > 0 && classes.opacity_0}`}>{t('resource_number')}</div>
                    <div className={`${classes.eventDescription}`}>{
                      `${handleK8sResourceName(cellName)} - ${number}`
                    }</div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </BaseModalNew>

      {/* Modal */}
      {
        showDeleteModal &&
        <ConfirmModalNew
          confirmText={t('delete')}
          content={t('sureDelete', { name: eventData.name })}
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={onDelete}
          title={`${t('delete')}${t('enSpace')}`}
        />
      }

      {
        isViewModalShow &&
        <ViewTemplateModal
          isOpen={isViewModalShow}
          onClose={() => {setIsViewModalShow(false)}}
          templateInfo={templateInfo}
          title={`${t('view')}${t('enSpace')}${t('schedule')}`}
        />
      }
    </>
  );
}

ViewSchedule.propTypes = {
  refreshEvent: PropTypes.func,
  eventData: PropTypes.object,
  onClose: PropTypes.func,
  isOpen: PropTypes.bool,
  selectedVg: PropTypes.string,
  isAdminEntry: PropTypes.bool,
  goEdit: PropTypes.func,
  onAcceptSchedule: PropTypes.func,
  onDenySchedule: PropTypes.func
}

export default ViewSchedule;