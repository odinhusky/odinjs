import {
  ParamListBase,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';

export const useNaviBack = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  return () => { navigation.goBack() };
}

export default useNaviBack;