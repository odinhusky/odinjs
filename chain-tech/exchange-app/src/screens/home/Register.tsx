import { Text, View, TouchableOpacity, Image, TextInput, Alert } from "react-native"
import styled from "styled-components"
import { RootStackScreenProps } from "common/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as React from "react";
import { useState, useEffect } from "react";
import Spinner from 'react-native-loading-spinner-overlay'
import { useTranslation } from "react-i18next";
import { RegisterRequest } from 'interfaces/request.interface';
import { useAppDispatch } from "hooks";
import { registerActions } from "store/slice";
import { authService } from "services";
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

const Register = ({ navigation }: RootStackScreenProps<"Register">) => {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [password2, setPassword2] = React.useState("");
    const [promoCode, setPromocode] = React.useState("");
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation()

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
                {/* <HeaderText>登入</HeaderText>
      <View></View> */}
            </Header>
            <View style={{ padding: 16 }}>
                {loading &&
                    <Spinner visible={true} textContent={''} />
                }
                <View>
                    <Text style={{ color: "white", fontSize: 32, fontWeight: "600" }}>{t("signUp")}</Text>
                    <Text style={{ color: "#DDE0E3", fontSize: 13, fontWeight: "500", marginTop: 24, marginBottom: 4 }}>{t("email")}</Text>
                    <TextInput style={{ width: "100%", height: 48, backgroundColor: "#242D37", borderRadius: 4, paddingLeft: 16, color: "white", fontSize: 15 }} placeholder={t("enterEmail")} onChangeText={setEmail} />
                    <Text style={{ color: "#DDE0E3", fontSize: 13, fontWeight: "500", marginTop: 24, marginBottom: 4 }}>{t("password")}</Text>
                    <TextInput style={{ width: "100%", height: 48, backgroundColor: "#242D37", borderRadius: 4, paddingLeft: 16, color: "white", fontSize: 15 }} placeholder="密碼長度至少為8個字元" secureTextEntry onChangeText={setPassword} />
                    <Text style={{ color: "#DDE0E3", fontSize: 13, fontWeight: "500", marginTop: 24, marginBottom: 4 }}>{t("passConfirm")}</Text>
                    <TextInput style={{ width: "100%", height: 48, backgroundColor: "#242D37", borderRadius: 4, paddingLeft: 16, color: "white", fontSize: 15 }} placeholder="再次輸入密碼" secureTextEntry onChangeText={setPassword2} />
                    <Text style={{ color: "#DDE0E3", fontSize: 13, fontWeight: "500", marginTop: 24, marginBottom: 4 }}>{t("referralCode")}</Text>
                    <TextInput style={{ width: "100%", height: 48, backgroundColor: "#242D37", borderRadius: 4, paddingLeft: 16, color: "white", fontSize: 15 }} placeholder="選填" onChangeText={setPromocode} />
                </View>
                <TouchableOpacity style={{ display: "flex", flexDirection: "row", backgroundColor: "#3D6A97", borderRadius: 4, justifyContent: "center", alignItems: "center", height: 44, marginTop: 42 }} onPress={() => {
                    if (!email) {
                        Alert.alert("請輸入信箱")
                    } else if (email.length < 8) {
                        Alert.alert("信箱不得小於8碼")
                    } else if (!password) {
                        Alert.alert(t("enterPass"))
                    } else if (password.length < 8) {
                        Alert.alert("密碼不得小於8碼")
                    } else if (!password2) {
                        Alert.alert("請輸入密碼確認")
                    } else if (password !== password2) {
                        Alert.alert("密碼不相同請重新輸入")
                    } else {
                        const registerRequest: RegisterRequest = {
                            account: email,
                            password: password,
                            password2: password2,
                            inviteCode: promoCode
                        }
                        dispatch(registerActions.setRequest(registerRequest))
                        setLoading(true)
                        authService.checkAccount({account: email}).then((response)=>{
                            authService.sendEmail({email: email}).then(()=>{
                                navigation.navigate("EmailVerify")
                            })
                        }).finally(()=>{
                            setLoading(false)
                        })
                    }
                }}>
                    <Text style={{ color: "white", fontSize: 14, fontWeight: "500" }}>{t("nextStep")}</Text>
                </TouchableOpacity>
            </View>
        </Container>
    );
};

export default Register;
