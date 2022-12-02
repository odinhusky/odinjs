import * as React from "react"
import { Text, View, Image, TouchableOpacity, ScrollView, Alert, Dimensions } from "react-native"
import { RootStackScreenProps } from "common/types";
import styled from "styled-components"
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppSelector } from "hooks";
import Spinner from 'react-native-loading-spinner-overlay';
import { useTranslation } from "react-i18next";
import { userService } from "services";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;


const Container = styled(View) <{ insets: number }>`
    display: flex ;
    flex-direction: column;
    padding-top: ${props => props.insets}px;
    justify-content: space-between;
    background-color: #131B24;
`;

const HeaderContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
background-color: #18222D;
padding-top: 12px;
padding-left: 16px;
padding-right: 16px;
padding-bottom: 10px;
`;

const PreviousIconContainer = styled(View)`
display: flex;
flex-direction: row;
width: 33%;
align-items: center;
`;

const PreviousIcon = styled(Image)`
width: 28px;
height: 28px;
`;

const HeaderTitleTextContainer = styled(View)`
display: flex;
width: 33%;
align-items: center;
`;

const HeaderTitleText = styled(Text)`
font-weight: 600;
font-size: 16px;
line-height: 24px;
color: ${props => props.theme.color.White};
`;

const HeaderFunctionIconContainer = styled(View)`
display: flex;
width: 33%;
flex-direction: row;
justify-content: flex-end;
align-items: center;
`;

const HeaderFunctionIcon = styled(Image)`
width: 28px;
height: 28px;
`;

const HeaderEditComfirmContainer = styled(View)`
display: flex;
width: 33%;
flex-direction: row;
justify-content: flex-end;
align-items: center;
`;

const HeaderEditComfirmText = styled(Text)`
font-weight: 600;
font-size: 16px;
line-height: 24px;
color: ${props => props.theme.color.MidGray};
`;

// Body Style
const BodyContainer = styled(ScrollView)`
display: flex;
flex-direction: column;
background-color: #131B24;
padding-top: 16px;
padding-left: 16px;
padding-right: 16px;
padding-bottom: 2000px;
`;

const CardContainer = styled(View)`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center; 
`;

const CardInsideContainer = styled(View)`
height: 75px;
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
`;

const CardLeftRowContainer = styled(View)`
display: flex;
flex-direction: row;
align-items: center;
width: 10%;
`;

const CardMiddleRowContainer = styled(View)`
display: flex;
flex-direction: row;
align-items: center;
width: 80%;
`;

const CardRightRowContainer = styled(View)`
display: flex;
flex-direction: row;
align-items: center;
width: 10%;
`;

const CardColumnContainer = styled(View)`
display: flex;
flex-direction: column;
`;

const CardPaymentsTitleText = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 24px;
color: ${props => props.theme.color.White};
`;

const CardPaymentsDetailText = styled(Text)`
font-weight: 500;
font-size: 13px;
line-height: 20px;
color: ${props => props.theme.color.LightMidGray};
`;

const CardPaymentsImage = styled(Image)`
width: 28px;
height: 28px;
`;

const CardRemoveImage = styled(Image)`
height: 28px;
width: 28px;
`;

const DetailCardLine = styled(View)`
height: 1px;
background-color: #18222D;
margin-top: 4px;
margin-bottom: 4px;
`;




