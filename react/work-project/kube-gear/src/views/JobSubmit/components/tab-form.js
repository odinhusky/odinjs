import React, { useState, useEffect, useContext } from 'react';

// ? context
import Context from './context';

// ^ Material-ui Components(Functions)
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { TabFormContent } from './tab-form-content';

import { BaseTooltip } from 'components/BaseTooltip';

// ? Self-packed Components || Functions
// import { getFormClassNames, getTabFromStyle } from './form-style';
// import Card from 'components/Card';
// import { TooltipIcon } from './controls/tooltip-icon';
// import {PROTOCOL_TOOLTIPS} from '../utils/constants';
// import { taskRolesSchema, prerequisitesSchema } from '../models/protocol-schema';
// const TAB_ITEM_KEY_PREFIX = 'tabItem-';
// const tabFormStyle = getTabFromStyle();

// ^ Plugins
import PropTypes from 'prop-types';
import { isNil } from 'lodash';
import { useTranslation } from 'react-i18next';
// import { validate } from 'joi-browser';

export const TabFormMui = ({ items, advanceFlag, dupNames, onItemsChange, onItemDelete, onItemAdd }) => {

  // $ init data
  const { t } = useTranslation();

  // = styles
  const { classes } = useContext(Context);

  // # states
  const [selectedIndex, setSelectedIndex] = useState();
  const [activeTab, setActiveTab] = useState(false);

  // - methods
  const _onItemsChange = (updatedItems) => {
    if (onItemsChange !== undefined) {
      onItemsChange(updatedItems);
    }
  }

  const _onContentChange = (itemContent, index) => {
    const updatedItems = [...items];
    updatedItems[index].content = itemContent;
    _onItemsChange(updatedItems);
  }

  const _onItemDelete = (event, itemKey) => {
    event.stopPropagation();
    if (itemKey === undefined) return;
    if (onItemDelete === undefined) return;
    const newSelectedIndex = onItemDelete(items, itemKey);
    setSelectedIndex(newSelectedIndex);
    setActiveTab(newSelectedIndex)
  }

  const _onItemAdd = () => {
    if (onItemAdd === undefined) {
      return;
    }
    const newSelectedIndex = onItemAdd(items);
    setSelectedIndex(newSelectedIndex);
    setActiveTab(newSelectedIndex)
  }

  // * hooks
  useEffect(() => {
    if (items !== undefined && items.size !== 0) {
      setSelectedIndex(0)
      setActiveTab(0)
    }
  }, [])

  return (
    <div className={`${classes.minH_0} ${classes.pt_20}`}>
      <div className={`${classes.flex_align_center} ${classes.tabFormContainer}`}>
        <div className={`${classes.fz_18} ${classes.pr_8}`}>
          {t('task')}{t('enSpace')}{t('setting')}
        </div>
        <BaseTooltip
          arrow
          onClick={() => {}}
          title={t('toolTipsTaskRole')}
        >
          <IconButton
            aria-label="info"
            children={<Icon className={`${classes.fz_18}`}>info_outlined</Icon>}
            className={classes.p_0}
          />
        </BaseTooltip>
      </div>
      <Toolbar
        className={classes.toolbar}
        disableGutters
      >
        <Tabs
          aria-label="tabs"
          indicatorColor="primary"
          onChange={(e, value) => {
            setActiveTab(value)
            setSelectedIndex(value)
          }}
          scrollButtons="on"
          value={activeTab}
          variant="scrollable"
        >

          {items.map((item, idx) => (
            <Tab
              classes={{
                wrapper: classes.iconLabelWrapper
              }}
              icon={
                <IconButton
                  children={<Icon>close</Icon>}
                  className={`${classes.mb_0}`}
                  component="div"
                  onClick={(event) => {
                    event.stopPropagation()
                    _onItemDelete(event, idx)
                  }}
                />
              }
              key={`${item.headerText}${idx}`}
              label={item.headerText}
              value={idx}
            />
          ))}

          {/* 新增另一個任務設置的 ＋ 按鈕 */}
          <div className={`${classes.flex_align_center}`}>
            <IconButton
              children={<Icon>add</Icon>}
              component="div"
              onClick={_onItemAdd}
            />
          </div>

        </Tabs>
      </Toolbar>
      <div className={`${classes.tabFormContentContainer}`}>
        {!isNil(selectedIndex) && (
          <TabFormContent
            advanceFlag={advanceFlag}
            dupNames={dupNames}
            jobTaskRole={items[selectedIndex].content}
            key={selectedIndex}
            onContentChange={(updateRole) => _onContentChange(updateRole, selectedIndex)}
          />
        )}
      </div>
    </div>
  )
}

