import React from 'react';

import BreadCrumbs from 'components/BreadCrumbs';
import { Stack } from 'office-ui-fabric-react';
import { VersionLog } from './components';

import styles from './index.module.scss';

const Version = () => {
  return (
    <Stack
      styles={{ root: { position: 'relative', padding: '0 20px 20px' } }}
      verticalFill
    >
      <BreadCrumbs />
      <Stack.Item
        grow
        styles={{
          root: {
            backgroundColor: '#FBFBFB'
          }
        }}
      >
        <div className={styles.container}>
          <VersionLog />
        </div>
      </Stack.Item>
    </Stack>
  );
};

export default Version;
