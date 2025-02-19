interface IProps {
  text?: string;
  styles?: Partial<Record<'container' | 'img', string>>;
}

export const NoData = (props: IProps) => {
  return null;
};

export default NoData;
