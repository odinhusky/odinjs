import { useMode2PolicyPageListStore } from '@libs/mode2/zustand/page/policyPageStore';
import { useTranslation } from 'react-i18next';

const PolicyPageContent = () => {
  const { t } = useTranslation();
  const policyList = useMode2PolicyPageListStore((state) => state.policyList);
  return (
    <div className="text-[var(--grayscale-100)] tablet:pb-16 mobile:pb-10 pb-6">
      <div
        className="bgi-text-[var(--state-warn-main)] text-center
            mobile:text-2xl text-xl 
            mobile:font-bold font-medium
            mobile:my-5 mt-3 mb-6"
      >
        {t('privacy_policy_game_launch_platform')}
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {policyList.map((item, index) => {
          return (
            <div key={index} className="group">
              <div
                className="group-first:bgi-text-[var(--grayscale-100)] font-medium group-first:mobile:text-base group-first:text-sm
                    bgi-text-[var(--state-warn-main)] mobile:text-lg text-base"
              >
                {t(item.i18nTitleKey)}
              </div>
              <div className="font-normal mobile:text-base text-sm mt-3">
                {t(item.i18nContentKey)}
              </div>
              <ul className="font-normal mobile:text-base text-sm pl-7 mt-3 list-disc">
                {item.i18nItemKeys.length > 0 &&
                  item.i18nItemKeys.map((item, i) => {
                    return (
                      <li key={index + '_' + i} className="first:mt-0 mt-1">
                        {t(item)}
                      </li>
                    );
                  })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default PolicyPageContent;
