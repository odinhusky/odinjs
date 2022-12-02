import * as React from "react"
import { Text, TextInput, View, Image, TouchableOpacity, Dimensions, Pressable, Alert } from "react-native"
import styled from "styled-components"
import { useState } from "react";
import Spinner from 'react-native-loading-spinner-overlay'
import { useTranslation } from "react-i18next";
import { useAppSelector } from "hooks";
import { advertisementService } from "services";
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

// Top Container
const TopContainer = styled(View)`
display: flex;
flex-direction: column;
padding-top: 16px;
padding-left: 16px;
padding-right: 16px;
`;

const TopDetailContainer = styled(View)`
display: flex;
flex-direction: column;
`;

const TopDetailPriceRowContainer = styled(View)`
display: flex;
flex-direction: row;
align-items: baseline;
`;

const TopDetailRowContainer = styled(View)`
display: flex;
flex-direction: row;
align-items: center;
`;

const TopDetailTitleText = styled(Text)`
font-weight: 500;
font-size: 13px;
line-height: 20px;
color: ${props => props.theme.color.MidGray};
padding-right: 8px;
`;

const TopDetailPriceText = styled(Text)`
font-weight: 700;
font-size: 24px;
line-height: 30px;
color: ${props => props.theme.color.SecondaryLight};
`;

const TopDetailCurrencyText = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 18px;
color: ${props => props.theme.color.SecondaryLight};
margin-left: 4px;
`;

const TopDetailValueText = styled(Text)`
font-weight: 600;
font-size: 13px;
line-height: 16px;
color: ${props => props.theme.color.ExtraLightGray};
`;

const TopInputContainer = styled(View)`
display: flex;
flex-direction: row;
padding-top: 26px;
`;

const TopInputLeftContainer = styled(View)`
display: flex;
flex-direction: column;
justify-content: space-between;
width: 90%;
`;

const TopInputLeftRowContainer = styled(View)`
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-between;
`;

const TopInputRightContainer = styled(View)`
background-color: #242D37;
justify-content: center;
align-items: center;
width: 10%;
border-top-right-radius: 4px;
border-bottom-right-radius: 4px;
`;

const TopInputCurrencyTextContainer = styled(View)`
flex-direction: row;
height: 46px;
width: 18%;
background-color: #242D37;
justify-content: flex-end;
align-items: center;
padding-right: 8px;
`;

const TopInputCurrencyText = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 18px;
color: ${props => props.theme.color.ExtraLightGray};
`;

const TopInputAllButtonContainer = styled(View)`
height: 46px;
width: 12%;
font-weight: 500;
font-size: 14px;
line-height: 22px;
background-color: #242D37;
justify-content: center;
align-items: center;

`;

const TopInputAllButtonText = styled(Text)`
font-weight: 500;
font-size: 14px;
line-height: 22px;
color: ${props => props.theme.color.PrimaryLight};
`;

const TopInputSwapIcon = styled(Image)`
width: 28px;
height: 28px;
`;

const TopBuyButton = styled(TouchableOpacity)`
height: 45px;
border-radius: 4px;
background-color: ${props => props.theme.color.PrimaryDark};
justify-content: center;
align-items: center;
margin-top: 24px;
margin-bottom: 25px;
`;

const TopBuyButtonText = styled(Text)`
font-weight: 500;
font-size: 14px;
line-height: 22px;
color: ${props => props.theme.color.White};
`;


// BottomStyle
const BottomDetailContainer = styled(View)`
display: flex;
flex-direction: column;
background-color: #18222D;
padding-top: 16px;
padding-left: 16px;
padding-right: 16px;
padding-bottom: 200px;
`;

const BottomDetailTopContainer = styled(View)`
display: flex;
flex-direction: row;
align-items: center;
`;

const PhotoButton = styled(TouchableOpacity)`
width: 20px;
height: 20px;
background-color: ${props => props.theme.color.PrimaryLight};
border-radius: 75px;
align-items: center;
justify-content: center;
`;

const PhotoButtonText = styled(Text)`
font-weight: 600;
font-size: 14px;
line-height: 18px;
`;

