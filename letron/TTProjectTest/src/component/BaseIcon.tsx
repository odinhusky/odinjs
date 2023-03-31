// ^ Plugins
import { AntDesign } from '@expo/vector-icons';
import { get } from 'lodash';

interface BaseIconProps {
  name: string;
  color?: string | undefined;
  size?: number | undefined;
}

export const BaseIcon = (props: BaseIconProps) : JSX.Element => {

  // $ init data
  const name = get(props, 'name', 'frowno');
  const color = get(props, 'color', 'black');
  const size = get(props, 'size', 24);

  return (
    <AntDesign name={name} color={color} size={size}  />
  );
}

export default BaseIcon;