import {
  ParamListBase,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';

export const useNaviTo = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const useNaviToPage = (toPage: string) => {
    navigation.navigate(toPage);
  };

  return useNaviToPage;
}

export default useNaviTo;