const Payments = ({ navigation, route }: RootStackScreenProps<"Payments">) => {
    const { token } = useAppSelector((state) => state.user)

    const insets = useSafeAreaInsets();

    const [loading, setLoading] = useState(false);

    // 編輯
    const [isEdit, setIsEdit] = useState(false);

    // 帳戶資料
    const [payments, setPayments] = useState<Payment[]>([])
    const { t } = useTranslation();
    const getUserInfoPayments = () => {
        setLoading(true);
        userService.getPayments().then((response) => {
            setPayments(response.data);
        }).finally(() => {
            setLoading(false);
        })
    };

    // 判斷帳戶類型
    const handlePaymentType = (payment: string) => {
        if (payment === 'BANK') {
            return t("bankAccount")
        } else if (payment === 'TOUCHNGO') {
            return 'TouchnGO'
        } else if (payment === 'PPAY') {
            return 'Ppay'
        }
    };

    // 判斷帳戶圖片
    const handlePaymentImage = (payment: string) => {
        if (payment === 'BANK') {
            return require('assets/images/home/BANK.png')
        } else if (payment === 'TOUCHNGO') {
            return require('assets/images/home/TOUCHNGO.png')
        } else if (payment === 'PPAY') {
            return require('assets/images/home/PPAY.png')
        }
        return "assets/images/home/account.png"
    };

    // 刪除帳戶
    const deletePayment = (paymentID: string) => {
        setLoading(true)
        userService.deletePayments(paymentID).then(()=>{
            refreshPageAlert();
        }).finally(()=>{
            setLoading(false)
        })
    };

    const deletePaymentAlert = (paymentID: string) => {
        Alert.alert(
            "確定移除？",
            "您使用此收款/付款方式的在線廣告將會被暫時中止。",
            [
                {
                    text: '取消',
                    onPress: () => { console.log("Cancel") },
                    style: 'cancel'
                },
                {
                    text: '確定',
                    onPress: () => { deletePayment(paymentID) }
                }
            ]
        )
    };

    const refreshPageAlert = () => {
        Alert.alert(
            "帳戶刪除成功！",
            "",
            [
                {
                    text: '確定',
                    onPress: () => { getUserInfoPayments() }
                }
            ]
        )
    };

    const addListener = () => {
        navigation.addListener('focus', () => getUserInfoPayments());
    };

    useEffect(() => {
        if (token) {
            getUserInfoPayments();
        }
    }, []);

    return (
        <Container insets={insets.top}>
            {
                loading &&
                <Spinner visible={true} textContent={t("loading")} color={'#FFFFFF'} textStyle={{ color: '#FFFFFF' }} />
            }
            <HeaderContainer>
                <PreviousIconContainer>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <PreviousIcon source={require("assets/images/global/previous.png")} />
                    </TouchableOpacity>
                </PreviousIconContainer>
                <HeaderTitleTextContainer>
                    <HeaderTitleText>{t("accountSet")}</HeaderTitleText>
                </HeaderTitleTextContainer>
                {
                    isEdit ?
                        <HeaderEditComfirmContainer>
                            <TouchableOpacity onPress={() => { setIsEdit(false) }}>
                                <HeaderEditComfirmText>{t("OK")}</HeaderEditComfirmText>
                            </TouchableOpacity>
                        </HeaderEditComfirmContainer> :
                        <HeaderFunctionIconContainer>
                            <TouchableOpacity onPress={() => { setIsEdit(true) }}>
                                <HeaderFunctionIcon source={require("assets/images/global/edit.png")} style={{ marginRight: 20 }} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                navigation.navigate("PaymentsCreate")
                            }}>
                                <HeaderFunctionIcon source={require("assets/images/global/add.png")} />
                            </TouchableOpacity>
                        </HeaderFunctionIconContainer>
                }
            </HeaderContainer>
            <BodyContainer>
                {
                    payments.map((x: any, i) => {
                        return (
                            <CardContainer>
                                <CardInsideContainer>
                                    <CardLeftRowContainer>
                                        <CardPaymentsImage source={handlePaymentImage(x.type)} />
                                    </CardLeftRowContainer>
                                    <CardMiddleRowContainer>
                                        <CardColumnContainer>
                                            <CardPaymentsTitleText>{handlePaymentType(x.type)}</CardPaymentsTitleText>
                                            <CardPaymentsDetailText>({x.code}) {x.account}</CardPaymentsDetailText>
                                        </CardColumnContainer>
                                    </CardMiddleRowContainer>
                                    <CardRightRowContainer>
                                        {
                                            isEdit &&
                                            <TouchableOpacity onPress={() => { deletePaymentAlert(x.id) }}>
                                                <CardRemoveImage source={require("assets/images/home/remove_circle.png")} />
                                            </TouchableOpacity>
                                        }
                                    </CardRightRowContainer>
                                </CardInsideContainer>
                                {
                                    i !== payments.length - 1 &&
                                    <DetailCardLine></DetailCardLine>
                                }
                            </CardContainer>
                        )
                    })
                }
            </BodyContainer>

        </Container>
    )
}
export default Payments