import { StyleSheet, Text, View, Button } from 'react-native';

// ? Types & Interface
import { HomeScreenProps } from '@/type/route'

// % Components
import TheHomeHeader from '@/container/TheHomeHeader';
import BaseSafeView from 'component/BaseView';

const Home = (props: HomeScreenProps) : JSX.Element => {

  // $ init data
  const { navigation } = props;
  const { navigate } = navigation;
  
  return (
    <BaseSafeView style={styles.homeContainer}>
      <TheHomeHeader />
      <Text>Home Screen</Text>

      <Button title="點我去Login" onPress={() => navigate('Login')} />
    </BaseSafeView>
  );
}

export default Home;

const styles = StyleSheet.create({
  homeContainer: {
    width: '100%',
    borderWidth: 3,
    borderColor: 'red',
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
});
