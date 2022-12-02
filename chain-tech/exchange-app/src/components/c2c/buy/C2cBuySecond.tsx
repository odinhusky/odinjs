import * as React from "react"
import { Text, View, ScrollView, Image, TouchableOpacity, Dimensions, Alert } from "react-native"
import Modal from "react-native-modal";
import styled from "styled-components"
import { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import { useAppSelector } from "hooks";
import { otcOrderService } from "services";
import { OtcOrderStatus } from "common/constant";
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;


const Container = styled(ScrollView)`
display: flex;
flex-direction: column;
background-color: #18222D;
padding-left: 16px;
padding-right: 16px;
`;


// First Card Style
const FirstCardContainer = styled(View)`
display: flex;
flex-direction: column;
padding-top: 20px;
padding-right: 16px;
padding-left: 16px;
padding-bottom: 20px;
background-color: #242D37;
border-radius: 8px;
`;

const FirstCardRowContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
margin-top: 8px;
`;

const FirstCardFirstRowContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: baseline;
`;

const FirstCardFirstInRowContainer = styled(View)`
display: flex;
flex-direction: row;
align-items: baseline;
`;

const FirstCardTitleText = styled(Text)`
font-weight: 500;
font-size: 13px;
line-height: 20px;
color: ${props => props.theme.color.MidGray};
`;

const FirstCardPriceText = styled(Text)`
font-weight: 700;
font-size: 24px;
line-height: 30px;
color: ${props => props.theme.color.Secondary};
padding-right: 4px;
`;

const FirstCardPriceCurrencyText = styled(Text)`
font-weight: 700;
font-size: 16px;
line-height: 20px;
color: ${props => props.theme.color.Secondary};
`;

const FirstCardValueText = styled(Text)`
font-weight: 600;
font-size: 13px;
line-height: 16px;
color: ${props => props.theme.color.ExtraLightGray};
`;


// Second Card Style
const SecondCardContainer = styled(View)`
display: flex;
flex-direction: column;
padding-top: 20px;
padding-right: 16px;
padding-left: 16px;
padding-bottom: 20px;
background-color: #242D37;
border-radius: 8px;
margin-top: 16px;
`;

const SecondCardTitleText = styled(Text)`
font-weight: 600;
font-size: 16px;
line-height: 24px;
color: ${props => props.theme.color.White};
`;

const SecondCardDetailText = styled(Text)`
font-weight: 500;
font-size: 13px;
line-height: 20px;
color: ${props => props.theme.color.LightMidGray};
margin-top: 8px;
`;

const SecondCardPaymentContainer = styled(View)`
display: flex;
flex-direction: column;
`;

const SecondCardPayTypeRowContainer = styled(ScrollView)`
display: flex;
flex-direction: row;
margin-top: 24px;
margin-bottom: 12px;
`;

const BankAccountButtonClicked = styled(TouchableOpacity)`
width: 67px;
height: 32px;
background-color: ${props => props.theme.color.PrimaryDark};
justify-content: center;
align-items: center;
border-radius: 16px;
margin-right: 8px;
`;

const BankAccountButton = styled(TouchableOpacity)`
width: 67px;
height: 32px;
background-color: ${props => props.theme.color.DarkGray};
justify-content: center;
align-items: center;
border-radius: 16px;
margin-right: 8px;
`;

const TouchnGoButtonClicked = styled(TouchableOpacity)`
width: 104px;
height: 32px;
background-color: ${props => props.theme.color.PrimaryDark};
justify-content: center;
align-items: center;
border-radius: 16px;
margin-right: 8px;
`;

const TouchnGoButton = styled(TouchableOpacity)`
width: 104px;
height: 32px;
background-color: ${props => props.theme.color.DarkGray};
justify-content: center;
align-items: center;
border-radius: 16px;
margin-right: 8px;
`;

const PpayButtonClicked = styled(TouchableOpacity)`
width: 59px;
height: 32px;
background-color: ${props => props.theme.color.PrimaryDark};
justify-content: center;
align-items: center;
border-radius: 16px;
margin-right: 8px;
`;

const PpayButton = styled(TouchableOpacity)`
width: 59px;
height: 32px;
background-color: ${props => props.theme.color.DarkGray};
justify-content: center;
align-items: center;
border-radius: 16px;
margin-right: 8px;
`;

const PayTypeButtonClickedText = styled(Text)`
font-weight: 500;
font-size: 14px;
line-height: 22px;
color: ${props => props.theme.color.White};
`;

const PayTypeButtonText = styled(Text)`
font-weight: 500;
font-size: 14px;
line-height: 22px;
color: ${props => props.theme.color.MidGray};
`;

const PayBottomContainer = styled(View)``;

const SecondCardPayDetailContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
margin-top: 8px;
`;

const SecondCardPayDetailInRowContainer = styled(View)`
display: flex;
flex-direction: row;
align-items: center;
`;

const SecondCardPayDetailTitleText = styled(Text)`
font-weight: 500;
font-size: 13px;
line-height: 20px;
color: ${props => props.theme.color.MidGray};
`;

const SecondCardPayDetailValueText = styled(Text)`
font-weight: 500;
font-size: 13px;
line-height: 20px;
color: ${props => props.theme.color.ExtraLightGray};
`;

const DuplicateIcon = styled(Image)`
width: 18px;
height: 18px;
`;

const QRCodeText = styled(Text)`
font-weight: 500;
font-size: 14px;
line-height: 22px;
color: ${props => props.theme.color.PrimaryLight};
`;

const BottomButtonContainer = styled(View)`
display: flex;
flex-direction: row
justify-content: space-between;
margin-top: 37px;
padding-bottom: 200px;
`;

const CancelButton = styled(TouchableOpacity)`
width: 25%;
height: 44px;
justify-content: center;
align-items: center;
border: 1px solid ${props => props.theme.color.Primary};
border-radius: 4px;
`;

const CancelButtonText = styled(Text)`
font-weight: 500;
font-size: 14px;
line-height: 22px;
color: ${props => props.theme.color.Primary};
`;

const SubmitButton = styled(TouchableOpacity)`
height: 44px;
width: 70%;
justify-content: center;
align-items: center;
background-color: ${props => props.theme.color.PrimaryDark};
border-radius: 4px;
`;

const SubmitButtonText = styled(Text)`
font-weight: 500;
font-size: 14px;
line-height: 22px;
color: ${props => props.theme.color.White};
`;


// Modal Style
const ModalHeaderContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
padding-top: 10px;
padding-bottom: 26px;
`;

const ModalHedaerTitleText = styled(Text)`
font-weight: 600;
font-size: 16px;
line-height: 24px
color: ${props => props.theme.color.White};
`;

const ModalLeftCancelButton = styled(Image)`
width: 28px;
height: 28px;
`;

const ModalEmptyDiv = styled(View)`
width: 28px;
height: 28px;
`;

const QRCodeContainer = styled(View)`
width: 224px;
height: 224px;
justify-content: center;
align-items: center;
background-color: ${props => props.theme.color.White};
`;

const QRCodeImage = styled(Image)`
width: 137px;
height: 137px;
`;

const ModalDetailText = styled(Text)`
font-weight: 500;
font-size: 13px;
line-height: 20px;
color: ${props => props.theme.color.LightMidGray};
margin-top: 24px;

`;

const C2cBuySecond = (props: {
    PayTypeTouchnGo: boolean;
    PayTypePpay: boolean;
    onChangeSetSwapPage: React.Dispatch<React.SetStateAction<number>>;
    onChangeSetChoosePayType: React.Dispatch<React.SetStateAction<string>>;
    onValueChangeIsWaitFinish: React.Dispatch<React.SetStateAction<number>>;

}) => {
    const advertisement = useAppSelector((state) => state.c2c.advertisement)
    const otcOrder = useAppSelector((state) => state.otcOrder.buying)
    const {
        PayTypeTouchnGo,
        PayTypePpay,
        onChangeSetSwapPage,
        onChangeSetChoosePayType,
        onValueChangeIsWaitFinish,
    } = props;

    //選擇付款方式
    const [choosePayType, setChoosePaytype] = useState("");
    const [choosePayTypeID, setChoosePayTypeID] = useState("");

    //付款資料
    const [accountDetail, setAccountDetail] = useState<Payment[]>([]);
    const [touchnGoDetail, setTouchnGoDetail] = useState<Payment[]>([]);
    const [pPayDetail, setPpayDetail] = useState<Payment[]>([]);


    // QRCode Modal
    const [isQRCodeModalVisible, setIsQRCodeModalVisible] = useState(false);

    const toggleQRCodeModal = () => {
        setIsQRCodeModalVisible(!isQRCodeModalVisible);
    };

    // 取消訂單

    const navigation = useNavigation();
    const { t } = useTranslation();
    const cancelAlert = () =>
        Alert.alert(
            "確定取消訂單？",
            "惡意取消訂單若達到 3 次或更多，您帳戶的部分功能將暫時禁用。",
            [
                {
                    text: "取消",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "確定", onPress: () => { postCancelRequest() } }
            ]
        );

    const postCancelRequest = () => {
        otcOrderService.cancel(otcOrder.id).then(() => {
            Alert.alert("訂單已取消")
            navigation.goBack()
        })
    }

    // 送出訂單，下一步
    const [submitText, setSubmitText] = useState('確認交易');

    const handleSubmitAlert = () => {
        if (otcOrder.status === OtcOrderStatus.WAIT_FOR_BUYER) {
            otcOrderService.check(otcOrder.id)
        } else {
            if (choosePayType !== "") {
                SubmitAlert()
            } else {
                Alert.alert("請選擇付款方式")
            }
        }

    };

    const SubmitAlert = () => {
        if (choosePayType != "") {
            Alert.alert(
                "已完成付款？",
                "請確定您已向賣方完成付款，惡意點擊系統將直接凍結您的賬戶。",
                [
                    {
                        text: "取消",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "確定", onPress: () => { postRequestPaid() } }
                ]
            );
        }
    };

    const postRequestPaid = () => {
        otcOrderService.paid(otcOrder.id, {
            payment: {
                id: choosePayTypeID
            }
        }).then(() => {
            setSubmitText('放行中...')
            onChangeSetChoosePayType(choosePayType);
            onValueChangeIsWaitFinish(1)
        })
    };

    // 更改Button Style
    const handleButtonDisabled = () => {
        if (submitText === '已付款，下一步' || submitText === '確認交易') {
            return false;
        } else {
            return true;
        }
    };

    const handleSubmitButtonStyle = () => {
        if (submitText === '放行中...') {
            return 'rgba(102, 153, 204, 0.3)';
        } else {
            return '#3D6A97';
        }
    };

    const handleSubmitButtonTextStyle = () => {
        if (submitText === '等待賣家確認交易') {
            return 'rgba(255, 255, 255, 0.3)';
        } else {
            return '#FFFFFF';
        }
    };

    const handleCancelButtonStyle = () => {
        if (submitText === '放行中...') {
            return 'rgba(102, 153, 204, 0.3)';
        } else {
            return '#6699CC';
        }
    };

    const handleCancelButtonTextStyle = () => {
        if (submitText === '放行中...') {
            return 'rgba(102, 153, 204, 0.3)';
        } else {
            return '#6699CC';
        }
    };

    const getPaymentsDetail = () => {
        otcOrderService.getPayments(otcOrder.id).then((payments) => {
            payments.forEach((payment) => {
                if (payment.type === 'BANK') {
                    setAccountDetail(p => [...p, payment])
                } else if (payment.type === 'TOUCHNGO') {
                    setTouchnGoDetail(p => [...p, payment])
                } else if (payment.type === 'PPAY') {
                    setPpayDetail(p => [...p, payment])
                }
            })
        })
    };
    // 更新訂單訊息
    const getBuyStatus = () => { // 按下付款後獲取訂單狀態，用以切換頁面
        console.log("hit")
        onValueChangeIsWaitFinish(2)
        onChangeSetSwapPage(3)
    };

    useEffect(() => {
        getPaymentsDetail();
    }, [])

    useEffect(() => {
        console.log(`otc order status change ${otcOrder.status}`)
        switch (otcOrder.status) {
            case OtcOrderStatus.WAIT_FOR_SELLER:
                setSubmitText("等待賣家確認交易"); break;
            case OtcOrderStatus.WAIT_FOR_PAID:
                setSubmitText("已付款，下一步"); break;
            case OtcOrderStatus.WAIT_FOR_BUYER:
                setSubmitText("確認交易"); break;
            case OtcOrderStatus.WAIT_FOR_SEND:
                setSubmitText("放行中..."); break;
            case OtcOrderStatus.FINISH:
                getBuyStatus(); break;
            case OtcOrderStatus.CANCEL:
                Alert.alert(t("fiatOrderCanceled"))
                navigation.goBack()
                break;
            case OtcOrderStatus.APPEAL:
                Alert.alert(t("orderAppealing"))
                navigation.goBack()
                break;
            default:
                Alert.alert(`otc order status error ${otcOrder.status}`)
        }
    }, [otcOrder]);

    return (
        <Container>
            <FirstCardContainer>
                <FirstCardFirstRowContainer>
                    <FirstCardTitleText>{t("fiatTotal")}</FirstCardTitleText>
                    <FirstCardFirstInRowContainer>
                        <FirstCardPriceText>{otcOrder.amount}</FirstCardPriceText>
                        <FirstCardPriceCurrencyText>{advertisement.fiatCurrency}</FirstCardPriceCurrencyText>
                    </FirstCardFirstInRowContainer>
                </FirstCardFirstRowContainer>
                <FirstCardRowContainer>
                    <FirstCardTitleText>{t("amount")}</FirstCardTitleText>
                    <FirstCardValueText>{otcOrder.quantity} {advertisement.cryptoAsset}</FirstCardValueText>
                </FirstCardRowContainer>
                <FirstCardRowContainer>
                    <FirstCardTitleText>{t("unitPrice")}</FirstCardTitleText>
                    <FirstCardValueText>{advertisement.price} {advertisement.fiatCurrency}</FirstCardValueText>
                </FirstCardRowContainer>
                <FirstCardRowContainer>
                    <FirstCardTitleText>{t("fiatOrderNumber")}</FirstCardTitleText>
                    <View style={{ alignItems: 'flex-end' }}>
                        <FirstCardValueText>{otcOrder.id.slice(0, 28)}</FirstCardValueText>
                        <FirstCardValueText>{otcOrder.id.slice(28)}</FirstCardValueText>
                    </View>
                </FirstCardRowContainer>
            </FirstCardContainer>
            <SecondCardContainer>
                <SecondCardTitleText>{t("payments")}</SecondCardTitleText>
                <SecondCardDetailText>{t("fiatPayMsg")}</SecondCardDetailText>
                <SecondCardPayTypeRowContainer horizontal={true}>
                    {
                        (accountDetail.map((payment) => {
                            if (choosePayType == 'BANK' && choosePayTypeID == payment.id) {
                                return (
                                    <BankAccountButtonClicked onPress={() => { setChoosePaytype('BANK'), setChoosePayTypeID("") }} disabled={handleButtonDisabled()}>
                                        <PayTypeButtonClickedText>{t("bankCard")}</PayTypeButtonClickedText>
                                    </BankAccountButtonClicked>
                                )
                            } else {
                                return (
                                    <BankAccountButton onPress={() => { setChoosePaytype('BANK'), setChoosePayTypeID(payment.id) }} disabled={handleButtonDisabled()}>
                                        <PayTypeButtonText>{t("bankCard")}</PayTypeButtonText>
                                    </BankAccountButton>
                                )
                            }
                        }))
                    }
                    {
                        PayTypeTouchnGo &&
                        (touchnGoDetail.map((payment) => {
                            if (choosePayType == 'TOUCHNGO' && choosePayTypeID == payment.id) {
                                return (
                                    <TouchnGoButtonClicked onPress={() => { setChoosePaytype('TOUCHNGO'), setChoosePayTypeID("") }} disabled={handleButtonDisabled()}>
                                        <PayTypeButtonClickedText>Touch'n Go</PayTypeButtonClickedText>
                                    </TouchnGoButtonClicked>
                                )
                            } else {
                                return (
                                    <TouchnGoButton onPress={() => { setChoosePaytype('TOUCHNGO'), setChoosePayTypeID(payment.id) }} disabled={handleButtonDisabled()}>
                                        <PayTypeButtonText>Touch'n Go</PayTypeButtonText>
                                    </TouchnGoButton>
                                )
                            }
                        }))
                    }
                    {
                        PayTypePpay &&
                        (pPayDetail.map((payment) => {
                            if (choosePayType == 'PPAY' && choosePayTypeID == payment.id) {
                                return (
                                    <PpayButtonClicked onPress={() => { setChoosePaytype('PPAY'), setChoosePayTypeID("") }} disabled={handleButtonDisabled()}>
                                        <PayTypeButtonClickedText>Ppay</PayTypeButtonClickedText>
                                    </PpayButtonClicked>
                                )
                            } else {
                                return (
                                    <PpayButton onPress={() => { setChoosePaytype('PPAY'), setChoosePayTypeID(payment.id) }} disabled={handleButtonDisabled()}>
                                        <PayTypeButtonText>Ppay</PayTypeButtonText>
                                    </PpayButton>
                                )
                            }
                        }))
                    }
                </SecondCardPayTypeRowContainer>
                {
                    choosePayType === 'BANK' &&
                    accountDetail.map((payment) => {
                        if (payment.id === choosePayTypeID) {
                            return (
                                <PayBottomContainer>
                                    <SecondCardPayDetailContainer>
                                        <SecondCardPayDetailTitleText>{t("accountName")}</SecondCardPayDetailTitleText>
                                        <SecondCardPayDetailInRowContainer>
                                            <SecondCardPayDetailValueText>{payment.name}</SecondCardPayDetailValueText>
                                            <DuplicateIcon source={require("assets/images/c2c/copy.png")} />
                                        </SecondCardPayDetailInRowContainer>
                                    </SecondCardPayDetailContainer>
                                    <SecondCardPayDetailContainer>
                                        <SecondCardPayDetailTitleText>{t("bankName")}</SecondCardPayDetailTitleText>
                                        <SecondCardPayDetailInRowContainer>
                                            <SecondCardPayDetailValueText>{payment.code}</SecondCardPayDetailValueText>
                                            <DuplicateIcon source={require("assets/images/c2c/copy.png")} />
                                        </SecondCardPayDetailInRowContainer>
                                    </SecondCardPayDetailContainer>
                                    <SecondCardPayDetailContainer>
                                        <SecondCardPayDetailTitleText>{t("accountNum")}</SecondCardPayDetailTitleText>
                                        <SecondCardPayDetailInRowContainer>
                                            <SecondCardPayDetailValueText>{payment.account}</SecondCardPayDetailValueText>
                                            <DuplicateIcon source={require("assets/images/c2c/copy.png")} />
                                        </SecondCardPayDetailInRowContainer>
                                    </SecondCardPayDetailContainer>
                                </PayBottomContainer>
                            )
                        }
                    })
                }
                {
                    choosePayType === 'TOUCHNGO' &&
                    touchnGoDetail.map((payment) => {
                        if (payment.id === choosePayTypeID) {
                            return (
                                <PayBottomContainer>
                                    <SecondCardPayDetailContainer>
                                        <SecondCardPayDetailTitleText>帳戶姓名</SecondCardPayDetailTitleText>
                                        <SecondCardPayDetailInRowContainer>
                                            <SecondCardPayDetailValueText>{payment.name}</SecondCardPayDetailValueText>
                                            <DuplicateIcon source={require("assets/images/c2c/copy.png")} />
                                        </SecondCardPayDetailInRowContainer>
                                    </SecondCardPayDetailContainer>
                                    <SecondCardPayDetailContainer>
                                        <SecondCardPayDetailTitleText>支付帳號</SecondCardPayDetailTitleText>
                                        <SecondCardPayDetailInRowContainer>
                                            <SecondCardPayDetailValueText>{payment.account}</SecondCardPayDetailValueText>
                                            <DuplicateIcon source={require("assets/images/c2c/copy.png")} />
                                        </SecondCardPayDetailInRowContainer>
                                    </SecondCardPayDetailContainer>
                                    <SecondCardPayDetailContainer>
                                        <SecondCardPayDetailTitleText>二維碼</SecondCardPayDetailTitleText>
                                        <TouchableOpacity onPress={() => { toggleQRCodeModal() }}>
                                            <QRCodeText>查看</QRCodeText>
                                        </TouchableOpacity>
                                    </SecondCardPayDetailContainer>
                                </PayBottomContainer>
                            )
                        }
                    })
                }
                {
                    choosePayType === 'PPAY' &&
                    pPayDetail.map((payment) => {
                        if (payment.id === choosePayTypeID) {
                            return (
                                <PayBottomContainer>
                                    <SecondCardPayDetailContainer>
                                        <SecondCardPayDetailTitleText>帳戶姓名</SecondCardPayDetailTitleText>
                                        <SecondCardPayDetailInRowContainer>
                                            <SecondCardPayDetailValueText>{payment.name}</SecondCardPayDetailValueText>
                                            <DuplicateIcon source={require("assets/images/c2c/copy.png")} />
                                        </SecondCardPayDetailInRowContainer>
                                    </SecondCardPayDetailContainer>
                                    <SecondCardPayDetailContainer>
                                        <SecondCardPayDetailTitleText>支付帳號</SecondCardPayDetailTitleText>
                                        <SecondCardPayDetailInRowContainer>
                                            <SecondCardPayDetailValueText>{payment.account}</SecondCardPayDetailValueText>
                                            <DuplicateIcon source={require("assets/images/c2c/copy.png")} />
                                        </SecondCardPayDetailInRowContainer>
                                    </SecondCardPayDetailContainer>
                                    <SecondCardPayDetailContainer>
                                        <SecondCardPayDetailTitleText>二維碼</SecondCardPayDetailTitleText>
                                        <TouchableOpacity onPress={() => { toggleQRCodeModal() }}>
                                            <QRCodeText>查看</QRCodeText>
                                        </TouchableOpacity>
                                    </SecondCardPayDetailContainer>
                                </PayBottomContainer>
                            )
                        }
                    })
                }
            </SecondCardContainer>
            <BottomButtonContainer>
                <CancelButton onPress={() => { cancelAlert() }} style={{ borderColor: handleCancelButtonStyle() }}>
                    <CancelButtonText style={{ color: handleCancelButtonTextStyle() }}>{t("fiatCancelOrder")}</CancelButtonText>
                </CancelButton>
                <SubmitButton onPress={() => { handleSubmitAlert() }} disabled={handleButtonDisabled()} style={{ backgroundColor: handleSubmitButtonStyle() }}>
                    <SubmitButtonText style={{ color: handleSubmitButtonTextStyle() }}>{submitText === "放行中..." ? t("fiatTransfer") :submitText}</SubmitButtonText>
                </SubmitButton>
            </BottomButtonContainer>

            <Modal
                isVisible={isQRCodeModalVisible}
                deviceHeight={windowHeight}
                deviceWidth={windowWidth}
                animationInTiming={500}
                animationOutTiming={700}
                backdropOpacity={0.7}
                onBackdropPress={() => setIsQRCodeModalVisible(false)}
                onSwipeComplete={() => setIsQRCodeModalVisible(false)}
                swipeDirection={['down']}
                style={{ justifyContent: 'flex-end', margin: 0 }}
                hideModalContentWhileAnimating={true}
            >
                <View style={{ backgroundColor: '#242D37', borderTopLeftRadius: 8, borderTopRightRadius: 8, paddingLeft: 16, paddingRight: 16, paddingBottom: 30 }}>
                    <ModalHeaderContainer>
                        <TouchableOpacity onPress={() => { setIsQRCodeModalVisible(false) }}>
                            <ModalLeftCancelButton source={require("assets/images/trade/cancel.png")} />
                        </TouchableOpacity>
                        <ModalHedaerTitleText>二維碼</ModalHedaerTitleText>
                        <ModalEmptyDiv></ModalEmptyDiv>
                    </ModalHeaderContainer>

                    {
                        choosePayType === 'TOUCHNGO' &&
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <QRCodeContainer>
                                <QRCodeImage source={require('assets/images/c2c/qrcode.png')} />
                            </QRCodeContainer>
                            <ModalDetailText>Touch’n Go 用戶掃描此行動條碼後，即可進行付款。</ModalDetailText>
                        </View>
                    }
                    {
                        choosePayType === 'PPAY' &&
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <QRCodeContainer>
                                <QRCodeImage source={require('assets/images/c2c/qrcode.png')} />
                            </QRCodeContainer>
                            <ModalDetailText>Ppay 用戶掃描此行動條碼後，即可進行付款。</ModalDetailText>
                        </View>
                    }

                </View>
            </Modal>

        </Container>
    )
}

export default C2cBuySecond