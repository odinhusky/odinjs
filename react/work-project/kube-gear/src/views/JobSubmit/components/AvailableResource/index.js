import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'components/BaseInput';
import PropTypes from 'prop-types';
import Context from '../context';

import {
  DirectionalHint,
  Callout
} from 'office-ui-fabric-react';
import styles from './index.module.scss';
import { isEmpty } from 'lodash';


const AvailableResource = ({ ...props }) => {
  const { t } = useTranslation();
  const { systemAvailableResource } = useContext(Context);
  const [selectedKey, setSelectedKey] = useState(null);
  const [resource, setResource] = useState({});

  useEffect(() => {
    if (isEmpty(systemAvailableResource)) return;
    if (!selectedKey) {
      setSelectedKey(systemAvailableResource[0].name)
    }
    const find = systemAvailableResource.find(item => item.name === selectedKey);

    if(!find) return;
    setResource(find);
  }, [systemAvailableResource, selectedKey])

  return (
    <Callout
      directionalHint={DirectionalHint.rightCenter}
      doNotLayer
      hideOverflow
      styles={{
        root: {
          zIndex: 1030
        },
        container:{
          marginTop: '0 !important'
        }
      }}
      {...props}
    >
      <div className={styles.container}>
        {
          isEmpty(systemAvailableResource) ?
            <div>{t('taskRoleContainerSize')}</div>
            :
            <>
              <h3>{t('remainingResource')}</h3>
              <Dropdown
                onChange={(e, opt) => setSelectedKey(opt.key)}
                options={systemAvailableResource.map(item => ({ key: item.name, text: item.name }))}
                selectedKey={selectedKey}
              />
              <p>
                <span>{t('CPU')}</span>
                <span>{resource.cpu - resource.cpuUsed}</span>
              </p>
              <p>
                <span>{t('memory')}</span>
                <span>{resource.memory - resource.memoryUsed} MB</span>
              </p>
              <p>
                <span>{t('disk')}</span>
                <span>{resource.storage - resource.storageUsed} GB</span>
              </p>
              <p>
                <span>{t('GPU')}</span>
                <span>{
                  resource.gpu && Object.entries(resource.gpu).map(([key, value ]) => (
                    `${value - resource.gpuUsed[key]} (${key})`
                  ))
                }</span>
              </p>
            </>
        }
      </div>
    </Callout>
  );
};

AvailableResource.propTypes = {
  data: PropTypes.object
}

export default AvailableResource;