const EmailText = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 18px;
color: ${props => props.theme.color.White};
padding-left: 12px;
`;

const SuccessRateText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 15px;
color: ${props => props.theme.color.MidGray};
padding-left: 4px;
`;

const BottomDetailSmallTitleText = styled(Text)`
font-weight: 500;
font-size: 13px;
line-height: 20px;
color: ${props => props.theme.color.MidGray};
margin-top: 16px;
`;

const BottomDetailSmallValueText = styled(Text)`
font-weight: 500;
font-size: 13px;
line-height: 20px;
color: ${props => props.theme.color.ExtraLightGray};
margin-top: 8px;
`;

const BottomDetailLine = styled(View)`
height: 1px;
background-color: #242D37;
margin-top: 16px;
`;

const C2cSellFirst = (props: {
    payments: Payment[]
    onChangeSetSwapPage: React.Dispatch<React.SetStateAction<number>>;
    onValueChangeIsWaitFinish: React.Dispatch<React.SetStateAction<number>>;
}) => {
    const {
        payments,
        onChangeSetSwapPage,
        onValueChangeIsWaitFinish
    } = props;
    const { advertisement } = useAppSelector((state) => state.c2c)
    const { account } = useAppSelector((state) => state.user.detail)

    // Input Price
    const [inputAmount, setInputAmount] = useState("");

    // Input Number
    const [inputNumber, setInputNumber] = useState("");

    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const handleOnChangeAllAmount = () => {
        setInputAmount(advertisement.orderLimitMax.toFixed(2));
        setInputNumber("");
    };

    const handleOnChangeAllNumber = () => {
        let num = ((advertisement.orderLimitMax / advertisement.price)).toString()
        let index = (num).indexOf('.')
        let slice = num.slice(0, index + 3)
        if ((parseFloat(slice)) <= (advertisement.totalTradingAmount)) {
            setInputNumber(slice)
        } else {
            setInputNumber(advertisement.totalTradingAmount.toFixed(2))
        }
        setInputAmount("")
    };

    const handleOnChangeExchange = () => {
        if (inputAmount == "" && inputNumber == "") {
            setInputAmount(advertisement.orderLimitMax.toFixed(2));
            setInputNumber("");
        } else if (inputAmount == "") {
            setInputAmount((parseFloat(inputNumber) * advertisement.price).toFixed(2))
            setInputNumber("")
        } else if (inputNumber == "") {
            setInputNumber((parseFloat(inputAmount) / advertisement.price).toFixed(2))
            setInputAmount("")
        }
    };

    const confirm = () => {
        setLoading(true)
        advertisementService.createOtcOrder(advertisement.id, {
            price: advertisement.price,
            quantity: (inputNumber === "" ? null : parseFloat(inputNumber)),
            amount: (inputAmount === "" ? null : parseFloat(inputAmount)),
            payments: payments
        }).then((response) => {
            onValueChangeIsWaitFinish(response.status)
            onChangeSetSwapPage(2)
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <View style={{ backgroundColor: '#131B24' }}>
            {
                loading &&
                <Spinner visible={true} textContent={t("loading")} color={'#FFFFFF'} textStyle={{ color: '#FFFFFF' }} />
            }
            <TopContainer>
                <TopDetailContainer>
                    <TopDetailPriceRowContainer>
                        <TopDetailTitleText>{t("unitPrice")}</TopDetailTitleText>
                        <TopDetailPriceText>{advertisement.price}</TopDetailPriceText>
                        <TopDetailCurrencyText>{advertisement.fiatCurrency}</TopDetailCurrencyText>
                    </TopDetailPriceRowContainer>
                    <TopDetailRowContainer>
                        <TopDetailTitleText>{t("amount")}</TopDetailTitleText>
                        <TopDetailValueText>{advertisement.totalTradingAmount} {advertisement.cryptoAsset}</TopDetailValueText>
                    </TopDetailRowContainer>
                    <TopDetailRowContainer>
                        <TopDetailTitleText>{t("limitedAmount")}</TopDetailTitleText>
                        <TopDetailValueText>{advertisement.orderLimitMin} - {advertisement.orderLimitMax} {advertisement.fiatCurrency}</TopDetailValueText>
                    </TopDetailRowContainer>
                </TopDetailContainer>
                <TopInputContainer>
                    <TopInputLeftContainer>
                        <TopInputLeftRowContainer>
                            <TextInput
                                placeholder={t("fiatSellAmount")}
                                value={inputAmount}
                                onChangeText={inputAmount => setInputAmount(inputAmount)}
                                placeholderTextColor={'#8D97A2'}
                                autoCorrect={false}
                                keyboardType={"number-pad"}
                                style={{ backgroundColor: '#242D37', width: '70%', height: 46, color: '#F4F5F6', borderTopLeftRadius: 4, paddingLeft: 16, paddingTop: 15, paddingBottom: 15 }}
                            />
                            <TopInputCurrencyTextContainer>
                                <TopInputCurrencyText>{advertisement.fiatCurrency}</TopInputCurrencyText>
                            </TopInputCurrencyTextContainer>
                            <TopInputAllButtonContainer>
                                <TouchableOpacity onPress={() => { handleOnChangeAllAmount() }}>
                                    <TopInputAllButtonText>{t("fiatAll")} </TopInputAllButtonText>
                                </TouchableOpacity>
                            </TopInputAllButtonContainer>
                        </TopInputLeftRowContainer>
                        <TopInputLeftRowContainer>
                            <TextInput
                                placeholder={t("fiatSellQty")}
                                value={inputNumber}
                                onChangeText={inputNumber => setInputNumber(inputNumber)}
                                placeholderTextColor={'#8D97A2'}
                                autoCorrect={false}
                                keyboardType={"decimal-pad"}
                                style={{ backgroundColor: '#242D37', width: '70%', height: 46, color: '#F4F5F6', borderBottomLeftRadius: 4, paddingLeft: 16, paddingTop: 15, paddingBottom: 15 }}
                            />
                            <TopInputCurrencyTextContainer>
                                <TopInputCurrencyText>{advertisement.cryptoAsset}</TopInputCurrencyText>
                            </TopInputCurrencyTextContainer>
                            <TopInputAllButtonContainer>
                                <TouchableOpacity onPress={() => { handleOnChangeAllNumber() }}>
                                    <TopInputAllButtonText>{t("fiatAll")} </TopInputAllButtonText>
                                </TouchableOpacity>
                            </TopInputAllButtonContainer>
                        </TopInputLeftRowContainer>
                    </TopInputLeftContainer>
                    <TopInputRightContainer>
                        <TouchableOpacity onPress={() => { handleOnChangeExchange() }}>
                            <TopInputSwapIcon source={require("assets/images/c2c/swap.png")} />
                        </TouchableOpacity>
                    </TopInputRightContainer>
                </TopInputContainer>
                <TopBuyButton onPress={() => { confirm() }}>
                    <TopBuyButtonText>{t(`advertisement.orderType.${advertisement.type}`)}</TopBuyButtonText>
                </TopBuyButton>
            </TopContainer>
            <BottomDetailContainer>
                <BottomDetailTopContainer>
                    <PhotoButton onPress={() => { }}>
                        <PhotoButtonText>{account.charAt(0).toUpperCase()}</PhotoButtonText>
                    </PhotoButton>
                    <EmailText>{account}</EmailText>
                </BottomDetailTopContainer>
                <BottomDetailSmallTitleText>{t("limitedTime")}</BottomDetailSmallTitleText>
                <BottomDetailSmallValueText>{advertisement.paymentTimeLimit / 60000}分鐘</BottomDetailSmallValueText>
                <BottomDetailLine></BottomDetailLine>
                <BottomDetailSmallTitleText>{t("fiatMemo")}</BottomDetailSmallTitleText>
                <BottomDetailSmallValueText>{advertisement.terms}</BottomDetailSmallValueText>
            </BottomDetailContainer>
        </View>
    )
}

export default C2cSellFirst