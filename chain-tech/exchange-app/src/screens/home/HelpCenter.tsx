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

const HelpCenter = ({ navigation }: RootStackScreenProps<"HelpCenter">) => {
    const insets = useSafeAreaInsets();
    const [active, setActive] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [userAccount, setUserAccount] = React.useState("");
    const [role, setRole] = React.useState("user");
    const [modalVisible, setModalVisible] = useState(false);
    const [obj, setObj] = React.useState({
        completeAmount: 0,
        completeOrders: 0,
        completeRate: 0,
        completeUsers: 0
    });
    const [level, setLevel] = React.useState([
        {
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
        }
    ]);

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
    const [language, setLanguage] = React.useState("");
    const [index, setIndex] = React.useState(0);
    const { t, i18n } = useTranslation();
    async function getData() {

    }
    useEffect(() => {
        getData()
        setLanguage(i18n.language)
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
                <HeaderText>{t("helpPage")}</HeaderText>
                <View></View>
            </Header>
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                <View style={{ display: "flex", flexDirection: "column", backgroundColor: "#242D37", padding: 16, borderRadius: 8 }}>
                    <Text style={{ color: "white", fontSize: 18 }}>{t("1")}</Text>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("HelpDetail", {
                            id: language === "tw" ? 37 : 3,
                        })
                    }}>
                        <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{t("2")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("HelpDetail", {
                            id: language === "tw" ? 38 : 4,
                        })
                    }}>
                        <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{t("3")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("HelpDetail", {
                            id: language === "tw" ? 39 : 5,
                        })
                    }}>
                        <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{t("4")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("HelpDetail", {
                            id: language === "tw" ? 40 : 6,
                        })
                    }}>
                        <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{t("5")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("HelpDetail", {
                            id: language === "tw" ? 41 : 7,
                        })
                    }}>
                        <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{t("6")}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ display: "flex", flexDirection: "column", backgroundColor: "#242D37", padding: 16, borderRadius: 8, marginTop: 16 }}>
                    <Text style={{ color: "white", fontSize: 18 }}>{t("7")}</Text>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("HelpDetail", {
                            id: language === "tw" ? 42 : 8,
                        })
                    }}>
                        <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{t("8")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("HelpDetail", {
                            id: language === "tw" ? 45 : 11,
                        })
                    }}>
                        <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{t("9")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("HelpDetail", {
                            id: language === "tw" ? 43 : 9,
                        })
                    }}>
                        <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{t("10")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("HelpDetail", {
                            id: language === "tw" ? 44 : 10,
                        })
                    }}>
                        <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{t("11")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("HelpDetail", {
                            id: language === "tw" ? 46 : 12,
                        })
                    }}>
                        <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{t("12")}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ display: "flex", flexDirection: "column", backgroundColor: "#242D37", padding: 16, borderRadius: 8, marginTop: 16 }}>
                    <Text style={{ color: "white", fontSize: 18 }}>{t("13")}</Text>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("HelpDetail", {
                            id: language === "tw" ? 61 : 52,
                        })
                    }}>
                        <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{t("14")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("HelpDetail", {
                            id: language === "tw" ? 62 : 54,
                        })
                    }}>
                        <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{t("15")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("HelpDetail", {
                            id: language === "tw" ? 63 : 55,
                        })
                    }}>
                        <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{t("16")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("HelpDetail", {
                            id: language === "tw" ? 64 : 56,
                        })
                    }}>
                        <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{t("17")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("HelpDetail", {
                            id: language === "tw" ? 65 : 57,
                        })
                    }}>
                        <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{t("18")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("HelpDetail", {
                            id: language === "tw" ? 66 : 58,
                        })
                    }}>
                        <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{t("19")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("HelpDetail", {
                            id: language === "tw" ? 47 : 13,
                        })
                    }}>
                        <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{t("20")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("HelpDetail", {
                            id: language === "tw" ? 48 : 14,
                        })
                    }}>
                        <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{t("21")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("HelpDetail", {
                            id: language === "tw" ? 49 : 15,
                        })
                    }}>
                        <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{t("22")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("HelpDetail", {
                            id: language === "tw" ? 50 : 16,
                        })
                    }}>
                        <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{t("23")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("HelpDetail", {
                            id: language === "tw" ? 51 : 17,
                        })
                    }}>
                        <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{t("24")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("HelpDetail", {
                            id: language === "tw" ? 52 : 18,
                        })
                    }}>
                        <Text style={{ color: "white", fontSize: 15, marginTop: 10, marginLeft: 20 }}>{t("25")}</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </Container>
    );
};

export default HelpCenter;
