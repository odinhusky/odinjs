/* eslint-disable react/no-multi-comp */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import BaseTable from 'components/BaseTable';
import { mergeStyles } from 'office-ui-fabric-react';
import { useTranslation } from 'react-i18next';
import InfoBar from './InfoBar';
import PieChart from './PieChart';


const VgList = ({ vgInfo, vgFilterKey }) => {
  const { t } = useTranslation();
  const [computedData, setComputedData] = useState([]);

  useEffect(() => {
    if (vgInfo.length > 0) {
      const summary = vgInfo.reduce((acc, curr) => {
        if (curr.name === 'total') return acc

        const gpuUsed = curr.gpuUsed.reduce((sum, now) => {
          const findData = sum.find(item => item.name === now.name)
          if (!findData) return [...sum, { ...now }]

          return sum.map(item => {
            if (item.name === now.name) return {
              ...item,
              number: Number(now.number) + Number(item.number)
            }

            return { ...item }
          })
        }, acc.gpuUsed)

        return {
          cpuUsed: acc.cpuUsed + Number(curr.cpuUsed),
          memoryUsed: acc.memoryUsed + Number(curr.memoryUsed),
          storageUsed: acc.storageUsed + Number(curr.storageUsed),
          gpuUsed
        }
      }, { cpuUsed: 0, memoryUsed: 0, gpuUsed: [], storageUsed: 0 })

      const filterState = [];
      const filterVgName = [];
      vgFilterKey.forEach(key => {
        if (key.substring(0, 6) === 'state-') {
          filterState.push(key.split('state-')[1])
          return
        }
        if (key.substring(0, 3) === 'vg-') {
          filterVgName.push(key.split('vg-')[1])
          return
        }
      })

      // total資料用其他集群的加總
      let filteredVgInfo = vgInfo.map(item => {
        if (item.name === 'total') {
          return { ...item, ...summary }
        }
        return { ...item }
      })

      filteredVgInfo = filteredVgInfo.filter(vg => {
        let stateCondition = true; // 篩選狀態
        if (filterState.length === 1) { // 狀態全選或沒選就不過濾
          switch (filterState[0]) {
            case 'using':
              stateCondition = vg.gpuUsed.some(item => Number(item.number) !== 0)
              break;
            default:
              stateCondition = !vg.gpuUsed.some(item => Number(item.number) !== 0)
              break;
          }
        }

        return filterVgName.length > 0
          ? stateCondition && filterVgName.includes(vg.name)
          : stateCondition
      })

      setComputedData(filteredVgInfo.sort((a, b) => {
        if (b.name === 'total') return 1
        const calc = (acc, curr) => parseInt(acc) + parseInt(curr.number ? curr.number : 0);
        const aRate = a.gpuUsed.reduce(calc, 0) ? a.gpuUsed.reduce(calc, 0) / a.gpuTotal.reduce(calc, 0) : 0;
        const bRate = b.gpuUsed.reduce(calc, 0) ? b.gpuUsed.reduce(calc, 0) / b.gpuTotal.reduce(calc, 0) : 0;

        return bRate - aRate
      }))
    }
  }, [vgInfo, vgFilterKey])

  const vgColumns = [
    {
      key: 'name',
      name: `${t('group')}${t('enSpace')}${t('name')}`,
      fieldName: 'name',
      minWidth: 100,
      maxWidth: 100,
      isResizable: true,
      onRender(rowData) {
        return <div className={mergeStyles({ display: 'flex', height: '100%', alignItems: 'center', color: '#333', fontSize: 14 })}>
          {rowData.name === 'total' ? t('pool') : rowData.name} </div>;
      }
    },
    {
      key: 'column2',
      name: `GPU ${t('Usage')}`,
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender(rowData) {
        return (
          <div className={mergeStyles({ display: 'flex', height: '100%', alignItems: 'center' })}>
            <PieChart vgData={rowData} />
          </div>);
      }
    },
    {
      key: 'column',
      name: t('detail'),
      minWidth: 200,
      maxWidth: 300,
      isResizable: true,
      onRender(rowData) {
        return (
          <div className={mergeStyles({ display: 'flex', width: '100%', height: '100%', alignItems: 'center' })}>
            <InfoBar vgData={rowData} />
          </div>);
      }
    }

  ];
  return (
    <BaseTable
      columns={vgColumns}
      items={computedData}
    />
  )
};

VgList.propTypes = {
  vgInfo: PropTypes.array,
  vgFilterKey: PropTypes.array
}


export default VgList;
