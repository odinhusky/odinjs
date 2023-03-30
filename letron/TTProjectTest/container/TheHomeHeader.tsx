import { StyleSheet, View } from 'react-native';

// ? Components
import { BaseImg } from 'component/BaseImg';


// ? hook
import { useNaviBack } from '@/hook/useNaviBack';

const TheHomeHeader = () : JSX.Element => {

  // $ init data
  const goBack = useNaviBack();

  const img = require('@/img/logo.png');
  
  return (
    <View style={styles.header}>
      <View>
        <BaseImg style={styles.img} src={img} />
      </View>
      {/* <BaseIconBtn name="back" onPress={goBack} /> */}
    </View>
  );
}

export default TheHomeHeader;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 60,
    backgroundColor: '#fff',
    padding: 8,
    paddingLeft: 30,
    borderWidth: 1,
    borderColor: 'black',
  },
  img: {
    width: 80,
    height: 80
  }
});
