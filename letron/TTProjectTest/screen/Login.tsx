import { StyleSheet, Text, View, Button } from 'react-native';

// ? Types & Interface
import { LoginScreenProps } from '@/type/route'

// ^ Navigation
import { useNavigation } from '@react-navigation/native';

const Login = (props: LoginScreenProps) : JSX.Element => {

  // $ init data
  // const { navigation } = props;
  // const { navigate } = navigation;

  const navigation = useNavigation<LoginScreenProps['navigation']>();

  const toPage = 'Home';
  
  const handleNavigate = () => {
    navigation.navigate(toPage)
  }

  return (
    <View style={styles.container}>
      <Text>Login Screen</Text>

      <Button title="點我去Home" onPress={handleNavigate} />
    </View>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
