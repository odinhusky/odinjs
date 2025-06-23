import { BaseProgressProps } from '@libs/mode2/components/BaseProgress';
import { MissionBoxResult } from '@libs/mode2/external/api/endpoint/mission/PostMissionOngoingEndpoint';

export type MilestoneFnParams = {
  isReached: boolean;
  isNext: boolean;
};

export interface Milestone extends MissionBoxResult {
  value: number;
  renderTop?:
    | React.ReactNode
    | ((params: MilestoneFnParams) => React.ReactNode);
  renderBottom?:
    | React.ReactNode
    | ((params: MilestoneFnParams) => React.ReactNode);
  renderAnchor?:
    | React.ReactNode
    | ((params: MilestoneFnParams) => React.ReactNode);
}

export type BaseProgressRelatedProps = Omit<BaseProgressProps, 'percent'>;

export interface MilestoneProgressProps extends BaseProgressRelatedProps {
  milestones: Milestone[];
  currentValue: number;
  progressBarContainerClass?: string;
}

export default MilestoneProgressProps;
