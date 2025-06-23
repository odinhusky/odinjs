import { ICommand } from '@libs/design/commandPattern/ICommand';
import { AnnouncementType } from '@mode2/@types/announcementType';

export enum SocketNotice {
  GLOBAL_NOTICE,
}

export enum SourceFrom {
  WEB_SOCKET = 'WEB_SOCKET',
  ANNOUNCEMENTS = 'ANNOUNCEMENTS',
  IMMEDIATE = 'IMMEDIATE',
}

export type AdModelCommandType = AnnouncementType | SocketNotice;

interface HallAdModelCommandProps {
  uniqueId: string; // 有就給，沒有就生成一組uuid
  orderId: number;
  parameter?: string;
  type: AdModelCommandType;
  from: SourceFrom;
  onShowAction: (uniqueId: string, type: AdModelCommandType) => void;
}

export class HallAdModelCommand implements ICommand {
  uniqueId: string;
  from: SourceFrom;
  private props: HallAdModelCommandProps;

  constructor(props: HallAdModelCommandProps) {
    this.uniqueId = props.uniqueId;
    this.from = props.from;
    this.props = props;
  }

  execute(): void {
    this.props.onShowAction(this.uniqueId, this.props.type);
  }
}
