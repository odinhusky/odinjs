import React, { useMemo, useCallback, useContext, useEffect } from 'react';
import { BasicSection } from '../basic-section';
import { Dropdown } from 'office-ui-fabric-react';
import Context from '../context';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export const GpuType = React.memo(props => {
  const { t } = useTranslation();
  const { onChange, gpuType } = props;
  const { gpuTypes } = useContext(Context);

  const options = useMemo(() => gpuTypes.map((gpuType, index) => {
    return {
      key: `gpuType_${index}`,
      text: gpuType
    };
  }), [gpuTypes]);

  useEffect(() => {
    if (gpuTypes.length !== 0 && !gpuTypes.includes(gpuType)) {
      onChange(gpuTypes[0]);
      return;
    }

    if (gpuTypes.length === 0 && gpuType !== '') {
      onChange(gpuTypes[0]);
    }
  }, [gpuTypes]);

  const _onChange = useCallback((_, item) => {
    if (onChange !== undefined) {
      onChange(item.text);
    }
  }, [onChange]);

  const gpuTypeIndex = options.findIndex(value=> value.text === gpuType);
  return (
    <BasicSection sectionLabel={`${t('Select')}${t('enSpace')}${t('GPU')}`}>
      <div style={{ width: 250 }}>
        <Dropdown
          onChange={_onChange}
          options={options}
          placeholder={`${t('Select')}${t('enSpace')}${t('GPU')}`}
          selectedKey={gpuTypeIndex == -1 ? null : `gpuType_${gpuTypeIndex}`}
          styles={{
            title: {
              borderRadius: 3
            }
          }}
        />
      </div>
    </BasicSection>
  );
});

GpuType.propTypes = {
  onChange: PropTypes.func,
  gpuType: PropTypes.string
};
