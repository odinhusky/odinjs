import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import ModalScreen from 'screens/ModalScreen';
import NotFoundScreen from 'screens/NotFoundScreen';
import { RootStackParamList } from 'common/types';
import Member from "screens/home/Member";
import Register from "screens/home/Register";
import EmailVerify from "screens/home/EmailVerify";
import Setting from "screens/home/Setting";
import PhoneVerify from "screens/home/PhoneVerify";
import PhoneInput from "screens/home/PhoneInput";
import GoogleVerifyStep1 from "screens/home/GoogleVerifyStep1";
import GoogleVerifyStep2 from "screens/home/GoogleVerifyStep2";
import GoogleVerifyStep3 from "screens/home/GoogleVerifyStep3";
import FundPassword from "screens/home/FundPassword";
import ResetFundPassword from "screens/home/ResetFundPassword";
import IdentityVerifyStep1 from "screens/home/IdentityVerifyStep1";
import IdentityVerifyStep2 from "screens/home/IdentityVerifyStep2";
import Payments from 'screens/home/Payments';
import PaymentsCreate from 'screens/home/PaymentsCreate';
import Advertisement from 'screens/home/Advertisement';
import AdvertisementEdit from 'screens/home/AdvertisementEdit';
import C2cCreateScreen from 'screens/c2c/C2cCreate';
import Web from "screens/home/Web";
import Consult from "screens/home/Consult";
import C2c from "screens/home/C2c";
import C2cMember from "screens/home/C2cMember";
import C2cApply from "screens/home/C2cApply";
import C2cNotification from "screens/home/C2cNotification";
import C2cHelp from "screens/home/C2cHelp";
import EditName from "screens/home/EditName";
import Rebate from "screens/home/Rebate";
import ForgotPassword from "screens/home/ForgotPassword";
import ResetPassword from "screens/home/ResetPassword";
import ResetGoogle from "screens/home/ResetGoogle";
import Announcement from "screens/home/Announcement";
import AnnouncementDetail from "screens/home/AnnouncementDetail";
import AllLanguage from "screens/home/AllLanguage";
import HelpCenter from "screens/home/HelpCenter";
import HelpCenterEn from "screens/home/HelpCenterEn";
import HelpDetail from "screens/home/HelpDetail";
import BottomTabNavigator from "./BottomTabNavigator"

import RechargeScreen from "screens/wallet/Recharge";
import HomeScreen from "screens/home/Home";
import Login from "screens/home/Login";

 const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  //  const {order:context} = useContext(Context)
   
  //  useEffect(()=>{
  //    if(context.data){
  //      Alert.alert(
  //        "訂單更新",
  //        "您有一筆訂單狀態更新，是否前往查看？",
  //        [
  //            {
  //                text: "取消",
  //                onPress: () => console.log("Cancel Pressed"),
  //                style: "cancel"
  //            },
  //            { text: "確定", onPress: () => { 
  //                navigation.navigate("C2cHistoryScreen")
  //            }}
  //        ]
  //      );
  //    }
  //  },[context])
 
   return (
     <Stack.Navigator>
       <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
       <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
       <Stack.Screen name="Member" component={Member} options={{ headerShown: false }} />
       <Stack.Screen name="Rebate" component={Rebate} options={{ headerShown: false }} />
       <Stack.Screen name="C2c" component={C2c} options={{ headerShown: false }} />
       <Stack.Screen name="C2cMember" component={C2cMember} options={{ headerShown: false }} />
       <Stack.Screen name="C2cApply" component={C2cApply} options={{ headerShown: false }} />
       <Stack.Screen name="C2cNotification" component={C2cNotification} options={{ headerShown: false }} />
       <Stack.Screen name="C2cHelp" component={C2cHelp} options={{ headerShown: false }} />
       <Stack.Screen name="EditName" component={EditName} options={{ headerShown: false }} />
       <Stack.Screen name="Setting" component={Setting} options={{ headerShown: false }} />
       <Stack.Screen name="PhoneVerify" component={PhoneVerify} options={{ headerShown: false }} />
       <Stack.Screen name="PhoneInput" component={PhoneInput} options={{ headerShown: false }} />
       <Stack.Screen name="GoogleVerifyStep1" component={GoogleVerifyStep1} options={{ headerShown: false }} />
       <Stack.Screen name="GoogleVerifyStep2" component={GoogleVerifyStep2} options={{ headerShown: false }} />
       <Stack.Screen name="GoogleVerifyStep3" component={GoogleVerifyStep3} options={{ headerShown: false }} />
       <Stack.Screen name="FundPassword" component={FundPassword} options={{ headerShown: false }} />
       <Stack.Screen name="ResetFundPassword" component={ResetFundPassword} options={{ headerShown: false }} />
       <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
       <Stack.Screen name="Announcement" component={Announcement} options={{ headerShown: false }} />
       <Stack.Screen name="AnnouncementDetail" component={AnnouncementDetail} options={{ headerShown: false }} />
       <Stack.Screen name="ResetGoogle" component={ResetGoogle} options={{ headerShown: false }} />
       <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
       <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
       <Stack.Screen name="EmailVerify" component={EmailVerify} options={{ headerShown: false }} />
       <Stack.Screen name="IdentityVerifyStep1" component={IdentityVerifyStep1} options={{ headerShown: false }} />
       <Stack.Screen name="IdentityVerifyStep2" component={IdentityVerifyStep2} options={{ headerShown: false }} />
       <Stack.Screen name="Payments" component={Payments} options={{ headerShown: false }} />
       <Stack.Screen name="PaymentsCreate" component={PaymentsCreate} options={{ headerShown: false }} />
       <Stack.Screen name="Advertisement" component={Advertisement} options={{ headerShown: false }} />
       <Stack.Screen name="AdvertisementEdit" component={AdvertisementEdit} options={{ headerShown: false }} />
       <Stack.Screen name="C2cCreateScreen" component={C2cCreateScreen} options={{ headerShown: false }} />
       <Stack.Screen name="Web" component={Web} options={{ headerShown: false }} />
       <Stack.Screen name="Consult" component={Consult} options={{ headerShown: false }} />
       <Stack.Screen name="HelpCenter" component={HelpCenter} options={{ headerShown: false }} />
       <Stack.Screen name="HelpCenterEn" component={HelpCenterEn} options={{ headerShown: false }} />
       <Stack.Screen name="HelpDetail" component={HelpDetail} options={{ headerShown: false }} />
       <Stack.Group screenOptions={{ presentation: 'modal',headerShown: false }}>
         <Stack.Screen name="Modal" component={ModalScreen} />
         <Stack.Screen name="AllLanguage" component={AllLanguage} />
       </Stack.Group>

       <Stack.Screen name="Recharge" component={RechargeScreen} />

       <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="Login" component={Login} />
     </Stack.Navigator>
   );
}

export default RootNavigator