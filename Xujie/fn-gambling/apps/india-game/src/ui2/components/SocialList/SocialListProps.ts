import {
  SocialInfo,
  SocialScenarios,
  SocialUnitImageType,
} from '@mode2/zustand/components/socialListStore';

export default interface SocialListProps {
  scenarios: SocialScenarios;
  className?: string;
  iconClassName?: string;
  classNameLabel?: string;
  classNameUnit?: string;
  isShowLabelFromProps?: boolean;
  iconOuterClassName?: string;
  classNameUnitBox?: string;
  isShowLabel?: boolean; // 顯示文本
  srcType?: SocialUnitImageType; // 圖片類型 [彩色 ｜ 透明icon | 實心icon]
  children?: React.ReactNode; //
  extraList?: SocialInfo[]; // 額外新增的不屬於社交列表的部分，案例在[mode3]SharePage頁
}
