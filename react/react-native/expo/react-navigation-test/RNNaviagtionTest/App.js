// ^ Screen related
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// % Components
import Home from './screen/Home'
import Profile from "./screen/Profile"

export default function App() {

  // $ init data
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ tabBarVisible: false }}
        />

        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ tabBarVisible: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
