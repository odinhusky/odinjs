import { Pressable } from 'react-native';

// ^ Plugins
import { AntDesign } from '@expo/vector-icons';
import { get } from 'lodash';

interface BaseIconBtnProps {
  name: string;
  color?: string;
  size?: number;
  onPress?: () => void;
}

export const BaseIconBtn = (props: BaseIconBtnProps) : JSX.Element => {

  // $ init data
  const name = get(props, 'name', 'frowno');
  const color = get(props, 'color', 'black');
  const size = get(props, 'size', 24);
  const onPress = get(props, 'onPress', () => {});

  return (
    <Pressable onPress={onPress}>
      <AntDesign name={name} color={color} size={size}  />
    </Pressable>
  );
}

export default BaseIconBtn;