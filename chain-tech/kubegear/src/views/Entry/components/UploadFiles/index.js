import React, {
  useState,
  useEffect,
  useContext
} from 'react'

// ? context
import EntryContext from '../../EntryContext';
import GlobalContext from 'layouts/Main/GlobalContext';

// ^ Redux
import { selectUserInfo } from 'layouts/Main/features/userinfo/userinfoSlice';

// ? Self-packed Components || Functions
import BaseSimpleCard from 'components/BaseCard/BaseSimpleCard'
import IconBtn from '../IconBtn';

// ^ plugins
import { useTranslation } from 'react-i18next';
// import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import cookies from 'js-cookie';


/**
 * @author odin
 * @level views/Entry/GeneralPanels/UploadFiles
 * @component UploadFiles
 * @description Upload files links component
*/
export default function UploadFiles() {

  // $ init data
  const { t } = useTranslation();
  const userName = cookies.get('user');

  // % context
  const { useSelector } = useContext(GlobalContext);
  const {
    classes,
    isAdmin,
    isShowGuide,
    currentStep,
    isSmallTablet
  } = useContext(EntryContext);

  // ^ Redux
  const userInfo = useSelector(selectUserInfo);

  // # states
  const [hasNFSConfig, setHasNFSConfig] = useState() // 是否有集中式存儲
  const [hasGlusterfsConfig, setHasGlusterfsConfig] = useState() // 是否有分散式存儲


  // - methods
  /**
   * @author odin
   * @description Get initialization data from API
  */
  const initData = async () => {
  }

  // * hooks
  /**
   * @author odin
   * @description Component Initialization
  */
  useEffect(()=> {
    if(isAdmin) initData()
  }, [])

  /**
   * @author odin
   * @description Get glusterfsList
  */
  useEffect(()=> {
    if(!isEmpty(userInfo)) {
      const { glusterfsList, nfsList } = userInfo

      setHasNFSConfig(nfsList.includes(userName))
      setHasGlusterfsConfig(glusterfsList.includes(userName))
    }
  }, [userInfo])

  return (
    <div
      className={`
        ${classes.uploadFilesContainer}
        ${(isShowGuide === true && currentStep === 3 && isSmallTablet === false) && classes.guideShow}
      `}
    >
      <BaseSimpleCard
        cardTitle={`${t('uploadFile')}`}
      >
        <div className={`${classes.uploadFilesContent}`}>
          {/* 集中式存儲 */}
          <div className={`${classes.mb_20}`}>
            <IconBtn
              color="red"
              // disabled={!hasNFSConfig}
              disabled={!hasNFSConfig}
              href={hasNFSConfig ? (
                `/fs-item-list/${userName}`) : ''}
              icon={<i className="fa fa-inbox" />}
              text={t('NFS')}
            />
          </div>

          {/* 分佈式存儲 */}
          <div>
            {/* 如果有配置才讓他有連結可以點，沒有就不能點 */}
            <IconBtn
              disabled={!hasGlusterfsConfig}
              href={hasGlusterfsConfig ? (
                `/glusterfs-item-list/${userName}` ) : ''}
              icon={<i className="fa fa-object-group" />}
              text={t('glusterfs')}
            />
          </div>
        </div>
      </BaseSimpleCard>
    </div>
  )
}

UploadFiles.propTypes = {
  history: PropTypes.object
}