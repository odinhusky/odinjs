import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// % context
import GlobalContext from 'layouts/Main/GlobalContext'
import ScheduleContext from '../ScheduleContext';

// ? Self-packed Components || Functions
import {
  DefaultButton,
  PrimaryButton
} from 'components/BaseButton';
import PreviewModal from './Step5/PreviewModal';
import { MB } from 'constant';
import { removeEmptyProperties, arrToObj } from 'common/commonMethods'

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  isEmpty,
  has
} from 'lodash';

/**
 * @author odin
 * @level views/Schedule/{CreateSchedule | EditSchedule}/Step5
 * @component Step5
 * @description Step5 -- Show distribution and submit data
*/
export const Step5 = ({
  step1State,
  step2State,
  jobTaskRoles,
  nfsInfo,
  nfsMounts,
  glusterfsInfo,
  glusterfsMounts,
  xdfsInfo,
  xdfsMounts,
  parameters,
  diskNum,
  onSubmit,
  isStep5SubmitClicked,
  setIsStep5SubmitClicked,
  selectedVgObj
}) => {

  // $ init data
  const { t } = useTranslation();
  const {
    isXdfsEnabled,
    getResource
    // getResourceUnitCount,
  } = useContext(GlobalContext);

  // = styles
  const { classes, selfCanUseVgList } = useContext(ScheduleContext);

  // # states
  const [jobTaskRolesArr, setJobTaskRolesArr] = useState([])

  // - methods
  /**
   * @author odin
   * @description 組成最後要送出的資料結構
   * @return {object}
  */
  const buildFinalData = () => {
    const { name: vgName } = selectedVgObj
    const { jobName, retryCount } = step1State
    const { jobConfig } = step2State.templateInfo

    const data = {
      ...step1State,
      cells: jobTaskRolesArr.reduce((acc, obj) => {
        const { hivedScheduler } = obj;

        const {
          vg: vg_1, // 1st
          sku: sku_3, // 3rd
          skuType: skyType_2, // 2nd
          skuNum
        } = hivedScheduler;

        const cellName = `${vg_1}.${skyType_2}.${sku_3}`

        return {
          ...acc,
          [cellName]: {
            number: has(acc, cellName)
              ? acc[cellName].number + skuNum
              : skuNum
          }
        }
      }, {}),
      jobConfig: removeEmptyProperties({
        ...jobConfig,
        name: jobName,
        type: 'job',
        jobRetryCount: retryCount,
        protocolVersion: 2,
        taskRoles: jobTaskRolesArr.reduce((acc, obj, idx) => {

          const { commands, name: taskRoleName, hivedScheduler, ports } = obj;
          const commandsToArray = commands.trim().split('\n').map(line=>(line.trim()));

          const vgName = selectedVgObj.name;

          const {
            vg,
            skuType,
            sku,
            skuNum
          } = hivedScheduler

          const cellName = `${vg}.${skuType}.${sku}`

          const { limit } = getResource(vgName, cellName, skuNum, selfCanUseVgList)
          const { cpu, gpu, memory } = limit

          // 處理掉 ports 的格式問題
          const newPorts = ports.reduce((acc, item) => {

            if(item.key === '' || item.value === '') return;

            return {
              ...acc,
              [item.key]: [item.value]
            }
          }, {})

          // 刪掉不需要的屬性
          const copyObj = { ...obj }
          delete copyObj.hivedScheduler
          delete copyObj.name
          delete copyObj.ports
          delete copyObj.dockerInfo
          // delete copyObj.containerSize

          return {
            ...acc,
            [taskRoleName]: {
              ...copyObj,
              commands: commandsToArray,
              resourcePerInstance: {
                cpu,
                gpu,
                memoryMB: memory,
                ports: newPorts
              },
              taskRetryCount: 0,
              instances: 1,
              dockerImage: `docker_image_${idx}`
            }
          }
        }, {}),
        prerequisites: jobTaskRolesArr.map(({ dockerInfo }, idx) => {
          return {
            type: 'dockerimage',
            uri: dockerInfo,
            name: `docker_image_${idx}`
          }
        }),
        parameters: parameters.length !== 0 && parameters[0].key !== '' && parameters[0].value !== '' ? arrToObj(parameters) : {},
        defaults: {
          // vg 都一樣拿第一個就可以
          virtualCluster: jobTaskRolesArr[0].hivedScheduler.vg
        },
        extras: {
          virtualGroup: vgName,
          nfsList: !isXdfsEnabled && !isEmpty(nfsMounts) ? nfsMounts : null,
          glusterfsList: !isXdfsEnabled && !isEmpty(glusterfsMounts) ? glusterfsMounts : null,
          xdfsList: isXdfsEnabled && !isEmpty(xdfsMounts) ? xdfsMounts : null,
          hivedScheduler: {
            taskRoles: jobTaskRolesArr.reduce((acc, obj) => {
              const { hivedScheduler, name: taskRoleName } = obj;
              const {
                sku: sku_3, // 3rd
                skuType: skuType_2 // 2nd
              } = hivedScheduler;

              const keyName = skuType_2 === 'pinned' ? 'pinnedCellId' : 'skuType'

              return {
                ...acc,
                [taskRoleName]: { [keyName]: sku_3 }
              }
            }, {})
          }
        }
      })
    }

    return data
  }

  // * hooks

  /**
   * @author odin
   * @description 轉換 jobTaskRoles 為陣列
  */
  useEffect(() => {
    setJobTaskRolesArr(Object.entries(jobTaskRoles).map(([, obj]) => obj))
  }, [jobTaskRoles])

  /**
   * @author odin
   * @description
   *  1. 提交作業設定
   *  2. reset State => isStep5SubmitClicked
   *  3. 導頁回 Calendar
  */
  useEffect(() => {
    if(isStep5SubmitClicked) {
      // 建立最終 data
      const finalData = buildFinalData()

      // reset
      setIsStep5SubmitClicked(false)

      // 提交所有的 data
      onSubmit(finalData)
    }
  }, [isStep5SubmitClicked])

  return (
    <div className={`${classes.step5Container} ${classes.flex_justify_center}`}>
      {/* 分配圖 */}
      <PreviewModal
        data={{
          disk: diskNum || 0,
          cpu: jobTaskRolesArr.reduce((acc, curr) => acc += curr.containerSize.cpu, 0),
          gpu: {
            num: jobTaskRolesArr.reduce((acc, curr) => acc += curr.containerSize.gpu, 0)
          },
          rdma: parameters.find(param => param.key === 'paiAzRDMA') && parameters.find(param => param.key === 'paiAzRDMA').value === 'true' ? true : false,
          ram: jobTaskRolesArr.reduce((acc, curr) => acc += curr.containerSize.memoryMB, 0),
          shm: jobTaskRolesArr.reduce((acc, curr) => {
            const sku = curr?.hivedScheduler?.sku
            // 如果是 pinned 的話就要除以 2
            const value = sku === 'pinnedCellId' ? curr.containerSize.memoryMB / 2 : curr.containerSize.memoryMB
            return acc += value
          }, 0),
          nfs: nfsMounts.reduce((acc, curr) => {
            if (!nfsInfo.find(nfs => nfs.name === curr.name)) return acc

            // available is KB
            const { available } = nfsInfo.find(nfs => nfs.name === curr.name)

            // convert to GB
            return acc += available / MB
          }, 0),
          glusterfs: glusterfsMounts.reduce((acc, curr) => {
            if (!glusterfsInfo.find(fs => fs.name === curr.name)) return acc

            // available is KB
            const { available } = glusterfsInfo.find(fs => fs.name === curr.name)

            // convert to GB
            return acc += available / MB
          }, 0),
          xdfs: xdfsMounts.reduce((acc, curr) => {
            if (!xdfsInfo.find(fs => fs.name === curr.name)) return acc

            // available is KB
            const { available } = xdfsInfo.find(fs => fs.name === curr.name)

            // convert to GB
            return acc += available / MB
          }, 0)
        }}
        isXdfsEnabled={isXdfsEnabled}
      />

      {/* 暫時隱藏，把這個共用區塊丟到外面 */}
      <div className={`${classes.dummyCtrlBar}`}>
        <DefaultButton
          text={t('cancel')}
        />
        <div>
          <DefaultButton
            text={t('Back')}
          />
          <PrimaryButton
            className={`${classes.ml_10}`}
            text={t('submit')}
          />
        </div>
      </div>
    </div>
  )
}

Step5.propTypes = {
  step1State: PropTypes.object,
  step2State: PropTypes.object,
  jobTaskRoles: PropTypes.object,
  nfsInfo: PropTypes.array,
  nfsMounts: PropTypes.array,
  glusterfsInfo: PropTypes.array,
  glusterfsMounts: PropTypes.array,
  xdfsInfo: PropTypes.array,
  xdfsMounts: PropTypes.array,
  parameters: PropTypes.array,
  diskNum: PropTypes.number,
  onSubmit: PropTypes.func,
  isStep5SubmitClicked: PropTypes.bool,
  setIsStep5SubmitClicked: PropTypes.func,
  selectedVgObj: PropTypes.object
}
