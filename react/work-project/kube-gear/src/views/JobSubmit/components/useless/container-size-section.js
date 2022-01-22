import React, { useContext, useRef } from 'react';
import { Label } from 'office-ui-fabric-react';
import PropTypes from 'prop-types';
import { BasicSection } from '../basic-section';
import { getDefaultContainerSize } from '../../models/container-size';
import { FormSpinButton } from '../form-spin-button';
// import {PROTOCOL_TOOLTIPS} from '../utils/constants';
import { RESOURCE_ERROR_MESSAGE_ID } from '../../utils/errorCode';
import JobContext from '../context';
import { useTranslation } from 'react-i18next';
import { TooltipIcon } from '../controls/tooltip-icon';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import { useState } from 'react';
import { useEffect } from 'react';
import { isEmpty } from 'lodash';
import AvaliableResource from '../AvailableResource';
import { ChoiceGroup } from 'components/BaseInput'

const ButtonStyles = {
  primary: {
    root: {
      borderRadius: 3,
      padding: 30,
      marginRight: 20
    },
    flexContainer: {
      flexDirection: 'column'
    }
  },
  default: {
    root: {
      borderRadius: 3,
      padding: 30,
      marginRight: 20,
      background: '#fff',
      border: '1px solid #333'
    },
    flexContainer: {
      flexDirection: 'column'
    }
  }
}

