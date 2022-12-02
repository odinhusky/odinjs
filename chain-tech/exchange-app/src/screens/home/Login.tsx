import React, { useState, useContext } from "react";

import { Text, View, TouchableOpacity, Image, TextInput, Alert } from "react-native";
import { useAppDispatch } from 'hooks/redux-hooks'
import { userActions } from "store/slice";

import styled from "styled-components"
import { RootStackScreenProps } from "common/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay'
import AuthService from "services/auth.service";
import { useTranslation } from "react-i18next";
import { LoginRequest } from "interfaces/request.interface";
import { fetchUser } from 'store/slice/user';

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
`;

const IconImg = styled(Image)`
  width: 28px;
  height:28px;
`


const Login = ({ navigation }: RootStackScreenProps<"Login">) => {

    // $ init data
    const insets = useSafeAreaInsets();
    const { t } = useTranslation()
    const dispatch = useAppDispatch();

    // # states
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = useState(false);

    return (
        <Container>
            {loading &&
                <Spinner visible={true} textContent={''} />
            }
            <Header insets={insets.top}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <IconImg source={require("assets/images/global/cancel.png")} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    navigation.navigate("Register");
                }}>
                    <HeaderText>{t("signUp")}</HeaderText>
                </TouchableOpacity>
            </Header>
            <View style={{ padding: 16 }}>
                <View>
                    <Text style={{ color: "white", fontSize: 32, fontWeight: "600" }}>{t("login")}</Text>
                    <Text style={{ color: "#DDE0E3", fontSize: 13, fontWeight: "500", marginTop: 24, marginBottom: 4 }}>{t("email")}</Text>
                    <TextInput style={{ width: "100%", height: 48, backgroundColor: "#242D37", borderRadius: 4, paddingLeft: 16, color: "white", fontSize: 15 }} placeholder={t("enterEmail")} onChangeText={setEmail} />
                    <Text style={{ color: "#DDE0E3", fontSize: 13, fontWeight: "500", marginTop: 24, marginBottom: 4 }}>{t("password")}</Text>
                    <TextInput style={{ width: "100%", height: 48, backgroundColor: "#242D37", borderRadius: 4, paddingLeft: 16, color: "white", fontSize: 15 }} placeholder={t("enterPassLogin")} secureTextEntry onChangeText={setPassword} />
                </View>
                <TouchableOpacity style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }} onPress={() => {
                    navigation.navigate("ForgotPassword")
                }}>
                    <Text style={{ color: "#A8C2DC", fontSize: 14, fontWeight: "500", marginTop: 16 }}>{t("forgetPass")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ display: "flex", flexDirection: "row", backgroundColor: "#3D6A97", borderRadius: 4, justifyContent: "center", alignItems: "center", height: 44, marginTop: 42 }} onPress={() => {
                    // setLoading(true)
                    const loginRequest = {
                        account: email,
                        password: password
                    } as LoginRequest
                    AuthService.login(loginRequest).then((resp) => {
                        dispatch(userActions.setToken(resp.data.token));
                        AsyncStorage.setItem("token", resp.data.token)
                        AsyncStorage.setItem("user", JSON.stringify(resp.data.user))
                        navigation.goBack()
                    }).then(()=>{
                        dispatch(fetchUser())
                    })
                }}>
                    <Text style={{ color: "white", fontSize: 14, fontWeight: "500" }}>{t("login")}</Text>
                </TouchableOpacity>
            </View>
        </Container>
    );
};

export default Login;
