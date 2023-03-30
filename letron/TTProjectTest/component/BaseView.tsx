import { ReactNode } from 'react';
import {StyleSheet, Platform, SafeAreaView, View} from 'react-native';

interface BaseSafeViewProps {
  children?: ReactNode;
  style?: object;
}

export const BaseSafeView = ({children, style, ...props}: BaseSafeViewProps): JSX.Element  => (
  Platform.OS === 'ios'
    ? <SafeAreaView children={children} style={[style]} {...props} />
    : <View children={children} style={[styles.defaultTopSpacing, style]} {...props} />
);

export default BaseSafeView;

const styles = StyleSheet.create({
  defaultTopSpacing: {
    marginTop: 40
  },
});