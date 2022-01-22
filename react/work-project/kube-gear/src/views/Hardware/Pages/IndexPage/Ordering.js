// import {getModified, getDuration, getStatusIndex} from './utils';

export default class Ordering {
  /**
   * @param {"username" | "nodename" | "virtualGroups" | "jobLifeHour"  | "state" | undefined} field
   * @param {boolean | undefined} descending
   */
  constructor(field, descending = false) {
    this.field = field;
    this.descending = descending;
  }

  apply(userInfos) {
    const { field, descending } = this;

    let comparator;
    if (field == null) {
      return userInfos;
    }


    function ip2int(ip) {
      return ip.split('.').reduce((ipInt, octet) => (ipInt << 8) + parseInt(octet, 10), 0) >>> 0;
    }

    if (field === 'address') {
      comparator = descending
        ? (a, b) => ip2int(b.ipAddress) - ip2int(a.ipAddress)
        : (a, b) => ip2int(a.ipAddress) - ip2int(b.ipAddress);
    } else if (field === 'nodename') {
      comparator = descending
        ? (a, b) => String(b.nodename).localeCompare(a.nodename)
        : (a, b) => String(a.nodename).localeCompare(b.nodename);
    } else if (field === 'cpuPercentage') {
      comparator = descending
        ? (a, b) => b.cpuPercentage - a.cpuPercentage
        : (a, b) => a.cpuPercentage - b.cpuPercentage;
    } else if (field === 'cpuMemoPercentage') {
      comparator = descending
        ? (a, b) => b.cpuMemoPercentage - a.cpuMemoPercentage
        : (a, b) => a.cpuMemoPercentage - b.cpuMemoPercentage;
    } else if (field === 'gpuMemoUsedPercentage') {
      comparator = descending
        ? (a, b) => b.gpuMemoUsedPercentage - a.gpuMemoUsedPercentage
        : (a, b) => a.gpuMemoUsedPercentage - b.gpuMemoUsedPercentage;
    } else if (field === 'gpuMemoPercentage') {
      comparator = descending
        ? (a, b) => b.gpuMemoPercentage - a.gpuMemoPercentage
        : (a, b) => a.gpuMemoPercentage - b.gpuMemoPercentage;
    } else if (field === 'diskPercentage') {
      comparator = descending
        ? (a, b) => b.diskPercentage - a.diskPercentage
        : (a, b) => a.diskPercentage - b.diskPercentage;
    } else if (field === 'ethPercentage') {
      comparator = descending
        ? (a, b) => b.ethPercentage - a.ethPercentage
        : (a, b) => a.ethPercentage - b.ethPercentage;
    }

    return userInfos.slice().sort(comparator);
  }
}
