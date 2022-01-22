import React, { useState, useContext } from 'react';

// ^ Redux
import { nanoid } from '@reduxjs/toolkit';

// ? context
import Context from '../../Context';

// ^ Material-ui Componets(Functions)
import Icon from '@material-ui/core/Icon';

// ? Self-packed Components || Functions
import BaseLink from 'components/BaseLink';
import BasePanel from 'components/BasePanel';
import Progress from 'components/BaseProgress';
import { formatBytes } from 'utils';
import { MB } from 'constant';
import { DefaultButton } from 'components/BaseButton';
import EditResourceNameModal from './components/EditResourceNameModal';


// ^ Plugins
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

const System = ({ data, resourceUnits }) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const { classes } = useContext(Context)

  // # states
  const [isEditResourceModalOpen, setIsEditResourceModalOpen] = useState(false);


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

        <div className={`${classes.ml_auto}`}>
          <DefaultButton
            children={t('Edit')}
            onClick={() => {
              setIsEditResourceModalOpen(true)
            }}
            startIcon={<Icon>edit</Icon>}
          />
        </div>
      </div>
    )
  }

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
            (!isEmpty(data) && !isEmpty(resourceUnits)) &&
          Object.entries(data.cells).map(([key, value], index) => {
            const { number: totalUnit, name, resourceUnit } = value;
            const usedUnit = data.usedCells[key] !== undefined ? data.usedCells[key] : 0
            let title = name
            if (resourceUnits[resourceUnit]) {
              const gpu = resourceUnits[resourceUnit].gpu !== null ? resourceUnits[resourceUnit].gpu : 0
              const cpu = resourceUnits[resourceUnit].cpu
              const memory = formatBytes(resourceUnits[resourceUnit].memory * MB)
              title = `${name} ( ${gpu} GPU, ${cpu} CPU, ${memory} ${t('Memory')} )`
            }
            return (
              <Progress
                key={`${data.name}${key}${nanoid()}`}
                keys={index}
                percentage={(usedUnit / totalUnit) * 100}
                style={{ padding: 20, width: '33.33%' }}
                title={title}
                total={totalUnit}
                unit={''}
                value={usedUnit}
              />
            )
          })
          }
        </div>
      </BasePanel>

      {/* Modal */}
      {
        // 編輯資源名稱的 Modal
        (!isEmpty(data) && isEditResourceModalOpen) &&
          <EditResourceNameModal
            data={data}
            isEditResourceModalOpen={isEditResourceModalOpen}
            onClose={() => {setIsEditResourceModalOpen(false)}}
          />
      }
    </>
  );
};

System.propTypes = {
  data: PropTypes.object,
  resourceUnits: PropTypes.object
}

export default System;