// export class TabForm extends React.Component {
//   constructor(props) {
//     super(props);
//     const { items } = props;

//     let selectedIndex;
//     if (items !== undefined && items.size !== 0) {
//       selectedIndex = 0;
//     }

//     this.state = {
//       selectedIndex: selectedIndex
//     };
//   }

//   _getItemKeyByIndex(index) {
//     return TAB_ITEM_KEY_PREFIX + index;
//   }

//   _getItemIndexByKey(key) {
//     return Number(key.substring(TAB_ITEM_KEY_PREFIX.length));
//   }

//   _onRenderItem(itemProps, defaultRender) {
//     if (itemProps === undefined || defaultRender === undefined) {
//       return null;
//     }
//     const { spacing } = getTheme();
//     const { items } = this.props;
//     const { selectedIndex } = this.state;
//     // validation
//     const idx = this._getItemIndexByKey(itemProps.itemKey);
//     const item = items[idx];
//     const taskRolesObject = { ...item.content.convertToProtocolFormat() };
//     const { error: taskRoleError } = validate(taskRolesObject, taskRolesSchema);
//     const dockerObject = item.content.getDockerPrerequisite();
//     const { error: dockerError } = validate(dockerObject, prerequisitesSchema);
//     const error = taskRoleError || dockerError;

//     return (
//       <div
//         style={{
//           position: 'relative'
//         }}
//       >
//         <div style={{ padding: `0 ${spacing.l1}` }}>
//           {
//             idx !== (selectedIndex || 0) && error &&
//             <Icon
//               iconName="Info"
//               styles={{
//                 root: {
//                   position: 'absolute',
//                   top: -10,
//                   left: 7,
//                   fontSize: 10,
//                   color: 'red'
//                 }
//               }}
//             />
//           }
//           <span
//             onClick={() => {
//               this._onLinkClick(itemProps)
//             }}
//           >
//             {defaultRender(itemProps)}
//           </span>
//           <Icon
//             iconName="Cancel"
//             onClick={this._onItemDelete.bind(this, itemProps.itemKey)}
//             styles={tabFormStyle.tabIcon}
//           />
//         </div>
//       </div>
//     );
//   }

//   _onItemsChange(updatedItems) {
//     const { onItemsChange } = this.props;
//     if (onItemsChange !== undefined) {
//       onItemsChange(updatedItems);
//     }
//   }

//   _onItemDelete(itemKey, event) {
//     event.stopPropagation();

//     if (itemKey === undefined) {
//       return;
//     }

//     const itemIndex = this._getItemIndexByKey(itemKey);
//     const { items, onItemDelete } = this.props;
//     if (onItemDelete === undefined) {
//       return;
//     }

//     const newSelectedIndex = onItemDelete(items, itemIndex);
//     this.setState({
//       selectedIndex: newSelectedIndex
//     });
//   }

//   _onItemAdd() {
//     const { items, onItemAdd } = this.props;
//     if (onItemAdd === undefined) {
//       return;
//     }
//     const newSelectedIndex = onItemAdd(items);
//     this.setState({
//       selectedIndex: newSelectedIndex
//     });
//   }

