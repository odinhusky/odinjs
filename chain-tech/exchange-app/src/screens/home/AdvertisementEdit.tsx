import * as React from "react"
import { Text, View, Image, TouchableOpacity, ScrollView, Alert, Dimensions, TextInput } from "react-native"
import Modal from "react-native-modal";
import { RootStackScreenProps } from "common/types";
import styled from "styled-components"
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppSelector } from "hooks";
import Spinner from 'react-native-loading-spinner-overlay'
import { SearchBar } from "@rneui/themed";
import { Picker } from '@react-native-picker/picker';
import { Feather } from '@expo/vector-icons';
import { useTogglePasswordVisibility } from 'hooks';
import { useTranslation } from "react-i18next";
import { advertisementService, userService } from "services";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

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
padding-bottom: 18px;
`;

const HeaderTitleText = styled(Text)`
font-weight: 600;
font-size: 16px;
line-height: 24px;
color: ${props => props.theme.color.White};
`;

const HeaderTitlePreviousIcon = styled(Image)`
width: 28px;
height: 28px;
`;

const HeaderTitleNextStepGrayText = styled(Text)`
font-weight: 600;
font-size: 16px;
line-height: 24px;
color: ${props => props.theme.color.Gray};
`;

const HeaderTitleNextStepWhiteText = styled(Text)`
font-weight: 600;
font-size: 16px;
line-height: 24px;
color: ${props => props.theme.color.White};
`;

// ScrollView Style
const BodyContainer = styled(ScrollView)`
display: flex ;
flex-direction: column;
`;

// Progress Bar Style
const HeaderProgressContainer = styled(View)`
display: flex;
flex-direction: column;
padding-top: 10px;
padding-left: 16px;
padding-right: 16px;
padding-bottom: 16px;
background-color : #18222D;
`;

const HeaderProgressTopContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
padding-left: 17px;
padding-right: 17px;
padding-bottom: 8px;
`;

const HeaderProgressBottomContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
`;

const HeaderProgressLightGrayCircle = styled(View)`
width: 20px;
height: 20px;
border: 4px solid #BCC2C8;
border-radius: 75px;
`;

const HeaderProgressGrayCircle = styled(View)`
width: 20px;
height: 20px;
border: 4px solid #5C6670;
border-radius: 75px;
`;

const HeaderProgressPrimaryCircle = styled(View)`
width: 20px;
height: 20px;
border: 4px solid #6699CC;
border-radius: 75px;
`;

const HeaderProgressGrayText = styled(Text)`
font-weight: 500;
font-size: 13px;
line-height: 20px;
color: #5C6670;
`;

const HeaderProgressLightGrayText = styled(Text)`
font-weight: 500;
font-size: 13px;
line-height: 20px;
color: #BCC2C8;
`;

const HeaderProgressWhiteText = styled(Text)`
font-weight: 500;
font-size: 13px;
line-height: 20px;
color: #FFFFFF;
`;

const HeaderProgressGrayLine = styled(View)`
width: 130px;
height: 2px;
background-color: #5C6670;
`;

const HeaderProgressLightGrayLine = styled(View)`
width: 130px;
height: 2px;
background-color: #BCC2C8;
`;

const SwapPageContainer = styled(ScrollView)`
padding-bottom: 200px;
`;

const PostCompleteContiner = styled(View)`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
`;

const PostCompleteImage = styled(Image)`
width: 135px;
height: 135px;
`;

const PostCompleteText = styled(Text)`
font-weight: 600;
font-size: 16px;
line-height: 24px;
color: ${props => props.theme.color.White};
padding-top: 16px;
`;

const PostCompleteButton = styled(TouchableOpacity)`
height: 44px;
justify-content: center;
align-items: center;
background-color: ${props => props.theme.color.PrimaryDark};
border-radius: 4px;
margin-top: 32px;
margin-bottom: 100px;
`;

const PostCompleteButtonText = styled(Text)`
font-weight: 500;
font-size: 14px;
line-height: 22px;
color: ${props => props.theme.color.White};
`;


// Progress Part 0 Style

// Swap Buy Sell Style
const SwapContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
padding-left: 16px;
padding-right: 16px;
padding-bottom: 16px;
`;

const SwapButtonClicked = styled(TouchableOpacity)`
height: 44px;
width: 50%;
border-bottom-width: 2px;
border-bottom-color: ${props => props.theme.color.Primary};
justify-content: center;
align-items: center;
`;

const SwapButton = styled(TouchableOpacity)`
height: 44px;
width: 50%;
justify-content: center;
align-items: center;
`;

const SwapButtonClickedText = styled(Text)`
font-weight: 500;
font-size: 14px;
line-height: 22px;
color: ${props => props.theme.color.White};
`;

const SwapButtonText = styled(Text)`
font-weight: 500;
font-size: 14px;
line-height: 22px;
color: ${props => props.theme.color.Gray};
`;

const CurrencyTypeContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
padding-left: 16px;
padding-right: 16px;
padding-bottom: 16px;
`;

const CurrencyTypeRowContainer = styled(View)`
display: flex;
flex-direction: row;
`;

const CurrencyTypeLeftColumnContainer = styled(View)`
display: flex;
flex-direction: column;
padding-right: 20px;
width: 50%;
`;

const CurrencyTypeRightColumnContainer = styled(View)`
display: flex;
flex-direction: column;
width: 50%;
`;

const CurrencyTypeTitleText = styled(Text)`
font-weight: 500;
font-size: 13px;
line-height: 20px;
color: ${props => props.theme.color.MidGray};
padding-bottom: 4px;
`;

const CurrencyTypeButton = styled(TouchableOpacity)`
height: 48px;
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
background-color: #242D37;
padding-top: 10px;
padding-bottom: 10px;
padding-right: 12px;
padding-left: 12px;
`;

const CurrencyTypeButtonText = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 18px;
color: ${props => props.theme.color.White};
`;

const CurrencyTypeForwardImage = styled(Image)`
width: 28px;
height: 28px;
`;

// Price Container Style
const PriceContainer = styled(View)`
display: flex;
flex-direction: column;
padding: 16px;
`;

const PriceTypeInputContainer = styled(View)`
display: flex;
flex-direction: column;
padding-top: 16px;
padding-bottom: 8px;
`;

const PriceRowContainer = styled(View)`
display: flex;
flex-direction: row;
height: 48px;
justify-content: space-between;
align-items: center;
padding-top: 4px;
`;

const PriceBottomRowContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: flex-end;
padding-top: 8px;
padding-bottom: 8px;
`;

const PriceTitleText = styled(Text)`
font-weight: 600;
font-size: 16px;
line-height: 24px;
color: ${props => props.theme.color.White};
`;

const PriceSmallTitleText = styled(Text)`
font-weight: 500;
font-size: 13px;
line-height: 20px;
color: ${props => props.theme.color.MidGray};
padding-bottom: 4px;
`;

const PriceButton = styled(TouchableOpacity)`
display: flex;
flex-direction: row;
height: 48px;
justify-content: space-between;
align-items: center;
padding-top: 12px;
padding-bottom: 12px;
padding-left: 16px;
padding-right: 16px;
background-color: #242D37;
`;

const PriceButtonText = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 24px;
color: ${props => props.theme.color.White};
`;

const PriceButtonForwardImage = styled(Image)`
width: 28px;
height: 28px;
`;

const PriceInputCurencytTextView = styled(View)`
height: 48px;
width: 20%;
background-color: #242D37;
justify-content: center;
align-items: center;
padding-top: 12px;
padding-bottom: 12px;
padding-left: 16px;
padding-right: 16px;
`;

const PriceInputCurrencyText = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 18px;
color: ${props => props.theme.color.White};
`;

const PriceMarketValueText = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 24px;
color: ${props => props.theme.color.LightMidGray};
`;

const PriceTradeText = styled(Text)`
font-weight: 700;
font-size: 24px;
line-height: 30px;
color: ${props => props.theme.color.White};
`;

const PriceNumberContainer = styled(View)`
display: flex;
flex-direction: row;
height: 48px;
justify-content: space-between;
align-items: center;
padding-top: 12px;
padding-bottom: 12px;
padding-left: 16px;
padding-right: 16px;
background-color: #242D37;
margin
`;

const PriceInputImage = styled(Image)`
width: 24px;
height: 24px;
`;

// Quantity Container Style
const QuantityContainer = styled(View)`
display: flex;
flex-direction: column;
padding: 16px;
`;

const QuantityTitleText = styled(Text)`
font-weight: 600;
font-size: 16px;
line-height: 24px;
color: ${props => props.theme.color.White};
padding-bottom: 8px;
`;

const QuantityInputContainer = styled(View)`
display: flex;
flex-direction: column;
padding-top: 8px;
padding-bottom: 8px;
`;

const QuantityInputTitleRowContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
`;

const QuantityTradeQuantityRowContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
`;

const QuantityTradeQuantityCurrencyView = styled(View)`
height: 48px;
width: 20%;
background-color: #242D37;
justify-content: center;
align-items: center;
padding-top: 12px;
padding-bottom: 12px;
padding-left: 16px;
padding-right: 16px;
`;

const QuantityTradeQuantityCurrencyText = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 18px;
color: ${props => props.theme.color.White};
`;

const QuanitityTradeQuantityTitleNegative = styled(Text)`
font-weight: 500;
font-size: 13px;
line-height: 20px;
color: ${props => props.theme.color.SecondaryLight};
padding-bottom: 4px;
`;

const QuanitityTradeQuantityDetailNegative = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 18px;
color: ${props => props.theme.color.SecondaryLight};
padding-top: 4px;
`;

const QuantitySmallTitleText = styled(Text)`
font-weight: 500;
font-size: 13px;
line-height: 20px;
color: ${props => props.theme.color.MidGray};
padding-bottom: 4px;
`;

const QuantityTradeQuantityCurrentWalletBalanceText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 15px;
color: ${props => props.theme.color.LightMidGray};
padding-bottom: 4px;
`;

const QuantityPriceLimitRowContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
`;

