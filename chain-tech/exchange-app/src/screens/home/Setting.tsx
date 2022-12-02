import { Text, View, TouchableOpacity, Image } from "react-native";
import styled from "styled-components";
import { RootStackScreenProps } from "common/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as React from "react";
import { useState, useEffect } from "react";
import { useAppSelector } from "hooks";
import { useTranslation } from "react-i18next";
import { userService } from "services";

const Container = styled(View)`
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
  margin-right: 30px;
`;

const IconImg = styled(Image)`
  width: 28px;
  height: 28px;
`;

const Setting = ({ navigation }: RootStackScreenProps<"Setting">) => {
    const { detail: user } = useAppSelector((state) => state.user)
    const insets = useSafeAreaInsets();
    const [active, setActive] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [userId, setUserId] = React.useState("");
    const [userSecurity, setUserSecurity] = React.useState({} as UserSecurity);
    const { t } = useTranslation();
    useEffect(() => {
        setEmail(user.account);
        setUserId(user.userId);
        userService.getSecurity().then((response) => {
            setUserSecurity(response.data);
        })
        const interval = setInterval(() => {
            userService.getSecurity().then((response) => {
                setUserSecurity(response.data);
            })

        }, 1000);

        return () => clearInterval(interval);

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
                <HeaderText>{t("security")}</HeaderText>
                <View></View>
            </Header>
            <View style={{ padding: 16 }}>
                <View>
                    <TouchableOpacity
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            height: 56,
                            alignItems: "center",
                            borderBottomWidth: 1,
                            borderBottomColor: "#242D37",
                            justifyContent: "space-between"
                        }}
                        onPress={() => {
                            if (userSecurity.phone) {
                                alert(t("mobileVerifyComp"))
                            } else {
                                navigation.navigate("PhoneInput");
                            }
                        }}
                    >
                        <Text style={{ color: "white", fontSize: 15 }}>{t("mobileVerification")}</Text>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center"
                            }}
                        >
                            {userSecurity.phone ? <Text
                                style={{ color: "#8D97A2", fontSize: 15, fontWeight: "400" }}
                            >
                                {t("verificationComp")}
                            </Text> :
                                <>
                                    <Text
                                        style={{ color: "#8D97A2", fontSize: 15, fontWeight: "400" }}
                                    >
                                        {t("verificationUnavb")}
                                    </Text>
                                    <IconImg
                                        source={require("assets/images/home/next.png")}
                                    />
                                </>}

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            height: 56,
                            alignItems: "center",
                            borderBottomWidth: 1,
                            borderBottomColor: "#242D37",
                            justifyContent: "space-between"
                        }}
                        onPress={() => {
                            if (userSecurity.googleAuth) {
                                navigation.navigate("ResetGoogle");
                            } else {
                                navigation.navigate("GoogleVerifyStep1");
                            }
                        }}
                    >
                        <Text style={{ color: "white", fontSize: 15 }}>{t("googleAuth")}</Text>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center"
                            }}
                        >
                            {userSecurity.googleAuth ? <Text
                                style={{ color: "#8D97A2", fontSize: 15, fontWeight: "400" }}
                            >
                                {t("verificationComp")}
                            </Text> :
                                <>
                                    <Text
                                        style={{ color: "#8D97A2", fontSize: 15, fontWeight: "400" }}
                                    >
                                        {t("verificationUnavb")}
                                    </Text>
                                    <IconImg
                                        source={require("assets/images/home/next.png")}
                                    />
                                </>}
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            height: 56,
                            alignItems: "center",
                            borderBottomWidth: 1,
                            borderBottomColor: "#242D37",
                            justifyContent: "space-between"
                        }}
                        disabled={userSecurity.kyc ? true : false}
                        onPress={() => {
                            if ( userSecurity.kyc ) {
                                alert(t("idAuthenticationComp"))
                            } else {
                                navigation.navigate("IdentityVerifyStep1");
                            }
                        }}
                    >
                        <Text style={{ color: "white", fontSize: 15 }}>{t("idAuth")}</Text>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center"
                            }}
                        >
                            <Text
                                style={{ color: "#8D97A2", fontSize: 15, fontWeight: "400" }}
                            >
                                {t(`user.kyc.${userSecurity.kyc ?? "EMPTY"}`)}
                            </Text>
                            { !userSecurity.kyc && <IconImg source={require("assets/images/home/next.png")} />}
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            height: 56,
                            alignItems: "center",
                            borderBottomWidth: 1,
                            borderBottomColor: "#242D37",
                            justifyContent: "space-between"
                        }}
                        onPress={() => {
                            if (userSecurity.financePwd) {
                                navigation.navigate("ResetFundPassword");
                            } else {
                                navigation.navigate("FundPassword");
                            }
                        }}
                    >
                        <Text style={{ color: "white", fontSize: 15 }}>{t("fundPass")}</Text>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center"
                            }}
                        >
                            {userSecurity.financePwd ? <Text
                                style={{ color: "#8D97A2", fontSize: 15, fontWeight: "400" }}
                            >
                                {t("verificationSet")}
                            </Text> :
                                <>
                                    <Text
                                        style={{ color: "#8D97A2", fontSize: 15, fontWeight: "400" }}
                                    >
                                        {t("verificationUnset")}
                                    </Text>
                                    <IconImg
                                        source={require("assets/images/home/next.png")}
                                    />
                                </>}
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            height: 56,
                            alignItems: "center",
                            borderBottomWidth: 1,
                            borderBottomColor: "#242D37",
                            justifyContent: "space-between"
                        }}
                        onPress={() => {
                            navigation.navigate("ResetPassword");
                        }}
                    >
                        <Text style={{ color: "white", fontSize: 15 }}>{t("resetFundPass")}</Text>

                    </TouchableOpacity>
                </View>
            </View>
        </Container>
    );
};

export default Setting;
