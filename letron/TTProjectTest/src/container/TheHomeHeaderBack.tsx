import { StyleSheet, View } from 'react-native';

// ? Components
import { BaseIconBtn } from '@/component/BaseIconBtn';

// ? hook
import { useNaviBack } from '@/hook/useNaviBack';

const TheHomeHeader = () : JSX.Element => {

  // $ init data
  const goBack = useNaviBack();
  
  return (
    <View style={styles.header}>
      <BaseIconBtn name="back" onPress={goBack} />
    </View>
  );
}

export default TheHomeHeader;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 60,
    backgroundColor: '#fff',
    padding: 16,
    paddingLeft: 30,
    borderWidth: 1,
    borderColor: 'black',
  }
});
