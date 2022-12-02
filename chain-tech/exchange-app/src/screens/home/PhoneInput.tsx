import { Text, View, TouchableOpacity, Image, TextInput, Alert } from "react-native"
import styled from "styled-components"
import { RootStackScreenProps } from "common/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as React from "react";
import { useState, useEffect } from "react";
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

const PhoneInput = ({ navigation }: RootStackScreenProps<"PhoneInput">) => {
    const insets = useSafeAreaInsets();
    const [count, setCount] = useState(300)
    const [loading, setLoading] = React.useState(false);
    const [phone, setPhone] = React.useState("");
    const { t } = useTranslation();
    useEffect(() => {
        setTimeout(() => {
            if (count > 0) {
                setCount(c => c - 1)
            }
        }, 1000)
    }, [count])
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
            </Header>
            <View style={{ padding: 16 }}>
                <View>
                    <Text style={{ color: "white", fontSize: 32, fontWeight: "600" }}>{t("mobileVerification")}</Text>
                    <Text style={{ color: "#DDE0E3", fontSize: 15, fontWeight: "400", marginTop: 24, marginBottom: 4 }}>為了您的帳號安全，請輸入有效的手機號碼以完成會員基礎驗證。</Text>
                    <Text style={{ color: "#DDE0E3", fontSize: 13, fontWeight: "500", marginTop: 40, marginBottom: 5 }}>{t("mobile")}</Text>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <TextInput style={{ width: "100%", height: 48, backgroundColor: "#242D37", borderRadius: 4, color: "white", fontSize: 15, paddingLeft: 10 }} placeholder="請輸入手機號碼如：886915547875" onChangeText={text => {
                            setPhone(text)
                        }}
                        />
                    </View>
                </View>
                <TouchableOpacity style={{ display: "flex", flexDirection: "row", borderRadius: 4, justifyContent: "center", alignItems: "center", height: 44, marginTop: 42, backgroundColor: "#3D6A97" }} onPress={() => {
                    setLoading(true)
                    userService.verifyPhone({
                        phone: phone,
                    }).then(() => {
                        navigation.navigate("PhoneVerify", { phone: phone })
                    }).finally(() => {
                        setLoading(false)
                    })
                }}
                >
                    <Text style={{ color: "white", fontSize: 14, fontWeight: "500" }}>{t("nextStep")}</Text>
                </TouchableOpacity>
            </View>
        </Container>
    );
};

export default PhoneInput;
