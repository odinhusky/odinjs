import React, { useState, useContext } from 'react';

// # API
import { applyGroup } from 'utils/api';

// ? context
// import GlobalContext from 'layouts/Main/GlobalContext';
import UserInfoContext from '../../UserInfoContext';

// ? self-packed components || functions
import BasePaper from 'components/BaseMuiPaper';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import Ordering from '../../Ordering';
import ConfirmModal from 'components/ConfirmModal';
import { applySortProps }   from 'common/commonMethods'

// ^ plugins
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

/**
 * @author odin
 * @level views/UserInfo/MyGroup/GroupModal/Table
 * @param {array} data -- 過濾後的表格內容
 * @param {object} userInfo -- 目前登入的使用者的相關訊息，由 Redux 的 store 中取出
 * @param {function} getUserInfo -- 包含 dispatch()的 function，username 從 cookie 取得，由 Redux 的 store 中取出
 * @component Table
 * @description Group Table
*/
const Table = ({ data, userInfo, getUserInfo }) => {

  // $ init data
  const { t } = useTranslation();

  // = style
  const { classes } = useContext(UserInfoContext);

  // # states
  const [modalData, setModalData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // 確認的燈箱是否開啟
  const [ordering, setOrdering] = useState(new Ordering());
  const [pageIndex, setPageIndex] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // - methods
  /**
   * @author odin
   * @param {Object} data -- 外部傳入的 props 作為打 API 的 data 內容
   * @description 打API拿取資料
  */
  const applyGroupEvent = (data) => {

    applyGroup(data)
      .then(() => {
        setIsModalOpen(false);
        getUserInfo()
      })
      .catch(err => {
      // .catch(({ message: msg }) => {
        const msg = err.data.message
        toast.error(msg)
      });
  }

  // 依照不同的狀態給予不同的按鈕樣式以及文字
  const handleModalData = ({ name, state, action }) => {
    const result = {};
    switch (state) {
      default:
      case 0:
        result.title = t('leaveGroup')
        result.content = t('sureLeaveGroup', { name })
        result.confrimText = t('leave')
        break;
      case 1:
        result.title = t('cancelApply')
        result.content = t('sureCancelApply', { name })
        result.confrimText = t('confirm')
        break;
      case 2:
        result.title = action === 1 ? t('joinGroup') : t('leaveGroup')
        result.content = action === 1 ?  t('sureJoinGroup', { name }) : t('sureDenyGroup', { name })
        result.confrimText = action === 1 ? t('join') : t('Deny')
        break;
      case 3:
        result.title = t('joinGroup')
        result.content = t('sureJoinGroup', { name })
        result.confrimText = t('join')
        break;
    }
    result.method = () => applyGroupEvent({ user: userInfo.username, group: name, applyState: action })
    setModalData(result);
    setIsModalOpen(true);
  }

  // & handled data
  const muiColumns = [
    // 名稱
    applySortProps({
      column: {
        id: 'group',
        key: 'group',
        label: t('name'),
        onTableCellRender: info => (
          <div className={classes.columnGroup}>
            {info.group}
          </div>
        )
      },
      Ordering,
      ordering,
      setOrdering
    }),
    // 狀態
    {
      id: 'state',
      key: 'state',
      label: t('status'),
      onTableCellRender: info => {
        // 0: 已加入 1: 已申請 2: 已邀請 3: 可申請
        const fontColors = ['#0070C6', '#FFA500', '#FF5974', '#008000'];
        const backgroundColors = ['#C9F1FC', '#FFF8EA', '#FFE4DD', '#D6F8C5'];
        const text = [t('joined'), t('applied'), t('invited'), t('canApply')]
        const state = (() => {
          const { applyState, inviteState } = info
          if (applyState === 1 && inviteState === 1) {
            return 0
          } else if (applyState === 1 && inviteState === 0) {
            return 1
          } else if (applyState === 0 && inviteState === 1) {
            return 2
          } else {
            return 3
          }
        })()

        return (
          <div
            className={classes.columnState}
            style={{
              color: fontColors[state],
              background: backgroundColors[state]
            }}
          >
            {
              text[state]
            }
          </div>
        )
      }
    },
    // 操作
    {
      id: 'action',
      key: 'action',
      label: t('Operations'),
      onTableCellRender: info => {
        const state = (() => {
          const { applyState, inviteState } = info
          if (applyState === 1 && inviteState === 1) {
            return 0
          } else if (applyState === 1 && inviteState === 0) {
            return 1
          } else if (applyState === 0 && inviteState === 1) {
            return 2
          } else {
            return 3
          }
        })()

        if (state === 0)
          return (
            <DefaultButton
              children={t('leave')}
              onClick={() => handleModalData({ name:info.group, state, action: -1 })}
            />
          )
        if (state === 1)
          return (
            <DefaultButton
              children={t('cancel')}
              onClick={() => handleModalData({ name:info.group, state, action: -1 })}
            />
          )
        if (state === 2)
          return (
            <>
              <PrimaryButton
                children={t('join')}
                className={classes.mr_10}
                onClick={() => handleModalData({ name:info.group, state, action: 1 })}
              />
              <DefaultButton
                children={t('Deny')}
                onClick={() => handleModalData({ name:info.group, state, action: -1 })}
              />
            </>
          )

        return (
          <PrimaryButton
            children={t('join')}
            onClick={() => handleModalData({ name:info.group, state, action: 1 })}
          />
        )
      }
    }
  ]

  return (
    <>
      <BasePaper
        columns={muiColumns}
        labelRowsPerPage={t('labelRowsPerPage')}
        ordering={ordering}
        page={pageIndex}
        rows={ordering.apply(data)}
        rowsPerPage={rowsPerPage}
        setPage={setPageIndex}
        setRowsPerPage={setRowsPerPage}
      />

      {
        isModalOpen &&
        <ConfirmModal
          confrimText={modalData.confrimText}
          content={modalData.content}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={modalData.method}
          title={modalData.title}
        />
      }
    </>
  );
};

Table.propTypes = {
  data: PropTypes.array,
  userInfo: PropTypes.object,
  getUserInfo: PropTypes.func
};

export default Table;