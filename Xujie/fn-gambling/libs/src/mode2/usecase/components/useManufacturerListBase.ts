import { useFooterStore } from '@mode2/zustand/components/footerStore';
import { useDeepEffect } from '@libs/commonUtils';
import isEmpty from 'lodash/isEmpty';

export const useManufacturerListBase = () => {
  const setManufacturerList = useFooterStore(
    (state) => state.setManufacturerList
  );

  const manufacturerList = useFooterStore((state) => state.manufacturerList);

  const manufacturerListData = [
    'logo_evolution',
    'logo_spribe',
    'logo_jili',
    'logo_turbo_games',
    'logo_alize',
    'logo_jdb',
    'logo_asia_gaming',
    'logo_playtech',
    'logo_one_touch',
    'logo_cq9',
    'logo_ygr',
    'logo_avivator',
    'logo_evoplay',
    'logo_hacksaw',
    'logo_ezugi',
    'logo_kerala',
    'logo_wm',
    'logo_rela',
    'logo_aviatrix',
    'logo_quick_spin',
    'logo_red_tiger',
    'logo_playn_go',
    'logo_pg',
    'logo_wg',
    'logo_big_time_gaming',
    'logo_pragmatic_play',
    'logo_kingmidas',
    'logo_nolimit',
    'logo_winfinity',
    'logo_yeebet',
    'logo_spinix',
    'logo_smartsoft',
    'logo_skywind',
  ];

  // 非變動靜態資源， setState一次就好
  useDeepEffect(() => {
    if (isEmpty(manufacturerList)) {
      setManufacturerList(manufacturerListData);
    }
  }, [manufacturerList]);
};
