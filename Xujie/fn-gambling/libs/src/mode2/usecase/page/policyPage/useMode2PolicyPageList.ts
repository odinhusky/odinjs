import {
  IPolicyListType,
  useMode2PolicyPageListStore,
} from '@mode2/zustand/page/policyPageStore';
import { useDeepEffect } from '@libs/commonUtils';

export const useMode2PolicyPageList = () => {
  const setPolicyList = useMode2PolicyPageListStore(
    (state) => state.setPolicyList
  );
  useDeepEffect(() => {
    const policyList: IPolicyListType[] = [
      {
        i18nTitleKey: 'privacy_policy_content_last_updated',
        i18nContentKey: 'privacy_policy_game_launch_general',
        i18nItemKeys: [],
      },
      {
        i18nTitleKey: 'privacy_policy_information_collection_title',
        i18nContentKey: 'privacy_policy_information_collection_content',
        i18nItemKeys: [
          'privacy_policy_information_collection_content_1',
          'privacy_policy_information_collection_content_2',
          'privacy_policy_information_collection_content_3',
          'privacy_policy_information_collection_content_4',
        ],
      },
      {
        i18nTitleKey: 'privacy_policy_use_of_information_title',
        i18nContentKey: 'privacy_policy_use_of_information_content',
        i18nItemKeys: [
          'privacy_policy_use_of_information_content_1',
          'privacy_policy_use_of_information_content_2',
          'privacy_policy_use_of_information_content_3',
          'privacy_policy_use_of_information_content_4',
          'privacy_policy_use_of_information_content_5',
        ],
      },
      {
        i18nTitleKey: 'privacy_policy_data_protection_title',
        i18nContentKey: 'privacy_policy_data_protection_content',
        i18nItemKeys: [],
      },
      {
        i18nTitleKey: 'privacy_policy_third_party_sharing_title',
        i18nContentKey: 'privacy_policy_third_party_sharing_content',
        i18nItemKeys: [],
      },
      {
        i18nTitleKey: 'privacy_policy_legal_compliance_title',
        i18nContentKey: 'privacy_policy_legal_compliance_content',
        i18nItemKeys: [],
      },
      {
        i18nTitleKey: 'privacy_policy_childrens_policy_title',
        i18nContentKey: 'privacy_policy_childrens_policy_content',
        i18nItemKeys: [],
      },
      {
        i18nTitleKey: 'privacy_policy_update_notice_title',
        i18nContentKey: 'privacy_policy_update_notice_content',
        i18nItemKeys: [],
      },
      {
        i18nTitleKey: 'privacy_policy_contact_us_title',
        i18nContentKey: 'privacy_policy_contact_us_content',
        i18nItemKeys: [],
      },
      {
        i18nTitleKey: 'privacy_policy_conclusion_conclusion',
        i18nContentKey: 'privacy_policy_conclusion_by_accessing_and_using',
        i18nItemKeys: [],
      },
    ];
    setPolicyList(policyList);
  }, []);
};
export default useMode2PolicyPageList;
