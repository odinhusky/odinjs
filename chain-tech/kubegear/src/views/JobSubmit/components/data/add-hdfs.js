import React, { useState, useEffect } from 'react';
import { cloneDeep } from 'lodash';
import {
  TextField,
  TagPicker,
  FontClassNames,
  Stack,
  IconButton,
  Label,
  getTheme
} from 'office-ui-fabric-react';
import PropTypes from 'prop-types';

import { STORAGE_PREFIX, ERROR_MARGIN } from '../../utils/constants';
import { InputData } from '../../models/data/input-data';
import { validateMountPath, validateHDFSPathAsync } from '../../utils/validation';
import { WebHDFSClient } from '../../utils/webhdfs';

const { semanticColors } = getTheme();

export const AddHDFS = ({
  dataList,
  setDataList,
  setDataType,
  hdfsClient,
  hdfsPathPrefix
}) => {
  const [mountPath, setMountPath] = useState();
  const [isHdfsEnabled, setIsHdfsEnabled] = useState(true);
  const [hdfsPath, setHdfsPath] = useState();
  const [containerPathErrorMessage, setContainerPathErrorMessage] = useState(
    'Path should not be empty',
  );
  const [hdfsPathErrorMessage, setHdfsPathErrorMessage] = useState();

  useEffect(() => {
    if (!hdfsClient) {
      setIsHdfsEnabled(false);
      setHdfsPathErrorMessage('Pai HDFS is not available');
    } else {
      hdfsClient.checkAccess().then((isAccessiable) => {
        setIsHdfsEnabled(isAccessiable);
        if (!isAccessiable) {
          setHdfsPathErrorMessage('Pai HDFS is not available');
        }
      });
    }
  }, []);

  const submitMount = async () => {
    if (hdfsClient) {
      try {
        await hdfsClient.readDir(hdfsPath);
      } catch (e) {
        alert(`${hdfsPath}: ${e.message}`);

        return;
      }
    }
    const newDataList = cloneDeep(dataList);
    newDataList.push(new InputData(mountPath, hdfsPath, 'hdfs'));
    setDataList(newDataList);
    setDataType('none');
  };

  const onFilterChanged = async (filterText) => {
    if (!isHdfsEnabled || !hdfsClient) {
      return [];
    }
    let result;
    try {
      const pathPrefix = filterText.slice(0, filterText.lastIndexOf('/') + 1);
      result = await hdfsClient.readDir(`${hdfsPathPrefix}${pathPrefix}`);
      const resultTags = result
        .filter((path) => {
          if (filterText.lastIndexOf('/') === filterText.length - 1) {
            return true;
          }
          const partPath = filterText.split('/').pop();
          if (!partPath) {
            return [];
          }
          return path.includes(partPath);
        })
        .map((pathSuffix) => {
          return {
            name: pathSuffix,
            key: `${pathPrefix}${pathSuffix}`
          };
        });
      return resultTags;
    } catch (e) {
      return [];
    }
  };
  const onItemSelected = async (selectedItem) => {
    if (!selectedItem) {
      return null;
    }
    const hdfsPath = selectedItem.key;
    setHdfsPath(hdfsPath);
    const valid = await validateHDFSPathAsync(hdfsPath, hdfsClient);
    if (!valid.isLegal) {
      setHdfsPathErrorMessage(valid.illegalMessage);
    } else {
      setHdfsPathErrorMessage(null);
    }
    return {
      name: selectedItem.key,
      key: selectedItem.key
    };
  };

  return (
    <Stack
      gap="s"
      horizontal
      horizontalAlign="space-between"
    >
      <Stack.Item align="baseline">
        <Label
          className={FontClassNames.medium}
          reqired
        >
          Container path
        </Label>
        <TextField
          errorMessage={containerPathErrorMessage}
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
          styles={{ root: { width: 200 } }}
        />
      </Stack.Item>
      <Stack.Item align="baseline">
        <Label
          className={FontClassNames.medium}
          required
        >
          Path in pai HDFS
        </Label>
        <TagPicker
          disabled={hdfsPathErrorMessage === 'Pai HDFS is not available'}
          itemLimit={1}
          onItemSelected={onItemSelected}
          onResolveSuggestions={onFilterChanged}
          pickerSuggestionsProps={{
            suggestionsHeaderText: 'Path in hdfs should start with /',
            noResultsFoundText: 'Path not found'
          }}
        />
        {hdfsPathErrorMessage && (
          <span
            className={FontClassNames.small}
            style={{
              color: semanticColors.errorText,
              paddingTop: 5
            }}
          >
            {hdfsPathErrorMessage}
          </span>
        )}
      </Stack.Item>
      <Stack.Item align="end">
        <IconButton
          disabled={!isHdfsEnabled}
          iconProps={{ iconName: 'View' }}
          onClick={() => {
            window.open(`${hdfsClient.host}/explorer.html#/`);
          }}
          styles={{
            root: {
              marginBottom:
                containerPathErrorMessage || hdfsPathErrorMessage ? ERROR_MARGIN : 0
            },
            rootDisabled: {
              backgroundColor: 'transparent'
            }
          }}
        />
      </Stack.Item>
      <Stack.Item align="end">
        <IconButton
          disabled={containerPathErrorMessage || hdfsPathErrorMessage}
          iconProps={{ iconName: 'Accept' }}
          onClick={submitMount}
          styles={{
            root: {
              marginBottom:
                containerPathErrorMessage || hdfsPathErrorMessage ? ERROR_MARGIN : 0
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
                containerPathErrorMessage || hdfsPathErrorMessage ? ERROR_MARGIN : 0
            }
          }}
        />
      </Stack.Item>
    </Stack>
  );
};

AddHDFS.propTypes = {
  dataList: PropTypes.arrayOf(PropTypes.instanceOf(InputData)),
  setDataList: PropTypes.func,
  setDataType: PropTypes.func,
  hdfsClient: PropTypes.instanceOf(WebHDFSClient),
  hdfsPathPrefix: PropTypes.string
};