const QuantityPriceLimitCurrencyView = styled(View)`
height: 48px;
width: 18%;
background-color: #242D37;
justify-content: center;
align-items: center;
padding-top: 12px;
padding-bottom: 12px;
padding-left: 16px;
padding-right: 16px;
`;

const QuantityPriceLimitCurrencyText = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 18px;
color: ${props => props.theme.color.White};
`;

const QuantityPriceLimitMiddleView = styled(View)`
height: 48px;
width: 4%;
justify-content: center;
align-items: center;
padding-top: 12px;
padding-bottom: 12px;
`;

const QuantityPriceLimitMiddleViewText = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 18px;
color: ${props => props.theme.color.White};
`;

const QuantityTimeLimitButton = styled(TouchableOpacity)`
display: flex;
flex-direction: row;
height: 48px;
justify-content: space-between;
align-items: center;
padding-top: 12px;
padding-bottom: 12px;
padding-left: 16px;
padding-right: 16px;
background-color: #242D37;
`;

const QuantityTimeLimitButtonText = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 24px;
color: ${props => props.theme.color.White};
`;

const QuantityTimeLimitButtonForwardImage = styled(Image)`
width: 28px;
height: 28px;
`;

// Trade Fee Notify View Style
const TradeFeeNotifyContainer = styled(View)`
display: flex;
flex-direction: row;
align-items: center;
background-color: ${props => props.theme.color.PrimaryDark};
border: 1px solid ${props => props.theme.color.Primary};
border-radius: 8px;
padding-top: 20px;
padding-bottom: 20px;
padding-left: 16px;
padding-right: 16px;
margin-left: 16px;
margin-right: 16px;
margin-top: 12px;
margin-bottom: 100px;
`;

const TradeFeeNotifyImage = styled(Image)`
width: 24px;
height: 24px;
`;

const TradeFeeNotifyText = styled(Text)`
font-weight: 500;
font-size: 13px;
line-height: 20px;
color: ${props => props.theme.color.White};
padding-left: 15px;
`;




// Progress Part 1 Style

const PaymentContainer = styled(View)`
display; flex;
flex-direction: column;
padding: 16px;
`;

const PaymentTitleRowContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
`;

const PaymentTitleText = styled(Text)`
font-weight: 600;
font-size: 16px;
line-height: 24px;
color: ${props => props.theme.color.White};
`;

const PaymentAddImage = styled(Image)`
width: 28px;
height: 28px;
`;

const PaymentRowContainer = styled(ScrollView)`
display: flex;
flex-direction: row;
height: 32px;
margin-top: 16px;
`;

const PaymentTypeView = styled(View)`
height: 32px;
width: 103px;
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
background-color: #F4F4F6;
border-radius: 16px;
padding-left: 8px;
padding-right: 4px;
margin-right: 8px;
`;

const PaymentTypeViewText = styled(Text)`
font-weight: 500;
font-size: 14px;
line-height: 22px;
color: ${props => props.theme.color.DarkGray};
padding-right: 4px;
`;

const PaymentTypeViewCancelImage = styled(Image)`
width: 18px;
height: 18px;
`;

const TradeMemoContainer = styled(View)`
display; flex;
flex-direction: column;
padding: 16px;
`;

const TradeMemoTitleText = styled(Text)`
font-weight: 600;
font-size: 16px;
line-height: 24px;
color: ${props => props.theme.color.White};
`;

const TradeMemoTextInputContainer = styled(View)`
display: flex;
flex-direction: column;
height: 120px;
padding-top: 16px;
padding-bottom: 8px;
`;

const TradeMemoCountTextView = styled(View)`
display: flex;
flex-direction: row;
height: 30px;
background-color: #242D37;
justify-content: flex-end;
padding-bottom : 12px;
padding-left: 16px;
padding-right: 16px;                     
`;

const TradeMemoCountText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 15px;
color: #8D97A2;
`;

const TradeConditionContainer = styled(View)`
display: flex;
flex-direction: column;
padding: 16px;
padding-bottom: 200px;
`;

const TradeConditionTitleText = styled(Text)`
font-weight: 600;
font-size: 16px;
line-height: 24px;
color: ${props => props.theme.color.White};
`;

const TradeConditionRowContainer = styled(View)`
display: flex;
flex-direction: row;
height: 36px;
align-items: center;
margin-top: 14px;
margin-bottom: 14px;
`;

const TradeConditionText = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 24px;
color: ${props => props.theme.color.LightMidGray};
`;



// Progress Part 2 Style

const ConfirmCardContainer = styled(View)`
display: flex;
flex-direction: column;
padding: 16px;
background-color: #242D37;
border-radius: 8px;
`;

const ConfirmCardRowContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
padding-top: 8px;
padding-bottom: 8px;
`;

const ConfirmCardTitle = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 24px;
color: ${props => props.theme.color.MidGray};
`;

const ConfirmCardTradePriceText = styled(Text)`
font-weight: 700;
font-size: 20px;
line-height: 24px;
color: ${props => props.theme.color.White};
`;

const ConfirmCardSecondText = styled(Text)`
font-weight: 600;
font-size: 16px;
line-height: 24px;
color: ${props => props.theme.color.White};
`;

const ConfirmCardThirdText = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 18px;
color: ${props => props.theme.color.White};
`;

const ConfirmCardPaymentContainer = styled(View)`
display: flex;
flex-direction: row;
align-items: center;
`;

const ConfirmCardPaymentImage = styled(Image)`
width: 28px;
height: 28px;
margin-right: 4px;
`;

const ConfirmCardColumnContainer = styled(View)`
display: flex;
flex-direction: column;
padding-top: 8px;
padding-bottom: 8px;
`;

const ConfirmCardSmallTitle = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 24px;
color: ${props => props.theme.color.Gray};
`;

const ConfirmCardFourthText = styled(Text)`
font-weight: 500;
font-size: 13px;
line-height: 20px;
color: ${props => props.theme.color.White};
padding-top: 4px;
`;

const ConfirmRulesContainer = styled(View)`
display; flex;
flex-direction: row;
height: 30px;
justify-content: center;
align-items: center;
margin-top: 40px;
`;
const ConfirmUnClickView = styled(View)`
width: 16px;
height: 16px;
background-color: #5F5C70;
border-radius: 75px;
`;

const ConfirmImage = styled(Image)`
width: 16px;
height: 16px;
`;

const ConfirmRulesText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 18px;
color: ${props => props.theme.color.Gray};
padding-left: 8px;
`;

const ConfirmRulesNegativeText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 18px;
color: ${props => props.theme.color.SecondaryLight};
`;

const ConfirmButtonContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
padding-top: 20px;
padding-bottom: 100px;
`;

const ConfirmUpdateButton = styled(TouchableOpacity)`
height: 44px;
width: 30%;
border: 1px solid #6699CC;
border-radius: 4px;
justify-content: center;
align-items: center;
`;

const ConfirmUpdateButtonText = styled(Text)`
font-weight: 500;
font-size: 14px;
line-height: 22px;
color: #6699CC;
`;

const ConfirmButton = styled(TouchableOpacity)`
height: 44px;
width: 65%;
background-color: #3D6A97
border-radius: 4px;
justify-content: center;
align-items: center;
`;

const ConfirmButtonText = styled(Text)`
font-weight: 500;
font-size: 14px;
line-height: 22px;
color: ${props => props.theme.color.White};
`;



// Modal Style

// Global Style
const ModalHeaderContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: center;
padding-top: 10px;
padding-bottom: 10px;
`;

const ModalTitleBarHeaderContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
padding-top: 10px;
padding-left: 16px;
padding-right: 16px;
padding-bottom: 10px;
background-color: #18222D;
`;

const ModalFullScreenHeaderContainer = styled(View) <{ insets: number }> `
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
padding-top: ${props => props.insets}px;
padding-left: 16px;
padding-right: 16px;
padding-bottom: 4px;
background-color: #18222D;
`;

const ModalHeaderTitleText = styled(Text)`
font-weight: 600;
font-size: 16px;
line-height: 24px;
color: ${props => props.theme.color.White};
`;

const ModalSelectImage = styled(Image)`
width: 28px;
height: 28px;
`;

const ModalCancelImage = styled(Image)`
width: 28px;
height: 28px;
`;

const ModalHeaderRightEmptyView = styled(View)`
width: 28px;
height: 28px;
`;

// CryptoAsset Modal Style
const CryptoAssetModalContainer = styled(View)`
display: flex;
flex-direction: column;
justify-content: center;
padding-bottom: 40px;
`;

const CryptoAssetModalCardContainer = styled(View)`
display: flex;
flex-direction: column;
justify-content: center;
`;

const CryptoAssetModalRowContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
height: 28px;
`;

const CryptoAssetModalInRowContainer = styled(View)`
display: flex;
flex-direction: row;
align-items: center;
`;

const CryptoAssetModalImage = styled(Image)`
width: 24px;
height: 24px;
`;

const CryptoAssetModalText = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 18px;
color: ${props => props.theme.color.White};
padding-left: 12px;
`;

const CryptoAssetModalLine = styled(View)`
height: 1px;
background-color: #242D37;
margin-top: 16px;
margin-bottom: 16px;
`;

// FiatCurrency Modal Style
const FiatCurrencyModalContainer = styled(ScrollView)`
display: flex;
flex-direction: column;
background-color: #131B24;
padding-bottom: 16px;
`;

const FiatCurrenctModalSearchbarContainer = styled(View)`
padding-top: 16px;
padding-left: 16px;
padding-right: 16px;
background-color: #131B24;
`;

const FiatCurrencyModalCardContainer = styled(View)`
display: flex;
flex-direction: column;
justify-content: center;
padding-left: 16px;
padding-right: 16px;
`;

const FiatCurrencyModalInRowContainer = styled(View)`
display: flex;
flex-direction: row;
align-items: center;
`;

const FiatCurrencyModalRowContainer = styled(View)`
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-between;
padding: 16px;
height: 58px;
`;

const FiatCurrencyModalIconView = styled(View)`
width: 24px;
height: 24px;
border-radius: 75px;
background-color: #A8C2DC;
align-items: center;
justify-content: center;
`;

const FiatCurrencyModalIconText = styled(Text)`
font-weight: 600;
font-size: 14px;
line-height: 18px;
color: #18222D;
`;

const FiatCurrencyModalText = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 24px;
color: ${props => props.theme.color.White};
padding-left: 12px;
`;

