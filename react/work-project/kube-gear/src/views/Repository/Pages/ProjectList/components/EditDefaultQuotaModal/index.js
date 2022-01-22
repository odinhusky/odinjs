import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// # API
import {
  updateDefaultQuota
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

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isNil } from 'lodash';
import { toast } from 'react-toastify';

/**
 * @author odin
 * @level views/Repository/ProjectList/EditDefaultQuotaModal
 * @component EditDefaultQuotaModal
 * @param {function} getDefaultQuotas -- 重新取得父層顯示資料的function
 * @param {object} defaultQuotas -- 外部傳入目前預設的資料
 * @param {boolean} isDefaultModalOpen -- 是否要開啟該 Modal
 * @param {function} onClose -- 關閉這個燈箱的 function
 * @param {function} handleCountErr -- 處理 count 欄位的錯誤 function
 * @param {function} handleStorageErr -- 處理 storage 欄位的錯誤 function
 * @description 修改預設數量以及大小值的 Modal
*/
const EditDefaultQuotaModal = ({
  getDefaultQuotas,
  defaultQuotas,
  isDefaultModalOpen,
  onClose,
  handleCountErr,
  handleStorageErr
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
  const [defaultCount, setDefaultCount] = useState(-1);
  const [defaultStorage, setDefaultStorage] = useState(-1);

  const [currentUnit, setCurrentUnit] = useState(defaultUnit);

  const [countErr, setCountErr] = useState('');
  const [storageErr, setStorageErr] = useState('');

  // - methods
  /**
   * @author odin
   * @description reset 的 function
   */
  const resetStates = () => {
    setDefaultCount(-1);
    setDefaultStorage(-1);
    setCurrentUnit(defaultUnit);
    setCountErr('');
    setStorageErr('');
  }

  /**
   * @author odin
   * @description 更新目前這個 project 的 quota 並且觸發父層 component 重新抓取資料
   */
  const updateDefaultQuotaConfiguration = async () => {
    try {
      const totalStorage = defaultStorage === -1 ? defaultStorage : defaultStorage * Math.pow(1024, currentUnit.log)

      const data = {
        count_per_project: defaultCount,
        storage_per_project: totalStorage
      }
      const res = await updateDefaultQuota(data);

      if(res.message && res.message.indexOf('successfully') !== -1) {
        toast.success(`${t('updateSuccess')}`);

        // 重新取得 quota 資料
        getDefaultQuotas();
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
    if(isDefaultModalOpen === false) {
      resetStates()
    }
  }, [isDefaultModalOpen])

  /**
   * @author odin
   * @description 同步將 prop 更新到 內部的 state
   */
  useEffect(() => {
    if(!isNil(defaultQuotas) && !isNil(defaultQuotas.storage)) {
      const { count, storage } = defaultQuotas
      const { unit, value } = storage
      const unitObj = unitOptions.find(({ unitName }) => unit === unitName)

      setDefaultCount(count)
      setDefaultStorage(value)
      setCurrentUnit(unitObj)
    }
  }, [defaultQuotas])

  return (
    <BaseModalNew
      isOpen={isDefaultModalOpen}
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
              updateDefaultQuotaConfiguration()
            }}
          />
        </>
      }
      onClose={onClose}
      title={`${t('defaultQuotaModalTitle')}`}
    >
      <div className={`${classes.projectContent}`}>

        <div className={`${classes.fz_14} ${classes.mb_20}`}>{t('defaultQuotaModalDescription')}</div>

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
                setDefaultCount(newCount)
              }}
              value={defaultCount}
              variant="outlined"
            />
          </div>

          <div className={`${classes.defaultDetail}`}>
            <div className={`${classes.mr_20}`}>
              <BaseTooltip
                className={`${classes.cursorPointer}`}
                title={t('mirrorTooltip')}
              >
                <InfoOutlinedIcon classes={{ root: classes.toolTipIcon }} />
              </BaseTooltip>
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
                  setDefaultStorage(newStorageNum)
                }}
                value={defaultStorage}
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
                      handleStorageErr(defaultStorage, unitObj.unitName, setStorageErr)
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

          <div className={`${classes.defaultDetail}`}>
            <div className={`${classes.mr_20}`}>
              <BaseTooltip
                className={`${classes.cursorPointer}`}
                title={t('mirrorTooltip')}
              >
                <InfoOutlinedIcon classes={{ root: classes.toolTipIcon }} />
              </BaseTooltip>
            </div>
          </div>
        </div>
      </div>
    </BaseModalNew>
  );
};

EditDefaultQuotaModal.propTypes = {
  getDefaultQuotas: PropTypes.func,
  defaultQuotas: PropTypes.object,
  isDefaultModalOpen: PropTypes.bool,
  onClose: PropTypes.func,
  handleCountErr: PropTypes.func,
  handleStorageErr: PropTypes.func
};

export default EditDefaultQuotaModal;
