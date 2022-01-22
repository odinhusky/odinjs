import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// # API
import {
  getSSHPrivateKey,
  getJumpServerKey
} from 'utils/api'

// ? context
import GlobalContext from 'layouts/Main/GlobalContext';
import JobDetailContext from '../../../JobDetailContext';

// ? Self-packed Components || Functions
import {
  PrimaryButton,
  DefaultButton
} from 'components/BaseButton';
// import BaseModal from 'components/BaseModal';
import BaseModalNew from 'components/BaseModalNew';
import {
  hasOwn,
  arrToObj,
  downloadStringWithFileSaver
} from 'common/commonMethods'

// ^ plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';

/**
 * @author odin
 * @level views/JobDetail/Page/DetailPage/TaskRole/TaskList/SshModal
 * @component SshModal
 * @description After clicking ssh split button modal content
*/
const SshModal = ({
  isOpen,
  onClose,
  containerItem,
  jobInfo
}) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const { systemSetting } = useContext(GlobalContext);

  // = styles
  const { classes } = useContext(JobDetailContext);

  // # states
  const [isSetJumpServerData, setIsSetJumpServerData] = useState(false);
  const [jumpServerHost, setJumpServerHost] = useState('');
  const [jumpServerPort, setJumpServerPort] = useState('');

  const [isDisabledPrivateKeyBtn, setIsDisabledPrivateKeyBtn] = useState(false);
  const [isDisabledJumpServerKeyBtn, setIsDisabledJumpServerKeyBtn] = useState(false);


  // - methods
  /**
   * @author odin
   * @description 取得 private key 並解提供使用者下載該 key 的檔案
  */
  const handlePrivateKeyBtnClick = async () => {
    try {
      setIsDisabledPrivateKeyBtn(true);

      const username = jobInfo?.jobStatus?.username;
      const privateKeyReq = await getSSHPrivateKey(username);

      if(!isEmpty(privateKeyReq)) {
        setIsDisabledPrivateKeyBtn(false);

        downloadStringWithFileSaver(privateKeyReq, 'target.pem')
      }

    } catch (err) {
      setIsDisabledPrivateKeyBtn(false);
      const msg = err.data ? err.data.message : err.toString();
      toast.error(msg)
    }
  }

  /**
   * @author odin
   * @description 取得 private key 並解提供使用者下載該 key 的檔案
  */
  const handleJumpServerKeyBtnClick = async () => {
    try {
      setIsDisabledJumpServerKeyBtn(true);

      const privateKeyReq = await getJumpServerKey();

      if(!isEmpty(privateKeyReq)) {
        setIsDisabledJumpServerKeyBtn(false);

        downloadStringWithFileSaver(privateKeyReq, 'proxy.pem')
      }

    } catch (err) {
      setIsDisabledJumpServerKeyBtn(false);
      const msg = err.data ? err.data.message : err.toString();
      toast.error(msg)
    }
  }

  // * hooks
  /**
   * @author odin
   * @description 取得系統設定，
  */
  useEffect(() => {
    const systemSettingObj = arrToObj(systemSetting)
    const isSetHostName = hasOwn(systemSettingObj, 'jumpServerHost')
    const isSetPort = hasOwn(systemSettingObj, 'jumpServerPort')

    // 設定是否有填妥堡壘機以及port的兩個欄位
    if(
      isSetHostName &&
      isSetPort &&
      systemSettingObj.jumpServerHost !== '' &&
      systemSettingObj.jumpServerPort !== ''
    ) {
      setIsSetJumpServerData(true)
    }

    // 如果有資料，就設定該資料到 state 裏
    if(isSetHostName) {
      setJumpServerHost(systemSettingObj.jumpServerHost)
    }

    if(isSetPort) {
      setJumpServerPort(systemSettingObj.jumpServerPort)
    }

  }, [systemSetting])


  return (
    <>
      <BaseModalNew
        classesNameObj={{
          modalContainer: `${classes.sshModalContainer}`,
          modalTitle: `${classes.sshModalTitle}`
        }}
        isCloseIcon
        isOpen={isOpen}
        modalFoot={
          <DefaultButton
            children={t('cancel')}
            onClick={onClose}
          />
        }
        onClose={onClose}
        title={'SSH'}
      >

        {/* Modal 內容 */}
        <div className={`${classes.sshModalContent}`}>

          {/* Step1 */}
          <div className={`${classes.stepBox} ${classes.sshStep1}`}>

            <span className={classes.stepOrder}>1</span>

            <div className={`${classes.stepContent}`}>
              <span className={`${classes.stepHead}`}>{t('ssh1')}</span>
            </div>

          </div>

          {/* Step2 */}
          <div className={`${classes.stepBox} ${classes.sshStep2}`}>

            <span className={classes.stepOrder}>2</span>

            <div className={`${classes.stepContent}`}>
              <span className={`${classes.stepHead}`}>{t('ssh2')}</span>

              <div className={`${classes.flex_align_center} ${classes.mt_8}`}>
                {/* 容器私鑰 */}
                <PrimaryButton
                  children={t('containerKey')}
                  classNameProps={`${isSetJumpServerData ? classes.mr_20 : ''}`}
                  disabled={isDisabledPrivateKeyBtn}
                  onClick={handlePrivateKeyBtnClick}
                />

                {/* 堡壘機私鑰 */}
                {
                  isSetJumpServerData && (
                    <PrimaryButton
                      children={t('jumpServerKey')}
                      disabled={isDisabledJumpServerKeyBtn}
                      onClick={handleJumpServerKeyBtnClick}
                    />
                  )
                }
              </div>
            </div>

          </div>

          {/* Step3 */}
          <div className={`${classes.stepBox} ${classes.sshStep2}`}>

            <span className={classes.stepOrder}>3</span>

            <div className={`${classes.stepContent}`}>
              <span className={`${classes.stepHead}`}>{t('ssh3')}</span>

              <div className={`${classes.w_full}`}>

                <span className={`${classes.stepLine}`}>chmod 600 target.pem</span>

                {
                  isSetJumpServerData && (
                    <span className={`${classes.stepLine}`}>chmod 600 proxy.pem</span>
                  )
                }

              </div>
            </div>

          </div>

          {/* Step4 */}
          <div className={`${classes.stepBox} ${classes.sshStep2}`}>

            <span className={classes.stepOrder}>4</span>

            <div className={`${classes.stepContent}`}>
              <span className={`${classes.stepHead}`}>{t('ssh4')}</span>

              <div className={`${classes.w_full}`}>

                {
                  isSetJumpServerData
                    ? (`ssh -o ProxyCommand="ssh -p ${jumpServerPort} -i /path/proxy.pem -W %h:%p root@${jumpServerHost}" -i /path/target.pem -p ${containerItem?.containerPorts} root@${containerItem?.containerIp}`)
                    : (`ssh -i /path/target.pem -p ${containerItem?.containerPorts} root@${containerItem?.containerIp}`)
                }

              </div>
            </div>

          </div>

        </div>
      </BaseModalNew>
    </>
  );
};

SshModal.propTypes = {
  containerItem: PropTypes.object,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  taskRoleIndex: PropTypes.number,
  taskRoleName: PropTypes.string,
  jobInfo: PropTypes.object
};

export default SshModal;
