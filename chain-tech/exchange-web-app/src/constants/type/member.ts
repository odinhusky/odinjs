export interface MemberOption {
  key: number | string;
  text: string;
  isLink: boolean;
  path?: string;
  onClick?: () => void;
}