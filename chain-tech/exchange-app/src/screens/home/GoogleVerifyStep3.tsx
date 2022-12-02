import * as React from "react";
import {
    Text,
    TouchableOpacity,
    View,
    Image,
    Alert,
    TextInput
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled from "styled-components";
import { RootStackScreenProps } from "common/types";
import { useState } from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { useTranslation } from "react-i18next";
import { userService } from "services";

const Container = styled(View)`
  display: flex;
  flex-direction: column;
  background-color: #131b24;
  border: none;
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
  background-color: #18222d;
`;

const HeaderText = styled(Text)`
  font-size: 16px;
  color: white;
  font-weight: 600;
`;

const IconImg = styled(Image)`
  width: 28px;
  height: 28px;
`;

const GoogleVerifyStep3 = ({
    navigation
}: RootStackScreenProps<"GoogleVerifyStep3">) => {
    const insets = useSafeAreaInsets();
    const [code, setCode] = useState("");
    const [loading, setLoading] = React.useState(false);
    const { t } = useTranslation();

    return (
        <Container>
            {loading && <Spinner visible={loading} textContent={""} />}
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
                <HeaderText>{t("googleAuth")}</HeaderText>
                <TouchableOpacity
                    onPress={() => {
                        if (!code) {
                            Alert.alert("請輸入驗證碼");
                        } else {
                            setLoading(true);
                            userService.setGoogleSecret({ code: code }).then((response) => {
                                userService.verifyGoogleSecret({ code: code }).then((response) => {
                                    navigation.navigate("Setting");
                                });
                            }).finally(() => {
                                setLoading(false);
                            })
                        }
                    }}
                >
                    <Text style={{ color: "#A8C2DC", fontSize: 16, fontWeight: "600" }}>
                        {t("nickNameDone")}
                    </Text>
                </TouchableOpacity>
            </Header>
            <View style={{ padding: 16 }}>
                <Text
                    style={{
                        color: "#DDE0E3",
                        fontSize: 13,
                        fontWeight: "500",
                        marginTop: 20,
                        marginBottom: 5
                    }}
                >
                    Google 驗證碼
                </Text>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}
                >
                    <TextInput
                        style={{
                            width: "100%",
                            height: 48,
                            backgroundColor: "#242D37",
                            borderRadius: 4,
                            color: "white",
                            fontSize: 15,
                            paddingLeft: 10
                        }}
                        maxLength={6}
                        onChangeText={text => {
                            setCode(text);
                        }}
                    />
                </View>
            </View>
        </Container>
    );
};

export default GoogleVerifyStep3;
