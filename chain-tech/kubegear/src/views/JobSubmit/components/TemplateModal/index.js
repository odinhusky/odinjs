import React, {
  useEffect,
  useState,
  useContext
} from 'react';

// ? context
import Context from '../context';

// ? Self-packed Components || Functions
import BaseModalNew from 'components/BaseModalNew';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import MuiDropdown from 'components/BaseMuiDropdown';
import Table from './Table';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isEmpty, uniqBy } from 'lodash';
// import { toast } from 'react-toastify';

/**
 * @author odin
 * @level views/JobSubmit/Footer/TemplateModal
 * @param {boolean} isOpen -- 是否開啟的 boolean
 * @param {function} onClose -- 關閉的 function
 * @component TemplateModal
 * @description TemplateModal component
*/
const TemplateModal = ({ isOpen, onClose }) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const {
    classes,
    setSelectedTemplate,
    templateList,
    userInfo
  } = useContext(Context);

  // # states
  const [filteredList, setFilteredList] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [ownerList, setOwnerList] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectionDetail, setSelectionDetail] = useState([]);

  // - methods
  /**
   * @author odin
   * @param {object} event -- 事件原生的 event object
   * @param {object} item -- 該選項相關的物件資訊
   * @description 根據使用者過濾顯示的模板選項
  */
  const handleDropdownChange = (event, item) => {
    if (item.type === 'user') {
      const user = new Set(selectedKeys);
      if (selectedKeys.has(item.id))
        user.delete(item.id)
      else
        user.add(item.id)

      setSelectedKeys(user);
    }
  };

  // * hooks
  /**
   * @author odin
   * @description 設定 ownerList 依照模板擁有者的名稱過濾模板用的資料
  */
  useEffect(() => {
    if (isEmpty(userInfo)) return;

    const username = userInfo.username;
    const owners = [
      ...uniqBy(templateList.map(item => ({
        key: item.owner,
        type: 'user',
        text: item.owner === username ? `@${t('self')}` : item.owner,
        id: item.owner
      })), 'key'),
      { key: 'divider_1', text: '-', itemType: 0 },
      { key: 'clear', text: t('clearOption'), type: 'clear', itemType: 1,
        onClick: () => {
          setSelectedUsers([]);
          setSelectedKeys(new Set());
        }
      }
    ];

    setOwnerList(owners, templateList);
  }, [userInfo, templateList])

  /**
   * @author odin
   * @description 根據分類或是文字，設定過濾過後的模板列表
  */
  useEffect(() => {
    let res = [...templateList];

    // 關鍵字過濾
    res = res.filter(item => item.name.includes(keyword))

    // selectedKeys 過濾
    if (!isEmpty(Array.from(selectedKeys))) {
      res = res.filter(item => Array.from(selectedKeys).includes(item.owner))
    }

    // 設定過濾完的結果
    setFilteredList(res)
  }, [keyword, templateList, selectedKeys])

  return (
    <BaseModalNew
      isOpen={isOpen}
      modalFoot={
        <>
          <DefaultButton
            children={t('close')}
            classes={{ root: classes.mr_10 }}
            onClick={onClose}
          />
          <PrimaryButton
            children={t('confirm')}
            disabled={true && selectionDetail.length === 0}
            onClick={() => {
              setSelectedTemplate(selectionDetail[0]);
              onClose();
            }}
          />
        </>
      }
      onClose={onClose}
      size="md"
      title={t('chooseTemplate')}
    >
      <div className={`${classes.templateModalContainer}`}>
        <div className={`${classes.flex_justify_end}`}>
          <MuiAutocomplete
            classes={{ root: `${classes.mr_10} ${classes.h_auto}` }}
            onInputChange={(e, value) => setKeyword(value)}
            placeholder={t('search')}
            value={keyword}
          />
          <MuiDropdown
            list={ownerList}
            maxWidth={200}
            multiple
            onChange={(e, child) => {
              if (child.props.type === 'clear') {
                child.props.onClick()
                return
              }
              handleDropdownChange(e, child.props)
              const result = e.target.value
              setSelectedUsers(result)
            }}
            text={t('filter')}
            value={selectedUsers}
          />
        </div>
        <div className={`${classes.templateModalContent}`}>
          <Table
            data={filteredList}
            setSelectionDetail={setSelectionDetail}
          />
        </div>
      </div>
    </BaseModalNew>
  );
};

TemplateModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default TemplateModal;