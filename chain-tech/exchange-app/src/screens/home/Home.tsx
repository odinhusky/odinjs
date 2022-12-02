import * as React from "react";
import { useEffect, useState } from "react"
import { Text, View, TouchableOpacity, Image,ScrollView,StyleSheet,Dimensions } from "react-native";

// % context
import { useAppSelector } from "hooks"

// ? Self-packed Components || Functions
import LinkButtonWithIcon from './components/LinkButtonWithIcon';
import LinkBanner from './components/LinkBanner';
import TradingPairBox from './components/TradingPairBox';

import { RootStackScreenProps } from "common/types";
import Ranking from './ranking/Ranking';

// ^ Plugins
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useIsFocused } from '@react-navigation/native';
import TextCarousel from "./components/TextCarousel";
import Carousel from 'react-native-reanimated-carousel';
// = Style Component
// import { theme } from "constants/Theme";
import styled from "styled-components";
import RenderCounter from "components/render-counter"
import { infoService } from "services";

const width = Dimensions.get('window').width;

const Container = styled(ScrollView)`
  display: flex;
  flex-direction: column;
  background: #18222d;
  flex: 1;
`;

const Header = styled(View) <{ insets: number }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: ${props => props.insets}px;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 11px;
`;

const HeaderText = styled(Text)`
  font-size: 16px;
  color: white;
  margin-left:20px;
`;

const IconImg = styled(Image)`
  width: 28px;
  height:28px;
`;

const TradingPairContainer = styled(View)`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const HomeScreen = ({ navigation }: RootStackScreenProps<"HomeScreen">) => {

  // $ init data
  const insets = useSafeAreaInsets();
  const { t,i18n } = useTranslation();
  const isFocused = useIsFocused();

  // % context
  const token = useAppSelector((state)=>state.user.token);

  // # states
  const [index, setIndex] = useState(0);
  const [carouselImages, setCarouselImages] = useState<Carousal[]>([]);

  // & handed data
  const linkButtonData = [
    {
      key: 'charge',
      title: 'deposit',
      naviDetail: {
        pathName: token ? 'Recharge' : 'Login'
      },
      imgSrc: require('assets/images/home/charge.png'),
      styleObj: {
        btn: { marginRight: 10 }
      }
    },
    {
      key: 'quick_currency',
      title: 'quickCurrency',
      naviDetail: {
        pathName: 'C2c'
      },
      imgSrc: require('assets/images/home/quick_currency.png'),
      styleObj: {
        btn: { marginRight: 10 }
      }
    },
    {
      key: 'invite_friends',
      title: 'inviteFriends',
      naviDetail: {
        pathName: token ? 'Rebate' : 'Login'
      },
      imgSrc: require('assets/images/home/invite_friends.png'),
      styleObj: {}
    }
  ];

  const tradingParData = ['btc', 'eth', 'chz'];

  // - methods
  const _renderItem = (v: any) => {
    const { item } = v;

    return (
        <TouchableOpacity  onPress={()=>{
          if(item.announcementId){
            navigation.navigate("AnnouncementDetail",{
              id: item.announcementId,
            })
          }
        }}>
            <Image source={{uri:item.imagePath}} style={{width:width - 32,height:160,borderRadius:8}}/>
        </TouchableOpacity>
    );
  };

  // * hooks
  useEffect(() => {
    infoService.getCarousals(i18n.language).then((response)=>{
        setCarouselImages(response.data);
    })
  }, [isFocused]);

  // useEffect(()=>{
  //   console.log("re-render Home.tsx")
  // })

  return (
    <Container>
      <RenderCounter name="Home" debug={false}/>
      <Header insets={insets.top}>
        {/* 頭像 */}
        <TouchableOpacity
          onPress={() => {
            token ? navigation.navigate("Member") : navigation.navigate("Login");
          }}
        >
          <IconImg source={require("assets/images/home/avatar.png")} />
        </TouchableOpacity>

        {/* 標題 */}
        <HeaderText>{t("home")}</HeaderText>

        {/* 右邊 Icons */}
        <View style={{display:"flex",flexDirection:"row"}}>
          {/* 語言 */}
          <TouchableOpacity
            style={{marginRight:10}}
            onPress={async () => {
                navigation.navigate("AllLanguage");
            }}
          >
            <IconImg source={require("assets/images/home/language.png")} />
          </TouchableOpacity>

          {/* 客服 */}
          <TouchableOpacity
            onPress={async () => {
                navigation.navigate("Consult");
            }}
          >
            <IconImg source={require("assets/images/home/support.png")} />
          </TouchableOpacity>
        </View>
      </Header>

      {/* Banner */}
      <View style={{ padding: 16 }}>
        <View style={{ marginBottom:20 }}>
          <Carousel
            width={width}
            height={width / 2.6}
            autoPlay={true}
            data={carouselImages}
            scrollAnimationDuration={2500}
            renderItem={_renderItem}
          />
        </View>

        {/* 按鈕區塊 */}
        <View style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          marginBottom: 10
        }}>
          {
            linkButtonData.map(item => (
              <LinkButtonWithIcon
                key={item.key}
                naviDetail={{ ...item.naviDetail }}
                imgSrc={item.imgSrc}
                title={item.title}
                styleObj={{ ...item.styleObj }}
              />
            ))
          }
        </View>
        <View style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          marginBottom: 10
        }}>
          <TextCarousel/>
        </View>
        {/* 合約交易區塊 */}
        <LinkBanner
          naviDetail={{
            pathName: 'Trade'
          }}
          styleObj={{
            btn: { marginBottom: 10 }
          }}
          imgSrc={require('assets/images/home/contract_deal.png')}
          title="contractDeal"
          subTitle="contractDealSubTitle"
        />

        {/* 交易對 */}
        <TradingPairContainer>
          {
            tradingParData.map(item => (
              <TradingPairBox key={item} coin={item}/>
            ))
          }
        </TradingPairContainer>

        {/* Tabs */}
        <View style={{ display: "flex", flexDirection: "row", width: "100%", height: 33, borderBottomWidth: 1, borderBottomColor: "#242D37", marginTop: 24 }}>
          {index === 0 ?
            <TouchableOpacity style={{ height: 33, borderBottomWidth: 2, borderBottomColor: "#608FBE" }} onPress={()=>{setIndex(0)}}>
              <Text style={{ fontSize: 14, color: index === 0 ? "white": "#BCC2C8", fontWeight: "500" }}>{t("gainersList")}</Text>
            </TouchableOpacity> :
            <TouchableOpacity style={{ height: 33 }}  onPress={()=>{setIndex(0)}}>
              <Text style={{ fontSize: 14, color: "#BCC2C8", fontWeight: "500" }}>{t("gainersList")}</Text>
            </TouchableOpacity>}
          {index === 1 ?
            <TouchableOpacity style={{ height: 33, borderBottomWidth: 2, borderBottomColor: "#608FBE",marginLeft:24 }}  onPress={()=>{setIndex(1)}}>
              <Text style={{ fontSize: 14, color: "white", fontWeight: "500" }}>{t("losersList")}</Text>
            </TouchableOpacity> :
            <TouchableOpacity style={{ height: 33,marginLeft:24 }}  onPress={()=>{setIndex(1)}}>
              <Text style={{ fontSize: 14, color: "#BCC2C8", fontWeight: "500" }}>{t("losersList")}</Text>
            </TouchableOpacity>}
        </View>

        {/* Tab Content */}
        <Ranking direction={index === 0}/>
      </View>
    </Container>
  );
};

export default HomeScreen;
