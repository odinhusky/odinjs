import React, { useEffect } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { useAppSelector, useAppDispatch } from 'hooks/redux-hooks'
import { userActions } from "store/slice";

import styled from "styled-components"
import { RootStackScreenProps } from "common/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTranslation } from "react-i18next";

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
  margin-right:30px;
`;

const IconImg = styled(Image)`
  width: 28px;
  height:28px;
`


const Member = ({ navigation }: RootStackScreenProps<"Member">) => {
    const { detail: user } = useAppSelector((state) => state.user)
    // $ init data
    const insets = useSafeAreaInsets();
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch();

    // # states
    const [active, setActive] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [userId, setUserId] = React.useState('');

    // * hooks
    useEffect(() => {
        setEmail(user.account)
        setUserId(user.userId)
    }, []);

    return (
        <Container>
            <Header insets={insets.top}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <IconImg source={require("assets/images/global/previous.png")} />
                </TouchableOpacity>
                <HeaderText>{t("memberCenter")}</HeaderText>
                <View >
                </View>
            </Header>
            <View style={{ padding: 16 }}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: "#A8C2DC", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: "black", fontSize: 32, fontWeight: "600" }}>N</Text>
                    </View>
                    <View style={{ marginLeft: 12 }}>
                        <Text style={{ color: "#F4F5F6", fontSize: 16, fontWeight: "700" }}>{email.slice(0, 3) + "****" + email.slice(7)}</Text>
                        <Text style={{ color: "#8D97A2", fontSize: 13, fontWeight: "600", marginTop: 4 }}>ID: {userId.slice(0, 12)}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 24 }}>
                    <TouchableOpacity style={{ display: "flex", flexDirection: "row", height: 56, alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#242D37" }} onPress={() => { navigation.navigate("Setting") }}>
                        <IconImg source={require("assets/images/home/security.png")} />
                        <Text style={{ color: "white", fontSize: 15, marginLeft: 16 }}>{t("security")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ display: "flex", flexDirection: "row", height: 56, alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#242D37" }} onPress={() => { navigation.navigate("C2c") }}>
                        <IconImg source={require("assets/images/home/setup.png")} />
                        <Text style={{ color: "white", fontSize: 15, marginLeft: 16 }}>{t("fiatManage")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ display: "flex", flexDirection: "row", height: 56, alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#242D37" }} onPress={() => { navigation.navigate("Advertisement") }}>
                        <IconImg source={require("assets/images/home/ad.png")} />
                        <Text style={{ color: "white", fontSize: 15, marginLeft: 16 }}>{t("myAds")}</Text>
                    </TouchableOpacity>

                    {/* 代理返佣 */}
                    <TouchableOpacity style={{ display: "flex", flexDirection: "row", height: 56, alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#242D37" }} onPress={() => { navigation.navigate("Rebate") }}>
                        <IconImg source={require("assets/images/home/bonus.png")} />
                        <Text style={{ color: "white", fontSize: 15, marginLeft: 16 }}>{t("referralManage")}</Text>
                    </TouchableOpacity>

                    {/* 公告 */}
                    <TouchableOpacity style={{ display: "flex", flexDirection: "row", height: 56, alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#242D37" }} onPress={() => { navigation.navigate("Announcement") }}>
                        <IconImg source={require("assets/images/home/announcement.png")} />
                        <Text style={{ color: "white", fontSize: 15, marginLeft: 16 }}>{t("announcement")}</Text>
                    </TouchableOpacity>

                    {/* 幫助中心 */}
                    <TouchableOpacity style={{ display: "flex", flexDirection: "row", height: 56, alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#242D37" }} onPress={() => {
                        if (i18n.language === "en") {
                            navigation.navigate("HelpCenterEn")
                        } else {
                            navigation.navigate("HelpCenter")
                        }
                    }}>
                        <IconImg source={require("assets/images/home/icon_help.png")} />
                        <Text style={{ color: "white", fontSize: 15, marginLeft: 16 }}>{t("helpPage")}</Text>
                    </TouchableOpacity>

                    {/* 隱私政策 */}
                    <TouchableOpacity style={{ display: "flex", flexDirection: "row", height: 56, alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#242D37" }} onPress={() => {
                        navigation.navigate("HelpDetail", {
                            id: i18n.language === "tw" ? 67 : i18n.language === "en" ? 35 : 34,
                        })
                    }}>
                        <IconImg source={require("assets/images/home/icon_privacy.png")} />
                        <Text style={{ color: "white", fontSize: 15, marginLeft: 16 }}>{t("privacy")}</Text>
                    </TouchableOpacity>

                    {/* 登出 */}
                    <TouchableOpacity style={{ display: "flex", flexDirection: "row", height: 56, alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#242D37" }} onPress={() => {
                        dispatch(userActions.logout())
                        navigation.goBack();
                    }}>
                        <IconImg source={require("assets/images/home/logout.png")} />
                        <Text style={{ color: "white", fontSize: 15, marginLeft: 16 }}>{t("logOut")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Container>
    );
};

export default Member;
