import React, { useState, useEffect } from 'react';

// ^ Redux
import { useSelector } from 'react-redux';
import { selectResourceUnit } from 'layouts/Main/features/resourceunit/resourceunitSlice';

// # API
import {
  getResource,
  getResourceVirtualGroup
} from 'utils/api';

// ? context
import Context from './Context';

// ? Self-packed Components || Functions
import System from './components/System';
import SubSource from './components/SubSource';
import BreadCrumbs from 'components/BreadCrumbs';
import BaseMenu from 'components/BaseMenu'
import CreateResourceModal from './components/SubSource/components/SubResource/CreateResourceModal';
import ModifyResourceModal from './components/SubSource/components/SubResource/ModifyResourceModal';
import CreateGroupModal from './components/SubSource/components/Group/CreateGroupModal';
import ModifyGroupModal from './components/SubSource/components/Group/ModifyGroupModal';
import UserSettingModal from './components/SubSource/components/Group/UserSettingModal';

// ? styles
import { makeStyles } from '@material-ui/core/styles'
import commonStyle from 'common/commonStyles'
import resourceManageStyles from './resourceManageStyles.js'

const useStyles = makeStyles((theme) => {
  return {
    ...commonStyle(theme),
    ...resourceManageStyles(theme)
  }});

// ^ Plugins
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';


