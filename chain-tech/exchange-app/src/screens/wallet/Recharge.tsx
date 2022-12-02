import * as React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled from "styled-components";
import { RootStackScreenProps } from "common/types";
import { useState, useEffect } from "react";
import { useAppSelector } from "hooks";
import * as Clipboard from "expo-clipboard";
// import QRCode  from 'qrcode.react';
import SvgQRCode from "react-native-qrcode-svg";
import { useTranslation } from "react-i18next";
import { investorService } from "services";

const Container = styled(View)`
  display: flex;
  flex-direction: column;
  background-color: #131b24;
  border: none;
  flex: 1;
`;

const Header = styled(View)<{ insets: number }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: ${props => props.insets}px;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 11px;
  background-color: #18222d;
`;

const HeaderText = styled(Text)`
  font-size: 16px;
  color: white;
  margin-right: 30px;
`;

const IconImg = styled(Image)`
  width: 28px;
  height: 28px;
`;

const RechargeScreen = ({ navigation }: RootStackScreenProps<"Recharge">) => {
  const {token} = useAppSelector((state)=>state.user)
  const [address, setAddress] = useState("");
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const getAddress = () => {
    investorService.getWallet().then(response=>{
        setAddress(response.data);
    })
  };

  const copyToClipboard = async () => {
    await Clipboard.setString(address);
    Alert.alert(t("copied"));
  };

  useEffect(() => {
    if (token) {
      getAddress();
    }
  }, []);

  return (
    <Container>
      <Header insets={insets.top}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <IconImg
            source={require("assets/images/global/previous.png")}
          />
        </TouchableOpacity>
        <HeaderText>{t("deposit")}USDT</HeaderText>
        <View></View>
      </Header>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          marginTop: 20
        }}
      >
        <View
          style={{
            width: 189,
            height: 189,
            backgroundColor: "white",
            borderRadius: 8,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <SvgQRCode value={address} size={141} />
        </View>
        <Text
          style={{
            color: "#8D97A2",
            fontSize: 13,
            fontWeight: "500",
            marginTop: 20
          }}
        >
          {t("addressOnlyUsdt")}
        </Text>
        <View style={{ width: "90%" }}>
          <Text
            style={{
              color: "#DDE0E3",
              fontSize: 13,
              fontWeight: "500",
              marginTop: 24
            }}
          >
            {t("network")}
          </Text>
          <View
            style={{
              backgroundColor: "#242D37",
              borderRadius: 4,
              padding: 12,
              marginTop: 5
            }}
          >
            <Text style={{ color: "white" }}>TRON(TRC20)</Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              color: "#F4F5F6",
              fontSize: 15,
              fontWeight: "700",
              marginTop: 20
            }}
          >
            {address}
          </Text>
          <TouchableOpacity onPress={copyToClipboard}>
            <Image
              source={require("assets/images/wallet/copy.png")}
              style={{ width: 20, height: 20, marginLeft: 5, marginTop: 20 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};

export default RechargeScreen;
