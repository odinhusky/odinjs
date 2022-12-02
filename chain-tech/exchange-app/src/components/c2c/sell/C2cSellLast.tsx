import { useNavigation } from "@react-navigation/native";
import * as React from "react"
import { Text, View, ScrollView, TouchableOpacity } from "react-native"
import styled from "styled-components"
import { useTranslation } from "react-i18next";
import { useAppSelector } from "hooks";
const Container = styled(ScrollView)`
display: flex;
flex-direction: column;
background-color: #18222D;
padding-left: 16px;
padding-right: 16px;
padding-bottom: 200px;
`;

// First Card Style
const FirstCardContainer = styled(View)`
display: flex;
flex-direction: column;
padding-top: 16px;
padding-right: 16px;
padding-left: 16px;
padding-bottom: 20px;
background-color: #242D37;
border-radius: 8px;
`;

const FirstCardTitleText = styled(Text)`
font-weight: 600;
font-size: 16px;
line-height: 24px;
color: ${props => props.theme.color.White};
`;

const FirstCardRowContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
margin-top: 16px;
`;

const FirstCardFirstRowContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: baseline;
margin-top: 20px;
`;

const FirstCardFirstInRowContainer = styled(View)`
display: flex;
flex-direction: row;
align-items: baseline;
`;

const FirstCardSmallTitleText = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 24px;
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

const FirstCardSmallValueText = styled(Text)`
font-weight: 700;
font-size: 16px;
line-height: 20px;
color: ${props => props.theme.color.ExtraLightGray};
`;

// Second Card Style
const SecondCardContainer = styled(View)`
display: flex;
flex-direction: column;
padding-top: 16px;
padding-right: 16px;
padding-left: 16px;
padding-bottom: 20px;
background-color: #242D37;
border-radius: 8px;
margin-top: 16px;
`;

const SecondCardRowContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: baseline;
margin-top: 16px;
`;

const SecondCardFirstRowContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: baseline;
margin-top: 20px;
`;

const SecondCardTitleText = styled(Text)`
font-weight: 600;
font-size: 16px;
line-height: 24px;
color: ${props => props.theme.color.White};
`;

const SecondCardSmallTitleText = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 24px;
color: ${props => props.theme.color.MidGray};
`;

const SecondCardSmallValueText = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 24px;
color: ${props => props.theme.color.ExtraLightGray};
`;

const ReturnButton = styled(TouchableOpacity)`
height: 44px;
border: 1px solid #6699CC;
border-radius: 4px;
margin-top: 50px;
margin-bottom: 100px;
justify-content: center;
align-items: center;
`;

const ReturnButtonText = styled(Text)`
font-weight: 500;
font-size: 14px;
line-height: 22px;
color: ${props => props.theme.color.Primary};
`;

const C2cSellLast = () => {
    const otcOrder = useAppSelector((state)=>state.otcOrder.selling)
    const advertisement = useAppSelector((state)=> state.c2c.advertisement)
    const navigation = useNavigation();
    const { t } = useTranslation();

    return (
        <Container>
            <FirstCardContainer>
                <FirstCardTitleText>{t("fiatOrderInfo")}</FirstCardTitleText>
                <FirstCardFirstRowContainer>
                    <FirstCardSmallTitleText>{t("fiatTotal")}</FirstCardSmallTitleText>
                    <FirstCardFirstInRowContainer>
                        <FirstCardPriceText>{otcOrder.amount}</FirstCardPriceText>
                        <FirstCardPriceCurrencyText>{advertisement.fiatCurrency}</FirstCardPriceCurrencyText>
                    </FirstCardFirstInRowContainer>
                </FirstCardFirstRowContainer>
                <FirstCardRowContainer>
                    <FirstCardSmallTitleText>{t("amount")}</FirstCardSmallTitleText>
                    <FirstCardSmallValueText>{otcOrder.quantity} {advertisement.cryptoAsset}</FirstCardSmallValueText>
                </FirstCardRowContainer>
                <FirstCardRowContainer>
                    <FirstCardSmallTitleText>{t("unitPrice")}</FirstCardSmallTitleText>
                    <FirstCardSmallValueText>{advertisement.price} {advertisement.fiatCurrency}</FirstCardSmallValueText>
                </FirstCardRowContainer>
                <FirstCardRowContainer>
                    <FirstCardSmallTitleText>{t("fiatOrderNumber")}</FirstCardSmallTitleText>
                    <View style={{alignItems: 'flex-end'}}>
                        <FirstCardSmallValueText>{otcOrder.id.slice(0, 28)}</FirstCardSmallValueText>
                        <FirstCardSmallValueText>{otcOrder.id.slice(28)}</FirstCardSmallValueText>
                    </View>
                </FirstCardRowContainer>
            </FirstCardContainer>
            {/* <SecondCardContainer>
                <SecondCardTitleText>收款資訊</SecondCardTitleText>
                <SecondCardFirstRowContainer>
                    <SecondCardSmallTitleText>收款方式</SecondCardSmallTitleText>
                    <SecondCardSmallValueText>{handleChange()}</SecondCardSmallValueText>
                </SecondCardFirstRowContainer>
                <SecondCardRowContainer>
                    <SecondCardSmallTitleText>訂單時間</SecondCardSmallTitleText>
                    <SecondCardSmallValueText>{handleCreateTime(BuyTime)}</SecondCardSmallValueText>
                </SecondCardRowContainer>
            </SecondCardContainer> */}
            <ReturnButton onPress={() => { navigation.goBack() }}>
                <ReturnButtonText>{t("backOverview")}</ReturnButtonText>
            </ReturnButton>
        </Container>
    )
}

export default C2cSellLast