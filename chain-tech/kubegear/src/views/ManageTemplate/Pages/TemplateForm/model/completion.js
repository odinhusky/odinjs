import { isNil } from 'lodash';

export class Completion {
  constructor(props) {
    const { minFailedInstances, minSucceededInstances } = props;
    // Create for the first time props is undefined
    this.minFailedInstances = (minFailedInstances === undefined) ? 1 : minFailedInstances;
    this.minSucceededInstances = (minSucceededInstances === undefined) ? 1 : minSucceededInstances;
  }

  static fromProtocol(completionProtocol) {
    if (isNil(completionProtocol)) {
      return new Completion({});
    }

    return new Completion(completionProtocol);
  }

  convertToProtocolFormat() {
    return {
      minFailedInstances: this.minFailedInstances,
      minSucceededInstances: this.minSucceededInstances
    };
  }
}
