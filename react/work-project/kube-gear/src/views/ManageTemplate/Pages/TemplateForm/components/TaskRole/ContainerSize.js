import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
// import TitleDivider from '../TitleDivider';
import { SpinButton } from '../Form';
import styles from '../../index.module.scss';

const ContainerSize = ({ data, onChange, shmMB }) => {
  const { t } = useTranslation();

  const onSizeChange = (field, value) => {
    onChange('containerSize', { ...data, [field]: value })
  }

  return (
    <div>
      {/* <TitleDivider
        hint={t('taskRoleContainerSize')}
        title={t('resourceConstraints')}
      /> */}
      <div className={styles.formContent}>
        <SpinButton
          min={1}
          onChange={v => onSizeChange('cpu', v)}
          title={t('CPU')}
          value={data.cpu}
        />
        <SpinButton
          max={8}
          min={0}
          onChange={v => onSizeChange('gpu', v)}
          title={`GPU ${t('amount')}`}
          value={data.gpu}
        />
        <SpinButton
          min={1}
          onChange={v => onSizeChange('memoryMB', v)}
          title={`${t('memory')} (MB)`}
          value={data.memoryMB}
        />
        <SpinButton
          min={1}
          onChange={value => onChange('shmMB', value)}
          title={t('sharedMemoryMB')}
          value={shmMB}
        />
        <SpinButton
          min={1}
          onChange={v => onSizeChange('storageGB', v)}
          title={`${t('disk')} (GB)`}
          value={data.storageGB}
        />
      </div>
    </div>
  );
};

ContainerSize.propTypes = {
  data: PropTypes.object,
  onChange: PropTypes.func,
  shmMB: PropTypes.number
};

export default ContainerSize;