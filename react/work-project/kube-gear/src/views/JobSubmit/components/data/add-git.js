import React, { useState } from 'react';
import { IconButton, Stack, TextField } from 'office-ui-fabric-react';
import { cloneDeep } from 'lodash';
import PropTypes from 'prop-types';

import { STORAGE_PREFIX, ERROR_MARGIN } from '../../utils/constants';
import { InputData } from '../../models/data/input-data';
import { validateMountPath, validateGitUrl } from '../../utils/validation';

export const AddGit = (props) => {
  const { dataList, setDataList, setDataType } = props;
  const [mountPath, setMountPath] = useState();
  const [gitUrl, setGitUrl] = useState();
  const [containerPathErrorMessage, setContainerPathErrorMessage] = useState(
    'Path should not be empty',
  );
  const [gitAddressErrorMessage, setGitAddressErrorMessage] = useState(
    'Git should not be empty',
  );

  const submitMount = () => {
    const newDataList = cloneDeep(dataList);
    newDataList.push(new InputData(mountPath, gitUrl, 'git'));
    setDataList(newDataList);
    setDataType('none');
  };

  return (
    <Stack
      gap="m"
      horizontal
      horizontalAlign="space-between"
    >
      <Stack.Item align="baseline">
        <TextField
          errorMessage={containerPathErrorMessage}
          label="Container path"
          onChange={(_event, newValue) => {
            const valid = validateMountPath(`/${newValue}`);
            if (!valid.isLegal) {
              setContainerPathErrorMessage(valid.illegalMessage);
            } else {
              setContainerPathErrorMessage(null);
              setMountPath(`${STORAGE_PREFIX}${newValue}`);
            }
          }}
          prefix={STORAGE_PREFIX}
          required
          styles={{ root: { width: 200 } }}
        />
      </Stack.Item>
      <Stack.Item align="baseline" />
      <TextField
        errorMessage={gitAddressErrorMessage} // eslint-disable-line react/jsx-boolean-value
        label="Git repo address"
        onChange={(_event, newValue) => {
          const valid = validateGitUrl(newValue);
          if (!valid.isLegal) {
            setGitAddressErrorMessage(valid.illegalMessage);
          } else {
            setGitAddressErrorMessage(null);
            setGitUrl(newValue);
          }
        }}
        required
      />
      <Stack.Item align="end">
        <IconButton
          disabled={containerPathErrorMessage || gitAddressErrorMessage}
          iconProps={{ iconName: 'Accept' }}
          onClick={submitMount}
          styles={{
            root: {
              marginBottom:
                containerPathErrorMessage || gitAddressErrorMessage ? ERROR_MARGIN : 0
            },
            rootDisabled: {
              backgroundColor: 'transparent'
            }
          }}
        />
      </Stack.Item>
      <Stack.Item align="end">
        <IconButton
          iconProps={{ iconName: 'Cancel' }}
          onClick={() => {
            setDataType('none');
          }}
          styles={{
            root: {
              marginBottom:
                containerPathErrorMessage || gitAddressErrorMessage ? ERROR_MARGIN : 0
            }
          }}
        />
      </Stack.Item>
    </Stack>
  );
};

AddGit.propTypes = {
  dataList: PropTypes.arrayOf(PropTypes.instanceOf(InputData)),
  setDataList: PropTypes.func,
  setDataType: PropTypes.func
};
