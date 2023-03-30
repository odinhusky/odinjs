import { StyleSheet } from 'react-native';

// ? Types & Interface
import { RootStackParamList } from '@/type/route';

// ? Route
import screenList from '@/route';

// ^ Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// ^ Plugins
import { isNil, isEmpty } from 'lodash';

const App = () : JSX.Element => {

  // $ init data
  const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();

  return (
    <NavigationContainer>
      <Navigator screenOptions={{ headerShown: false }}>
        {
          !isNil(screenList) && !isEmpty(screenList) ? (
            screenList.map(item => (
            <Screen { ...item } />
          ))
          ) : null
        }
      </Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
