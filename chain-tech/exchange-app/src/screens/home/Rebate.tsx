import {
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
    StyleSheet,
    TextInput
} from "react-native";
import styled from "styled-components";
import { RootStackScreenProps } from "common/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as React from "react";
import { useState, useEffect, useContext } from "react";
import * as Clipboard from "expo-clipboard";
import { useTranslation } from "react-i18next";
import { agentService, investorService } from "services";
import { AgentApplicationRequest } from "interfaces/request.interface";

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

const GrayHeader = styled(View)`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${props => props.theme.color.DarkGray};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding: 16px;
`;

const GrayText = styled(Text)`
  font-size: 13px;
  color: ${props => props.theme.color.ExtraLightGray};
  font-weight: 500;
`;

const PriceText = styled(Text)`
  font-size: 20px;
  color: white;
  font-weight: 700;
`;

const USDText = styled(Text)`
  font-size: 15px;
  color: #8d97a2;
  font-weight: 500;
`;

const PercentText = styled(Text)`
  font-size: 32px;
  color: ${props => props.theme.color.Secondary};
  font-weight: 700;
`;

const RedPercentText = styled(Text)`
  font-size: 15px;
  color: #f4f5f6;
  font-weight: 700;
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

const styles = StyleSheet.create({
    tabSelected: {
        height: 33,
        borderBottomWidth: 2,
        borderBottomColor: "#608FBE",
        marginRight: 24
    },
    tab: {
        height: 33,
        marginRight: 24
    },
    textSelected: {
        fontSize: 14,
        color: "white",
        fontWeight: "500"
    },
    text: {
        fontSize: 14,
        color: "#BCC2C8",
        fontWeight: "500"
    }
});

const Rebate = ({ navigation }: RootStackScreenProps<"Rebate">) => {
    const insets = useSafeAreaInsets();
    const [index, setIndex] = useState(0);
    const [memberNumber, setMemberNumber] = useState(0);
    const [records, setRecord] = useState<Commission[]>([]);
    const [tradeMembers, setTradeMembers] = useState<string[]>([]);
    const [sum, setSum] = useState(0);
    const [code, setCode] = useState("");
    const [isApply, setIsApply] = useState(false);
    const { t } = useTranslation();
    const copyToClipboard = async () => {
        await Clipboard.setString("ABC963412");
        Alert.alert(t("copied"));
    };
    const [applicationRequest, setApplicationRequest] = useState({} as AgentApplicationRequest);
    const [application, setApplication] = useState({} as AgentApplication);

    const applicationRequestKey = [
        "name",
        "phone",
        "email",
        "telegram",
        "whatsapp",
        "other",
        "teamName",
        "teamPeopleNumber",
        "location"
    ]

    const [tabs, setTabs] = useState([
        {
            text: t("commissionHistory"),
            selected: true
        },
        {
            text: t("referralAllMember"),
            selected: false
        },
        {
            text: t("applyAgent"),
            selected: false
        },
    ])

    useEffect(() => {
        investorService.getCommission().then((response)=>{
            setMemberNumber(response.data.memberNumber);
            setRecord(response.data.records.reverse());
            setTradeMembers(response.data.tradeMembers);
            let sum = 0;
            response.data.records.map( record => record.amount).reduce((previousValue, currentValue) => previousValue + currentValue, sum)
            setSum(sum);
        })
        investorService.getInviteCode().then((response)=>{
            setCode(response.data);
        })
        agentService.get().then(response=>{
            setApplication(response.data)
        })
    }, []);

    const getAgentApplicationComponent = () => {
        if (!application) {
            return (
                <View style={{ padding: 16 }}>
                    <Text style={{ color: "#DDE0E3", fontSize: 16, fontWeight: "500", marginBottom: 4 }}>{t("agent.application.name")}</Text>
                    <TextInput style={{ width: "100%", height: 40, backgroundColor: "#242D37", borderRadius: 4, paddingLeft: 16, color: "white", fontSize: 15 }} onChangeText={(v) => setApplicationRequest({ ...applicationRequest, name: v })} />
                    <Text style={{ color: "#DDE0E3", fontSize: 16, fontWeight: "500", marginBottom: 4 }}>{t("agent.application.phone")}</Text>
                    <TextInput style={{ width: "100%", height: 40, backgroundColor: "#242D37", borderRadius: 4, paddingLeft: 16, color: "white", fontSize: 15 }} onChangeText={(v) => setApplicationRequest({ ...applicationRequest, phone: v })} />
                    <Text style={{ color: "#DDE0E3", fontSize: 16, fontWeight: "500", marginBottom: 4 }}>{t("agent.application.email")}</Text>
                    <TextInput style={{ width: "100%", height: 40, backgroundColor: "#242D37", borderRadius: 4, paddingLeft: 16, color: "white", fontSize: 15 }} onChangeText={(v) => setApplicationRequest({ ...applicationRequest, email: v })} />
                    <Text style={{ color: "#DDE0E3", fontSize: 16, fontWeight: "500", marginBottom: 4 }}>{t("agent.application.telegram")}</Text>
                    <TextInput style={{ width: "100%", height: 40, backgroundColor: "#242D37", borderRadius: 4, paddingLeft: 16, color: "white", fontSize: 15 }} onChangeText={(v) => setApplicationRequest({ ...applicationRequest, telegram: v })} />
                    <Text style={{ color: "#DDE0E3", fontSize: 16, fontWeight: "500", marginBottom: 4 }}>{t("agent.application.whatsapp")}</Text>
                    <TextInput style={{ width: "100%", height: 40, backgroundColor: "#242D37", borderRadius: 4, paddingLeft: 16, color: "white", fontSize: 15 }} onChangeText={(v) => setApplicationRequest({ ...applicationRequest, whatsapp: v })} />
                    <Text style={{ color: "#DDE0E3", fontSize: 16, fontWeight: "500", marginBottom: 4 }}>{t("agent.application.other")}</Text>
                    <TextInput style={{ width: "100%", height: 40, backgroundColor: "#242D37", borderRadius: 4, paddingLeft: 16, color: "white", fontSize: 15 }} onChangeText={(v) => setApplicationRequest({ ...applicationRequest, other: v })} />
                    <Text style={{ color: "#DDE0E3", fontSize: 16, fontWeight: "500", marginBottom: 4 }}>{t("agent.application.teamName")}</Text>
                    <TextInput style={{ width: "100%", height: 40, backgroundColor: "#242D37", borderRadius: 4, paddingLeft: 16, color: "white", fontSize: 15 }} onChangeText={(v) => setApplicationRequest({ ...applicationRequest, teamName: v })} />
                    <Text style={{ color: "#DDE0E3", fontSize: 16, fontWeight: "500", marginBottom: 4 }}>{t("agent.application.teamPeopleNumber")}</Text>
                    <TextInput style={{ width: "100%", height: 40, backgroundColor: "#242D37", borderRadius: 4, paddingLeft: 16, color: "white", fontSize: 15 }} onChangeText={(v) => setApplicationRequest({ ...applicationRequest, teamPeopleNumber: v })} />
                    <Text style={{ color: "#DDE0E3", fontSize: 16, fontWeight: "500", marginBottom: 4 }}>{t("agent.application.location")}</Text>
                    <TextInput style={{ width: "100%", height: 40, backgroundColor: "#242D37", borderRadius: 4, paddingLeft: 16, color: "white", fontSize: 15 }} onChangeText={(v) => setApplicationRequest({ ...applicationRequest, location: v })} />
                    <TouchableOpacity style={{ display: "flex", flexDirection: "row", backgroundColor: "#3D6A97", borderRadius: 4, justifyContent: "center", alignItems: "center", height: 44, marginTop: 42 }} onPress={() => {
                        var lackData = "";
                        // Object.keys(applicationRequest).forEach(key => {
                        //     if (applicationRequest[key] === null || applicationRequest[key] === "") {
                        //         lackData = key
                        //         return
                        //     }
                        // })
                        if (lackData !== "") {
                            Alert.alert(`please input ${t(`agent.application.${lackData}`)}`)
                        }
                        else {
                            agentService.create(applicationRequest).then((response)=>{
                                setApplication(response.data)
                            })
                        }
                    }}>
                        <Text style={{ color: "white", fontSize: 14, fontWeight: "500" }}>{t("OK")}</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        else {
            return (
                <View style={{ display: "flex", flexDirection: "column", backgroundColor: "#242D37", padding: 16, borderRadius: 8 }}>
                    <Text style={{ color: "white", fontSize: 18 }}>{t("agent.application.applied")}</Text>
                    <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{`${t(`agent.application.name`)} ${application.name}`}</Text>
                    <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{`${t(`agent.application.teamName`)} ${application.teamName}`}</Text>
                    <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{`${t(`agent.application.teamPeopleNumber`)} ${application.teamPeopleNumber}`}</Text>
                    <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{`${t(`agent.application.location`)} ${application.location}`}</Text>
                    <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{`${t(`agent.application.email`)} ${application.email}`}</Text>
                    <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{`${t(`agent.application.phone`)} ${application.phone}`}</Text>
                    <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{`${t(`agent.application.telegram`)} ${application.telegram}`}</Text>
                    <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{`${t(`agent.application.whatsapp`)} ${application.whatsapp}`}</Text>
                    <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{`${t(`agent.application.other`)} ${application.other}`}</Text>
                </View>
            )
        }
    }

    return (
        <Container>
            <Header insets={insets.top}>
                <TouchableOpacity
                    onPress={async () => {
                        navigation.goBack();
                    }}
                >
                    <IconImg
                        source={require("assets/images/global/previous.png")}
                    />
                </TouchableOpacity>
                <HeaderText>{t("referralManage")}</HeaderText>
                <View></View>
            </Header>
            <View style={{ padding: 16 }}>
                <View
                    style={{ width: "100%", borderRadius: 8, backgroundColor: "#242D37" }}
                >
                    <GrayHeader>
                        <GrayText>{t("myReferralCode")}</GrayText>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between"
                            }}
                        ></View>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginTop: 10
                            }}
                        >
                            <Text
                                style={{ color: "#608FBE", fontSize: 20, fontWeight: "700" }}
                            >
                                {code}
                            </Text>
                            <TouchableOpacity onPress={copyToClipboard}>
                                <IconImg
                                    source={require("assets/images/wallet/copy.png")}
                                    style={{ width: 20, height: 20 }}
                                />
                            </TouchableOpacity>
                        </View>
                    </GrayHeader>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            padding: 16,
                            alignItems: "center"
                        }}
                    >
                        <View>
                            <USDText>{t("referralIncome")}</USDText>
                        </View>
                        <RedPercentText>{sum.toFixed(6)} USDT</RedPercentText>
                    </View>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingLeft: 16,
                            paddingRight: 16,
                            alignItems: "center"
                        }}
                    >
                        <View>
                            <USDText>{t("referralActiveMember")}</USDText>
                        </View>
                        <RedPercentText>
                            {tradeMembers.length} {t("people")}
                        </RedPercentText>
                    </View>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            padding: 16,
                            alignItems: "center"
                        }}
                    >
                        <View>
                            <USDText>{t("referralAllMember")}</USDText>
                        </View>
                        <RedPercentText>
                            {memberNumber} {t("people")}
                        </RedPercentText>
                    </View>
                </View>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        height: 33,
                        borderBottomWidth: 1,
                        borderBottomColor: "#242D37",
                        marginTop: 24
                    }}
                >
                    {
                        tabs.map((tab, index) => {
                            return (
                                <TouchableOpacity
                                    style={tab.selected ? styles.tabSelected : styles.tab}
                                    onPress={() => {
                                        setIndex(index);
                                        setTabs(tabs.map((t, i) => {
                                            t.selected = i === index
                                            return t
                                        }))
                                    }}
                                >
                                    <Text style={tab.selected ? styles.textSelected : styles.text}>
                                        {tab.text}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
                <View>
                    <ScrollView contentContainerStyle={{ paddingBottom: 600 }}>
                        {index === 0 &&
                            records.map((x: any) => {
                                return (
                                    <>
                                        <View
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                marginTop: 12,
                                                alignItems: "center"
                                            }}
                                        >
                                            <View
                                                style={{ display: "flex", flexDirection: "column" }}
                                            >
                                                <Text
                                                    style={{
                                                        color: "#F4F5F6",
                                                        fontSize: 15,
                                                        fontWeight: "400"
                                                    }}
                                                >
                                                    ID {x.childAccount}
                                                </Text>
                                                <Text
                                                    style={{
                                                        color: "#8D97A2",
                                                        fontSize: 12,
                                                        fontWeight: "400"
                                                    }}
                                                >
                                                    {new Date(x.createdDate).toISOString().split("T")[0]}{" "}
                                                    {
                                                        new Date(x.createdDate)
                                                            .toISOString()
                                                            .split("T")[1]
                                                            .split(".")[0]
                                                    }
                                                </Text>
                                            </View>

                                            <View
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    height: 40
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }}
                                                >
                                                    <Text style={{ color: "white", fontWeight: "600" }}>
                                                        {x.amount} USDT
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </>
                                );
                            })}
                        {index === 1 &&
                            tradeMembers.map((x: any) => {
                                return (
                                    <>
                                        <View
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                marginTop: 12,
                                                alignItems: "center"
                                            }}
                                        >
                                            <View
                                                style={{ display: "flex", flexDirection: "column" }}
                                            >
                                                <Text
                                                    style={{
                                                        color: "#F4F5F6",
                                                        fontSize: 15,
                                                        fontWeight: "400"
                                                    }}
                                                >
                                                    ID {x}
                                                </Text>
                                                {/* <Text
                        style={{
                          color: "#8D97A2",
                          fontSize: 12,
                          fontWeight: "400"
                        }}
                      >
                        2021-10-26 16:12:08
                      </Text> */}
                                            </View>

                                            <View
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    height: 40
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }}
                                                >
                                                    <Text style={{ color: "white", fontWeight: "600" }}>
                                                        已交易
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </>
                                );
                            })}
                        {
                            index === 2 && getAgentApplicationComponent()
                        }
                    </ScrollView>
                </View>
            </View>
        </Container>
    );
};

export default Rebate;