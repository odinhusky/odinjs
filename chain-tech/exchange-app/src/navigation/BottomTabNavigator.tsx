import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { ColorSchemeName, Image,Alert,View,Text} from 'react-native';
import Colors from 'constants/Colors';
import { useColorScheme}  from 'hooks';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from 'common/types';
import HomeStack from './homeStack';
import MarketStack from './marketStack';
import WalletStack from './walletStack';
import C2cStack from './c2cStack';
import TradeStack from './tradeStack';
import styled from "styled-components"
import { useTranslation } from "react-i18next";

const BottomTab = createBottomTabNavigator<RootTabParamList>();

const Icon = styled(Image)`
  width:31px;
  height:28px;
  margin-top:20px;
`

const BottomTabNavigator = () => {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarStyle: { backgroundColor: "#242D37" }
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeStack}
        options={({ navigation }: RootTabScreenProps<"Home">) => ({
          title: "",
          tabBarIcon: ({ focused }) => (
            focused ? <View style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
              <Icon source={require("assets/images/global/home-blue.png")} />
              <Text style={{fontSize:10,color:"#6699CC"}}>{t("home")}</Text>
            </View> : <View style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
              <Icon source={require("assets/images/global/home-gray.png")} />
              <Text style={{fontSize:10,color:"#8D97A2"}}>{t("home")}</Text>
            </View> 
          ),
          headerShown: false
        })}
      />
      <BottomTab.Screen
        name="Market"
        component={MarketStack}
        options={({ navigation }: RootTabScreenProps<"Market">) => ({
          title: "",
          tabBarIcon: ({ focused }) => (
            focused ? <View style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <Icon source={require("assets/images/global/market-blue.png")} />
            <Text style={{fontSize:10,color:"#6699CC"}}>{t("market")}</Text>
          </View> : <View style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
              <Icon source={require("assets/images/global/market-gray.png")} />
              <Text style={{fontSize:10,color:"#8D97A2"}}>{t("market")}</Text>
            </View>
          ),
          headerShown: false
        })}
      />
      <BottomTab.Screen
        name="Trade"
        component={TradeStack}
        options={({ navigation }: RootTabScreenProps<"Trade">) => ({
          title: "",
          tabBarIcon: ({ focused }) => (
            focused ? <View style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <Icon source={require("assets/images/global/trade-blue.png")} />
            <Text style={{fontSize:10,color:"#6699CC"}}>{t("trade")}</Text>
          </View>  : <View style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
              <Icon source={require("assets/images/global/trade-gray.png")} />
              <Text style={{fontSize:10,color:"#8D97A2"}}>{t("trade")}</Text>
            </View>
          ),
          headerShown: false
        })}
      />
      <BottomTab.Screen
        name="C2c"
        component={C2cStack}
        options={({ navigation }: RootTabScreenProps<"C2c">) => ({
          title: "",
          tabBarIcon: ({ focused }) => (
            focused ? <View style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <Icon source={require("assets/images/global/c2c-blue.png")} />
            <Text style={{fontSize:10,color:"#6699CC"}}>C2C</Text>
          </View> : <View style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
              <Icon source={require("assets/images/global/c2c-gray.png")} />
              <Text style={{fontSize:10,color:"#8D97A2"}}>C2C</Text>
            </View>
          ),
          headerShown: false
        })}
      />
      <BottomTab.Screen
        name="Wallet"
        component={WalletStack}
        options={({ navigation }: RootTabScreenProps<"Wallet">) => ({
          title: "",
          tabBarIcon: ({ focused }) => (
            focused ? <View style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <Icon source={require("assets/images/global/wallet-blue.png")} />
            <Text style={{fontSize:10,color:"#6699CC"}}>{t("fund")}</Text>
          </View>  : <View style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
              <Icon source={require("assets/images/global/wallet-gray.png")} />
              <Text style={{fontSize:10,color:"#8D97A2"}}>{t("fund")}</Text>
            </View>
          ),
          headerShown: false
        })}
      />
    </BottomTab.Navigator>
  );
}

export default BottomTabNavigator