export const ContainerSizeSection = ({ value, onChange, isContainerSizeEnabled, ShmFormSpinButton }) => {
  const { t } = useTranslation();
  const { cpu, memoryMB, gpu, storageGB } = value;
  const { advanceFlag, errorMessages, setErrorMessage, systemParams, setEditorOpen } = useContext(JobContext);
  const [resourceOptions, setResourceOptions] = useState(
    [ { cpu: 1, gpu: 2, check: true }, { cpu: 2, gpu: 4, check: false }, { cpu: 8, gpu: 16, check: false }]
  )
  const [isCalloutShow, setIsCalloutShow] = useState(false);
  const [selectedKey, setSelectedKey] = useState(0);
  const iconRefSimple = useRef(null); // 簡易版icon ref
  const iconRefPro = useRef(null); // 專業版icon ref

  const handleOptionChange = () => {
    resourceOptions.forEach(opt => {
      if (opt.check) {
        onChange({
          ...value,
          cpu: opt.cpu,
          gpu: opt.gpu
        })
      }
    })
  }

  useEffect(handleOptionChange, [resourceOptions, advanceFlag]);

  useEffect(() => {
    if (!advanceFlag) {
      setResourceOptions(options => (options.map((params, idx) => ({ ...params, check: idx === 0 }))))
      setSelectedKey(0)
    }
  }, [advanceFlag])

  useEffect(() => {
    if (isEmpty(systemParams)) return;
    // get data
    const settingOption = systemParams.find(param => param.key === 'cpuAndGpuList') ?
      JSON.parse(`${systemParams.find(param => param.key === 'cpuAndGpuList').value}`) :
      [{ cpu :2, gpu: 1 }, { cpu:4, gpu:2 }, { cpu:8, gpu:4 }]
    const advanceSettingDisk = systemParams.find(param => param.key === 'disk') ? systemParams.find(param => param.key === 'disk').value : Number(5);
    const advanceSettingMemorySize = systemParams.find(param => param.key === 'memorySize') ? systemParams.find(param => param.key === 'memorySize').value : Number(1024);
    const params = new URLSearchParams(window.location.search);

    if (params.get('op') !== 'resubmit') {
      if (!advanceFlag) {
        // 第一個選項亮起來
        const options = settingOption.map((params, idx) => ({ ...params, check: idx === 0 }))
        setSelectedKey(0)
        options.forEach(opt => {
          if (opt.check) {
            onChange({
              ...value,
              cpu: opt.cpu,
              gpu: opt.gpu,
              memoryMB: advanceSettingMemorySize,
              storageGB: advanceSettingDisk
            })
          }
        })
        setResourceOptions(options)
      }
    }
  }, [systemParams])

  const _onChange = (keyName, newValue) => {
    if (errorMessages[RESOURCE_ERROR_MESSAGE_ID]) {
      // clear error message when user input
      setErrorMessage(RESOURCE_ERROR_MESSAGE_ID, {});
    }
    if (onChange !== undefined) {
      onChange({ ...value, [keyName]: newValue });
    }
  };

  const _onGPUSkuChange = gpuNumber => {
    if (onChange !== undefined) {
      onChange(getDefaultContainerSize(gpuNumber));
    }
  };

  return (
    <>
      {
        advanceFlag ?
          <>
            <div style={{ display: 'flex', alignItems: 'center' }} >
              <Label styles={{ root: { fontSize: 18 } }}>{t('resourceConstraints')}</Label>
              <TooltipIcon
                iconRef={iconRefPro}
                onClick={() => setIsCalloutShow(true)}
                styles={{ root: {
                  marginLeft: 10
                } }}
              />
              <div style={{ flexGrow: 1, borderBottom: '1px solid #eaeaea', marginLeft: 20 }} />
            </div>
            <FormSpinButton
              disabled={!isContainerSizeEnabled}
              fieldError={errorMessages[RESOURCE_ERROR_MESSAGE_ID] === 'VgCpuNotEnoughError' ? 'VgCpuNotEnoughError' : ''}
              min={1}
              onChange={value => _onChange('cpu', value < 1 ? 1 : value)}
              sectionLabel={'CPU'}
              shortStyle
              value={cpu}
            />
            <FormSpinButton
              fieldError={errorMessages[RESOURCE_ERROR_MESSAGE_ID] === 'VgGpuNotEnoughError' ? 'VgGpuNotEnoughError' : ''}
              min={0}
              onChange={
                isContainerSizeEnabled
                  ? value => _onChange('gpu', value)
                  : _onGPUSkuChange
              }
              sectionLabel={'GPU'}
              shortStyle
              value={gpu}
            />
            <FormSpinButton
              disabled={!isContainerSizeEnabled}
              fieldError={errorMessages[RESOURCE_ERROR_MESSAGE_ID] === 'VgMemoryNotEnoughError' ? 'VgMemoryNotEnoughError' : ''}
              min={512}
              onChange={value => _onChange('memoryMB', value)}
              sectionLabel={`${t('memory')} (MB)`}
              shortStyle
              value={memoryMB}
            />
            {ShmFormSpinButton}
            <FormSpinButton
              onChange={value => _onChange('storageGB', value)}
              sectionLabel={`${t('disk')} (GB)`}
              shortStyle
              value={storageGB}
            />
          </>
          :
          <>
            <BasicSection
              iconRef={iconRefSimple}
              onIconClick={() => setIsCalloutShow(true)}
              sectionLabel={`${t('resourceConstraints')}`}
            >
              <ChoiceGroup
                onChange={(e, item) => {
                  setSelectedKey(item.key)
                }}
                options={[{ key: 0, text: t('default') }, { key: 1, text: t('customize') }]}
                selectedKey={selectedKey}
                styles={{
                  flexContainer: {
                    display: 'flex'
                  },
                  root: {
                    selectors: {
                      '& .ms-ChoiceField': {
                        paddingRight: '20px',
                        marginTop: '0px'
                      },
                      '& .ms-ChoiceField-field': {
                        marginBottom: '0px'
                      }
                    }
                  }
                }}
              />
            </BasicSection>
            {
              selectedKey === 0 ?
                <BasicSection>
                  <div>
                    {
                      resourceOptions.map(opt => {
                        if (opt.customized) {
                          if (opt.check) {
                            return (
                              <PrimaryButton
                                key={opt.customized}
                                onClick={() => {
                                  setEditorOpen(true)
                                  setResourceOptions(prev => prev.map(
                                    item => {
                                      if (item.customized) {
                                        return { ...item, check: true }
                                      } else {
                                        return ({ ...item, check: false })
                                      }
                                    }
                                  ))}
                                }
                                styles={ButtonStyles.primary}
                              >
                                {t('customize')}
                              </PrimaryButton>
                            )
                          } else {
                            return (
                              <DefaultButton
                                key={opt.customized}
                                onClick={() => {
                                  setEditorOpen(true)
                                  setResourceOptions(prev => prev.map(
                                    item => {
                                      if (item.customized) {
                                        return { ...item, check: true }
                                      } else {
                                        return ({ ...item, check: false })
                                      }
                                    }
                                  ))}
                                }
                                styles={ButtonStyles.default}
                              >
                                {t('customize')}
                              </DefaultButton>
                            )
                          }
                        } else {
                          if (opt.check) {
                            return (
                              <PrimaryButton
                                key={opt.gpu}
                                onClick={() => setResourceOptions(prev => prev.map(
                                  item => ({ ...item, check: item.gpu === opt.gpu })
                                ))}
                                styles={ButtonStyles.primary}
                              >
                                <span>{opt.gpu} GPU</span>
                                <span>{opt.cpu} CPU</span>
                              </PrimaryButton>
                            )
                          } else {
                            return (
                              <DefaultButton
                                key={opt.gpu}
                                onClick={() => setResourceOptions(prev => prev.map(
                                  item => ({ ...item, check: item.gpu === opt.gpu })
                                ))}
                                styles={ButtonStyles.default}
                              >
                                <span>{opt.gpu} GPU</span>
                                <span>{opt.cpu} CPU</span>
                              </DefaultButton>
                            )
                          }
                        }
                      })
                    }
                  </div>
                </BasicSection>
                :
                <>
                  <FormSpinButton
                    disabled={!isContainerSizeEnabled}
                    fieldError={errorMessages[RESOURCE_ERROR_MESSAGE_ID] === 'VgCpuNotEnoughError' ? 'VgCpuNotEnoughError' : ''}
                    min={1}
                    onChange={value => _onChange('cpu', value < 1 ? 1 : value)}
                    sectionLabel={'CPU'}
                    shortStyle
                    value={cpu}
                  />
                  <FormSpinButton
                    fieldError={errorMessages[RESOURCE_ERROR_MESSAGE_ID] === 'VgGpuNotEnoughError' ? 'VgGpuNotEnoughError' : ''}
                    min={0}
                    onChange={
                      isContainerSizeEnabled
                        ? value => _onChange('gpu', value)
                        : _onGPUSkuChange
                    }
                    sectionLabel={'GPU'}
                    shortStyle
                    value={gpu}
                  />
                </>
            }
            <FormSpinButton
              disabled={!isContainerSizeEnabled}
              fieldError={errorMessages[RESOURCE_ERROR_MESSAGE_ID] === 'VgMemoryNotEnoughError' ? 'VgMemoryNotEnoughError' : ''}
              min={512}
              onChange={value => _onChange('memoryMB', value)}
              sectionLabel={`${t('memory')} (MB)`}
              shortStyle
              value={memoryMB}
            />
            {ShmFormSpinButton}
            <FormSpinButton
              onChange={value => _onChange('storageGB', value)}
              sectionLabel={`${t('disk')} (GB)`}
              shortStyle
              value={storageGB}
            />
          </>
      }
      <AvaliableResource
        gapSpace={0}
        hidden={!isCalloutShow}
        hideOverflow
        isBeakVisible
        onDismiss={() => setIsCalloutShow(false)}
        target={iconRefSimple.current || iconRefPro.current}
      />
    </>
  );
};

ContainerSizeSection.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  isContainerSizeEnabled: PropTypes.bool,
  containerErrorCode: PropTypes.string,
  onEnable: PropTypes.func,
  ShmFormSpinButton: PropTypes.node
};
