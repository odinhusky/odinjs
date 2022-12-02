import { Text, View, TouchableOpacity, Image, TextInput, Alert, Platform } from "react-native"
import styled from "styled-components"
import { RootStackScreenProps } from "common/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as React from "react";
import { useState } from "react";
import Spinner from 'react-native-loading-spinner-overlay'
import * as ImagePicker from 'expo-image-picker';
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
  font-weight:600;
  margin-right:30;

`;

const IconImg = styled(Image)`
  width: 28px;
  height:28px;
`

const IdentityVerifyStep2 = ({ navigation, route }: RootStackScreenProps<"IdentityVerifyStep2">) => {
    const insets = useSafeAreaInsets();
    const [count, setCount] = useState(180)
    const [email, setEmail] = React.useState("");
    const [promoCode, setPromocode] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [password2, setPassword2] = React.useState("");
    const [idCardFront, setIdCardFront] = useState("");
    const [idCardBack, setIdCardBack] = useState("");
    const [selfie, setSelfie] = useState("");
    const { t } = useTranslation();
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setIdCardFront(result.uri);
        }
    };

    const pickImage2 = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setIdCardBack(result.uri);
        }
    };

    const pickImage3 = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setSelfie(result.uri);
        }
    };

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
                <HeaderText>{t("idAuth")}</HeaderText>
                <View></View>
            </Header>
            <View style={{ padding: 16, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <TouchableOpacity style={{ display: "flex", flexDirection: "row", justifyContent: "center" }} onPress={pickImage} >
                    <Image source={idCardFront ? { uri: idCardFront } : require("assets/images/home/front.png")} style={{ width: 311, height: 186 }} />
                </TouchableOpacity>
                <Text style={{ color: "#BCC2C8", fontSize: 13, fontWeight: "500", marginTop: 20 }}> {t("idCardFrontMsg")}  </Text>
                <TouchableOpacity style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginTop: 20 }} onPress={pickImage2}>
                    <Image source={idCardBack ? { uri: idCardBack } : require("assets/images/home/back.png")} style={{ width: 311, height: 186 }} />
                </TouchableOpacity>
                <Text style={{ color: "#BCC2C8", fontSize: 13, fontWeight: "500", marginTop: 20 }}>{t("idCardBackMsg")}</Text>
                <TouchableOpacity style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginTop: 20 }} onPress={pickImage3}>
                    <Image source={selfie ? { uri: selfie } : require("assets/images/home/selfie.png")} style={{ width: 311, height: 186 }} />
                </TouchableOpacity>
                <Text style={{ color: "#BCC2C8", fontSize: 13, fontWeight: "500", marginTop: 20 }}>{t("selfieMsg")}</Text>

                <TouchableOpacity style={{ display: "flex", flexDirection: "row", backgroundColor: "#3D6A97", borderRadius: 4, justifyContent: "center", alignItems: "center", height: 44, marginTop: 42, width: "100%" }} onPress={async () => {
                    if (!idCardFront) {
                        alert("請上傳身分證正面")
                    } else if (!idCardBack) {
                        alert("請上傳身分證反面")
                    } else if (!selfie) {
                        alert("請上傳手持自拍照")
                    }
                    else {

                        const FormData = global.FormData;
                        const formData: any = new FormData();

                        formData.append("idCardFront", { uri: idCardFront, name: "123", type: "image/jpeg" })
                        formData.append("idCardBack", { uri: idCardBack, name: "456", type: "image/jpeg" })
                        formData.append("selfie", { uri: selfie, name: "789", type: "image/jpeg" })
                        formData.append("name", route.params.name)
                        formData.append("address", route.params.address)
                        formData.append("birthday", route.params.birth)

                        setLoading(true)
                        userService.applyKyc(formData).then(() => {
                            navigation.navigate("Setting")
                        }).finally(()=>{
                            setLoading(false)
                        })
                    }
                }}>
                    <Text style={{ color: "white", fontSize: 14, fontWeight: "500" }}>{t("saveIdCard")}</Text>
                </TouchableOpacity>
            </View>
        </Container>
    );
};

export default IdentityVerifyStep2;