//   _onLinkClick(item) {
//     this.setState({
//       selectedIndex: this._getItemIndexByKey(item.itemKey)
//     });
//   }

//   _onContentChange(index, itemContent) {
//     const { items } = this.props;
//     const updatedItems = [...items];
//     updatedItems[index].content = itemContent;

//     this._onItemsChange(updatedItems);
//   }

//   render() {
//     let { selectedIndex } = this.state;
//     const { items, advanceFlag, dupNames } = this.props;

//     const { formTabBar } = getFormClassNames();

//     if ((selectedIndex === undefined && items.length) ||
//         (selectedIndex > items.length - 1)) {
//       selectedIndex = 0;
//     }
//     const { spacing } = getTheme();

//     return (
//       <Stack styles={{ root: { minHeight: 0, paddingTop: 20 } }}>
//         <div style={{ backgroundColor: '#F0FAF7', padding: '10px 20px', display: 'flex', alignItems: 'center' }}>
//           <Translation>
//             {
//               t => (
//                 <>
//                   <Label styles={{ root: { fontSize: 18 } }}>{t('task')}{t('enSpace')}{t('setting')}</Label>
//                   <TooltipIcon
//                     content={t('toolTipsTaskRole')}
//                     styles={{ root: {
//                       marginLeft: 10
//                     } }}
//                   />
//                 </>
//               )
//             }
//           </Translation>
//         </div>
//         <Stack
//           className={formTabBar}
//           horizontal
//         >
//           <Stack.Item styles={tabFormStyle.tabWapper}>
//             <Pivot
//               selectedKey={this._getItemKeyByIndex(selectedIndex)}
//               styles={{
//                 text: tabFormStyle.tab.text,
//                 root: tabFormStyle.tab.root,
//                 link: [{ margin: 0, padding: 0, background: '#f8f8f8' }],
//                 linkIsSelected: [{ margin: 0, padding: 0 }]
//               }}
//             >
//               {items.map((item, idx) => (
//                 <PivotItem
//                   headerText={item.headerText}
//                   itemKey={this._getItemKeyByIndex(idx)}
//                   key={this._getItemKeyByIndex(idx)}
//                   onRenderItemLink={this._onRenderItem.bind(this)}
//                 />
//               ))}
//             </Pivot>
//           </Stack.Item>
//           <Stack.Item disableShrink>
//             <ActionButton
//               iconProps={{ iconName: 'Add' }}
//               onClick={this._onItemAdd.bind(this)}
//               styles={{ root: { padding: `0 ${spacing.l1}` } }}
//               text=""
//             />
//           </Stack.Item>
//         </Stack>
//         <Stack styles={{ root: { minHeight: 0, overflowY: 'auto' } }}>
//           <Card style={{ padding: `${spacing.l2} ${spacing.l1} ${spacing.l1}` }}>
//             {!isNil(selectedIndex) && (
//               <TabFormContent
//                 advanceFlag={advanceFlag}
//                 dupNames={dupNames}
//                 jobTaskRole={items[selectedIndex].content}
//                 key={selectedIndex}
//                 onContentChange={this._onContentChange.bind(this, selectedIndex)}
//               />
//             )}
//           </Card>
//         </Stack>
//       </Stack>
//     );
//   }
// }

// TabForm.propTypes = {
//   items: PropTypes.array.isRequired,
//   onItemAdd: PropTypes.func.isRequired,
//   onItemDelete: PropTypes.func.isRequired,
//   onItemsChange: PropTypes.func,
//   advanceFlag: PropTypes.bool,
//   dupNames: PropTypes.array
// };

TabFormMui.propTypes = {
  items: PropTypes.array.isRequired,
  onItemAdd: PropTypes.func.isRequired,
  onItemDelete: PropTypes.func.isRequired,
  onItemsChange: PropTypes.func,
  advanceFlag: PropTypes.bool,
  dupNames: PropTypes.array
}
