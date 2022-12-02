import React, { useState, useEffect, useContext } from 'react';

// ^ Redux
import { nanoid } from '@reduxjs/toolkit';

// ? context
import ResourceManageContext from '../../ResourceManageContext';

// ^ Material-ui Componets(Functions)

// ? Self-packed Components || Functions
import BaseLink from 'components/BaseLink';
import BasePanel from 'components/BasePanel';
import Progress from 'components/BaseProgress';
import { theme } from 'theme';
import {
  CPUUnit,
  GPUUnit,
  MemoryUnit,
  GPUMemoryPercentageUnit
} from 'common/commonConstant';

// ^ Plugins
import PropTypes from 'prop-types';
import { isEmpty, cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/ResourceManage/System
 * @component System
 * @description System component
*/
const System = ({ data }) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const { classes } = useContext(ResourceManageContext);

  // # states
  const [resources, setResources] = useState([]);

  // - methods
  /**
   * @author odin
   * @param {string} name -- 資源名稱
   * @description 處理 title 的顯示
   * @returns {string}
  */
  const handleTitle = name => {
    let result = '';

    switch(name) {
      case 'cpu':
      case 'gpu':
        result = name.toUpperCase()
        break;
      case 'memory':
        result = 'Memory';
        break;
      case 'gpuMemoryPercentage':
        result = t('GPU Percentage');
        break;
    }

    return result
  };

  /**
   * @author odin
   * @param {string} name -- 資源名稱
   * @description 處理 progressColor 的色碼
   * @returns {string}
  */
  const handleProgressColor = name => {
    let result = '';

    switch(name) {
      case 'cpu':
        result = theme.progressCPU;
        break;
      case 'gpu':
        result = theme.progressGPU;
        break;
      case 'memory':
        result = theme.progressMemory;
        break;
      case 'progressMemory':
        result = '';
        break;
    }

    return result
  };

  /**
   * @author odin
   * @param {string} name -- 資源名稱
   * @description 處理 unit 的顯示
   * @returns {string}
  */
  const handleUnit = name => {
    let result = '';

    switch(name) {
      case 'cpu':
        result = CPUUnit;
        break;
      case 'gpu':
        result = GPUUnit;
        break;
      case 'memory':
        result = MemoryUnit;
        break;
      case 'gpuMemoryPercentage':
        result = GPUMemoryPercentageUnit;
        break;
    }

    return result
  };

  // ! Component
  const ModalTitle = () => {
    const checkParent = isEmpty(data.parent) ? '-' : data.parent;
    const checkGroup = isEmpty(data.group)
      ? '-'
      :
      <BaseLink
        style={{ fontSize: '14px', padding: '0' }}
        to={`/group-manage?group=${data.group}`}
      >
        {data.group}
      </BaseLink>;

    return (
      <div className={`${classes.d_flex} ${classes.whiteSpacePre} ${classes.w_full}`}>
        <div className={`${classes.pr_20} ${classes.fz_18} ${classes.flex_align_center}`}>{!isEmpty(data) ? data.name : ''}</div>

        <div className={`${classes.fz_14} ${classes.flex_align_center} ${classes.fw_normal}`}>{t('source')} {checkParent}</div>

        <div className={`${classes.fz_14} ${classes.flex_align_center} ${classes.fw_normal} ${classes.px_20}`}>｜</div>

        <div className={`${classes.fz_14} ${classes.flex_align_center} ${classes.fw_normal}`}>{t('group2')} {checkGroup}</div>
      </div>
    )
  };

  // * hooks
  /**
   * @author odin
   * @description 為了依照指定的順序顯示
  */
  useEffect(() => {
    if(isEmpty(data.cells)) return;

    const order = ['cpu', 'gpu', 'gpuMemoryPercentage', 'memory']
    const copyTarget = { ...cloneDeep(data.cells) };
    const result = order.map(resourceName => (copyTarget[resourceName]));

    setResources(result);
  }, [data.cells]);

  return (
    <>
      <BasePanel
        className={`${classes.h_full}`}
        classNameObj={{
          header: `${classes.bg_white_imp} ${classes.borderBottom}`
        }}
        contentStyle={{ height: 'calc(100% - 45px)', overflow: 'auto' }}
        title={ModalTitle()}
      >
        <div className={`${classes.d_flex} ${classes.flex_wrap}`}>
          {
            !isEmpty(resources) &&
          resources.map((item, index) => {
            const { number: totalUnit, name } = item;
            const title = handleTitle(name);
            const usedUnit = data.usedCells[name] !== undefined ? data.usedCells[name] : 0;
            const unit = handleUnit(name);
            const color = handleProgressColor(name);

            return (
              <Progress
                key={`${data.name}${name}${nanoid()}`}
                keys={index}
                percentage={(usedUnit / totalUnit) * 100}
                progressColor={color}
                style={{ padding: 20, width: '33.33%' }}
                title={title}
                total={totalUnit}
                unit={unit}
                value={usedUnit}
              />
            )
          })
          }
        </div>
      </BasePanel>
    </>
  );
};

System.propTypes = {
  data: PropTypes.object
}

export default System;