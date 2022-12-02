import React, {
  useState,
  // useEffect,
  useContext,
  memo
} from 'react';

// ? context
import UserManageContext from '../UserManageContext';

// ^ Material-ui Components(Functions)
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

// ? Self-packed Components || Functions
import BaseModalNew from 'components/BaseModalNew';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';

// ^ Plugin
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isEmpty, isEqual } from 'lodash';

/**
 * @author odin
 * @level views/UserManage/ColumnAdjustmentModal
 * @component ColumnAdjustmentModal
 * @description ColumnAdjustmentModal component
*/
const ColumnAdjustmentModal = memo(({
  isOpen,
  onClose
}) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const {
    classes,
    columnList,
    setColumnList
  } = useContext(UserManageContext);

  // # states
  const [innerColumnList, setInnerColumnList] = useState({ ...columnList });

  // - methods
  /**
   * @author odin
   * @description 更新外部資料，並且關閉燈箱
  */
  const handleCheckData = () => {
    setColumnList({ ...innerColumnList });
    onClose();
  };

  return (
    <BaseModalNew
      classNameObj={{
        modalContainer: `${classes.userManageModalContainer} ${classes.h_auto}`
      }}
      isOpen={isOpen}
      modalFoot={
        <>
          <DefaultButton
            children={t('close')}
            onClick={() => {
              onClose();
            }}
          />

          <PrimaryButton
            children={t('confirm')}
            classNameProps={`${classes.ml_10}`}
            onClick={handleCheckData}
          />
        </>
      }
      onClose={onClose}
      title={`${t('columnAdjust')}`}
    >
      {
        !isEmpty(innerColumnList) ? (
          Object.entries(innerColumnList)
            .reduce((acc, [str, value]) => {
              return [
                ...acc,
                {
                  label: str,
                  isCheck: value
                }
              ]
            }, [])
            .map((item, i) => (
              <div key={item.label}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={item.isCheck}
                      color="primary"
                      disabled={i === 0} // 使用者的欄位不能夠調整
                      name={item.label}
                      onChange={(e) => {
                        setInnerColumnList((prev) => ({
                          ...prev,
                          [item.label]: e.target.checked
                        }))
                      }}
                    />
                  }
                  label={t(`${item.label}`)}
                />
              </div>
            ))
        ) : null
      }
    </BaseModalNew>
  )
}, (prevProps, nextProps) => (isEqual(prevProps, nextProps)));

ColumnAdjustmentModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
}

export default ColumnAdjustmentModal;