const FiatCurrencyModalLine = styled(View)`
height: 1px;
background-color: #242D37;
`;

// Price Modal Style
const PriceModalContainer = styled(View)`
display: flex;
flex-direction: column;
justify-content: center;
padding-top: 16px;
padding-bottom: 30px;
`;

const PriceModalCardContainer = styled(View)`
display: flex;
flex-direction: column;
justify-content: center;
`;

const PriceModalRowContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
height: 28px;
`;

const PriceModalText = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 18px;
color: ${props => props.theme.color.White};
padding-left: 12px;
`;

const PriceModalLine = styled(View)`
height: 1px;
background-color: #242D37;
margin-top: 16px;
margin-bottom: 16px;
`;

// Time Limit Modal Style
const TimeLimitModalConfirmText = styled(Text)`
font-weight: 500;
font-size: 14px;
line-height: 22px;
color: ${props => props.theme.color.MidGray};
`;

const TimeLmitPickerContainer = styled(View)``;


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

// Payment Modal Style
const PaymentModalContainer = styled(ScrollView)`
display: flex;
flex-direction: column;
padding-top: 32px;
padding-left: 16px;
padding-right: 16px;
padding-bottom: 500px;
`;

const PaymentModalCardContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
`;

const PaymentModalCardIconContainer = styled(View)`
width: 10%;
justify-content: center;
align-items: center;
`;

const PaymentModalCardDetailContainer = styled(View)`
width: 80%;
display: flex;
flex-direction: column;
justify-content: center;
`;

const PaymentModalCardSelectContainer = styled(View)`
width: 10%;
justify-content: center;
align-items: center;
`;

const PaymentModalRemindText = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 24px;
color: ${props => props.theme.color.White};
padding-top: 16px;
padding-left: 16px;
padding-right: 16px;
padding-bottom: 4px;
`;

const PaymentModalDetailTitleText = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 24px;
color: ${props => props.theme.color.White};
`;

const PaymentModalDetailNumberText = styled(Text)`
font-weight: 500;
font-size: 13px;
line-height: 20px;
color: ${props => props.theme.color.MidGray};
`;

const PaymentTypeImage = styled(Image)`
width: 28px;
height: 28px;
`;

const PaymentModalLine = styled(View)`
height: 1px;
background-color: #242D37;
margin-top: 16px;
margin-bottom: 16px;
`;

const PaymentText = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 24px;
color: ${props => props.theme.color.MidGray};
`;



