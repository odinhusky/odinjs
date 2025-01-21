import Progress from 'antd/es/progress';
import { useTranslation } from 'react-i18next';
export interface LvInfoProps {
  curLv: number;
  maxLv: number;
  percent: number;
}

export const LvInfo = ({ curLv, maxLv, percent }: LvInfoProps) => {
  const { t } = useTranslation();

  return (
    <div className="absolute flex flex-col gap-1 bottom-[8px] left-0 right-0 text-sm font-medium bgi-text-[var(--grayscale-100)] w-full font-semibold text-xs mobile:text-sm px-3 mobile:px-4">
      <div>{t('activity_VIP_cards_deposit_amount')}</div>
      <div className="flex flex-row font-semibold gap-2">
        <div>V{curLv}</div>
        <Progress
          className="vip-level-progress"
          percent={percent}
          showInfo={false}
        />
        <div>{curLv >= maxLv ? 'Max' : 'V' + (curLv + 1)}</div>
      </div>
    </div>
  );
};

export default LvInfo;
