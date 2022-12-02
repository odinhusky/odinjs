import React, { useRef } from "react"
import { Text, View, Image, TouchableOpacity, ScrollView, Alert } from "react-native"
import { RootStackScreenProps } from "common/types";
import styled from "styled-components"
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { advertisementService } from "services";
import Spinner from 'react-native-loading-spinner-overlay'
import { useTranslation } from "react-i18next";
import RenderCounter from "components/render-counter"
import { C2cOrderType } from "common/types";
import { useAppDispatch } from "hooks";
import { userActions, c2cActions } from "store/slice";
import { Theme } from "constants/Theme";
import { AdvertisementType } from "common/constant";
import useOtcWebsocket from "hooks/useOtcWebsocket"

const Container = styled(View) <{ insets: number }>`
    display: flex ;
    flex-direction: column;
    padding-top: ${props => props.insets}px;
    background-color: #131B24;
`;

//Header Style
const HeaderContainer = styled(View)`
display: flex ;
flex-direction: column;
padding-top: 16px;
padding-left: 16px;
padding-right: 12px;
background-color : #18222D;
`;

const HeaderTitleContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
padding-bottom: 23px;
`;

const HeaderTitleInlineRowContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
width: 100px;
`;

const HeaderTitleInlineRowRightContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: flex-end;
align-items: center;
width: 100px;
`;

const HeaderTitleOrderIcon = styled(Image)`
width: 28px;
height: 28px;
`;

const HeaderTitleAddIcon = styled(Image)`
width: 32px;
height: 32px;
margin-right: 15px;
`;

const HeaderCurrencyPageContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
padding-right: 150px;
`;

const HeaderCurrencyButtonClicked = styled(TouchableOpacity)`
height: 30px;
width: 39px;
border-bottom-width: 2px;
border-bottom-color: ${props => props.theme.color.Primary};
justify-content: center;
align-items: center;
`;

const HeaderCurrencyButtonTextClicked = styled(Text)`
font-weight: 500;
font-size: 14px;
line-height: 22px;
color: ${props => props.theme.color.White};
`;

// Detail Container
const DetailContainer = styled(ScrollView)`
display: flex;
flex-direction: column;
padding-top: 20px;
padding-left: 16px;
padding-right: 12px;
padding-bottom: 500px;
background-color: #131B24;
`;

const DetailCardContainer = styled(View)`
display: flex;
flex-direction: column;
`;

const DetailCardTopContainer = styled(View)`
display: flex;
flex-direction: row;
align-items: center;
`;

const DetailCardMiddleContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
padding-top: 12px;
`;

const DetailCardMiddleLeftColumnContainer = styled(View)`
display: flex;
flex-direction: column;
`;

const DetailCardMiddleLeftRowContainer = styled(View)`
display: flex;
flex-direction: row;
align-items: center;
`;

const DetailCardMiddleRightRowContainer = styled(View)`
display: flex;
flex-direction: row;
align-items: baseline;
`;

const DetailCardBottomContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
padding-top: 25px;
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

const SmallTitleText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 18px;
color: ${props => props.theme.color.MidGray};
`;

