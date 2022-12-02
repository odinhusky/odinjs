import { Text, View, TouchableOpacity, Image, TextInput, Alert, Dimensions } from "react-native"
import styled from "styled-components"
import { RootStackScreenProps } from "common/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as React from "react";
import { useState, useEffect } from "react";
import { useAppSelector } from "hooks";
import Spinner from 'react-native-loading-spinner-overlay'
import Modal from "react-native-modal";
import { useTranslation } from "react-i18next";
import { authService, userService } from "services";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

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

// Password Modal Style
const PasswordModalContainer = styled(View)`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
padding-top: 16px;
padding-left: 16px;
padding-right: 16px;
`;

const PasswordModalHeaderText = styled(Text)`
font-weight: 500;
font-size: 16px;
line-height: 20px;
color: ${props => props.theme.color.White};
`;

const PasswordModalHeaderDetailText = styled(Text)`
font-weight: 400;
font-size: 14px;
line-height: 18px;
color: ${props => props.theme.color.LightGray};
margin-top: 8px;
`;

const PasswordModalRowLine = styled(View)`
height: 1px;
width: 100%;
background-color: #3B393E;
margin-top: 16px;
`;

const PasswordModalButtonContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
padding-right: 16px;
padding-left: 16px;
`;

const PasswordModalCancelButton = styled(TouchableOpacity)`
height: 43px;
width: 45%;
border-bottom-left-radius: 18px;
justify-content: center;
align-items: center;
`;

const PasswordModalCancelButtonText = styled(Text)`
font-weight: 400;
font-size: 16px;
line-height: 20px;
color: #98999A;
`;

const PasswordModalButtonLine = styled(View)`
height: 43px;
width: 1px;
background-color: #3B393E;
`;

const PasswordModalSubmitButton = styled(TouchableOpacity)`
height: 43px;
width: 45%;
border-bottom-right-radius: 18px;
justify-content: center;
align-items: center;
`;

const PasswordModalSubmitButtonText = styled(Text)`
font-weight: 500;
font-size: 16px;
line-height: 20px;
color: #0A84FF;
`;


const ResetFundPassword = ({ navigation }: RootStackScreenProps<"ResetFundPassword">) => {
    const { detail: user } = useAppSelector((state) => state.user)
    const insets = useSafeAreaInsets();
    const [count, setCount] = useState(0)
    const [count2, setCount2] = useState(0)
    const [email, setEmail] = React.useState("");
    const [emailSend, setEmailSend] = React.useState(false);
    const [phoneSend, setPhoneSend] = React.useState(false);
    const [phone, setPhone] = React.useState("");
    const [emailCode, setEmailcode] = React.useState("");
    const [phoneCode, setPhonecode] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [password, setPassword] = React.useState("");
    const [password2, setPassword2] = React.useState("");
    const [isPassordModalVisible, setIsPasswordModalVisible] = useState(false);
    const [isPassordModalVisible2, setIsPasswordModalVisible2] = useState(false);
    const [userSecurity, setUserSecurity] = React.useState<UserSecurity>({} as UserSecurity);
    const { t } = useTranslation();
    useEffect(() => {
        setPhone(user.phone)
        setEmail(user.account)
        userService.getSecurity().then((response) => {
            setUserSecurity(response.data);
        })
        if (emailSend) {
            setTimeout(() => {
                if (count > 0) {
                    setCount(c => c - 1)
                }
            }, 1000)
        }
        if (count == 0) {
            setEmailSend(false)
        }
    }, [count])

    useEffect(() => {
        if (phoneSend) {
            setTimeout(() => {
                if (count2 > 0) {
                    setCount2(c => c - 1)
                }
            }, 1000)
        }
        if (count2 == 0) {
            setPhoneSend(false)
        }
    }, [count2])
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
                <HeaderText>{t("resetFundPass2")}</HeaderText>
                <View></View>
            </Header>
            <View style={{ padding: 16 }}>

                <Text style={{ color: "#DDE0E3", fontSize: 13, fontWeight: "500", marginBottom: 4 }}>{t("password")}</Text>
                <TextInput style={{ width: "100%", height: 48, backgroundColor: "#242D37", borderRadius: 4, paddingLeft: 16, color: "white", fontSize: 15 }} placeholder={t("enterPass")} secureTextEntry onChangeText={setPassword} />

                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ color: "#DDE0E3", fontSize: 13, fontWeight: "500", marginTop: 24, marginBottom: 4 }}>{t("emailCode")}</Text>

                    <TouchableOpacity onPress={() => {
                        // setIsPasswordModalVisible(true)

                        setLoading(true)
                        authService.sendEmail({ email: email }).then((response) => {
                            Alert.alert(response.msg)
                            setEmailSend(true)
                            setCount(60)
                            setIsPasswordModalVisible(false)
                        }).finally(() => {
                            setLoading(false)
                        })
                    }}>
                        {emailSend ? <Text style={{ color: "#DDE0E3", fontSize: 13, fontWeight: "500", marginTop: 24 }}>{count}s</Text>
                            : <Text style={{ color: "#DDE0E3", fontSize: 13, fontWeight: "500", marginTop: 24 }}>{t("sendEmailCode")}</Text>
                        }
                    </TouchableOpacity>
                </View>
                <TextInput style={{ width: "100%", height: 48, backgroundColor: "#242D37", borderRadius: 4, paddingLeft: 16, color: "white", fontSize: 15 }} placeholder={t("enterEmailCode")} onChangeText={setEmailcode} />

                {userSecurity.phone && <>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ color: "#DDE0E3", fontSize: 13, fontWeight: "500", marginTop: 24, marginBottom: 4 }}>{t("mobileCode")}</Text>

                        <TouchableOpacity onPress={() => {
                            // setIsPasswordModalVisible2(true)

                            setLoading(true)
                            userService.verifyPhone({ phone: phone }).then((response) => {
                                Alert.alert(response.msg)
                                setPhoneSend(true)
                                setCount2(60)
                                setIsPasswordModalVisible2(false)
                            }).finally(() => {
                                setLoading(false)
                            })
                        }}>
                            {phoneSend ? <Text style={{ color: "#DDE0E3", fontSize: 13, fontWeight: "500", marginTop: 24, borderBottomWidth: 1, borderBottomColor: "white" }}>{count2}s</Text>
                                : <Text style={{ color: "#DDE0E3", fontSize: 13, fontWeight: "500", marginTop: 24, borderBottomWidth: 1, borderBottomColor: "white" }}>{t("sendMobileCode")}</Text>
                            }
                        </TouchableOpacity>
                    </View>
                    <TextInput style={{ width: "100%", height: 48, backgroundColor: "#242D37", borderRadius: 4, paddingLeft: 16, color: "white", fontSize: 15 }} placeholder={t("enterMobileCode")} onChangeText={setPhonecode} />

                </>}
                <Text style={{ color: "#DDE0E3", fontSize: 13, fontWeight: "500", marginTop: 24, marginBottom: 4 }}>{t("newFundPass")}</Text>
                <TextInput style={{ width: "100%", height: 48, backgroundColor: "#242D37", borderRadius: 4, paddingLeft: 16, color: "white", fontSize: 15 }} placeholder={t("enterNewFundPass")} secureTextEntry onChangeText={setPassword2} />
                <TouchableOpacity style={{ display: "flex", flexDirection: "row", backgroundColor: "#3D6A97", borderRadius: 4, justifyContent: "center", alignItems: "center", height: 44, marginTop: 42 }} onPress={() => {
                    //  navigation.navigate("Setting")
                    if (!password) {
                        Alert.alert(t("enterPass"))
                    }
                    else if (!emailCode) {
                        Alert.alert("請輸入信箱驗證")
                    }
                    else if (userSecurity.phone && !phoneCode) {
                        Alert.alert(t("enterMobileCode"))
                    }
                    else if (!password2) {
                        Alert.alert(t("enterNewFundPass"))
                    }

                    else {
                        setLoading(true)
                        userService.resetFinancePassword({
                            password: password,
                            mailCode: emailCode,
                            phoneCode: userSecurity.phone ? phoneCode : null,
                            financePassword: password2
                        }).then((response) => {
                            navigation.goBack()
                        }).finally(() => {
                            setLoading(false)
                        })
                    }

                }}>
                    <Text style={{ color: "white", fontSize: 14, fontWeight: "500" }}>{t("OK")}</Text>
                </TouchableOpacity>
            </View>
            <Modal
                isVisible={isPassordModalVisible}
                deviceHeight={windowHeight}
                deviceWidth={windowWidth}
                animationInTiming={500}
                animationOutTiming={700}
                backdropOpacity={0.9}
                onBackdropPress={() => setIsPasswordModalVisible(false)}
                onSwipeComplete={() => setIsPasswordModalVisible(false)}
                swipeDirection={['down']}
                style={{ justifyContent: 'center', margin: 0 }}
                hideModalContentWhileAnimating={true}
            >
                <View style={{
                    backgroundColor: 'rgba(40, 39, 42, 1)',
                    borderTopLeftRadius: 18,
                    borderTopRightRadius: 18,
                    borderBottomLeftRadius: 18,
                    borderBottomRightRadius: 18,
                    marginLeft: 53,
                    marginRight: 53,
                }}>
                    <PasswordModalContainer>
                        <PasswordModalHeaderText>輸入信箱</PasswordModalHeaderText>
                        {/* <PasswordModalHeaderDetailText>{t("sellingEnterPass")}</PasswordModalHeaderDetailText> */}

                        <View style={{
                            height: 32,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 14,
                            marginLeft: 16,
                            marginRight: 16,
                            paddingLeft: 12,
                            paddingRight: 12,
                            borderWidth: 1,
                            borderColor: '#3B393E',
                            borderRadius: 4,
                            alignItems: 'center',
                        }}>
                            <TextInput
                                style={{ width: '100%', color: '#FFFFFF' }}
                                placeholder="輸入信箱"
                                placeholderTextColor={'#98999A'}
                                autoCapitalize="none"
                                autoCorrect={false}
                                textContentType="newPassword"
                                value={email}
                                enablesReturnKeyAutomatically
                                onChangeText={text => setEmail(text)}
                            />
                        </View>
                    </PasswordModalContainer>
                    <PasswordModalRowLine></PasswordModalRowLine>
                    <PasswordModalButtonContainer>
                        <PasswordModalCancelButton onPress={() => { setIsPasswordModalVisible(false) }}>
                            <PasswordModalCancelButtonText>{t("cancel")}</PasswordModalCancelButtonText>
                        </PasswordModalCancelButton>
                        <PasswordModalButtonLine />
                        <PasswordModalSubmitButton onPress={() => {
                            setLoading(true)
                            authService.sendEmail({ email: email }).then((response) => {
                                Alert.alert(response.msg)
                                setIsPasswordModalVisible(false)
                            }).finally(() => {
                                setLoading(false)
                            })
                        }}>
                            <PasswordModalSubmitButtonText>{t("OK")}</PasswordModalSubmitButtonText>
                        </PasswordModalSubmitButton>
                    </PasswordModalButtonContainer>
                </View>
            </Modal>
            <Modal
                isVisible={isPassordModalVisible2}
                deviceHeight={windowHeight}
                deviceWidth={windowWidth}
                animationInTiming={500}
                animationOutTiming={700}
                backdropOpacity={0.9}
                onBackdropPress={() => setIsPasswordModalVisible2(false)}
                onSwipeComplete={() => setIsPasswordModalVisible2(false)}
                swipeDirection={['down']}
                style={{ justifyContent: 'center', margin: 0 }}
                hideModalContentWhileAnimating={true}
            >
                <View style={{
                    backgroundColor: 'rgba(40, 39, 42, 1)',
                    borderTopLeftRadius: 18,
                    borderTopRightRadius: 18,
                    borderBottomLeftRadius: 18,
                    borderBottomRightRadius: 18,
                    marginLeft: 53,
                    marginRight: 53,
                }}>
                    <PasswordModalContainer>
                        <PasswordModalHeaderText>輸入手機</PasswordModalHeaderText>
                        {/* <PasswordModalHeaderDetailText>{t("sellingEnterPass")}</PasswordModalHeaderDetailText> */}

                        <View style={{
                            height: 32,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 14,
                            marginLeft: 16,
                            marginRight: 16,
                            paddingLeft: 12,
                            paddingRight: 12,
                            borderWidth: 1,
                            borderColor: '#3B393E',
                            borderRadius: 4,
                            alignItems: 'center',
                        }}>
                            <TextInput
                                style={{ width: '100%', color: '#FFFFFF' }}
                                placeholder="如：886915547875"
                                placeholderTextColor={'#98999A'}
                                autoCapitalize="none"
                                autoCorrect={false}
                                textContentType="newPassword"
                                value={phone}
                                enablesReturnKeyAutomatically
                                onChangeText={text => setPhone(text)}
                            />
                        </View>
                    </PasswordModalContainer>
                    <PasswordModalRowLine></PasswordModalRowLine>
                    <PasswordModalButtonContainer>
                        <PasswordModalCancelButton onPress={() => { setIsPasswordModalVisible2(false) }}>
                            <PasswordModalCancelButtonText>{t("cancel")}</PasswordModalCancelButtonText>
                        </PasswordModalCancelButton>
                        <PasswordModalButtonLine />
                        <PasswordModalSubmitButton onPress={() => {
                            setLoading(true)
                            userService.verifyPhone({ phone: phone }).then((response) => {
                                Alert.alert(response.msg)
                                setIsPasswordModalVisible2(false)
                            }).finally(() => {
                                setLoading(false)
                            })
                        }}>
                            <PasswordModalSubmitButtonText>{t("OK")}</PasswordModalSubmitButtonText>
                        </PasswordModalSubmitButton>
                    </PasswordModalButtonContainer>
                </View>
            </Modal>
        </Container>
    );
};

export default ResetFundPassword;
