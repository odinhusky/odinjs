import { Pressable, Text, StyleSheet } from 'react-native';

// % hook
import { useToggle } from '@/hook/useToggle'

// ^ Plugins
import { get } from 'lodash';

// ? Types & Interface
import { BtnStyleProp } from '@/type/btn';

interface BaseBtnProps {
  label: string;
  styleObj?: BtnStyleProp | undefined;
  onFocusStyleObj?: BtnStyleProp | undefined;
  onPress?: () => void | undefined;
}

export const BaseBtn = ({
  label,
  styleObj = {},
  onPress
}: BaseBtnProps) : JSX.Element => {

  // # state
  const [isFocus, setFocusOrToggle] = useToggle(false);

  // = styles
  const containerStyle = get(styleObj, 'container', {});
  const labelStyle = get(styleObj, 'label', {});

  const onFocusContainerStyle = get(styleObj, 'container', {});
  const onFocusLabelStyle = get(styleObj, 'label', {});

  // - methods
  const handlePressIn = () => { setFocusOrToggle(true) }
  const handlePressOut = () => { setFocusOrToggle(false) }

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={[
        styles.defaultPressable,
        containerStyle,
        isFocus ? onFocusContainerStyle : {}
      ]}
    >
      <Text style={[
        styles.defaultLabel,
        labelStyle,
        isFocus ? onFocusLabelStyle : {}
      ]}>
        { label }
      </Text>
    </Pressable>
  );
}

export default BaseBtn;

const styles = StyleSheet.create({
  defaultPressable: {
    minWidth: 160,
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  defaultLabel: {
    width: '100%',
    fontSize: 16,
    color: 'black'
  }
});