const SmallValueText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 15px;
color: ${props => props.theme.color.White};
padding-left: 8px;
`;

const TradeButtonText = styled(Text)`
font-weight: 500;
font-size: 14px;
line-height: 22px;
color: ${props => props.theme.color.White};
`;

const DetailCardLine = styled(View)`
height: 1px;
background-color: #18222D;
margin-top: 16px;
margin-bottom: 16px;
`;

const EmptyDiv = styled(View)`
height: 200px;
`;

const HeaderTitleText = styled(Text) <{ select: boolean }>`
font-weight: 600;
font-size: 20px;
line-height: 30px;
color: ${props => props.select ? props.theme.color.White : props.theme.color.Gray};
`;

const PriceText = styled(Text) <{ type: number }>`
font-weight: 700;
font-size: 20px;
line-height: 24px;
color: ${props => props.type === AdvertisementType.BUY ? props.theme.color.SecondaryLight : props.theme.color.Secondary};
padding-right: 4px;
`;

const CurrencyText = styled(Text) <{ type: number }>`
font-weight: 400;
font-size: 12px;
line-height: 15px;
color: ${props => props.type === AdvertisementType.BUY ? props.theme.color.SecondaryLight : props.theme.color.Secondary};
`;

const C2cScreen = ({ navigation }: RootStackScreenProps<"C2cScreen">) => {
    // Screen Top Padding
    const insets = useSafeAreaInsets();
    useOtcWebsocket()
    // Swap Title Buy or Sell
    const currentType = useRef(0)

    // Swap Buy Currency
    const [swapBuyCurrencyType, setSwapBuyCurrencyType] = useState("USDT");
    const [advertisements, setAdvertisements] = useState([] as Advertisement[]);
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch()
    const { t } = useTranslation();
    const getAdvertisements = (cryptoAsset: string, type: C2cOrderType) => {
        setLoading(true)
        advertisementService.getAdvertisement({
            all: false,
            my: false,
            type: type,
            cryptoAsset: cryptoAsset
        }).then((response) => {
            setAdvertisements(response);
        }).catch((error) => {
            if (error.response.status === 401) {
                dispatch(userActions.logout())
            }
        }).finally(() => setLoading(false))
    };

    function swapPage(cryptoAsset: string, type: number) {
        console.log(type)
        currentType.current = type
        // setCurrentAdvertisementType(type)
        setSwapBuyCurrencyType(cryptoAsset)
        getAdvertisements(cryptoAsset, type === 0 ? "sell" : "buy");
    };

    useEffect(() => {
        swapPage(swapBuyCurrencyType, AdvertisementType.BUY);
    }, []);

    return (
        <Container insets={insets.top}>
            <RenderCounter name="C2c" debug={true} />
            {
                loading &&
                <Spinner visible={true} textContent={t("loading")} color={'#FFFFFF'} textStyle={{ color: '#FFFFFF' }} />
            }
            <HeaderContainer>
                <HeaderTitleContainer>
                    <HeaderTitleInlineRowContainer>
                        <TouchableOpacity onPress={() => { swapPage("USDT", AdvertisementType.BUY) }}>
                            <HeaderTitleText select={currentType.current === AdvertisementType.BUY}>{t(`advertisement._type.${AdvertisementType.BUY}`)}</HeaderTitleText>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { swapPage("USDT", AdvertisementType.SELL) }}>
                            <HeaderTitleText select={currentType.current === AdvertisementType.SELL}>{t(`advertisement._type.${AdvertisementType.SELL}`)}</HeaderTitleText>
                        </TouchableOpacity>
                    </HeaderTitleInlineRowContainer>
                    <HeaderTitleInlineRowRightContainer>
                        <TouchableOpacity onPress={() => { navigation.navigate("C2cCreateScreen") }}>
                            <HeaderTitleAddIcon source={require("assets/images/c2c/add.png")} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { navigation.navigate("C2cHistoryScreen") }}>
                            <HeaderTitleOrderIcon source={require("assets/images/c2c/order.png")} />
                        </TouchableOpacity>
                    </HeaderTitleInlineRowRightContainer>
                </HeaderTitleContainer>
                <HeaderCurrencyPageContainer>
                    <HeaderCurrencyButtonClicked onPress={() => { swapPage("USDT", currentType.current) }}>
                        <HeaderCurrencyButtonTextClicked>USDT</HeaderCurrencyButtonTextClicked>
                    </HeaderCurrencyButtonClicked>
                </HeaderCurrencyPageContainer>
            </HeaderContainer>
            <DetailContainer>
                {
                    advertisements.map((advertisement, index) => {
                        const color = advertisement.type === 0 ? Theme.color.SecondaryLight : Theme.color.Secondary
                        return (
                            /* 在 BuyArray 中尋找符合 USDT 的 OBject */
                            advertisement.cryptoAsset === 'USDT' &&
                            <DetailCardContainer key={advertisement.id}>
                                <DetailCardTopContainer>
                                    <PhotoButton onPress={() => { }}>
                                        {/* 取 account 中第一個字位於頭像 */}
                                        <PhotoButtonText>{advertisement.owner.charAt(0).toUpperCase()}</PhotoButtonText>
                                    </PhotoButton>
                                    <EmailText>{advertisement.owner}</EmailText>
                                </DetailCardTopContainer>
                                <DetailCardMiddleContainer>
                                    <DetailCardMiddleLeftColumnContainer>
                                        <DetailCardMiddleLeftRowContainer>
                                            <SmallTitleText>{t("amount")}</SmallTitleText>
                                            <SmallValueText>{advertisement.totalTradingAmount} {advertisement.cryptoAsset}</SmallValueText>
                                        </DetailCardMiddleLeftRowContainer>
                                        <DetailCardMiddleLeftRowContainer>
                                            <SmallTitleText>{t("limitedAmount")}</SmallTitleText>
                                            <SmallValueText>{advertisement.orderLimitMin} - {advertisement.orderLimitMax} {advertisement.fiatCurrency}</SmallValueText>
                                        </DetailCardMiddleLeftRowContainer>
                                    </DetailCardMiddleLeftColumnContainer>
                                    <DetailCardMiddleRightRowContainer>
                                        <PriceText type={advertisement.type}>{advertisement.price}</PriceText>
                                        <CurrencyText type={advertisement.type}>{advertisement.fiatCurrency}</CurrencyText>
                                    </DetailCardMiddleRightRowContainer>
                                </DetailCardMiddleContainer>
                                <DetailCardBottomContainer>
                                    <TouchableOpacity
                                        style={{
                                            width: 64,
                                            height: 30,
                                            backgroundColor: color,
                                            borderRadius: 4,
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}
                                        onPress={() => {
                                            dispatch(c2cActions.setSelectedAdvertisement(advertisement))
                                            const targetScreen = advertisement.type === 0 ? "C2cSellScreen" : "C2cBuyScreen"
                                            navigation.navigate(targetScreen, { from: "list" })
                                        }}
                                    >
                                        <TradeButtonText>{t(`advertisement.orderType.${advertisement.type}`)}</TradeButtonText>
                                    </TouchableOpacity>
                                </DetailCardBottomContainer>
                                {
                                    advertisement.cryptoAsset === 'USDT' &&
                                    index !== advertisements.length - 1 &&
                                    <DetailCardLine></DetailCardLine>
                                }
                            </DetailCardContainer>
                        )
                    })
                }
                {/* 預留 Padding */}
                <EmptyDiv></EmptyDiv>
            </DetailContainer>
        </Container >
    )
}

export default C2cScreen