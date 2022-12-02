import { isEmpty, get } from 'lodash';
export const VIRTUAL_CLUSTER_DEFAULT_VALUE = '';

export class JobBasicInfo {
  constructor(props) {
    const { name, jobRetryCount, virtualCluster } = props;
    this.name = name || '';
    this.jobRetryCount = jobRetryCount || 0;
    this.virtualCluster = virtualCluster || '';
  }

  static fromProtocol(protocol) {
    const { name, jobRetryCount } = protocol;
    const virtualCluster = get(protocol, 'extras.virtualGroup', VIRTUAL_CLUSTER_DEFAULT_VALUE);
    return new JobBasicInfo({
      name: name,
      jobRetryCount: jobRetryCount,
      virtualCluster: virtualCluster
    });
  }

  getDefaults() {
    if (isEmpty(this.virtualCluster)) {
      return '';
    }

    return {
      virtualCluster: this.virtualCluster
    };
  }

  convertToProtocolFormat() {
    return {
      protocolVersion: 2,
      name: this.name,
      type: 'job',
      jobRetryCount: this.jobRetryCount
    };
  }
}