const ResourceManage = () => {

  // $ init data
  const query = new URLSearchParams(window.location.search);
  const getParam = query.get('selectedItem') || 'system';
  const history = useHistory();

  // ^ Redux
  const resourceUnits = useSelector(selectResourceUnit)

  // = styles
  const classes = useStyles();

  // # states
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [treeData, setTreeData] = useState([]);
  const [activeSystemData, setActiveSystemData] = useState({});
  const [vgData, setVgData] = useState([]);

  const [originModifyResourceSelectedData, setOriginModifyResourceSelectedData] = useState({});
  const [modifyResourceSelectedItem, setModifyResourceSelectedItem] = useState('');
  const [modifyResourceData, setModifyResourceData] = useState({});

  const [originModifyGroupSelectedData, setOriginModifyGroupSelectedData] = useState({});
  const [modifyGroupSelectedItem, setModifyGroupSelectedItem] = useState('');
  const [modifyGroupData, setModifyGroupData] = useState({});

  const [isCreateResourceModalShow, setIsCreateResourceModalShow] = useState(false);
  const [isModifyResourceModalShow, setIsModifyResourceModalShow] = useState(false);

  const [isCreateGroupModalShow, setIsCreateGroupModalShow] = useState(false);
  const [isModifyGroupModalShow, setIsModifyGroupModalShow] = useState(false);

  const [originUserSettingGroupSelectedData, setOriginUserSettingGroupSelectedData] = useState({});
  const [userSettingGroupSelectedItem, setUserSettingGroupSelectedItem] = useState('');

  const [isUserSettingModalShow, setIsUserSettingModalShow] = useState(false);
  const [userSettingVgCells, setUserSettingVgCells] = useState(false);

  // - methods
  /**
   * @author odin
   * @description 取得各個資源
  */
  const getData = (name = getParam) => {
    setIsLoading(true)
    Promise.all([getResource(name)])
      .then(([res]) => {
        setIsLoading(false)
        setTreeData([res])
        setActiveSystemData(findSelectedData([res]))
      })
      .catch(err => {
        toast.error('Error:' + err.data ? err.data.message : err.message, {
          onClose: () => history.push('group-manage')
        })
        setIsLoading(false)
      })
  }

  /**
   * @author elvis
   * @param {string} selectedItem -- 該節點的名稱
   * @description 取得 vg 資訊
  */
  const getVgData = selectedItem => {
    getResourceVirtualGroup(selectedItem)
      .then(res => setVgData(res))
      .catch(err => toast.error('Error:' + err.data ? err.data.message : err.message))
  }

  const findModifyGroupSelectedData = (data, selectedItemName) => {
    const findActive = data.find(element => element.name === selectedItemName)
    return findActive
  }

  const findModifyResourceSelectedData = (data) => {
    const findActive = data.find(element => element.name === modifyResourceSelectedItem)
    if (!isEmpty(findActive)) {
      return findActive
    } else {
      const findChildren = data.flatMap(item => item.children)
      return !isEmpty(findChildren) ? findModifyResourceSelectedData(findChildren) : {}
    }
  }

  /**
   * @author elvis
   * @description 找初目前選出的節點物件
   * @returns {object}
  */
  const findSelectedData = (data) => {
    const findActive = data.find(element => element.name === selectedItem)
    if (!isEmpty(findActive)) {
      return findActive
    } else {
      const findChildren = data.flatMap(item => item.children)
      return !isEmpty(findChildren) ? findSelectedData(findChildren) : {}
    }
  }

  // * hooks
  useEffect(() => {
    if (!isModifyGroupModalShow) {
      setOriginModifyGroupSelectedData({})
      setModifyGroupSelectedItem('')
      setModifyGroupData({})
    }
  }, [isModifyGroupModalShow])

  useEffect(() => {
    if (!isModifyResourceModalShow) {
      setOriginModifyResourceSelectedData({})
      setModifyResourceSelectedItem('')
      setModifyResourceData({})
    }
  }, [isModifyResourceModalShow])

  useEffect(() => {
    if (!isEmpty(modifyResourceSelectedItem)) {
      (() => {
        const data = findModifyResourceSelectedData(treeData);
        const parentData = { ...activeSystemData }
        const { cells, usedCells } = parentData

        const remainCells = Object.entries(usedCells).reduce((acc, [key, value]) => {
          if (acc[key]) {
            return { ...acc, [key]: { ...acc[key], number: acc[key]['number'] - value }  }
          } else {
            return { ...acc }
          }
        }, cells)

        const mergeCells = Object.entries(remainCells).reduce((acc, [key, details]) => {
          const newAcc = { ...acc }
          if (newAcc[key]) {
            newAcc[key] = {
              ...newAcc[key],
              number: newAcc[key]['number'] + details['number']
            }
            return { ...newAcc }
          } else {
            return { ...newAcc, [key]: details }
          }
        }, data.cells)

        const result = { ...data, cells: mergeCells }

        if (!isEmpty(data)) {
          setOriginModifyResourceSelectedData(data)
          setModifyResourceData(result)
        }
      })()
    }
  }, [modifyResourceSelectedItem])

  useEffect(() => {
    if (!isEmpty(modifyGroupSelectedItem)) {
      (() => {
        const data = findModifyGroupSelectedData(vgData, modifyGroupSelectedItem);
        const parentData = { ...activeSystemData };
        const { cells, usedCells } = parentData;

        const remainCells = Object.entries(usedCells).reduce((acc, [key, value]) => {
          if (acc[key]) {
            return { ...acc, [key]: { ...acc[key], number: acc[key]['number'] - value }  }
          } else {
            return { ...acc }
          }
        }, cells)

        const mergeCells = Object.entries(remainCells).reduce((acc, [key, details]) => {
          const newAcc = { ...acc }
          if (newAcc[key]) {
            newAcc[key] = {
              ...newAcc[key],
              number: newAcc[key]['number'] + details['number']
            }
            return { ...newAcc }
          } else {
            return { ...newAcc, [key]: details }
          }
        }, data.cells)

        const result = {
          ...data,
          cells: mergeCells
        }

        if (!isEmpty(data)) {
          setOriginModifyGroupSelectedData(data)
          setModifyGroupData(result)
        }
      })()
    }
  }, [modifyGroupSelectedItem])

  useEffect(() => {
    if (userSettingGroupSelectedItem !== '') {
      (() => {
        const data = findModifyGroupSelectedData(vgData, userSettingGroupSelectedItem);
        if (!isEmpty(data)) {
          setOriginUserSettingGroupSelectedData(data)
        }
      })()
    }
  }, [userSettingGroupSelectedItem])

  useEffect(() => {
    if (!isEmpty(treeData)) {
      const data = findSelectedData(treeData);
      if (!isEmpty(data)) {
        setActiveSystemData(data)
      }
      getVgData(selectedItem)
    }
  }, [selectedItem, treeData])

  useEffect(() => {
    getData()
    setSelectedItem(getParam)
  }, [getParam])

  const context = {
    classes,
    getData,
    getParam,
    isLoading,
    setIsModifyResourceModalShow,
    setModifyResourceSelectedItem,
    setModifyResourceData,
    modifyResourceData,
    setOriginModifyResourceSelectedData,
    originModifyResourceSelectedData,
    setIsCreateGroupModalShow,
    setIsModifyGroupModalShow,
    setIsUserSettingModalShow,
    setUserSettingVgCells,
    setModifyGroupSelectedItem,
    setModifyGroupData,
    modifyGroupData,
    setOriginModifyGroupSelectedData,
    originModifyGroupSelectedData,
    setUserSettingGroupSelectedItem,
    originUserSettingGroupSelectedData
  }

  return (
    <Context.Provider value={context}>
      <div
        className={`
          ${classes.pos_rel}
          ${classes.px_20}
          ${classes.pb_20}
          ${classes.flexDColumn}
          ${classes.overflowHidden}
          ${classes.h_full}
        `}
      >
        <BreadCrumbs />
        <div className={`${classes.d_flex} ${classes.flexGrow1} ${classes.overflowHidden}`}>
          <div
            className={`
              ${classes.treeView}
              ${classes.mr_20}
              ${classes.py_4}
              ${classes.borderRadius_4}
              ${classes.bg_white}
              ${classes.pos_rel}
              ${classes.overflowAuto}
            `}
          >
            <BaseMenu
              data={treeData}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
            />
          </div>

          <div
            className={`
              ${classes.flexDColumn}
              ${classes.w_80}
              ${classes.overflowAuto}
            `}
          >
            <div className={`${classes.w_full}`}>
              <System
                data={activeSystemData}
                resourceUnits={resourceUnits}
                selectedItem={selectedItem}
              />
            </div>

            <div
              className={`
                ${classes.flexDColumn}
                ${classes.mt_30}
                ${classes.bg_white}
                ${classes.borderRadius_4}
              `}
            >
              <SubSource
                resourceData={activeSystemData.children}
                resourceUnits={resourceUnits}
                setIsCreateResourceModalShow={setIsCreateResourceModalShow}
                vgData={vgData}
              />
            </div>
          </div>
        </div>

        {/* Modals */}
        {
          isCreateResourceModalShow &&
          <CreateResourceModal
            data={activeSystemData}
            isOpen={isCreateResourceModalShow}
            onClose={() => setIsCreateResourceModalShow(false)}
            resourceUnits={resourceUnits}
          />
        }
        {
          isModifyResourceModalShow &&
          <ModifyResourceModal
            data={activeSystemData}
            isOpen={isModifyResourceModalShow}
            onClose={() => setIsModifyResourceModalShow(false)}
            resourceUnits={resourceUnits}
          />
        }
        {
          isCreateGroupModalShow &&
          <CreateGroupModal
            data={activeSystemData}
            isOpen={isCreateGroupModalShow}
            onClose={() => setIsCreateGroupModalShow(false)}
            resourceUnits={resourceUnits}
          />
        }
        {
          isModifyGroupModalShow &&
          <ModifyGroupModal
            data={activeSystemData}
            isOpen={isModifyGroupModalShow}
            onClose={() => setIsModifyGroupModalShow(false)}
            resourceUnits={resourceUnits}
          />
        }
        {
          isUserSettingModalShow &&
          <UserSettingModal
            data={userSettingVgCells}
            getRefreshData={getData}
            isOpen={isUserSettingModalShow}
            onClose={() => setIsUserSettingModalShow(false)}
            resourceUnits={resourceUnits}
          />
        }
      </div>
    </Context.Provider>
  );
};

export default ResourceManage;