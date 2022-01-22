import moment from 'moment';

export class JobResources {
  constructor(props) {
    const { modify, step1State, userInfo } = props;

    this.name = step1State.name || '';
    this.users = step1State.user !== undefined ? [step1State.user] : [userInfo.username],
    this.startAt = moment(step1State.startAt).seconds(0).milliseconds(0).valueOf();
    this.endAt = moment(step1State.endAt).seconds(0).milliseconds(0).valueOf();
    this.cpu = step1State.cpu;
    this.memory = step1State.memory;
    this.storage = step1State.storage;
    this.virtualGroup = modify ? null : step1State.virtualGroup;
    this.gpu = step1State.gpu;
    this.jobConfig = null;
  }
}