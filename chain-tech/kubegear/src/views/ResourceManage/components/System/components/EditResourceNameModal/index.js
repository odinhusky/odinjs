import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// # API
import {
  putVgResourceName
} from 'utils/api';

// ? context
import ResourceManageContext from '../../../../ResourceManageContext';

// ? Self-packed Components || Functions
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import BaseModalNew from 'components/BaseModalNew';
import { DebouncedTextField } from 'components/Debounce/DebouncedTextField'

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  isEmpty
} from 'lodash';
import { toast } from 'react-toastify';

/**
 * @author odin
 * @level views/ResourceManage/System/EditResourceNameModal
 * @component EditResourceNameModal
 * @param {boolean} isProjectModalOpen -- 是否要開啟該 Modal
 * @description 修改資源顯示名稱的 Modal
*/
const EditResourceNameModal = ({
  isEditResourceModalOpen,
  onClose,
  data
}) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const { classes, getData } = useContext(ResourceManageContext)

  // # states
  const [nameObj, setNameObj] = useState({});

  // - methods
  /**
   * @author odin
   * @description 更新對應的資源名稱，並且重新取得資料
   */
  const updateResourceName = async () => {
    try {
      await putVgResourceName(nameObj);

      toast.success(`${t('updateSuccess')}`);

      // 重新取得資料
      getData();
      onClose();

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

    if(!isEmpty(data)){
      const obj = {};

      Object.entries(data.cells).map(([key, value]) => {
        const { name } = value;
        obj[key] = name
      })

      setNameObj(obj)
    }
  }, [data])

  return (
    <BaseModalNew
      classNameObj={{
        modalContainer: classes.editResourceNameModal
      }}
      isOpen={isEditResourceModalOpen}
      modalFoot={
        <>
          <DefaultButton
            children={t('close')}
            classNameProps={`${classes.mr_20}`}
            onClick={onClose}
          />
          <PrimaryButton
            children={t('confirm')}
            // disabled={}
            onClick={() => {
              updateResourceName()
            }}
          />
        </>
      }
      onClose={onClose}
      title={`${t('editResourceName')}`}
    >
      <div className={`${classes.editResourceNameContent}`}>
        {
          !isEmpty(nameObj) &&
          Object.entries(nameObj).map(([key], index, arr) => {

            return (
              <div
                className={`
                  ${classes.w_full}
                  ${(index + 1 !== arr.length) && classes.mb_20}
                  ${classes.unlimitWidthInput}
                `}
                key={key}
              >
                <DebouncedTextField
                  label={key}
                  onChange={(value) => {
                    setNameObj(prev => ({ ...prev, [key]: value }))
                  }}
                  value={nameObj[key]}
                />
              </div>
            )
          })
        }
      </div>
    </BaseModalNew>
  );
};

EditResourceNameModal.propTypes = {
  isEditResourceModalOpen: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.object
};

export default EditResourceNameModal;
