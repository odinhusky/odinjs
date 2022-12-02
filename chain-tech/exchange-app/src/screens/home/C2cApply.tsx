import {
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    Dimensions,
    Alert
} from "react-native";
import styled from "styled-components";
import { RootStackScreenProps } from "common/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as React from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "hooks";
import { advertisementService, userService } from "services";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
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

const ModalHeaderContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 10px;
  padding-bottom: 26px;
`;

const ModalLeftCancelButton = styled(Image)`
  width: 28px;
  height: 28px;
`;

const ModalHedaerTitleText = styled(Text)`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: ${props => props.theme.color.White};
`;

const ModalEmptyDiv = styled(View)`
  width: 28px;
  height: 28px;
`;

const C2cApply = ({ navigation }: RootStackScreenProps<"C2cApply">) => {
    const { detail: user, token } = useAppSelector((state) => state.user)
    const insets = useSafeAreaInsets();
    const [active, setActive] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [userAccount, setUserAccount] = React.useState("");
    const [role, setRole] = React.useState("user");
    const [modalVisible, setModalVisible] = useState(false);
    const [advertisementCondition, setAdvertisementCondition] = React.useState({} as AdvertisementCondition);
    const [level, setLevel] = React.useState<AdvertiserLevel[]>();

    const [currentLevel, setCurrentLevel] = React.useState({
        conditionCompleteAmount: 0,
        conditionCompleteOrders: 0,
        conditionCompleteRate: 0,
        conditionCompleteUsers: 0,
        deposit: 0,
        id: 0,
        isSpecial: false,
        maxAmountPerDay: 0,
        maxAmountPerOrder: 0,
        name: ""
    });
    const [advertiserLevel, setAdvertiserLevel] = React.useState("");
    const [index, setIndex] = React.useState(0);
    const { t } = useTranslation();
    async function getData() {
        setUserAccount(user.account)
        userService.getOtcUserInfo(user.account).then((otcUser)=>{
            advertisementService.getLevels().then((levels)=>{
                setLevel(levels);
                if ( otcUser.advertiserLevel ){
                    levels.filter( level=> otcUser.advertiserLevel?.name===level.name ).forEach( (level,index) => {
                        if (index + 1 < levels.length) {
                            setCurrentLevel(levels[index + 1]);
                            setIndex(index + 1)
                        } else {
                            setCurrentLevel(levels[index]);
                            setIndex(index)
                        }
                    })
                }
                else {
                    setCurrentLevel(levels[0]);
                }
            })

            userService.getAdvertisementCondition(user.account).then((response)=>{
                setAdvertisementCondition(response);
            })

            if (otcUser.advertiserLevel) {
                setAdvertiserLevel(otcUser.advertiserLevel.name);
            }
        })
    }
    useEffect(() => {
        getData()
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
                <HeaderText>{t("MchStack")}</HeaderText>
                <View></View>
            </Header>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <View style={{}}>
                    { level && level[0].id != 0 &&
                        level.map((x: any, i) => {
                            return (
                                <View
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        backgroundColor: "#333C47",
                                        padding: 16,
                                        borderRadius: 4,
                                        borderWidth: advertisementCondition.completeAmount >= currentLevel.conditionCompleteAmount && advertisementCondition.completeOrders >= currentLevel.conditionCompleteOrders && advertisementCondition.completeRate >= currentLevel.conditionCompleteRate && advertisementCondition.completeUsers >= currentLevel.conditionCompleteUsers && advertiserLevel !== x.name && index === i ? 1 : 0,
                                        borderColor: "#A8C2DC",
                                        marginBottom: 10
                                    }}
                                >
                                    <View
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between"
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: "white",
                                                fontSize: 16,
                                                fontWeight: "700"
                                            }}
                                        >
                                            {x.name}
                                        </Text>
                                        {advertiserLevel == x.name && (
                                            <View
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color: "#8D97A2",
                                                        fontSize: 13,
                                                        fontWeight: "500"
                                                    }}
                                                >
                                                    {t("stackLevel")}
                                                </Text>
                                                <IconImg
                                                    source={require("assets/images/home/selected.png")}
                                                    style={{ width: 24, height: 24 }}
                                                />
                                            </View>
                                        )}
                                    </View>
                                </View>
                            );
                        })}

                    {/* <View style={{ display: "flex", flexDirection: "column", backgroundColor: "#333C47", padding: 16, borderRadius: 4, marginTop: 16 ,borderWidth:1,borderColor:"#A8C2DC"}}>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>Level 2</Text>
            </View>
          </View> */}
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            borderRadius: 8,
                            marginTop: 24
                        }}
                    >
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                        >
                            <Text
                                style={{ color: "#8D97A2", fontSize: 13, fontWeight: "500" }}
                            >
                                {t("stackAmount")}
                            </Text>
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
                                        fontSize: 13,
                                        fontWeight: "600",
                                        marginRight: 5
                                    }}
                                >
                                    {currentLevel.deposit}
                                </Text>
                                <Text
                                    style={{ color: "#8D97A2", fontSize: 13, fontWeight: "500" }}
                                >
                                    USDT
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginTop: 12
                            }}
                        >
                            <Text
                                style={{ color: "#8D97A2", fontSize: 13, fontWeight: "500" }}
                            >
                                {t("maxAmountPer")}
                            </Text>
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
                                        fontSize: 13,
                                        fontWeight: "600",
                                        marginRight: 5
                                    }}
                                >
                                    {currentLevel.maxAmountPerOrder}
                                </Text>
                                <Text
                                    style={{ color: "#8D97A2", fontSize: 13, fontWeight: "500" }}
                                >
                                    USDT
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginTop: 12
                            }}
                        >
                            <Text
                                style={{ color: "#8D97A2", fontSize: 13, fontWeight: "500" }}
                            >
                                {t("maxAmountPerDay")}
                            </Text>
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
                                        fontSize: 13,
                                        fontWeight: "600",
                                        marginRight: 5
                                    }}
                                >
                                    {currentLevel.maxAmountPerDay}
                                </Text>
                                <Text
                                    style={{ color: "#8D97A2", fontSize: 13, fontWeight: "500" }}
                                >
                                    USDT
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            backgroundColor: "#333C47",
                            height: 1,
                            marginTop: 16,
                            marginBottom: 16
                        }}
                    ></View>
                    <Text
                        style={{
                            color: "#F4F5F6",
                            fontSize: 13,
                            fontWeight: "500",
                            marginBottom: 12
                        }}
                    >
                        {t("levelRestrict")}
                    </Text>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            borderRadius: 8
                        }}
                    >
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                        >
                            <Text
                                style={{ color: "#8D97A2", fontSize: 13, fontWeight: "500" }}
                            >
                                {t("fiatTraderNum")}
                            </Text>
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center"
                                }}
                            >
                                <Text
                                    style={{
                                        color: "#FABD43",
                                        fontSize: 13,
                                        fontWeight: "600",
                                        marginRight: 5
                                    }}
                                >
                                    {advertisementCondition.completeUsers}
                                </Text>
                                <Text
                                    style={{ color: "#8D97A2", fontSize: 13, fontWeight: "500" }}
                                >
                                    /{currentLevel.conditionCompleteUsers}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginTop: 12
                            }}
                        >
                            <Text
                                style={{ color: "#8D97A2", fontSize: 13, fontWeight: "500" }}
                            >
                                {t("fiatTradeNum")}
                            </Text>
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center"
                                }}
                            >
                                <Text
                                    style={{
                                        color: "#FABD43",
                                        fontSize: 13,
                                        fontWeight: "600",
                                        marginRight: 5
                                    }}
                                >
                                    {advertisementCondition.completeOrders}
                                </Text>
                                <Text
                                    style={{ color: "#8D97A2", fontSize: 13, fontWeight: "500" }}
                                >
                                    /{currentLevel.conditionCompleteOrders}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginTop: 12
                            }}
                        >
                            <Text
                                style={{ color: "#8D97A2", fontSize: 13, fontWeight: "500" }}
                            >
                                {t("accumulatedAmount")}{" "}
                            </Text>
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center"
                                }}
                            >
                                <Text
                                    style={{
                                        color: "#FABD43",
                                        fontSize: 13,
                                        fontWeight: "600",
                                        marginRight: 5
                                    }}
                                >
                                    {advertisementCondition.completeAmount}
                                </Text>
                                <Text
                                    style={{ color: "#8D97A2", fontSize: 13, fontWeight: "500" }}
                                >
                                    /{currentLevel.conditionCompleteAmount}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginTop: 12
                            }}
                        >
                            <Text
                                style={{ color: "#8D97A2", fontSize: 13, fontWeight: "500" }}
                            >
                                {t("completeRate")}
                            </Text>
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center"
                                }}
                            >
                                <Text
                                    style={{
                                        color: "#FABD43",
                                        fontSize: 13,
                                        fontWeight: "600",
                                        marginRight: 5
                                    }}
                                >
                                    {advertisementCondition.completeRate}
                                </Text>
                                <Text
                                    style={{ color: "#8D97A2", fontSize: 13, fontWeight: "500" }}
                                >
                                    /{currentLevel.conditionCompleteRate}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            backgroundColor: "#3D6A97",
                            borderRadius: 4,
                            justifyContent: "center",
                            alignItems: "center",
                            height: 44,
                            marginTop: 42
                        }}
                        onPress={() => {
                            if (advertiserLevel === (level && level[level.length - 1].name)) {
                                Alert.alert(t("maxLevel"))
                            } else {
                                Alert.alert(t("upgradeCheck"), t("upgradeCheckMsg"), [
                                    {
                                        text: '取消',
                                        onPress: () => console.log('Cancel Pressed'),
                                        style: 'cancel',
                                    },
                                    {
                                        text: '確定', onPress: () => {
                                            userService.setAdvertisementLevel(user.account, currentLevel.id).then(()=>{
                                                getData()
                                            })
                                        }
                                    },
                                ]);
                            }
                        }}
                    >
                        { level && advertiserLevel === level[level.length - 1].name ? <Text style={{ color: "white", fontSize: 14, fontWeight: "500" }}>
                            {t("highestLevel")}
                        </Text> : <Text style={{ color: "white", fontSize: 14, fontWeight: "500" }}>
                            {t("fiatUpgrade")}
                        </Text>}

                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Container>
    );
};

export default C2cApply;
