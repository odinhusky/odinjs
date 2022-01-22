import React, {
  useContext
} from 'react'

// ? context
import UserInfoContext from '../../UserInfoContext';

// Self-packed Componets
import BaseVerticalTabPanel from 'components/BaseVerticalTabAndPanel/BaseVerticalTabPanel';

// plugins
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

/**
 * @author odin
 * @level views/UserInfo/BaseVerticalTabPanelContainer/AvailableSource
 * @prop {number} currentTabIndex -- 目前是哪一個 tab 被正在 active
 * @prop {object} userInfo -- 使用者的相關資訊，從 GlobalContext 來的
 * @prop {array} limitedVg -- 拿到這個使用者的集群以及被限制的資源數量
 * @component AvailableSource
 * @description Available Source tab
*/
export default function AvailableSource({
  currentTabIndex,
  userInfo,
  limitedVg,
  getResource
}) {

  // $ init data
  const { t } = useTranslation();

  // = style
  const { classes, selfCanUseVgList } = useContext(UserInfoContext);

  return (
    <BaseVerticalTabPanel
      index={2}
      value={currentTabIndex}
    >
      {/* 集群 */}
      <div
        className={`${classes.w_full} ${classes.mb_20} ${classes.flex_align_start}`}
      >
        <div
          className={`${classes.w_ctrl90} ${classes.mr_16} ${classes.black_60}`}
        >
          {t('group')}</div>
        <div
          className={classes.w_ctrl_left90}
        >
          {
            !isEmpty(limitedVg) && Object.entries(limitedVg).map(([vgName, { resourceCells }]) => (
              <div
                className={`${classes.vgUnit}`}
                key={vgName}
              >
                <div
                  className={classes.w_full}
                >
                  {vgName}
                </div>

                {
                  !isEmpty(resourceCells) && Object.entries(resourceCells).map(([cellName, limitedNumber]) => {
                    const { unitStr } = getResource(vgName, cellName, limitedNumber, selfCanUseVgList)
                    const limitNumberStr = limitedNumber === -1 ? t('Unlimited') : limitedNumber

                    return (
                      <div
                        className={classes.w_full}
                        key={cellName}
                      >
                        {`${cellName}(${unitStr}) - ${limitNumberStr}`}
                      </div>
                    )
                  })
                }
              </div>
            ))
          }
        </div>
      </div>

      {/* 集中式存儲 */}
      <div
        className={`${classes.w_full} ${classes.mb_20} ${classes.flex_align_start}`}
      >
        <div
          className={`${classes.w_ctrl90} ${classes.mr_16} ${classes.black_60}`}
        >
          {t('NFS')}</div>
        <div
          className={classes.w_ctrl_left90}
        >
          {
            userInfo.nfsList && userInfo.nfsList.map(vg => (
              <div
                className={classes.w_full}
                key={vg}
              >
                {vg}
              </div>
            ))
          }
        </div>
      </div>

      {/* 分散式存儲 */}
      <div
        className={`${classes.w_full} ${classes.mb_20} ${classes.flex_align_start}`}
      >
        <div
          className={`${classes.w_ctrl90} ${classes.mr_16} ${classes.black_60}`}
        >
          {t('glusterfs')}</div>
        <div
          className={classes.w_ctrl_left90}
        >
          {
            userInfo.glusterfsList && userInfo.glusterfsList.map(vg => (
              <div
                className={classes.w_full}
                key={vg}
              >
                {vg}
              </div>
            ))
          }
        </div>
      </div>

      {/* CPU */}
      {/* <div
        className={`${classes.w_full} ${classes.mb_20} ${classes.flex_align_start}`}
      >
        <div
          className={`${classes.w_ctrl90} ${classes.mr_16} ${classes.black_60}`}
        >
          {t('CPU')}</div>
        <div
          className={classes.w_ctrl_left90}
        >
          {
            userInfo.limitResource && userInfo.limitResource.cpu
          }
        </div>
      </div> */}

      {/* 記憶體 */}
      {/* <div
        className={`${classes.w_full} ${classes.mb_20} ${classes.flex_align_start}`}
      >
        <div
          className={`${classes.w_ctrl90} ${classes.mr_16} ${classes.black_60}`}
        >
          {t('memory')}</div>
        <div
          className={classes.w_ctrl_left90}
        >
          {
            userInfo.limitResource
            && userInfo.limitResource.memory
            && `${userInfo.limitResource.memory} MB`
          }
        </div>
      </div> */}

      {/* 硬碟容量 */}
      {/* <div
        className={`${classes.w_full} ${classes.mb_20} ${classes.flex_align_start}`}
      >
        <div
          className={`${classes.w_ctrl90} ${classes.mr_16} ${classes.black_60}`}
        >
          {t('disk')}</div>
        <div
          className={classes.w_ctrl_left90}
        >
          {
            userInfo.limitResource
            && userInfo.limitResource.storage
            && `${userInfo.limitResource.storage} GB`
          }
        </div>
      </div> */}

      {/* 硬碟容量 */}
      {/* <div
        className={`${classes.w_full} ${classes.mb_20} ${classes.flex_align_start}`}
      >
        <div
          className={`${classes.w_ctrl90} ${classes.mr_16} ${classes.black_60}`}
        >
          {t('GPU')}</div>
        <div
          className={classes.w_ctrl_left90}
        >
          {
            userInfo.limitResource
            && userInfo.limitResource.gpu
            && Object.entries(userInfo.limitResource.gpu).map(([key, value]) => (
              <div key={key}>{value} ({key})</div>
            ))
          }
        </div>
      </div> */}

    </BaseVerticalTabPanel>
  )
}

AvailableSource.propTypes = {
  currentTabIndex: PropTypes.number,
  userInfo: PropTypes.object,
  limitedVg: PropTypes.object,
  getResource: PropTypes.func
};