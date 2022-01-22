export class JobTemplate {
  constructor(props) {
    const { name, description, publicMode, canReadUsers, canWriteUsers } = props;
    this.name = name || '';
    this.description = description || '';
    this.publicMode = publicMode || 0;
    this.canReadUsers = canReadUsers || [];
    this.canWriteUsers = canWriteUsers || [];
  }
}