const AdvertisementEdit = ({ navigation, route }: RootStackScreenProps<"AdvertisementEdit">) => {
    const {detail:user, token} = useAppSelector((state)=>state.user)
    const insets = useSafeAreaInsets();

    const { ID } = route.params;
    const { createDate } = route.params;
    const { type } = route.params;
    const { cryptoAsset } = route.params;
    const { fiatCurrency } = route.params;
    const { priceType } = route.params;
    const { price } = route.params;
    const { totalTradingAmount } = route.params;
    const { orderLimitMin } = route.params;
    const { orderLimitMax } = route.params;
    const { payments } = route.params;
    const { paymentTimeLimit } = route.params;
    const { terms } = route.params;
    const { conditionRegisteredDays } = route.params;
    const { conditionCompleteOrders } = route.params;

    // 切換進度條
    const [swapProgress, setSwapProgress] = useState(0);

    // 切換購買/出售頁面
    const [swapPage, setSwapPage] = useState(type);

    // Modal Visible
    const [isCryptoAssetModalVisible, setIsCryptoAssetModalVisible] = useState(false);
    const [isFiatCurrencyModalVisible, setIsFiatCurrencyModalVisible] = useState(false);
    const [isPriceTypeModalVisible, setIsPriceTypeModalVisible] = useState(false);
    const [isTimeLimitModalVisible, setIsTimeLimitModalVisible] = useState(false);
    const [isPassordModalVisible, setIsPasswordModalVisible] = useState(false);
    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);

    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    // 選擇幣種
    const [cryptoAssetType, setCryptoAssetType] = useState(cryptoAsset);

    // 選擇法幣
    const [fiatCurrencyType, setFiatCurrencyType] = useState(fiatCurrency);

    // 法幣 Search Bar
    const [inputSearch, setInputSearch] = useState('');
    const onChangeSearch = (query: any) => setInputSearch(query);

    // 定價方式
    const [PriceTypeValue, setPriceTypeValue] = useState(priceType); // 0 = 固定價格 ; 1 = 浮動價格
    const handlePriceText = () => {
        if (PriceTypeValue === 0) {
            return t("FixedPrice")
        } else {
            return t("flexiblePrice")
        }
    };

    const [priceProportion, setPriceProportion] = useState(100);

    const handleProportionMinus = () => {
        if (priceProportion > 1) {
            setPriceProportion(priceProportion - 1);
        }
    };

    const handleProportionAdd = () => {
        if (priceProportion < 100) {
            setPriceProportion(priceProportion + 1);
        }
    };

    // 價格 Input
    const [inputPrice, setInputPrice] = useState(`${price}`);

    // 數量 Input
    const [inputQuantity, setInputQuantity] = useState(`${totalTradingAmount}`);
    const [inputMinLimitPrice, setInputMinLimitPrice] = useState(`${orderLimitMin}`);
    const [inputMaxLimitPrice, setInputMaxLimitPrice] = useState(`${orderLimitMax}`);
    const [inputLimitTime, setInputLimitTime] = useState(paymentTimeLimit / 60000);

    // 付款方式選擇
    const [paymentList, setPaymentList] = useState<Payment[]>([]); // 獲取用戶已有付款方式
    const [chosenPaymentType, setChosenPaymentType] = useState(payments);// 最終選擇的付款方式
    const [modalPaymentType, setModalPaymentType] = useState<any[]>([]); // 判斷

    const getUserPayment = () => {
        userService.getPayments().then((response) => {
            setPaymentList(response.data);
        }).finally(() => {
            setLoading(false);
        })
    };


    // 交易備註 Input
    const [inputTradeMemo, setInputTradeMemo] = useState(terms == null ? "" : terms);

    // 交易方條件 Input
    const [inputConditionLimitOrder, setInputConditionLimitOrder] = useState(`${conditionCompleteOrders}`);
    const [inputConditionLimitSignUp, setinputConditionLimitSignUp] = useState(`${conditionRegisteredDays}`);

    // 同意條款勾選
    const [confirmRules, setConfirmRules] = useState(false);

    // 是否可以進行下一步
    const handleNextStep = () => {

        if (swapProgress === 0) {
            if (PriceTypeValue === 0) {
                if (
                    inputPrice != "" &&
                    inputQuantity != "" &&
                    inputMinLimitPrice != "" &&
                    inputMaxLimitPrice != ""
                     /* &&
                    parseFloat(inputQuantity) <= parseFloat(currentWalletBalance) */) {
                    return true;
                } else {
                    return false;
                }
            };
            if (PriceTypeValue === 1) {
                if (
                    inputQuantity != "" &&
                    inputMinLimitPrice != "" &&
                    inputMaxLimitPrice != ""
             /* &&
            parseFloat(inputQuantity) <= parseFloat(currentWalletBalance) */) {
                    return true;
                } else {
                    return false;
                }
            };
        };



        if (swapProgress === 1) {
            if (swapPage === 1) {
                if (chosenPaymentType.length >= 1) {
                    return true;
                } else {
                    return false;
                };
            } else {
                return true;
            }
        }
    };

    const handleSwapProgress = (swapProgress: number) => {
        setSwapProgress(swapProgress += 1)
    };

    // 獲取廣告單幣種列表
    const [cryptoAssetList, setCryptoAssetList] = useState<CryptoAsset[]>([]);

    const getCryptoAssetList = () => {
        setLoading(true)
        advertisementService.getCryptoAsset().then((response)=>{
            setCryptoAssetList(response);
        }).finally(()=>{
            setLoading(false)
        })
    };

    const handleCryptoAssetImage = (cryptoAsset: string) => {
        if (cryptoAsset == 'USDT') {
            return require('assets/images/wallet/usdt.png');
        } else if (cryptoAsset == 'BTC') {
            return require('assets/images/wallet/btc.png');
        } else if (cryptoAsset == 'ETH') {
            return require('assets/images/wallet/eth.png');
        } else {
            return require('assets/images/home/ad.png');
        }
    };

    // 判斷帳戶圖片
    const handlePaymentImage = (payment: string) => {
        if (payment === 'BANK') {
            return require('assets/images/c2c/payment.png')
        } else if (payment === 'TOUCHNGO') {
            return require('assets/images/c2c/touchn_go.png')
        } else if (payment === 'PPAY') {
            return require('assets/images/c2c/p_pay.png')
        }
        return "assets/images/c2c/payment.png"
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

    // 獲取廣告單法幣列表
    const [fiatCurrencyList, setFiatCurrencyList] = useState<FiatCurrency[]>([]);

    const getFiatCurrencyList = () => {
        setLoading(true)
        advertisementService.getFiatCurrency().then((response)=>{
            setFiatCurrencyList(response);
        }).finally(()=>{
            setLoading(false)
        })
    };

    const handleFiatCurrencyIconText = (fiatCurrency: string) => {
        if (fiatCurrency === 'CNY') {
            return '¥';
        } else if (fiatCurrency === 'USD') {
            return '$';
        } else if (fiatCurrency === 'TWD') {
            return '$';
        } else {
            return '$';
        }
    };

    // 篩選付款資訊
    const handleChosenPayment = (paymentID: string) => {
        if (modalPaymentType.some((x: any) => { return x == paymentID })) {
            setModalPaymentType(modalPaymentType.filter((x: any) => { return x != paymentID }));
        } else {
            setModalPaymentType(modalPaymentType => [...modalPaymentType, paymentID]);
        }
    };

    // 更新ChosenPaymentType
    const updateChosenPaymentType = () => {
        setChosenPaymentType([])
        for (let i = 0; i <= modalPaymentType.length; i++) {
            paymentList.filter((m: any) => { if (m.id == modalPaymentType[i]) return (setChosenPaymentType(chosenPaymentType => [...chosenPaymentType, m])) })
        }
    };

    // 刪除付款方式
    const deletePayment = (paymentType: string) => {
        setChosenPaymentType(chosenPaymentType.filter((x: any) => { return x.type != paymentType }));
    };

    // 更新ModalPaymentType
    const handleModalPaymentType = () => {
        setModalPaymentType([])
        for (const n of chosenPaymentType) {
            paymentList.filter((m: any) => { if (m.id == n.id) return (setModalPaymentType(modalPaymentType => [...modalPaymentType, m.id])) })

        }
    };

    // 用戶資訊
    interface userInfoDetail {
        account?: string,
        buyFeeRate?: number,
        sellFeeRate?: number,
        wallet?: {
            coins?: [],
            id?: string
        }
    };

    const [buyFeeRate, setBuyFeeRate] = useState(1);
    const [sellFeeRate, setSellFeeRate] = useState(1);
    const [currentWalletBalance, setCurrentWalletBalance] = useState(0);


    // 獲取用戶資訊（費率）
    const getUserInfo = async () => {
        setLoading(true)
        userService.getOtcUserInfo(user.account).then((response)=>{
            setBuyFeeRate(response.buyFeeRate);
            setSellFeeRate(response.sellFeeRate);
        }).finally(()=>{
            setLoading(false)
        })
    };

    // 獲取用戶資訊（幣種餘額）
    const getUserBalanceInfo = async () => {
        setLoading(true)
        userService.getOtcUserInfo(user.account).then((response)=>{
            const usdt = response.wallet.coins.find((coin) => { return coin.symbol === "USDT" }) ?? {} as Coin
            setCurrentWalletBalance(usdt.balance)
        }).finally(()=>{
            setLoading(false)
        })
    };

    // 廣告費計算 (尚未計算浮動價格)
    const handleCountFee = () => {
        if (inputPrice !== "" && inputQuantity != "") {
            if (swapPage === 0 && PriceTypeValue === 0) {
                return parseFloat(inputPrice) * parseFloat(inputQuantity) * buyFeeRate
            }
            if (swapPage === 1 && PriceTypeValue === 0) {
                return parseFloat(inputPrice) * parseFloat(inputQuantity) * sellFeeRate
            }
        } else {
            return 0;
        }
    };

    // 用戶資金密碼
    const [password, setPassword] = useState("");
    const { passwordVisibility, rightIcon, handlePasswordVisibility } =
        useTogglePasswordVisibility();


    // 修改廣告單  PUT
    const [postComplete, setPostComplete] = useState(false);

    const postAdvertisement = () => {
        setLoading(true);
        advertisementService.create({
            type: swapPage,
            cryptoAsset: cryptoAssetType,
            fiatCurrency: fiatCurrencyType,
            priceType: priceType,
            price: (parseFloat(inputPrice)).toFixed(2),
            totalTradingAmount: (parseFloat(inputQuantity)).toFixed(2),
            orderLimitMin: (parseFloat(inputMinLimitPrice)).toFixed(2),
            orderLimitMax: (parseFloat(inputMaxLimitPrice)).toFixed(2),
            paymentTimeLimit: (inputLimitTime * 60 * 1000),
            payments: (swapPage === 0 ? null : chosenPaymentType),
            conditionCompleteOrders: parseInt(inputConditionLimitOrder),
            conditionRegisteredDays: parseInt(inputConditionLimitSignUp),
            terms: inputTradeMemo,
            financePassword: password
        }).then(()=>{
            setIsPasswordModalVisible(false)
            setSwapProgress(3)
            setPostComplete(true)
        }).finally(()=>{
            setLoading(false)
        })
    };


    // useEffect
    useEffect(() => {
        const getToken = async () => {
            if (token) {
                getCryptoAssetList();
                getFiatCurrencyList();
                getUserPayment();
                getUserInfo();
            }
    
            handleNextStep()
        }
        getToken()
    }, []);

    useEffect(() => {
        const getToken = async () => {
            if (token) {
                getUserBalanceInfo();
            }
        }
        getToken()
    }, [cryptoAssetType]);

    return (
        <Container insets={insets.top}>
            {
                loading &&
                <Spinner visible={true} textContent={''} color={'#FFFFFF'} textStyle={{ color: '#FFFFFF' }} />
            }
            <HeaderContainer>
                <HeaderTitleContainer>
                    <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ paddingRight: 21 }}>
                        <HeaderTitlePreviousIcon source={require("assets/images/global/previous.png")} />
                    </TouchableOpacity>
                    <HeaderTitleText>編輯廣告</HeaderTitleText>
                    {
                        (swapProgress !== 2 && swapProgress !== 3) &&
                        (handleNextStep() === true &&
                            <TouchableOpacity onPress={() => { handleSwapProgress(swapProgress) }}>
                                <HeaderTitleNextStepWhiteText>{t("next")}</HeaderTitleNextStepWhiteText>
                            </TouchableOpacity>)
                    }
                    {
                        (swapProgress !== 2 && swapProgress !== 3) &&
                        (handleNextStep() !== true &&
                            <TouchableOpacity disabled={true}>
                                <HeaderTitleNextStepGrayText>{t("next")}</HeaderTitleNextStepGrayText>
                            </TouchableOpacity>)
                    }
                    {
                        (swapProgress === 2) &&
                        <HeaderTitleNextStepGrayText style={{ paddingRight: 50 }} />
                    }
                    {
                        (postComplete === true) &&
                        <HeaderTitleNextStepGrayText style={{ paddingRight: 50 }} />
                    }
                </HeaderTitleContainer>
            </HeaderContainer>
            <BodyContainer>
                {
                    !postComplete ?
                        <HeaderProgressContainer>
                            {
                                swapProgress === 0 &&
                                <HeaderProgressTopContainer>
                                    <HeaderProgressPrimaryCircle />
                                    <HeaderProgressGrayLine />
                                    <HeaderProgressGrayCircle />
                                    <HeaderProgressGrayLine />
                                    <HeaderProgressGrayCircle />
                                </HeaderProgressTopContainer>
                            }
                            {
                                swapProgress === 1 &&
                                <HeaderProgressTopContainer>
                                    <HeaderProgressLightGrayCircle />
                                    <HeaderProgressLightGrayLine />
                                    <HeaderProgressPrimaryCircle />
                                    <HeaderProgressGrayLine />
                                    <HeaderProgressGrayCircle />
                                </HeaderProgressTopContainer>
                            }
                            {
                                swapProgress === 2 &&
                                <HeaderProgressTopContainer>
                                    <HeaderProgressLightGrayCircle />
                                    <HeaderProgressLightGrayLine />
                                    <HeaderProgressLightGrayCircle />
                                    <HeaderProgressLightGrayLine />
                                    <HeaderProgressPrimaryCircle />
                                </HeaderProgressTopContainer>
                            }
                            {
                                swapProgress === 0 &&
                                <HeaderProgressBottomContainer>
                                    <HeaderProgressWhiteText>{t("priceNQty")}</HeaderProgressWhiteText>
                                    <HeaderProgressGrayText>{t("fiatTradeType")}</HeaderProgressGrayText>
                                    <HeaderProgressGrayText>{t("adsConfirm")}</HeaderProgressGrayText>
                                </HeaderProgressBottomContainer>
                            }
                            {
                                swapProgress === 1 &&
                                <HeaderProgressBottomContainer>
                                    <HeaderProgressLightGrayText>{t("priceNQty")}</HeaderProgressLightGrayText>
                                    <HeaderProgressWhiteText>{t("fiatTradeType")}</HeaderProgressWhiteText>
                                    <HeaderProgressGrayText>{t("adsConfirm")}</HeaderProgressGrayText>
                                </HeaderProgressBottomContainer>
                            }
                            {
                                swapProgress === 2 &&
                                <HeaderProgressBottomContainer>
                                    <HeaderProgressLightGrayText>{t("priceNQty")}</HeaderProgressLightGrayText>
                                    <HeaderProgressLightGrayText>{t("fiatTradeType")}</HeaderProgressLightGrayText>
                                    <HeaderProgressWhiteText>{t("adsConfirm")}</HeaderProgressWhiteText>
                                </HeaderProgressBottomContainer>
                            }
                        </HeaderProgressContainer> :
                        <HeaderProgressContainer>
                            <PostCompleteContiner>
                                <PostCompleteImage source={require("assets/images/c2c/post_complete.png")} />
                                <PostCompleteText>廣告編輯成功</PostCompleteText>
                            </PostCompleteContiner>
                        </HeaderProgressContainer>
                }

                {
                    swapProgress === 0 &&
                    <SwapPageContainer>
                        {
                            swapPage === 0 ?
                                <SwapContainer>
                                    <SwapButtonClicked onPress={() => { setSwapPage(0) }} disabled={true}>
                                        <SwapButtonClickedText>{t("wantBuy")}</SwapButtonClickedText>
                                    </SwapButtonClicked>
                                    <SwapButton onPress={() => { setSwapPage(1) }} disabled={true}>
                                        <SwapButtonText>{t("wantSell")}</SwapButtonText>
                                    </SwapButton>
                                </SwapContainer> :
                                <SwapContainer>
                                    <SwapButton onPress={() => { setSwapPage(0) }} disabled={true}>
                                        <SwapButtonText>{t("wantBuy")}</SwapButtonText>
                                    </SwapButton>
                                    <SwapButtonClicked onPress={() => { setSwapPage(1) }} disabled={true}>
                                        <SwapButtonClickedText>{t("wantSell")}</SwapButtonClickedText>
                                    </SwapButtonClicked>
                                </SwapContainer>
                        }

                        <CurrencyTypeContainer>
                            <CurrencyTypeRowContainer>
                                <CurrencyTypeLeftColumnContainer>
                                    <CurrencyTypeTitleText>{t("token")}</CurrencyTypeTitleText>
                                    <CurrencyTypeButton onPress={() => { setIsCryptoAssetModalVisible(true) }} disabled={true}>
                                        <CurrencyTypeButtonText>{cryptoAssetType}</CurrencyTypeButtonText>
                                        <CurrencyTypeForwardImage source={require("assets/images/c2c/next.png")} />
                                    </CurrencyTypeButton>
                                </CurrencyTypeLeftColumnContainer>
                                <CurrencyTypeRightColumnContainer>
                                    <CurrencyTypeTitleText>{t("fundFiat")}</CurrencyTypeTitleText>
                                    <CurrencyTypeButton onPress={() => { setIsFiatCurrencyModalVisible(true) }} disabled={true}>
                                        <CurrencyTypeButtonText>{fiatCurrencyType}</CurrencyTypeButtonText>
                                        <CurrencyTypeForwardImage source={require("assets/images/c2c/next.png")} />
                                    </CurrencyTypeButton>
                                </CurrencyTypeRightColumnContainer>
                            </CurrencyTypeRowContainer>
                        </CurrencyTypeContainer>

                        <PriceContainer>
                            <PriceTitleText>{t("price")}</PriceTitleText>
                            <PriceTypeInputContainer>
                                <PriceSmallTitleText>{t("priceMethod")}</PriceSmallTitleText>
                                <PriceButton onPress={() => { setIsPriceTypeModalVisible(true) }}>
                                    <PriceButtonText>{handlePriceText()}</PriceButtonText>
                                    <PriceButtonForwardImage source={require("assets/images/c2c/next.png")} />
                                </PriceButton>
                            </PriceTypeInputContainer>
                            <PriceTypeInputContainer>
                                <PriceSmallTitleText>{handlePriceText()}</PriceSmallTitleText>
                                {
                                    PriceTypeValue === 0 ?
                                        <PriceRowContainer>
                                            <TextInput
                                                style={{
                                                    height: 48,
                                                    backgroundColor: '#242D37',
                                                    paddingBottom: 12,
                                                    paddingTop: 12,
                                                    paddingLeft: 16,
                                                    paddingRight: 16,
                                                    width: '80%',
                                                    color: '#FFFFFF'
                                                }}
                                                value={inputPrice}
                                                onChangeText={(text) => { setInputPrice(text) }}
                                                placeholder={t("enterFixedPrice")}
                                                placeholderTextColor={'#8D97A2'}
                                                keyboardType={"decimal-pad"}
                                            />
                                            <PriceInputCurencytTextView>
                                                <PriceInputCurrencyText>{fiatCurrencyType}</PriceInputCurrencyText>
                                            </PriceInputCurencytTextView>
                                        </PriceRowContainer> :
                                        <PriceNumberContainer>
                                            <TouchableOpacity onPress={() => { handleProportionMinus() }}>
                                                <PriceInputImage source={require("assets/images/trade/remove.png")} />
                                            </TouchableOpacity>
                                            <PriceButtonText>{priceProportion}</PriceButtonText>
                                            <TouchableOpacity onPress={() => { handleProportionAdd() }}>
                                                <PriceInputImage source={require("assets/images/trade/add.png")} />
                                            </TouchableOpacity>
                                        </PriceNumberContainer>
                                }
                            </PriceTypeInputContainer>
                            <PriceBottomRowContainer style={{ paddingTop: 16 }}>
                                <PriceSmallTitleText>{t("fiatMarketPrice")}</PriceSmallTitleText>
                                <PriceMarketValueText>{inputPrice} {fiatCurrencyType} / {cryptoAssetType}</PriceMarketValueText>
                            </PriceBottomRowContainer>
                            <PriceBottomRowContainer>
                                <PriceSmallTitleText>{t("tradePrice")}</PriceSmallTitleText>
                                <PriceTradeText>{inputPrice} {fiatCurrencyType} / {cryptoAssetType}</PriceTradeText>
                            </PriceBottomRowContainer>
                        </PriceContainer>

                        <QuantityContainer>
                            <QuantityTitleText>{t("amount")}</QuantityTitleText>
                            <QuantityInputContainer>
                                <QuantityInputTitleRowContainer>
                                    {
                                        parseFloat(inputQuantity) > currentWalletBalance ?
                                            <QuanitityTradeQuantityTitleNegative>{t("tradeAmount")}</QuanitityTradeQuantityTitleNegative> :
                                            <QuantitySmallTitleText>{t("tradeAmount")}</QuantitySmallTitleText>
                                    }
                                    <QuantityTradeQuantityCurrentWalletBalanceText>
                                    {t("transferAvailableAmount")} {currentWalletBalance} {cryptoAssetType}
                                    </QuantityTradeQuantityCurrentWalletBalanceText>
                                </QuantityInputTitleRowContainer>
                                <QuantityTradeQuantityRowContainer>
                                    <TextInput
                                        style={{
                                            height: 48,
                                            backgroundColor: '#242D37',
                                            paddingBottom: 12,
                                            paddingTop: 12,
                                            paddingLeft: 16,
                                            paddingRight: 16,
                                            width: '80%',
                                            color: '#FFFFFF'
                                        }}
                                        value={inputQuantity}
                                        onChangeText={(text) => { setInputQuantity(text) }}
                                        placeholder={t("enterTradeAmount")}
                                        placeholderTextColor={'#8D97A2'}
                                        keyboardType={"decimal-pad"}
                                    />
                                    <QuantityTradeQuantityCurrencyView>
                                        <QuantityTradeQuantityCurrencyText>{cryptoAssetType}</QuantityTradeQuantityCurrencyText>
                                    </QuantityTradeQuantityCurrencyView>
                                </QuantityTradeQuantityRowContainer>
                                {
                                    parseFloat(inputQuantity) > currentWalletBalance &&
                                    <QuanitityTradeQuantityDetailNegative>超過您的可用資產</QuanitityTradeQuantityDetailNegative>
                                }
                            </QuantityInputContainer>
                            <QuantityInputContainer>
                                <QuantitySmallTitleText>{t("limitedAmountPerOrder")}</QuantitySmallTitleText>
                                <QuantityPriceLimitRowContainer>
                                    <TextInput
                                        style={{
                                            height: 48,
                                            backgroundColor: '#242D37',
                                            paddingBottom: 12,
                                            paddingTop: 12,
                                            paddingLeft: 16,
                                            paddingRight: 16,
                                            width: '30%',
                                            color: '#FFFFFF'
                                        }}
                                        value={inputMinLimitPrice}
                                        onChangeText={(text) => { setInputMinLimitPrice(text) }}
                                        placeholder={t("min")}
                                        placeholderTextColor={'#8D97A2'}
                                        keyboardType={"decimal-pad"}
                                    />
                                    <QuantityPriceLimitCurrencyView>
                                        <QuantityPriceLimitCurrencyText>{fiatCurrencyType}</QuantityPriceLimitCurrencyText>
                                    </QuantityPriceLimitCurrencyView>
                                    <QuantityPriceLimitMiddleView>
                                        <QuantityPriceLimitMiddleViewText> ~ </QuantityPriceLimitMiddleViewText>
                                    </QuantityPriceLimitMiddleView>
                                    <TextInput
                                        style={{
                                            height: 48,
                                            backgroundColor: '#242D37',
                                            paddingBottom: 12,
                                            paddingTop: 12,
                                            paddingLeft: 16,
                                            paddingRight: 16,
                                            width: '30%',
                                            color: '#FFFFFF'
                                        }}
                                        value={inputMaxLimitPrice}
                                        onChangeText={(text) => { setInputMaxLimitPrice(text) }}
                                        placeholder={t("max")}
                                        placeholderTextColor={'#8D97A2'}
                                        keyboardType={"decimal-pad"}
                                    />
                                    <QuantityPriceLimitCurrencyView>
                                        <QuantityPriceLimitCurrencyText>{fiatCurrencyType}</QuantityPriceLimitCurrencyText>
                                    </QuantityPriceLimitCurrencyView>
                                </QuantityPriceLimitRowContainer>
                            </QuantityInputContainer>
                            <QuantityInputContainer>
                                {
                                    swapPage === 0 ?
                                        <QuantitySmallTitleText>{t("limitedTime")}</QuantitySmallTitleText> :
                                        <QuantitySmallTitleText>{t("releaseLimitedTime")}</QuantitySmallTitleText>
                                }
                                <QuantityTimeLimitButton onPress={() => { setIsTimeLimitModalVisible(true) }}>
                                    <QuantityTimeLimitButtonText>{inputLimitTime} 分鐘</QuantityTimeLimitButtonText>
                                    <QuantityTimeLimitButtonForwardImage source={require("assets/images/c2c/next.png")} />
                                </QuantityTimeLimitButton>
                            </QuantityInputContainer>
                        </QuantityContainer>

                        <TradeFeeNotifyContainer>
                            <TradeFeeNotifyImage source={require("assets/images/c2c/funds.png")} />
                            <TradeFeeNotifyText>{t("estAdsFee")} {handleCountFee()} {cryptoAssetType}</TradeFeeNotifyText>
                        </TradeFeeNotifyContainer>

                    </SwapPageContainer>
                }

                {
                    swapProgress === 1 &&
                    <SwapPageContainer>
                        {
                            swapPage === 1 &&
                            (<PaymentContainer>
                                <PaymentTitleRowContainer>
                                    <PaymentTitleText>{t("payments")}</PaymentTitleText>
                                    <TouchableOpacity onPress={() => { setIsPaymentModalVisible(true), handleModalPaymentType() }}>
                                        <PaymentAddImage source={require("assets/images/c2c/add.png")} />
                                    </TouchableOpacity>
                                </PaymentTitleRowContainer>
                                {
                                    chosenPaymentType.length < 1 ?
                                        <PaymentRowContainer>
                                            <PaymentText>{t("addOnePayment")} </PaymentText>
                                        </PaymentRowContainer> :
                                        <PaymentRowContainer horizontal={true}>
                                            {
                                                chosenPaymentType.some((x: any) => { return x.type == 'BANK' }) &&
                                                <PaymentTypeView>
                                                    <PaymentTypeViewText>{t("bankTransfer")}</PaymentTypeViewText>
                                                    <TouchableOpacity onPress={() => { deletePayment('BANK') }}>
                                                        <PaymentTypeViewCancelImage source={require("assets/images/c2c/cancel_circle.png")} />
                                                    </TouchableOpacity>
                                                </PaymentTypeView>
                                            }
                                            {
                                                chosenPaymentType.some((x: any) => { return x.type == 'TOUCHNGO' }) &&
                                                <PaymentTypeView>
                                                    <PaymentTypeViewText>TouchnGo</PaymentTypeViewText>
                                                    <TouchableOpacity onPress={() => { deletePayment('TOUCHNGO') }}>
                                                        <PaymentTypeViewCancelImage source={require("assets/images/c2c/cancel_circle.png")} />
                                                    </TouchableOpacity>
                                                </PaymentTypeView>
                                            }
                                            {
                                                chosenPaymentType.some((x: any) => { return x.type == 'PPAY' }) &&
                                                <PaymentTypeView>
                                                    <PaymentTypeViewText>Ppay</PaymentTypeViewText>
                                                    <TouchableOpacity onPress={() => { deletePayment('PPAY') }}>
                                                        <PaymentTypeViewCancelImage source={require("assets/images/c2c/cancel_circle.png")} />
                                                    </TouchableOpacity>
                                                </PaymentTypeView>
                                            }
                                        </PaymentRowContainer>
                                }
                            </PaymentContainer>)
                        }

                        <TradeMemoContainer>
                            <TradeMemoTitleText>{t("tradeMemo")}</TradeMemoTitleText>
                            <TradeMemoTextInputContainer>
                                <TextInput
                                    style={{
                                        height: 90,
                                        backgroundColor: '#242D37',
                                        paddingBottom: 12,
                                        paddingTop: 12,
                                        paddingLeft: 16,
                                        paddingRight: 16,
                                        color: '#FFFFFF'
                                    }}
                                    value={inputTradeMemo}
                                    onChangeText={(text) => { setInputTradeMemo(text) }}
                                    placeholder={t("memoMsg")}
                                    placeholderTextColor={'#8D97A2'}
                                    multiline={true}
                                    maxLength={100}
                                />
                                <TradeMemoCountTextView>
                                    <TradeMemoCountText>{inputTradeMemo.length}/100</TradeMemoCountText>
                                </TradeMemoCountTextView>
                            </TradeMemoTextInputContainer>
                        </TradeMemoContainer>

                        <TradeConditionContainer>
                            <TradeConditionTitleText>{t("otherSideConditions")}</TradeConditionTitleText>
                            <TradeConditionRowContainer>
                                <TradeConditionText>{t("dealAtLeast")}</TradeConditionText>
                                <TextInput
                                    style={{
                                        height: 36,
                                        width: 60,
                                        backgroundColor: '#242D37',
                                        paddingBottom: 8,
                                        paddingTop: 8,
                                        paddingLeft: 12,
                                        paddingRight: 12,
                                        marginLeft: 8,
                                        marginRight: 8,
                                        color: '#FFFFFF',
                                        textAlign: 'center'
                                    }}
                                    value={inputConditionLimitOrder}
                                    onChangeText={(text) => { setInputConditionLimitOrder(text) }}
                                    defaultValue={"0"}
                                    keyboardType={"number-pad"}
                                />
                                <TradeConditionText>{t("dealTimes")}</TradeConditionText>
                            </TradeConditionRowContainer>
                            <TradeConditionRowContainer>
                                <TradeConditionText>{t("signUpDays")}</TradeConditionText>
                                <TextInput
                                    style={{
                                        height: 36,
                                        width: 60,
                                        backgroundColor: '#242D37',
                                        paddingBottom: 8,
                                        paddingTop: 8,
                                        paddingLeft: 12,
                                        paddingRight: 12,
                                        marginLeft: 8,
                                        marginRight: 8,
                                        color: '#FFFFFF',
                                        textAlign: 'center'
                                    }}
                                    value={inputConditionLimitSignUp}
                                    onChangeText={(text) => { setinputConditionLimitSignUp(text) }}
                                    keyboardType={"number-pad"}
                                />
                                <TradeConditionText>{t("days")}</TradeConditionText>
                            </TradeConditionRowContainer>
                        </TradeConditionContainer>
                    </SwapPageContainer>
                }

                {
                    swapProgress === 2 &&
                    <SwapPageContainer style={{ padding: 16 }}>
                        <ConfirmCardContainer>
                            <ConfirmCardRowContainer>
                                <ConfirmCardTitle>{t("tradePrice")}</ConfirmCardTitle>
                                {
                                    PriceTypeValue === 0 ?
                                        <ConfirmCardTradePriceText>{inputPrice} {fiatCurrencyType}/{cryptoAssetType}</ConfirmCardTradePriceText> :
                                        <ConfirmCardTradePriceText>{t("flexiblePrice")} {fiatCurrencyType}/{cryptoAssetType}</ConfirmCardTradePriceText>
                                }
                            </ConfirmCardRowContainer>
                            <ConfirmCardRowContainer>
                                <ConfirmCardTitle>{t("priceMethod")}</ConfirmCardTitle>
                                <ConfirmCardSecondText>{handlePriceText()}</ConfirmCardSecondText>
                            </ConfirmCardRowContainer>
                            <ConfirmCardRowContainer>
                                <ConfirmCardTitle>{t("tradeAmount")}</ConfirmCardTitle>
                                <ConfirmCardSecondText>{inputQuantity}</ConfirmCardSecondText>
                            </ConfirmCardRowContainer>
                            <ConfirmCardRowContainer>
                                <ConfirmCardTitle>{t("limitedAmountPerOrder")}</ConfirmCardTitle>
                                <ConfirmCardThirdText>{fiatCurrencyType} {inputMinLimitPrice} - {inputMaxLimitPrice}</ConfirmCardThirdText>
                            </ConfirmCardRowContainer>
                            <ConfirmCardRowContainer>
                                <ConfirmCardTitle>{t("limitedTime")}</ConfirmCardTitle>
                                <ConfirmCardThirdText>{inputLimitTime} {t("minutes")}</ConfirmCardThirdText>
                            </ConfirmCardRowContainer>
                            <ConfirmCardRowContainer>
                                <ConfirmCardTitle>{t("paymnets")}</ConfirmCardTitle>
                                <ConfirmCardPaymentContainer>
                                    {
                                        chosenPaymentType.some((x: any) => { return x.type == 'BANK' }) &&
                                        <ConfirmCardPaymentImage source={require("assets/images/c2c/payment.png")} />
                                    }
                                    {
                                        chosenPaymentType.some((x: any) => { return x.type == 'TOUCHNGO' }) &&
                                        <ConfirmCardPaymentImage source={require("assets/images/c2c/touchn_go.png")} />
                                    }
                                    {
                                        chosenPaymentType.some((x: any) => { return x.type == 'PPAY' }) &&
                                        <ConfirmCardPaymentImage source={require("assets/images/c2c/p_pay.png")} />
                                    }
                                </ConfirmCardPaymentContainer>
                            </ConfirmCardRowContainer>
                            <ConfirmCardColumnContainer>
                                <ConfirmCardSmallTitle>{t("fiatMemo")}</ConfirmCardSmallTitle>
                                <ConfirmCardFourthText>{t("payPlz")}</ConfirmCardFourthText>
                            </ConfirmCardColumnContainer>
                            <ConfirmCardColumnContainer>
                                <ConfirmCardSmallTitle>{t("otherSideConditions")}</ConfirmCardSmallTitle>
                                <ConfirmCardFourthText>
                                {t("dealAtLeast")} {inputConditionLimitOrder} {t("dealTimes")}、{t("signUpDays")} {inputConditionLimitSignUp} {t("days")}
                                </ConfirmCardFourthText>
                            </ConfirmCardColumnContainer>
                        </ConfirmCardContainer>
                        <ConfirmRulesContainer>
                            {
                                confirmRules ?
                                    <TouchableOpacity onPress={() => { setConfirmRules(false) }}>
                                        <ConfirmImage source={require("assets/images/c2c/check.png")} />
                                    </TouchableOpacity> :
                                    <TouchableOpacity onPress={() => { setConfirmRules(true) }}>
                                        <ConfirmUnClickView />
                                    </TouchableOpacity>
                            }
                            <ConfirmRulesText>{t("iAgree")}</ConfirmRulesText>
                            <TouchableOpacity onPress={() => { }}>
                                <ConfirmRulesNegativeText>《{t("tradeRegulations")}》</ConfirmRulesNegativeText>
                            </TouchableOpacity>
                        </ConfirmRulesContainer>
                        <ConfirmButtonContainer>
                            <ConfirmUpdateButton onPress={() => { setSwapProgress(0) }}>
                                <ConfirmUpdateButtonText>{t("modify")}</ConfirmUpdateButtonText>
                            </ConfirmUpdateButton>
                            <ConfirmButton onPress={() => { confirmRules && setIsPasswordModalVisible(true) }}>
                                <ConfirmButtonText>{t("placeConfirm")}</ConfirmButtonText>
                            </ConfirmButton>
                        </ConfirmButtonContainer>
                    </SwapPageContainer>
                }

                {
                    postComplete &&
                    <SwapPageContainer style={{ padding: 16 }}>
                        <ConfirmCardContainer>
                            <ConfirmCardRowContainer>
                                <ConfirmCardTitle>{t("tradePrice")}</ConfirmCardTitle>
                                {
                                    PriceTypeValue === 0 ?
                                        <ConfirmCardTradePriceText>{inputPrice} {fiatCurrencyType}/{cryptoAssetType}</ConfirmCardTradePriceText> :
                                        <ConfirmCardTradePriceText>{t("flexiblePrice")} {fiatCurrencyType}/{cryptoAssetType}</ConfirmCardTradePriceText>
                                }
                            </ConfirmCardRowContainer>
                            <ConfirmCardRowContainer>
                                <ConfirmCardTitle>{t("priceMethod")}</ConfirmCardTitle>
                                <ConfirmCardSecondText>{handlePriceText()}</ConfirmCardSecondText>
                            </ConfirmCardRowContainer>
                            <ConfirmCardRowContainer>
                                <ConfirmCardTitle>{t("tradeAmount")}</ConfirmCardTitle>
                                <ConfirmCardSecondText>{inputQuantity}</ConfirmCardSecondText>
                            </ConfirmCardRowContainer>
                            <ConfirmCardRowContainer>
                                <ConfirmCardTitle>{t("limitedAmountPerOrder")}</ConfirmCardTitle>
                                <ConfirmCardThirdText>{fiatCurrencyType} {inputMinLimitPrice} - {inputMaxLimitPrice}</ConfirmCardThirdText>
                            </ConfirmCardRowContainer>
                            <ConfirmCardRowContainer>
                                <ConfirmCardTitle>{t("limitedTime")}</ConfirmCardTitle>
                                <ConfirmCardThirdText>{inputLimitTime} {t("minutes")}</ConfirmCardThirdText>
                            </ConfirmCardRowContainer>
                            <ConfirmCardRowContainer>
                                <ConfirmCardTitle>{t("payments")}</ConfirmCardTitle>
                                <ConfirmCardPaymentContainer>
                                    {
                                        chosenPaymentType.some((x: any) => { return x.type == 'BANK' }) &&
                                        <ConfirmCardPaymentImage source={require("assets/images/c2c/payment.png")} />
                                    }
                                    {
                                        chosenPaymentType.some((x: any) => { return x.type == 'TOUCHNGO' }) &&
                                        <ConfirmCardPaymentImage source={require("assets/images/c2c/touchn_go.png")} />
                                    }
                                    {
                                        chosenPaymentType.some((x: any) => { return x.type == 'PPAY' }) &&
                                        <ConfirmCardPaymentImage source={require("assets/images/c2c/p_pay.png")} />
                                    }
                                </ConfirmCardPaymentContainer>
                            </ConfirmCardRowContainer>
                            <ConfirmCardColumnContainer>
                                <ConfirmCardSmallTitle>{t("fiatMemo")}</ConfirmCardSmallTitle>
                                <ConfirmCardFourthText>{t("payPlz")}</ConfirmCardFourthText>
                            </ConfirmCardColumnContainer>
                            <ConfirmCardColumnContainer>
                                <ConfirmCardSmallTitle>{t("otherSideConditions")}</ConfirmCardSmallTitle>
                                <ConfirmCardFourthText>
                                {t("dealAtLeast")} {inputConditionLimitOrder} {t("dealTimes")}、{t("signUpDays")} {inputConditionLimitSignUp} {t("days")}
                                </ConfirmCardFourthText>
                            </ConfirmCardColumnContainer>
                        </ConfirmCardContainer>
                        <PostCompleteButton onPress={() => { navigation.goBack() }}>
                            <PostCompleteButtonText>{t("fiatOverview")}</PostCompleteButtonText>
                        </PostCompleteButton>
                    </SwapPageContainer>
                }
            </BodyContainer>


            {/* CryptoAsset Modal 幣種*/}
            <Modal
                isVisible={isCryptoAssetModalVisible}
                deviceHeight={windowHeight}
                deviceWidth={windowWidth}
                animationInTiming={500}
                animationOutTiming={700}
                backdropOpacity={0.7}
                onBackdropPress={() => setIsCryptoAssetModalVisible(false)}
                onSwipeComplete={() => setIsCryptoAssetModalVisible(false)}
                swipeDirection={['down']}
                style={{ justifyContent: 'flex-end', margin: 0 }}
                hideModalContentWhileAnimating={true}
            >
                <View style={{ backgroundColor: '#242D37', paddingLeft: 16, paddingRight: 16, paddingBottom: 30 }}>
                    <ModalHeaderContainer>
                        <ModalHeaderTitleText>{t("token")}</ModalHeaderTitleText>
                    </ModalHeaderContainer>
                    <CryptoAssetModalContainer>
                        {
                            cryptoAssetList.map((x: any, i) => {
                                return (
                                    <CryptoAssetModalCardContainer>
                                        <TouchableOpacity onPress={() => { (setCryptoAssetType((x.name).toUpperCase()), setIsCryptoAssetModalVisible(false)) }}>
                                            <CryptoAssetModalRowContainer>
                                                <CryptoAssetModalInRowContainer>
                                                    <CryptoAssetModalImage source={handleCryptoAssetImage(x.name)} />
                                                    <CryptoAssetModalText>{x.name}</CryptoAssetModalText>
                                                </CryptoAssetModalInRowContainer>
                                                {
                                                    cryptoAssetType === (x.name).toUpperCase() &&
                                                    <ModalSelectImage source={require("assets/images/trade/selected.png")} />
                                                }
                                            </CryptoAssetModalRowContainer>
                                        </TouchableOpacity>
                                        {
                                            i !== cryptoAssetList.length - 1 &&
                                            <CryptoAssetModalLine />
                                        }
                                    </CryptoAssetModalCardContainer>
                                )
                            })
                        }
                    </CryptoAssetModalContainer>
                </View>
            </Modal>

            {/* FiatCurrency Modal 法幣*/}
            <Modal
                isVisible={isFiatCurrencyModalVisible}
                deviceHeight={windowHeight}
                deviceWidth={windowWidth}
                animationInTiming={500}
                animationOutTiming={700}
                backdropOpacity={0.7}
                onBackdropPress={() => setIsFiatCurrencyModalVisible(false)}
                onSwipeComplete={() => setIsFiatCurrencyModalVisible(false)}
                swipeDirection={['down']}
                style={{ justifyContent: 'flex-start', margin: 0, height: windowHeight, width: windowWidth }}
                hideModalContentWhileAnimating={true}
            >
                <View style={{
                    backgroundColor: '#18222D',
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    paddingTop: 16,
                    paddingBottom: 500
                }}>
                    <ModalFullScreenHeaderContainer insets={insets.top} >
                        <TouchableOpacity onPress={() => { setIsFiatCurrencyModalVisible(false) }}>
                            <ModalCancelImage source={require("assets/images/c2c/cancel.png")} />
                        </TouchableOpacity>
                        <ModalHeaderTitleText>{t("fundFiat")}</ModalHeaderTitleText>
                        <ModalHeaderRightEmptyView />
                    </ModalFullScreenHeaderContainer>
                    <FiatCurrenctModalSearchbarContainer>
                        <SearchBar
                            placeholder="請輸入法幣"
                            onChangeText={onChangeSearch}
                            value={inputSearch}
                            containerStyle={{ height: 48, backgroundColor: '#242D37', borderWidth: 0, borderTopWidth: 0, borderBottomWidth: 0, marginBottom: 10 }}
                            inputContainerStyle={{ height: 32, backgroundColor: '#242D37' }}
                        />
                    </FiatCurrenctModalSearchbarContainer>
                    <FiatCurrencyModalContainer>
                        {
                            inputSearch === '' ?
                                fiatCurrencyList.map((x: any, i) => {
                                    return (
                                        <FiatCurrencyModalCardContainer>
                                            <TouchableOpacity onPress={() => (setFiatCurrencyType(x.name), setIsFiatCurrencyModalVisible(false))}>
                                                <FiatCurrencyModalRowContainer>
                                                    <FiatCurrencyModalInRowContainer>
                                                        <FiatCurrencyModalIconView>
                                                            <FiatCurrencyModalIconText>{handleFiatCurrencyIconText(x.name)}</FiatCurrencyModalIconText>
                                                        </FiatCurrencyModalIconView>
                                                        <FiatCurrencyModalText>{x.name}</FiatCurrencyModalText>
                                                    </FiatCurrencyModalInRowContainer>
                                                    {
                                                        fiatCurrencyType === x.name &&
                                                        <ModalSelectImage source={require("assets/images/trade/selected.png")} />
                                                    }
                                                </FiatCurrencyModalRowContainer>
                                            </TouchableOpacity>
                                            {
                                                i !== fiatCurrencyList.length - 1 &&
                                                <FiatCurrencyModalLine />
                                            }
                                        </FiatCurrencyModalCardContainer>
                                    )
                                }) :
                                fiatCurrencyList.map((x: any) => {
                                    if (x.name == inputSearch.toUpperCase()) {
                                        return (
                                            <FiatCurrencyModalCardContainer>
                                                <TouchableOpacity onPress={() => (setFiatCurrencyType(x.name), setIsFiatCurrencyModalVisible(false))}>
                                                    <FiatCurrencyModalRowContainer>
                                                        <FiatCurrencyModalInRowContainer>
                                                            <FiatCurrencyModalIconView>
                                                                <FiatCurrencyModalIconText>{handleFiatCurrencyIconText(x.name)}</FiatCurrencyModalIconText>
                                                            </FiatCurrencyModalIconView>
                                                            <FiatCurrencyModalText>{x.name}</FiatCurrencyModalText>
                                                        </FiatCurrencyModalInRowContainer>
                                                        {
                                                            fiatCurrencyType === x.name &&
                                                            <ModalSelectImage source={require("assets/images/trade/selected.png")} />
                                                        }
                                                    </FiatCurrencyModalRowContainer>
                                                </TouchableOpacity>
                                            </FiatCurrencyModalCardContainer>
                                        )
                                    }
                                })
                        }
                    </FiatCurrencyModalContainer>
                </View>
            </Modal>

            {/* Price Type Modal 價格*/}
            <Modal
                isVisible={isPriceTypeModalVisible}
                deviceHeight={windowHeight}
                deviceWidth={windowWidth}
                animationInTiming={500}
                animationOutTiming={700}
                backdropOpacity={0.7}
                onBackdropPress={() => setIsPriceTypeModalVisible(false)}
                onSwipeComplete={() => setIsPriceTypeModalVisible(false)}
                swipeDirection={['down']}
                style={{ justifyContent: 'flex-end', margin: 0 }}
                hideModalContentWhileAnimating={true}
            >
                <View style={{ backgroundColor: '#242D37', paddingLeft: 16, paddingRight: 16, paddingBottom: 30 }}>
                    <ModalHeaderContainer>
                        <ModalHeaderTitleText>{t("priceMethod")}</ModalHeaderTitleText>
                    </ModalHeaderContainer>
                    <PriceModalContainer>
                        <TouchableOpacity onPress={() => { setPriceTypeValue(0), setIsPriceTypeModalVisible(false) }}>
                            <PriceRowContainer>
                                <PriceModalText>{t("FixedPrice")}</PriceModalText>
                                {
                                    PriceTypeValue === 0 &&
                                    <ModalSelectImage source={require("assets/images/trade/selected.png")} />
                                }
                            </PriceRowContainer>
                        </TouchableOpacity>
                        <PriceModalLine />
                        <TouchableOpacity onPress={() => { setPriceTypeValue(1), setIsPriceTypeModalVisible(false) }}>
                            <PriceRowContainer>
                                <PriceModalText>{t("flexiblePrice")}</PriceModalText>
                                {
                                    PriceTypeValue === 1 &&
                                    <ModalSelectImage source={require("assets/images/trade/selected.png")} />
                                }
                            </PriceRowContainer>
                        </TouchableOpacity>
                        <PriceModalLine />
                    </PriceModalContainer>
                </View>
            </Modal>

            {/* Time Limit Modal {t("limitedTime")}*/}
            <Modal
                isVisible={isTimeLimitModalVisible}
                deviceHeight={windowHeight}
                deviceWidth={windowWidth}
                animationInTiming={500}
                animationOutTiming={700}
                backdropOpacity={0.7}
                onBackdropPress={() => setIsTimeLimitModalVisible(false)}
                onSwipeComplete={() => setIsTimeLimitModalVisible(false)}
                style={{ justifyContent: 'flex-end', margin: 0 }}
                hideModalContentWhileAnimating={true}
            >
                <View style={{ backgroundColor: '#242D37', paddingBottom: 30 }}>
                    <ModalTitleBarHeaderContainer>
                        <TouchableOpacity onPress={() => { setIsTimeLimitModalVisible(false) }}>
                            <ModalCancelImage source={require("assets/images/c2c/cancel.png")} />
                        </TouchableOpacity>
                        {
                            swapPage === 0 ?
                                <ModalHeaderTitleText>{t("limitedTime")}</ModalHeaderTitleText> :
                                <ModalHeaderTitleText>{t("releaseLimitedTime")}</ModalHeaderTitleText>
                        }
                        <TouchableOpacity onPress={() => { setIsTimeLimitModalVisible(false) }}>
                            <TimeLimitModalConfirmText>{t("OK")}</TimeLimitModalConfirmText>
                        </TouchableOpacity>
                    </ModalTitleBarHeaderContainer>
                    <TimeLmitPickerContainer>
                        <Picker
                            selectedValue={inputLimitTime}
                            onValueChange={(itemValue, itemIndex) =>
                                setInputLimitTime(itemValue)
                            }
                            itemStyle={{ color: '#FFFFFF' }}
                        >
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label="4" value="4" />
                            <Picker.Item label="5" value="5" />
                            <Picker.Item label="6" value="6" />
                            <Picker.Item label="7" value="7" />
                            <Picker.Item label="8" value="8" />
                            <Picker.Item label="9" value="9" />
                            <Picker.Item label="10" value="10" />
                            <Picker.Item label="11" value="11" />
                            <Picker.Item label="12" value="12" />
                            <Picker.Item label="13" value="13" />
                            <Picker.Item label="14" value="14" />
                            <Picker.Item label="15" value="15" />
                            <Picker.Item label="16" value="16" />
                            <Picker.Item label="17" value="17" />
                            <Picker.Item label="18" value="18" />
                            <Picker.Item label="19" value="19" />
                            <Picker.Item label="20" value="20" />
                            <Picker.Item label="21" value="21" />
                            <Picker.Item label="22" value="22" />
                            <Picker.Item label="23" value="23" />
                            <Picker.Item label="24" value="24" />
                            <Picker.Item label="25" value="25" />
                            <Picker.Item label="26" value="26" />
                            <Picker.Item label="27" value="27" />
                            <Picker.Item label="28" value="28" />
                            <Picker.Item label="29" value="29" />
                            <Picker.Item label="30" value="30" />
                            <Picker.Item label="31" value="31" />
                            <Picker.Item label="32" value="32" />
                            <Picker.Item label="33" value="33" />
                            <Picker.Item label="34" value="34" />
                            <Picker.Item label="35" value="35" />
                        </Picker>
                    </TimeLmitPickerContainer>
                </View>
            </Modal>

            {/* // 檢查資金密碼Modal */}
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
                        <PasswordModalHeaderText>{t("enterFundingPass")}</PasswordModalHeaderText>
                        <PasswordModalHeaderDetailText>{t("sellingEnterPass")}</PasswordModalHeaderDetailText>

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
                                style={{ width: '90%', color: '#FFFFFF' }}
                                placeholder={t("enterFundPass")}
                                placeholderTextColor={'#98999A'}
                                autoCapitalize="none"
                                autoCorrect={false}
                                textContentType="newPassword"
                                secureTextEntry={passwordVisibility}
                                value={password}
                                enablesReturnKeyAutomatically
                                onChangeText={text => setPassword(text)}
                            />
                            <TouchableOpacity onPress={handlePasswordVisibility}>
                                <Feather name={rightIcon} size={16} color="#DBDCDD" />
                            </TouchableOpacity>
                        </View>
                    </PasswordModalContainer>
                    <PasswordModalRowLine></PasswordModalRowLine>
                    <PasswordModalButtonContainer>
                        <PasswordModalCancelButton onPress={() => { setIsPasswordModalVisible(false), setPassword("") }}>
                            <PasswordModalCancelButtonText>{t("cancel")}</PasswordModalCancelButtonText>
                        </PasswordModalCancelButton>
                        <PasswordModalButtonLine />
                        <PasswordModalSubmitButton onPress={() => { postAdvertisement() }}>
                            <PasswordModalSubmitButtonText>{t("OK")}</PasswordModalSubmitButtonText>
                        </PasswordModalSubmitButton>
                    </PasswordModalButtonContainer>
                </View>
            </Modal>

            {/* 交易方式 Modal */}
            <Modal
                isVisible={isPaymentModalVisible}
                deviceHeight={windowHeight}
                deviceWidth={windowWidth}
                animationInTiming={500}
                animationOutTiming={700}
                backdropOpacity={0.7}
                onBackdropPress={() => setIsPaymentModalVisible(false)}
                onSwipeComplete={() => setIsPaymentModalVisible(false)}
                style={{ justifyContent: 'flex-start', margin: 0, height: windowHeight, width: windowWidth }}
                hideModalContentWhileAnimating={true}
            >
                <View style={{
                    backgroundColor: '#18222D',
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    paddingTop: 16,
                    paddingBottom: 200
                }}>
                    <ModalFullScreenHeaderContainer insets={insets.top} >
                        <TouchableOpacity onPress={() => { setIsPaymentModalVisible(false), updateChosenPaymentType() }} >
                            <ModalCancelImage source={require("assets/images/global/previous.png")} />
                        </TouchableOpacity>
                        <ModalHeaderTitleText>{t("payments")}</ModalHeaderTitleText>
                        <TouchableOpacity onPress={() => { navigation.navigate("PaymentsCreate") }}>
                            <PaymentAddImage source={require("assets/images/c2c/add.png")} />
                        </TouchableOpacity>
                    </ModalFullScreenHeaderContainer>
                    <PaymentModalRemindText>{t("atLeastPayment")}</PaymentModalRemindText>
                    <PaymentModalContainer>
                        {
                            paymentList.map((payment, index) => {
                                return (
                                    <TouchableOpacity key={payment.id} onPress={() => { handleChosenPayment(payment.id) }}>
                                        <PaymentModalCardContainer>
                                            <PaymentModalCardIconContainer>
                                                <PaymentTypeImage source={handlePaymentImage(payment.type)} />
                                            </PaymentModalCardIconContainer>
                                            <PaymentModalCardDetailContainer>
                                                <PaymentModalDetailTitleText>{handlePaymentType(payment.type)}</PaymentModalDetailTitleText>
                                                <PaymentModalDetailNumberText>({payment.code}) {payment.account}</PaymentModalDetailNumberText>
                                            </PaymentModalCardDetailContainer>
                                            <PaymentModalCardSelectContainer>
                                                {
                                                    modalPaymentType.some((m: any) => { return (m == payment.id) }) &&
                                                    <ModalSelectImage source={require("assets/images/c2c/selected.png")} />
                                                }
                                            </PaymentModalCardSelectContainer>
                                        </PaymentModalCardContainer>
                                        {
                                            index !== paymentList.length - 1 &&
                                            <PaymentModalLine />
                                        }
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </PaymentModalContainer>
                </View>
            </Modal>
        </Container>
    )
}

export default AdvertisementEdit