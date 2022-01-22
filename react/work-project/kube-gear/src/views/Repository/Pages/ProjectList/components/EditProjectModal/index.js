import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// # API
import {
  updateProjectQuota
} from 'utils/api';

// ? context
import Context from '../../../../Context';

// ^ Material-ui Componets(Functions)
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

// ? Self-packed Components || Functions
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import BaseModalNew from 'components/BaseModalNew';
import { DebouncedTextField } from 'components/Debounce/DebouncedTextField'
import { BaseTooltip } from 'components/BaseTooltip';
import { formatBytes } from 'utils';
import { formatIntegerBytes } from 'common/commonMethods';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isNil } from 'lodash';
import { toast } from 'react-toastify';

/**
 * @author odin
 * @level views/Repository/ProjectList/EditProjectModal
 * @component EditProjectModal
 * @param {boolean} isProjectModalOpen -- 是否要開啟該 Modal
 * @param {object} quotaId -- 該筆 quota 的 id
 * @param {boolean} limitedCount -- 原本的 count 數
 * @param {boolean} limitedStorage -- 原本的 storage byte 數
 * @param {boolean} usedCount -- 已經使用的 count 數
 * @param {boolean} usedStorage -- 已經使用的 storage byte 數
 * @param {function} onClose -- 關閉這個燈箱的 function
 * @param {function} handleCountErr -- 處理 count 欄位的錯誤 function
 * @param {function} handleStorageErr -- 處理 storage 欄位的錯誤 function
 * @param {function} getProjectQuotas -- 重新取得父層顯示資料的function
 * @description 修改預設數量以及大小值的 Modal
*/
const EditProjectModal = ({
  isProjectModalOpen,
  quotaId,
  projectName,
  limitedCount,
  limitedStorage,
  usedCount,
  usedStorage,
  onClose,
  handleCountErr,
  handleStorageErr,
  getProjectQuotas
}) => {

  // $ init data
  const { t } = useTranslation();
  const numberRegex = /^-?\d+$/;
  const unitOptions = [
    {
      log: 2,
      unitName: 'MB'
    },
    {
      log: 3,
      unitName: 'GB'
    },
    {
      log: 4,
      unitName: 'TB'
    }
  ]

  const defaultUnit = {
    log: 2,
    unitName: 'MB'
  }

  // ? context
  const { classes } = useContext(Context)

  // # states
  const [projectCount, setProjectCount] = useState(-1);
  const [projectStorage, setProjectStorage] = useState(-1);

  const [currentUnit, setCurrentUnit] = useState(defaultUnit);

  const [countErr, setCountErr] = useState('');
  const [storageErr, setStorageErr] = useState('');

  // - methods
  /**
   * @author odin
   * @description reset 的 function
   */
  const resetStates = () => {
    setProjectCount(-1);
    setProjectStorage(-1);
    setCurrentUnit(defaultUnit);
    setCountErr('');
    setStorageErr('');
  }

  /**
   * @author odin
   * @description 更新目前這個 project 的 quota 並且觸發父層 component 重新抓取資料
   */
  const updateSingleProjectQuota = async () => {
    try {
      const totalStorage = projectStorage === -1 ? projectStorage : projectStorage * Math.pow(1024, currentUnit.log)
      const hard = {
        count: projectCount,
        storage: totalStorage
      }
      const res = await updateProjectQuota(quotaId, hard);

      if(res.message && res.message.indexOf('successfully') !== -1) {
        toast.success(`${t('updateSuccess')}`);

        // 重新取得 quota 資料
        getProjectQuotas();
        onClose();
      }

    } catch (err) {
      toast.error(err.data ? err.data.message : err.message)
    }
  }

  // * hooks
  /**
   * @author odin
   * @description 關閉時清除所有資料
   */
  useEffect(() => {
    if(isProjectModalOpen === false) {
      resetStates()
    }
  }, [isProjectModalOpen])

  /**
   * @author odin
   * @description 同步將 prop 更新到 內部的 state
   */
  useEffect(() => {
    setProjectCount(limitedCount)
  }, [limitedCount])

  /**
   * @author odin
   * @description 同步將 prop 更新到 內部的 state，並作資料轉換
   */
  useEffect(() => {
    if(limitedStorage === -1) {
      setProjectStorage(limitedStorage)
    } else {
      const { value, unit } = formatIntegerBytes(limitedStorage)
      const properUnitObj = unitOptions.find(({ unitName }) => unitName === unit)

      setProjectStorage(value)
      setCurrentUnit(properUnitObj)
    }
  }, [limitedStorage])

  return (
    <BaseModalNew
      classesNameObj={{
        modalContainer: classes.projectModal
      }}
      isOpen={isProjectModalOpen}
      modalFoot={
        <>
          <DefaultButton
            children={t('cancel')}
            classNameProps={`${classes.mr_20}`}
            onClick={onClose}
          />
          <PrimaryButton
            children={t('confirm')}
            disabled={countErr || storageErr}
            onClick={() => {
              updateSingleProjectQuota()
            }}
          />
        </>
      }
      onClose={onClose}
      title={`${t('editProjectQuota', { name: projectName })}`}
    >
      <div className={`${classes.projectContent}`}>
        {/* 鏡像數量 */}
        <div className={`${classes.w_full} ${classes.flex_align_center} ${classes.mb_20}`}>

          <div className={`${classes.projectInput} ${classes.unlimitWidthInput}}`}>
            <DebouncedTextField
              error={countErr}
              helperText={countErr}
              label={t('mirrorNumber')}
              onChange={(count) => {
                const newCount = numberRegex.test(count) ? Number(count) : count;

                handleCountErr(newCount, setCountErr)
                setProjectCount(newCount)
              }}
              value={projectCount}
              variant="outlined"
            />
          </div>

          <div className={`${classes.projectDetail}`}>
            <div className={`${classes.mr_20}`}>
              <BaseTooltip
                className={`${classes.cursorPointer}`}
                title={t('mirrorTooltip')}
              >
                <InfoOutlinedIcon classes={{ root: classes.toolTipIcon }} />
              </BaseTooltip>
            </div>

            <div>
              {usedCount} / {limitedCount === -1 ? t('Unlimited') : limitedCount}
            </div>
          </div>
        </div>

        {/* 項目大小 */}
        <div className={`${classes.w_full} ${classes.flex_align_center}`}>

          <div className={`${classes.projectInput} ${classes.d_flex}`}>
            <div className={`${classes.flexGrow1} ${classes.mr_20} ${classes.unlimitWidthInput}`}>
              <DebouncedTextField
                error={storageErr}
                helperText={storageErr}
                label={t('itemSize')}
                onChange={(storageNum) => {
                  const newStorageNum = numberRegex.test(storageNum) ? Number(storageNum) : storageNum;

                  handleStorageErr(newStorageNum, currentUnit.unitName, setStorageErr)
                  setProjectStorage(newStorageNum)
                }}
                value={projectStorage}
                variant="outlined"
              />
            </div>

            <div className={`${classes.selectUnit}`}>
              <FormControl
                className={`${classes.unlimitWidthSelect}`}
                fullWidth
              >
                <Select
                  id="project-storage-unit"
                  inputProps={{
                    name: 'project-storage-unit-select',
                    id: 'project-storage-unit-select'
                  }}
                  onChange={(e) => {
                    const selectedUnitLog = e.target.value
                    const unitObj = unitOptions.find(({ log }) => selectedUnitLog === log)

                    if(!isNil(unitObj)) {
                      handleStorageErr(projectStorage, unitObj.unitName, setStorageErr)
                      setCurrentUnit(unitObj)
                    }
                  }}
                  value={currentUnit.log}
                  variant="outlined"
                >
                  {unitOptions.map(({ log, unitName }) => {
                    return (
                      <MenuItem
                        key={log}
                        value={log}
                      >
                        {unitName}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </div>
          </div>

          <div className={`${classes.projectDetail}`}>
            <div className={`${classes.mr_20}`}>
              <BaseTooltip
                className={`${classes.cursorPointer}`}
                title={t('mirrorTooltip')}
              >
                <InfoOutlinedIcon classes={{ root: classes.toolTipIcon }} />
              </BaseTooltip>
            </div>

            <div>
              {formatBytes(usedStorage)} / {limitedStorage === -1 ? t('Unlimited') : formatBytes(limitedStorage)}
            </div>
          </div>
        </div>
      </div>
    </BaseModalNew>
  );
};

EditProjectModal.propTypes = {
  isProjectModalOpen: PropTypes.bool,
  quotaId: PropTypes.number,
  projectName: PropTypes.string,
  limitedCount: PropTypes.number,
  limitedStorage: PropTypes.number,
  usedCount: PropTypes.number,
  usedStorage: PropTypes.number,
  onClose: PropTypes.func,
  handleCountErr: PropTypes.func,
  handleStorageErr: PropTypes.func,
  getProjectQuotas: PropTypes.func
};

export default EditProjectModal;
