import React, {
  useState,
  useEffect,
  useContext
} from 'react'

import { Link } from 'react-router-dom';

// # API
import { getCustomizedSystemParam } from 'utils/api';

// ^ Material-ui Componets(Functions)
import BaseTabs from 'components/BaseTabAndPanel/BaseTabs'
import BaseTabPanelContainer from 'components/BaseTabAndPanel/BaseTabPanelContainer'
import BaseTabPanel from 'components/BaseTabAndPanel/BaseTabPanel'

// ? Self-packed Components || Functions
import BaseSimpleCard from 'components/BaseCard/BaseSimpleCard'
import path from 'assets/imagePath'

import {
// computeDayRange
} from 'common/commonMethods';

// ? context
import EntryContext from '../../EntryContext';

// ^ plugins
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/Entry/GeneralPanels/QuickStart
 * @component QuickStart
 * @description Quick start component
*/
export default function QuickStart() {

  // $ init data
  const { t } = useTranslation();

  const defaultSystemSetting = {
    dl: [
      {
        imgUrl: '/assets/img/job/caffe.png',
        repoUrl: path.caffe
      },
      {
        imgUrl: '/assets/img/job/keras.jpg',
        repoUrl: path.keras
      },
      {
        imgUrl: '/assets/img/job/mxnet.png',
        repoUrl: path.mxnet
      },
      {
        imgUrl: '/assets/img/job/pytorch.png',
        repoUrl: path.pytorch
      },
      {
        imgUrl: '/assets/img/job/tensorflow.png',
        repoUrl: path.tensorflow
      },
      {
        imgUrl: '/assets/img/job/docker.svg',
        repoUrl: path.customDl
      }
    ],
    ml: [
      {
        imgUrl: '/assets/img/job/RAPIDS.png',
        repoUrl: path.rapids
      },
      {
        imgUrl: '/assets/img/job/tensorRt.png',
        repoUrl: path.tensortrt
      },
      {
        imgUrl: '/assets/img/job/docker.svg',
        repoUrl: path.customMl
      }
    ]
  }

  // % context
  const {
    classes,
    isShowGuide,
    currentStep,
    isSmallTablet
  } = useContext(EntryContext);

  // # states
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [systemSetting, setSystemSetting] = useState(defaultSystemSetting);

  // & handled data
  const tabsArray = [
    // 深度學習
    {
      keyData: 'DL',
      label: `${t('deep')}${t('enSpace')}${t('learning')}`
    },
    // 機器學習
    {
      keyData: 'ML',
      label: `${t('machine')}${t('enSpace')}${t('learning')}`
    }
  ]

  const defaultSetting = {
    caffeImage: path.caffe,
    kerasImage: path.keras,
    mxnetImage: path.mxnet,
    pytorchImage: path.pytorch,
    tensorflowImage: path.tensorflow,
    customDLImage: path.customDl,
    rapidsItem: path.rapids,
    tensorrtItem: path.tensortrt,
    customMLImageItem: path.customMl
  }

  // - methods
  /**
   * @author odin
   * @description Handle tabs change event
  */
  const handleTabsChange = (event, newValue) => {
    setCurrentTabIndex(newValue);
  };

  /**
   * @author odin
   * @description 在特定陣列中以key比對，找到特定key的物件
  */
  const findKeyItem = (arr, key) => (arr.find(el => el.key === key))

  /**
   * @author odin
   * @description Get component data
  */
  const initData = async () => {
    try {
      // 取得本週的 jobSchedule
      const data = await getCustomizedSystemParam();

      if(data && !isEmpty(data)){

        // 取得對應 key 的 item
        const caffeImageItem = findKeyItem(data, 'caffeImage')
        const kerasImageItem = findKeyItem(data, 'kerasImage')
        const mxnetImageItem = findKeyItem(data, 'mxnetImage')
        const pytorchImageItem = findKeyItem(data, 'pytorchImage')
        const tensorflowImageItem = findKeyItem(data, 'tensorflowImage')
        const customDLImageItem = findKeyItem(data, 'customDLImage')
        const rapidsItem = findKeyItem(data, 'rapids')
        const tensorrtItem = findKeyItem(data, 'tensorrt')
        const customMLImageItem = findKeyItem(data, 'customMLImage')


        setSystemSetting({
          dl: [
            {
              imgUrl: '/assets/img/job/caffe.png',
              repoUrl: !isEmpty(caffeImageItem) ? caffeImageItem.value : defaultSetting.caffeImage
            },
            {
              imgUrl: '/assets/img/job/keras.jpg',
              repoUrl: !isEmpty(kerasImageItem) ? kerasImageItem.value : defaultSetting.kerasImage
            },
            {
              imgUrl: '/assets/img/job/mxnet.png',
              repoUrl: !isEmpty(mxnetImageItem) ? mxnetImageItem.value : defaultSetting.mxnetImage
            },
            {
              imgUrl: '/assets/img/job/pytorch.png',
              repoUrl: !isEmpty(pytorchImageItem) ? pytorchImageItem.value : defaultSetting.pytorchImage
            },
            {
              imgUrl: '/assets/img/job/tensorflow.png',
              repoUrl: !isEmpty(tensorflowImageItem) ? tensorflowImageItem.value : defaultSetting.tensorflowImage
            },
            {
              imgUrl: '/assets/img/job/docker.svg',
              repoUrl: !isEmpty(customDLImageItem) ? customDLImageItem.value : defaultSetting.customDLImage
            }
          ],
          ml: [
            {
              imgUrl: '/assets/img/job/RAPIDS.png',
              repoUrl: !isEmpty(rapidsItem) ? rapidsItem.value : defaultSetting.rapidsItem
            },
            {
              imgUrl: '/assets/img/job/tensorRt.png',
              repoUrl: !isEmpty(tensorrtItem) ? tensorrtItem.value : defaultSetting.tensorrtItem
            },
            {
              imgUrl: '/assets/img/job/docker.svg',
              repoUrl: !isEmpty(customMLImageItem) ? customMLImageItem.value : defaultSetting.customMLImageItem
            }
          ]
        })
      }

    } catch (err) {
    // } catch ({ message: msg }) {
      const msg = err.data.message
      toast.error(msg);
    }
  }

  // * hooks
  /**
   * @author odin
   * @description Component data initialization
  */
  useEffect(() => {
    initData()
  }, [])

  return (
    <div
      className={`
        ${classes.quickStartContainer}
        ${(isShowGuide === true && currentStep === 4 && isSmallTablet === false) && classes.guideShow}
      `}
    >
      <BaseSimpleCard
        cardTitle={`${t('qucikStart')}`}
        contentClass={`${classes.p_0} ${classes.quickStartCardContent}`}
      >
        <div className={`${classes.quickStartContent}`}>
          <BaseTabs
            currentTabIndex={currentTabIndex}
            handleTabsChange={handleTabsChange}
            tabsArray={tabsArray}
          />

          {/* 深度學習 */}
          <BaseTabPanelContainer>
            <BaseTabPanel
              index={0}
              value={currentTabIndex}
            >
              <div className={classes.startItemContainer}>
                {
                  !isEmpty(systemSetting) && systemSetting.dl.map(item =>
                    <div
                      className={classes.startItem}
                      key={item.imgUrl}
                    >
                      <Link
                        style={{ backgroundImage: `url(${item.imgUrl})` }}
                        to={`/job-submit?docker_repo=${item.repoUrl}`}
                      />
                    </div>
                  )
                }
              </div>
            </BaseTabPanel>

            {/* 機器學習 */}
            <BaseTabPanel
              index={1}
              value={currentTabIndex}
            >
              <div className={classes.startItemContainer}>
                {
                  !isEmpty(systemSetting) && systemSetting.ml.map(item =>
                    <div
                      className={classes.startItem}
                      key={item.imgUrl}
                    >
                      <Link
                        style={{ backgroundImage: `url(${item.imgUrl})` }}
                        to={`/job-submit?docker_repo=${item.repoUrl}`}
                      />
                    </div>
                  )
                }
              </div>
            </BaseTabPanel>
          </BaseTabPanelContainer>
        </div>
      </BaseSimpleCard>
    </div>
  )
}

QuickStart.propTypes = {
  history: PropTypes.object
}