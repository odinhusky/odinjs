import React, {
  useState,
  useEffect,
  useContext,
  useMemo
} from 'react';

// ^ Redux
import { selectUserInfo } from 'layouts/Main/features/userinfo/userinfoSlice';

// # API
import {
  getJobTemplate,
  getCanReadJobTemplate
} from 'utils/api';

// % context
import ScheduleContext from '../ScheduleContext';
import GlobalContext from 'layouts/Main/GlobalContext';

// ^ Material-ui Components(Functions)
import {
  Icon,
  Radio,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';

// ? Self-packed Components || Functions
import { ViewTemplateModal } from 'reuseContainers/ViewTemplateModal';
import Filter from './Step2/Filter';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import MuiDropdown from 'components/BaseMuiDropdown';
import BasePaper from 'components/BaseMuiPaper';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';

/**
 * @author odin
 * @prop {object} step2State -- 在父層的 State，用來記錄第二步驟中使用者選擇的模板以及其他相關資料
 * @prop {function} setStep2State -- 設定 step2State 的 setState function
 * @level views/Schedule/{CreateSchedule | EditSchedule}/Step2/Step2Table
 * @component Step2Table
 * @description Step2 的表格內容
*/
export const Step2Table = ({
  setStep2State,
  step2State
}) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const { classes } = useContext(ScheduleContext);
  const { useSelector } = useContext(GlobalContext);

  // ^ Redux
  const userInfo = useSelector(selectUserInfo);

  // # states
  const [templateList, setTemplateList] = useState([]);
  const [isViewModalShow, setIsViewModalShow] = useState(false);
  const [viewTemplate, setViewTemplate] = useState({});
  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = useState(new Filter());
  const [selectedOwner, setSelectedOwner] = useState(filter.owner);
  const [selectedTemplateObj, setSelectedTemplateObj] = useState({});

  // table pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // - methods
  const addDropDownOptionKeys = optionItems => {
    return optionItems.map((item) => ({
      key: item.key,
      text: item.name,
      ...item
    }));
  };

  const { users } = useMemo(() => {

    // 產生 users
    const users = Object.create(null);
    if (templateList) {
      templateList.forEach(function(job) {
        users[job.owner] = true;
      });
    }

    return { users }
  }, [templateList])

  /**
   * @author odin
   * @description 產生出 過濾的多選選項內容，targetvalue 是真的要記錄的值。
   * @return {array}
  */
  const filterOption = () => {
    const userList = [];
    if (templateList !== undefined) {
      userList.push({
        key: 'user-' + userInfo.username,
        text: `@${t('self')}`,
        targetvalue: userInfo.username,
        type: 'user'
      });
    }

    userList.push(...Object.keys(users)
      .filter(user => {
        return user !== userInfo.username;
      }).map(user => ({
        key: 'user-' + user,
        text: user,
        targetvalue: user,
        type: 'user'
      })));

    return addDropDownOptionKeys([
      { key: 'creator', name: t('Creator'), type: '-', itemType: 2 },
      { key: 'divider_1', name: 'divider_1', text: '-', itemType: 0 },
      ...userList,
      { key: 'divider_2', name: 'divider_2', text: '-', itemType: 0 },
      { key: 'clear', name: t('clearOption'), type: 'clear', itemType: 1 }
    ])
  }

  /**
   * @author odin
   * @description 清楚已經選定的選項們
  */
  const clearFilter = () => {
    setSelectedOwner(new Set());
  };

  /**
   * @author odin
   * @param {object} thisRow -- 該筆資料的內容
   * @example
   * {
   *  canReadUsers: ['admin']
      canWriteUsers: ['admin']
      description: "test1 test1 test1"
      id: 1
      jobConfig: {protocolVersion: '2', name: 'admin_be004b80', type: 'job', jobRetryCount: 0, prerequisites: Array(1), …}
      name: "test1"
      owner: "admin"
    }
   * @description 當點下查看之後，要顯示該模板的詳細資料 Modal
  */
  const onViewCheck = (
    thisRow
  ) => {
    setViewTemplate(thisRow)
    setIsViewModalShow(true)
  }

  /**
   * @author odin
   * @param {object} thisRow -- 該筆資料的內容
   * @description 選擇模板後要做的事情
  */
  const handleRadioChange = (thisRow) => {
    const { owner } = thisRow;
    const isModify = userInfo.username === owner ? false : true;
    const templateInfo = { ...thisRow }

    // 這個 Component 的 state
    setSelectedTemplateObj(thisRow)

    // 父層 component 的 state
    setStep2State((prev) => {
      return {
        ...prev,
        templateInfo,
        isModify
      }})
  }

  /**
   * @author odin
   * @description 是否要選擇修改
  */
  const handleCheckboxChange = () => {
    // 父層 component 的 state
    setStep2State((prev) => ({
      ...prev,
      isModify: !step2State.isModify
    }))

  }

  // & handled data
  const templateColumns = [
    // Radio column
    {
      id: 'radio',
      key: 'radio',
      label: '',
      width: 25,
      cellStyle: {
        th: {
          backgroundColor: '#ffffff'
        }
      },
      onTableCellRender: (
        thisRow
      ) => {
        return (
          <Radio
            checked={selectedTemplateObj.id === thisRow.id}
            className={`${classes.radioRoot}`}
            color="primary"
            onChange={() => {handleRadioChange(thisRow)}}
          />
        )
      }
    },
    // 名稱
    {
      id: 'name',
      key: 'name',
      label: t('name'),
      cellStyle: {
        th: {
          backgroundColor: '#ffffff'
        }
      },
      onTableCellRender: (thisRow) => thisRow.name
    },
    // 發布者
    {
      id: 'Creator',
      key: 'Creator',
      label: t('Creator'),
      cellStyle: {
        th: {
          backgroundColor: '#ffffff'
        }
      },
      onTableCellRender: (thisRow) => thisRow.owner
    },
    // 描述
    {
      id: 'description',
      key: 'description',
      label: t('description'),
      cellStyle: {
        th: {
          backgroundColor: '#ffffff'
        }
      },
      onTableCellRender: (thisRow) => thisRow.description
    },
    {
      id: 'view',
      key: 'view',
      label: t('view'),
      cellStyle: {
        th: {
          backgroundColor: '#ffffff'
        }
      },
      onTableCellRender: (thisRow) => {
        return (
          <div
            className={`${classes.viewBtn}`}
            onClick={() => {onViewCheck(thisRow)}}
          >
            <Icon className={`${classes.viewIcon}`}>visibility</Icon>
          </div>
        )
      }
    },
    {
      id: 'modify_configuration',
      key: 'modify_configuration',
      label: '',
      width: 250,
      cellStyle: {
        th: {
          backgroundColor: '#ffffff'
        }
      },
      onTableCellRender: (thisRow) => {
        const { id, owner } = thisRow

        if(
          selectedTemplateObj.id === id &&
          userInfo.username === owner
        ) {
          return (
            <FormControlLabel
              className={`${classes.mb_0}`}
              control={
                <Checkbox
                  checked={step2State.isModify}
                  // indeterminate
                  className={`${classes.checkboxRoot}`}
                  color="primary"
                  onChange={() => {
                    handleCheckboxChange()
                  }}
                />
              }
              label={`${t('modify')}${t('enSpace')}${t('configuration')}`}
            />
          )
        }
      }
    }

  ]

  // * hooks
  useEffect(() => {
    const hasAdminPrivileges = userInfo.admin === 'true' ? true : false;
    const getTemList = hasAdminPrivileges ? getJobTemplate() : getCanReadJobTemplate(userInfo.username);
    getTemList
      .then((template) => setTemplateList(template))
      .catch(err => {
      // .catch(({ message: msg }) => {
        const msg = err.data.message
        toast.error(msg)
      });
  }, [])

  useEffect(() => {
    if (!isEmpty(step2State.templateInfo)) {
      setSelectedTemplateObj(step2State.templateInfo)
    }
  }, [step2State])

  useEffect(() => {
    // const { keyword } = filter;
    // const { username } = userInfo;
    setFilter(new Filter(keyword, selectedOwner));
  }, [keyword, selectedOwner])

  return (
    <>
      {/* Material UI */}
      <div className={classes.flex_align_center}>
        <MuiAutocomplete
          classes={{ root: `${classes.mr_20} ${classes.h_auto}` }}
          onInputChange={(e, text) => setKeyword(text)}
          placeholder={`${t('search')}`}
          value={keyword}
        />

        <MuiDropdown
          classNameObj={{
            select: classes.mdSelect
          }}
          list={filterOption()}
          maxWidth={200}
          multiple
          onChange={(e, child) => {
            const { type, targetvalue } = child.props;

            if (child.props.type === 'clear') {
              clearFilter()
              return
            }

            const selected = [...selectedOwner].find(username => username === targetvalue)

            if (type === 'user') {
              const owners = new Set(selectedOwner);

              if (selected){
                owners.delete(targetvalue);
              } else{
                owners.add(targetvalue);
              }

              setSelectedOwner(owners)
            }
          }}
          onChangeChecked={(valueOrigin, item) => {
          // 決定怎麼樣 checkbox 會被勾選
            return valueOrigin.find(data => data === item.targetvalue) !== undefined ? true : false
          }}
          text={t('filter')}
          value={[...selectedOwner].map(name => name === userInfo.username ? `@${t('self')}` : name)}
          valueOrigin={[...selectedOwner]}
        />

      </div>

      {
        !isEmpty(templateList) && (
          <div className={`${classes.mt_20} ${classes.templateTableContainer}`}>
            <BasePaper
              classNameObj={{
                table: classes.step2Table
              }}
              columns={templateColumns}
              labelRowsPerPage={t('labelRowsPerPage')}
              page={page}
              PaperStyle={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
              rows={filter.apply(templateList)}
              rowsPerPage={rowsPerPage}
              setPage={setPage}
              setRowsPerPage={setRowsPerPage}
            />
          </div>
        )
      }

      {/* Modals */}
      {
        isViewModalShow &&
        <ViewTemplateModal
          isOpen={isViewModalShow}
          onClose={() => {setIsViewModalShow(false)}}
          templateInfo={viewTemplate}
          title={`${t('view')}${t('enSpace')}${t('template')}`}
        />
      }
    </>
  )
}

Step2Table.propTypes = {
  step2State: PropTypes.object,
  setStep2State: PropTypes.func
}
