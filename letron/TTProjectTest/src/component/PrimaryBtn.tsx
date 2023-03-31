import { StyleSheet } from 'react-native';


// % Components
import { BaseBtn } from '@/component/BaseBtn';
import { $primary, $primaryHover } from '@/style/palette';

// ^ Plugin
import { isEmpty } from 'lodash';

// ? Types & Interface
import { BtnStyleProp } from '@/type/btn';

interface PrimaryBtnProps {
  label: string;
  styleObj?: BtnStyleProp | undefined;
  onFocusStyleObj?: BtnStyleProp | undefined;
  onPress?: () => void | undefined;
}

export const PrimaryBtn = ({
  label,
  styleObj = {},
  onFocusStyleObj = {},
  onPress
}: PrimaryBtnProps) : JSX.Element => {

  // = styles
  const defaultPrimaryStyleObj =  {
    container: styles.container,
    label: styles.label,
  };

  const defaultPrimaryOnFocusStyleObj =  {
    container: styles.onFocusContainer
  }

  const resultStyleObj = isEmpty(styleObj) ? defaultPrimaryStyleObj : styleObj;
  const resultOnFocusStyleObj = isEmpty(onFocusStyleObj) ? defaultPrimaryOnFocusStyleObj : onFocusStyleObj;
  
  return (
    <BaseBtn
      label={label}
      styleObj={resultStyleObj}
      onFocusStyleObj={resultOnFocusStyleObj}
      onPress={onPress}
    />
  );
}

export default PrimaryBtn;

const styles = StyleSheet.create({
  container: {
    backgroundColor: $primary
  },

  onFocusContainer: {
    backgroundColor: $primaryHover
  },
  label: {
    color: 'white'
  },
});