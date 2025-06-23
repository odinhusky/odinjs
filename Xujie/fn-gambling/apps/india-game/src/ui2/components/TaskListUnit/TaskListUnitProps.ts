import { AnnouncementType } from '@libs/mode2/@types/announcementType';
import { MissionResult } from '@libs/mode2/external/api/endpoint/mission/PostMissionOngoingEndpoint';

export interface TaskListUnitProps {
  className?: string;
  item: MissionResult;
  type: AnnouncementType;
  isModal?: boolean;
}

export interface TaskListUnitAction {
  onClaim?: () => void;
  onGoTo?: () => void;
  onMore?: () => void;
}
