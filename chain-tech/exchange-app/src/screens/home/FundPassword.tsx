import { Text, View, TouchableOpacity, Image, TextInput, Alert } from "react-native"
import styled from "styled-components"
import { RootStackScreenProps } from "common/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as React from "react";
import Spinner from 'react-native-loading-spinner-overlay'
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

const IconImg = styled(Image)`
  width: 28px;
  height:28px;
`
const HeaderText = styled(Text)`
  font-size: 16px;
  color: white;
  font-weight:600;
  margin-right:30;
`;

const FundPassword = ({ navigation }: RootStackScreenProps<"FundPassword">) => {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = React.useState(false);
    const [password, setPassword] = React.useState("");
    const [password2, setPassword2] = React.useState("");
    const { t } = useTranslation();
    return (
        <Container>
            {loading && <Spinner visible={loading} textContent={''} />}
            <Header insets={insets.top}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <IconImg source={require("assets/images/global/previous.png")} />
                </TouchableOpacity>
                <HeaderText>{t("fundPass")}</HeaderText>
                <View></View>
            </Header>
            <View style={{ padding: 16 }}>
                <Text style={{ color: "#DDE0E3", fontSize: 13, fontWeight: "500", marginBottom: 4 }}>{t("fundPass")}</Text>
                <TextInput style={{ width: "100%", height: 48, backgroundColor: "#242D37", borderRadius: 4, paddingLeft: 16, color: "white", fontSize: 15 }} placeholder="密碼長度至少為8個字元" secureTextEntry onChangeText={setPassword} />
                <Text style={{ color: "#DDE0E3", fontSize: 13, fontWeight: "500", marginTop: 24, marginBottom: 4 }}>資金密碼確認</Text>
                <TextInput style={{ width: "100%", height: 48, backgroundColor: "#242D37", borderRadius: 4, paddingLeft: 16, color: "white", fontSize: 15 }} placeholder="再次輸入密碼" secureTextEntry onChangeText={setPassword2} />
                <TouchableOpacity style={{ display: "flex", flexDirection: "row", backgroundColor: "#3D6A97", borderRadius: 4, justifyContent: "center", alignItems: "center", height: 44, marginTop: 42 }} onPress={() => {
                    //  navigation.navigate("Setting")
                    if (!password) {
                        Alert.alert("請輸入資金密碼")
                    }
                    else if (!password2) {
                        Alert.alert("請輸入資金密碼確認")
                    }
                    else if (password !== password2) {
                        Alert.alert("資金密碼不相同請確認後重新輸入")
                    }
                    else {
                        setLoading(true)
                        userService.setFinancePassword({
                            originPassword: password,
                            password: password2
                        }).then(() => {
                            navigation.goBack()
                        }).finally(() => {
                            setLoading(false)
                        })
                    }

                }}>
                    <Text style={{ color: "white", fontSize: 14, fontWeight: "500" }}>{t("verificationUnset")}  </Text>
                </TouchableOpacity>
            </View>
        </Container>
    );
};

export default FundPassword;
