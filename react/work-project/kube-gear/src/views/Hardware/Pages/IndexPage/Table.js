/* eslint-disable react/no-multi-comp */
import React, { useContext, useEffect, useState } from 'react';
import BaseTable from 'components/BaseTable';
import BaseLink from 'components/BaseLink';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import Ordering from './Ordering';
import { CommandBarButton } from 'components/BaseButton';
import ConfirmModal from 'components/ConfirmModal';

import Context from './Context';
import { Stack } from 'office-ui-fabric-react';

import { useTranslation } from 'react-i18next';
import { shutdownNode, rebootNode } from 'utils/api';
import { toast } from 'react-toastify';

export default function Table() {
  const { t } = useTranslation();
  const {
    filterHarewareInfoList,
    ordering,
    setOrdering,
    isLoading,
    reloadData
  } = useContext(Context);

  const [isConfirmModalShow, setIsConfirmModalShow] = useState(false);
  const [modalData, setModalData] = useState({});

  function toPercent(point) {
    const number = Number(point);
    return isNaN(number) ? 'N/A' : number.toFixed(0) + '%';
  }

  function circleStyle(point) {
    const percent = Number(point).toFixed(2);
    if (percent < 60) {
      return { color: 'hsl(120, 100%, 40%)', display: 'flex', alignItems: 'center' };
    } else if (percent >= 60 && percent < 80) {
      return { color: 'hsl(35, 100%, 50%)', display: 'flex', alignItems: 'center' };
    } else if (percent >= 80) {
      return { color: 'hsl(0, 100%, 45%)', display: 'flex', alignItems: 'center' };
    }
    return { display: 'none', backgroundColor: '#A19F9D' };
  }

  /**
   * @param {React.MouseEvent<HTMLElement>} event
   * @param {import('office-ui-fabric-react').IColumn} column
   */

  function onColumnClick(event, column) {
    const { field, descending } = ordering;
    if (field === column.key) {
      if (descending) {
        setOrdering(new Ordering());
      } else {
        setOrdering(new Ordering(field, true));
      }
    } else {
      setOrdering(new Ordering(column.key));
    }
  }

  /**
   * @param {import('office-ui-fabric-react').IColumn} column
   */

  function applySortProps(column) {
    column.isSorted = ordering.field === column.key;
    column.isSortedDescending = ordering.descending;
    column.onColumnClick = onColumnClick;
    return column;
  }

  const addressColumn = applySortProps({
    key: 'address',
    name: 'IP',
    fieldName: 'address',
    minWidth: 150,
    maxWidth: 150,
    isResizable: true,
    onRender: HardwareInfoList => {
      return (
        HardwareInfoList.ipAddress !== undefined
          ? <Label>
            <BaseLink
              to={`/cluster-report?tab=singleNode&instance=${HardwareInfoList.ipAddress}`}
            >
              {HardwareInfoList.ipAddress}
            </BaseLink>
          </Label>
          :
          <Spinner size={SpinnerSize.medium} />
      );
    }
  });

  const nodenameColumn = applySortProps({
    key: 'nodename',
    name: `${t('machine')}${t('enSpace')}${t('name')}`,
    fieldName: 'nodename',
    minWidth: 100,
    maxWidth: 100,
    isResizable: true,
    onRender: HardwareInfoList => {
      return (
        HardwareInfoList.nodename !== undefined
          ? <Label>
            {HardwareInfoList.nodename}
          </Label>
          :
          <Spinner size={SpinnerSize.medium} />
      );
    }
  });

  const cpuPercentageColumn = applySortProps({
    key: 'cpuPercentage',
    name: t('CPU'),
    fieldName: 'cpuPercentage',
    minWidth: 100,
    maxWidth: 100,
    isResizable: true,
    onRender: HardwareInfoList => {
      const percent = toPercent(HardwareInfoList.cpuPercentage);
      const style = circleStyle(HardwareInfoList.cpuPercentage);
      const labelStyle = percent === 'N/A' ? { root: { color: '#8A8886' } } : {};

      if (HardwareInfoList.state !== 'RUNNING')
        return (<Label styles={{ root: { color: '#8A8886' } }}>N/A</Label>)

      return (
        <Stack horizontalAlign="flex-start">
          <Stack.Item>
            {HardwareInfoList.cpuPercentage !== undefined
              ? <Stack horizontal>
                <Icon
                  aria-hidden="true"
                  iconName={'LocationFill'}
                  style={style}
                  // title={'LocationFill'}
                />
                &nbsp;
                <Label styles={labelStyle}>
                  {percent}
                </Label>
              </Stack>
              :
              <Spinner size={SpinnerSize.medium} />}
          </Stack.Item>
        </Stack>
      );
    }
  });

  const cpuMemoPercentageColumn = applySortProps({
    key: 'cpuMemoPercentage',
    name: t('memory'),
    fieldName: 'cpuMemoPercentage',
    minWidth: 100,
    maxWidth: 100,
    isResizable: true,
    onRender: HardwareInfoList => {
      const percent = toPercent(HardwareInfoList.cpuMemoPercentage);
      const style = circleStyle(HardwareInfoList.cpuMemoPercentage);
      const labelStyle = percent === 'N/A' ? { root: { color: '#8A8886' } } : {};

      if (HardwareInfoList.state !== 'RUNNING')
        return (<Label styles={{ root: { color: '#8A8886' } }}>N/A</Label>)

      return (
        <Stack horizontalAlign="flex-start">
          <Stack.Item>
            {HardwareInfoList.cpuMemoPercentage !== undefined
              ? <Stack horizontal>
                <Icon
                  aria-hidden="true"
                  iconName={'LocationFill'}
                  style={style}
                  // title={'LocationFill'}
                />
                &nbsp;
                <Label styles={labelStyle}>
                  {percent}
                </Label>
              </Stack>
              :
              <Stack>
                <Spinner size={SpinnerSize.medium} />
              </Stack>}
          </Stack.Item>
        </Stack>
      );
    }
  });

  const storageUsedColumn = applySortProps({
    key: 'storageUsed',
    name: t('VGA'),
    fieldName: 'storageUsed',
    minWidth: 100,
    maxWidth: 100,
    isResizable: true,
    onRender: HardwareInfoList => {
      const percent = toPercent(HardwareInfoList.gpuMemoPercentage);
      const style = circleStyle(HardwareInfoList.gpuMemoPercentage);
      const labelStyle = percent === 'N/A' ? { root: { color: '#8A8886' } } : {};

      if (HardwareInfoList.state !== 'RUNNING')
        return (<Label styles={{ root: { color: '#8A8886' } }}>N/A</Label>)

      return (
        <Stack horizontalAlign="flex-start">
          <Stack.Item>
            {HardwareInfoList.gpuMemoPercentage !== undefined
              ? <Stack horizontal>
                <Icon
                  aria-hidden="true"
                  iconName={'LocationFill'}
                  style={style}
                  // title={'LocationFill'}
                />
                &nbsp;
                <Label styles={labelStyle}>
                  {percent}
                </Label>
              </Stack>
              :
              <Spinner size={SpinnerSize.medium} />}
          </Stack.Item>
        </Stack>
      );
    }
  });

  const storageTotalColumn = applySortProps({
    key: 'storageTotal',
    name: t('VGAMemory'),
    fieldName: 'storageTotal',
    minWidth: 100,
    maxWidth: 100,
    isResizable: true,
    onRender: HardwareInfoList => {
      const percent = toPercent(HardwareInfoList.gpuMemoUsedPercentage);
      const style = circleStyle(HardwareInfoList.gpuMemoUsedPercentage);
      const labelStyle = percent === 'N/A' ? { root: { color: '#8A8886' } } : {};

      if (HardwareInfoList.state !== 'RUNNING')
        return (<Label styles={{ root: { color: '#8A8886' } }}>N/A</Label>)

      return (
        <Stack horizontalAlign="flex-start">
          <Stack.Item>
            {HardwareInfoList.gpuMemoUsedPercentage !== undefined
              ? <Stack horizontal>
                <Icon
                  aria-hidden="true"
                  iconName={'LocationFill'}
                  style={style}
                  // title={'LocationFill'}
                />
                &nbsp;
                <Label styles={labelStyle}>
                  {percent}
                </Label>
              </Stack>
              :
              <Spinner size={SpinnerSize.medium} />}
          </Stack.Item>
        </Stack>
      );
    }
  });

  const diskPercentageColumn = applySortProps({
    key: 'diskPercentage',
    name: t('disk'),
    fieldName: 'diskPercentage',
    minWidth: 100,
    maxWidth: 100,
    isResizable: true,
    onRender: HardwareInfoList => {
      const percent = toPercent(HardwareInfoList.diskPercentage);
      const style = circleStyle(HardwareInfoList.diskPercentage);
      const labelStyle = percent === 'N/A' ? { root: { color: '#8A8886' } } : {};

      if (HardwareInfoList.state !== 'RUNNING')
        return (<Label styles={{ root: { color: '#8A8886' } }}>N/A</Label>)

      return (
        <Stack horizontalAlign="flex-start">
          <Stack.Item>
            {HardwareInfoList.diskPercentage !== undefined
              ? <Stack horizontal>
                <Icon
                  aria-hidden="true"
                  iconName={'LocationFill'}
                  style={style}
                  // title={'LocationFill'}
                />
                &nbsp;
                <Label styles={labelStyle}>
                  {percent}
                </Label>
              </Stack>
              :
              <Spinner size={SpinnerSize.medium} />}
          </Stack.Item>
        </Stack>
      );
    }
  });

  const ethPercentageColumn = applySortProps({
    key: 'ethPercentage',
    name: t('ethernet'),
    fieldName: 'ethPercentage',
    minWidth: 100,
    maxWidth: 100,
    isResizable: true,
    onRender: HardwareInfoList => {
      const percent = toPercent(HardwareInfoList.ethPercentage);
      const style = circleStyle(HardwareInfoList.ethPercentage);
      const labelStyle = percent === 'N/A' ? { root: { color: '#8A8886' } } : {};

      if (HardwareInfoList.state !== 'RUNNING')
        return (<Label styles={{ root: { color: '#8A8886' } }}>N/A</Label>)

      return (
        <Stack horizontalAlign="flex-start">
          <Stack.Item>
            {HardwareInfoList.ethPercentage !== undefined
              ? <Stack horizontal>
                <Icon
                  aria-hidden="true"
                  iconName={'LocationFill'}
                  style={style}
                  // title={'LocationFill'}
                />
                &nbsp;
                <Label styles={labelStyle}>
                  {percent}
                </Label>
              </Stack>
              :
              <Spinner size={SpinnerSize.medium} />}
          </Stack.Item>
        </Stack>
      );
    }
  });

  const stateColumn = applySortProps({
    key: 'state',
    name: t('status'),
    fieldName: 'state',
    minWidth: 100,
    maxWidth: 100,
    isResizable: true,
    onRender: info => {
      const isRunning = info.state === 'RUNNING'
      const style = {
        background: isRunning ? '#D6F8C5' : '#B1B5B8',
        color: isRunning ? '#3C8027' : '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100px',
        padding: '10px'
      }
      return (
        <div style={style}>
          {isRunning ? t('online') : t('offline')}
        </div>
      );
    }
  });

  const actionColumn = {
    key: 'action',
    name: t('Operations'),
    fieldName: 'action',
    minWidth: 100,
    maxWidth: 100,
    isResizable: true,
    onRender: info => {
      if (info.state !== 'RUNNING') return
      return (
        <CommandBarButton
          iconProps={{
            iconName: 'RepeatAll'
          }}
          menuProps={{
            items: [
              {
                key: 'shutdown',
                text: t('shutdown'),
                iconProps: { iconName: 'PowerButton', styles: { root: { color: '#333333' } } },
                onClick() {
                  setModalData({
                    title: t('shutdown'),
                    confrimText: t('shutdown'),
                    content: t('sureShutdownNode', { name: info.ipAddress }),
                    method: () => {
                      shutdownNode({
                        ip: info.ipAddress
                      })
                        .then(() => {
                          toast.success('Success')
                          reloadData();
                        })
                        .catch(err => {
                          const msg = err.data ? err.data.message : err.toString();
                          toast.error(msg);
                        })
                    }
                  })
                  setIsConfirmModalShow(true)
                }
              }
            ]
          }}
          onClick={
            () => {
              setModalData({
                title: t('reboot'),
                confrimText: t('reboot'),
                content: t('sureRebootNode', { name: info.ipAddress }),
                method: () => {
                  rebootNode({
                    ip: info.ipAddress
                  })
                    .then(() => {
                      toast.success('Success')
                      reloadData();
                    })
                    .catch(err => {
                      const msg = err.data ? err.data.message : err.toString();
                      toast.error(msg);
                    })
                }
              })
              setIsConfirmModalShow(true)
            }}
          split
          text={t('reboot')}
        />
      );
    }
  };

  const columns = [
    addressColumn,
    nodenameColumn,
    cpuPercentageColumn,
    cpuMemoPercentageColumn,
    storageUsedColumn,
    storageTotalColumn,
    diskPercentageColumn,
    ethPercentageColumn,
    stateColumn,
    actionColumn
  ];

  useEffect(() => {
    onColumnClick(event, addressColumn);
  }, []);

  return (
    <>
      <BaseTable
        columns={columns}
        enableShimmer={isLoading}
        items={filterHarewareInfoList}
        setKey="key"
      />
      {
        isConfirmModalShow &&
        <ConfirmModal
          confrimText={modalData.confrimText}
          content={modalData.content}
          isOpen={isConfirmModalShow}
          onClose={() => setIsConfirmModalShow(false)}
          onConfirm={modalData.method}
          title={modalData.title}
        />
      }
    </>
  );
}
