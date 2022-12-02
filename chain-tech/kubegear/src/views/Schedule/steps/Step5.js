import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// % context
// import GlobalContext from 'layouts/Main/GlobalContext'
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
  cloneDeep
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
  parameters,
  diskNum,
  onSubmit,
  isStep5SubmitClicked,
  setIsStep5SubmitClicked,
  selectedVgObj
}) => {

  // $ init data
  const { t } = useTranslation();
  // const {
  //   getResource
  // } = useContext(GlobalContext);

  // = styles
  const { classes } = useContext(ScheduleContext);

  // # states
  const [jobTaskRolesArr, setJobTaskRolesArr] = useState([])

  // - methods
  /**
   * @author odin
   * @description 組成最後要送出的資料結構
   * @return {object}
  */
  const buildFinalData = () => {
    const copyStep1State = cloneDeep(step1State);
    const { name: vgName } = selectedVgObj
    const { jobName, retryCount } = copyStep1State
    const { jobConfig } = step2State.templateInfo

    // 移除不用的屬性
    delete copyStep1State.k8sResource;

    const data = {
      ...copyStep1State,
      cells: jobTaskRolesArr.reduce((acc, obj) => {
        const {
          cpu,
          gpu,
          memoryMB,
          gpuMemoryPercentage
        } = obj.k8sResource;

        acc.cpu.number += cpu;
        acc.gpu.number += gpu;
        acc.memory.number += memoryMB;

        // gpuMemoryPercentage: taskRole(gpu*percentage => 1 * 15% = 15) +(2*80 = 160): total: 175
        acc.gpuMemoryPercentage.number += gpuMemoryPercentage * gpu;

        return acc
      }, {
        cpu: {
          number: 0
        },
        gpu: {
          number: 0
        },
        memory: {
          number: 0
        },
        gpuMemoryPercentage: {
          number: 0
        }
      }),
      jobConfig: removeEmptyProperties({
        ...jobConfig,
        name: jobName,
        type: 'job',
        jobRetryCount: retryCount,
        protocolVersion: 2,
        taskRoles: jobTaskRolesArr.reduce((acc, obj, idx) => {

          const { commands, name: taskRoleName, ports, k8sResource } = obj;
          // const newK8sResource = {
          //   cpu: k8sResource.cpu,
          //   gpu: k8sResource.gpu,
          //   memory: k8sResource.memoryMB
          // };
          const commandsToArray = commands.trim().split('\n').map(line=>(line.trim()));

          // 處理掉 ports 的格式問題
          const newPorts = ports.reduce((acc, item) => {
            if(item.key === '' || item.value === '') return;

            return {
              ...acc,
              [item.key]: item.value
            }
          }, {});

          // 刪掉不需要的屬性
          const copyObj = cloneDeep(obj);
          delete copyObj.name;
          delete copyObj.ports;
          delete copyObj.dockerInfo;
          delete copyObj.k8sResource;

          return {
            ...acc,
            [taskRoleName]: {
              ...copyObj,
              commands: commandsToArray,
              resourcePerInstance: {
                ...k8sResource,
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
          // 目前只有 default
          virtualCluster: 'default'
        },
        extras: {
          virtualGroup: vgName,
          nfsList: !isEmpty(nfsMounts) && nfsMounts[0].name !== '' && nfsMounts[0].mountPoint !== '' ? nfsMounts : [],
          glusterfsList: !isEmpty(glusterfsMounts) && glusterfsMounts[0].name !== '' && glusterfsMounts[0].mountPoint !== '' ? glusterfsMounts : []
        }
      })
    };


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
      const finalData = buildFinalData();

      // reset
      setIsStep5SubmitClicked(false);

      // 提交所有的 data
      onSubmit(finalData);
    }
  }, [isStep5SubmitClicked])

  return (
    <div className={`${classes.step5Container} ${classes.flex_justify_center}`}>
      {/* 分配圖 */}
      <PreviewModal
        data={{
          disk: diskNum || 0,
          cpu: jobTaskRolesArr.reduce((acc, curr) => acc += curr.k8sResource.cpu, 0),
          gpu: {
            num: jobTaskRolesArr.reduce((acc, curr) => acc += curr.k8sResource.gpu, 0)
          },
          rdma: parameters.find(param => param.key === 'paiAzRDMA') && parameters.find(param => param.key === 'paiAzRDMA').value === 'true' ? true : false,
          ram: jobTaskRolesArr.reduce((acc, curr) => acc += curr.k8sResource.memoryMB, 0),
          shm: jobTaskRolesArr.reduce((acc, curr) => {
            const value = curr.k8sResource.memoryMB;
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
            if (!glusterfsInfo.find(fs => fs.name === curr.name)) return acc;

            // available is KB
            const { available } = glusterfsInfo.find(fs => fs.name === curr.name);

            // convert to GB
            return acc += available / MB
          }, 0)
        }}
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
  parameters: PropTypes.array,
  diskNum: PropTypes.number,
  onSubmit: PropTypes.func,
  isStep5SubmitClicked: PropTypes.bool,
  setIsStep5SubmitClicked: PropTypes.func,
  selectedVgObj: PropTypes.object
}
