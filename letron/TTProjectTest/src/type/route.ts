import { ComponentType } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type ScreenUnit = {
  key: string | number,
  name: any,
  component: ComponentType<any>
};

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
}

export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>