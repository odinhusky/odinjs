import Modal from '@libs/mode2/components/Modal';
import { useTeamDataDetailModalStore } from '@libs/mode2/zustand/components/teamDataDetailModalStore';
import { TeamDataDetailListContent } from './components/TeamDataDetailListContent';
import { TeamDataDetailTitle } from './components/TeamDataDetailTitle';
import { useTeamDataDetailModalBase } from '@/ui/hooks/components/teamDataDetailModal/useTeamDataDetailModalBase';

export const TeamDataDetailModal = () => {
  useTeamDataDetailModalBase();
  const visible = useTeamDataDetailModalStore(
    (state) => state.teamDataDetailModalVisible
  );
  return visible ? (
    <Modal>
      <div className="mobile:max-w-[540px] max-w-none w-full mobile:px-0 px-4">
        <div
          className="text-[var(--grayscale-100)] bg-[var(--grayscale-100)] rounded-lg
            shadow-[4px_4px_8px_0px_#00000080] overflow-hidden"
        >
          <TeamDataDetailTitle />
          <TeamDataDetailListContent />
        </div>
      </div>
    </Modal>
  ) : null;
};

export default TeamDataDetailModal;
