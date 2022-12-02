import * as React from "react"
import { Text, View, Image, TouchableOpacity, ScrollView, Alert, Dimensions } from "react-native"
import { RootStackScreenProps } from "common/types";
import styled from "styled-components"
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import { useAppSelector, useAppDispatch } from "hooks";
import { advertisementService, otcOrderService } from "services";
import { otcOrderActions, c2cActions } from "store/slice";
import Spinner from 'react-native-loading-spinner-overlay'
import _ from "lodash"
import { useTranslation } from "react-i18next";
import { OtcOrderStatus } from "common/constant";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const Container = styled(View) <{ insets: number }>`
    display: flex ;
    flex:1;
    flex-direction: column;
    padding-top: ${props => props.insets}px;
    background-color: #18222D;
    justify-content: space-between;
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

const PreviousIcon = styled(Image)`
width: 28px;
height: 28px;
`;

const HeaderTitleText = styled(Text)`
font-weight: 600;
font-size: 16px;
line-height: 24px;
color: ${props => props.theme.color.White};
`;

const HeaderEmptyContainer = styled(View)`
width: 28px;
height: 28px;
`;

const SwapContainer = styled(View)`
display: flex;
flex-direction: row;
background-color: #18222D;
padding-top: 25px;
padding-left: 16px;
padding-right: 16px;
padding-bottom: 7px;
`;

const SwapLeftButtonClicked = styled(TouchableOpacity)`
width: 33%
height: 30px;
justify-content: center;
align-items: center;
background-color: ${props => props.theme.color.DarkGray};
border-top-left-radius: 4px;
border-bottom-left-radius: 4px;
`;

const SwapLeftButton = styled(TouchableOpacity)`
width: 33%
height: 30px;
justify-content: center;
align-items: center;
border: 1px solid #333C47;
border-top-left-radius: 4px;
border-bottom-left-radius: 4px;
`;

const SwapMiddleButtonClicked = styled(TouchableOpacity)`
width: 33%
height: 30px;
justify-content: center;
align-items: center;
background-color: ${props => props.theme.color.DarkGray};

`;

const SwapMiddleButton = styled(TouchableOpacity)`
width: 33%
height: 30px;
justify-content: center;
align-items: center;
border: 1px solid #333C47;

`;

const SwapRightButtonClicked = styled(TouchableOpacity)`
width: 33%
height: 30px;
justify-content: center;
align-items: center;
background-color: ${props => props.theme.color.DarkGray};
border-top-right-radius: 4px;
border-bottom-right-radius: 4px;
`;

const SwapRightButton = styled(TouchableOpacity)`
width: 33%
height: 30px;
justify-content: center;
align-items: center;
border: 1px solid #333C47;
border-top-right-radius: 4px;
border-bottom-right-radius: 4px;
`;

const SwapButtonClickedText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 18px;
color: ${props => props.theme.color.White};
`;

const SwapButtonText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 18px;
color: ${props => props.theme.color.MidGray};
`;

// Detail Container
const DetailContainer = styled(ScrollView)`
display: flex;
flex-direction: column;
background-color: #18222D;
padding-top: 26px;
padding-left: 16px;
padding-right: 16px;
`;

const CardContainer = styled(TouchableOpacity)`
display: flex;
flex-direction: column;
`;

const CardTitleContainer = styled(View)`
display: flex;
flex-direction: row;
align-items: center;
`;

const CardBuyTitleText = styled(Text)`
font-weight: 600;
font-size: 20px;
line-height: 30px;
color: ${props => props.theme.color.Secondary};
`;

const CardBuyTitleCurrencyText = styled(Text)`
font-weight: 700;
font-size: 20px;
line-height: 24px;
color: ${props => props.theme.color.Secondary};
`;

const CardSellTitleText = styled(Text)`
font-weight: 600;
font-size: 20px;
line-height: 30px;
color: ${props => props.theme.color.SecondaryLight};
`;

const CardSellTitleCurrencyText = styled(Text)`
font-weight: 700;
font-size: 20px;
line-height: 24px;
color: ${props => props.theme.color.SecondaryLight};
`;

const CardMiddleContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
margin-top: 12px;
`;

const CardMiddleColumnContainer = styled(View)`
display: flex;
flex-direction: column;
`;

const CardMiddleRowContainer = styled(View)`
display: flex;
flex-direction: row;
align-items: center;
`;

const CardMiddleRightRowContainer = styled(View)`
display: flex;
flex-direction: row;
align-items: baseline;
`;

const CardMiddleLeftTitleText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 18px;
color: ${props => props.theme.color.MidGray};
`;



const CardMiddleLeftValueText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 15px;
color: ${props => props.theme.color.ExtraLightGray};
padding-left: 8px;
`;

const CardMiddleRightBuyPriceText = styled(Text)`
font-weight: 700;
font-size: 20px;
line-height: 24px;
color: ${props => props.theme.color.Secondary};
padding-right: 4px;
`;

const CardMiddleRightBuyCurrencyText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 15px;
color: ${props => props.theme.color.Secondary};
`;

const CardMiddleRightSellPriceText = styled(Text)`
font-weight: 700;
font-size: 20px;
line-height: 24px;
color: ${props => props.theme.color.SecondaryLight};
padding-right: 4px;
`;

const CardMiddleRightSellCurrencyText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 15px;
color: ${props => props.theme.color.SecondaryLight};
`;

const CardBottomContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
margin-top: 18px;
`;

const CardBottomInRowContainer = styled(View)`
display: flex;
flex-direction: row;
align-items: center;
`;

const CardBottomStatusText = styled(Text)`
font-weight: 500;
font-size: 13px;
line-height: 20px;
color: ${props => props.theme.color.LightMidGray};
`;

const CardBottomButton = styled(TouchableOpacity)`
height: 30px;
justify-content: center;
align-items: center;
background-color: ${props => props.theme.color.DarkGray};
border-radius: 4px;
padding-left:10px;
padding-right:10px;
`;

const CardBottomButtonText = styled(Text)`
font-weight: 500;
font-size: 14px;
line-height: 22px;
color: ${props => props.theme.color.White};
`;

const CardLine = styled(View)`
height: 1px;
background-color: #242D37;
margin-top: 16px;
margin-bottom: 16px;
`;

// Empty Card
const EmptyCardContainer = styled(View)`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
margin-top: 60px;
padding-bottom: 100px;
`;

const OrderImage = styled(Image)`
width: 135px;
height: 135px;
`;

const EmptyCardTitleText = styled(Text)`
font-weight: 600;
font-size: 16px;
line-height: 24px;
color: ${props => props.theme.color.White};
margin-top: 24px;
`;

const EmptyCardDetailText = styled(Text)`
font-weight: 500;
font-size: 13px;
line-height: 20px;
color: ${props => props.theme.color.LightMidGray};
margin-top: 8px;
`;

const EmptyCardButton = styled(TouchableOpacity)`
width: 255px;
height: 44px;
justify-content: center;
align-items: center;
background-color: ${props => props.theme.color.PrimaryDark};
border-radius: 4px;
margin-top: 40px;
`;

const EmptyCardButtonText = styled(Text)`
font-weight: 500;
font-size: 14px;
line-height: 22px;
color: ${props => props.theme.color.White};
`;

const TopContainerTimerContainer = styled(View)`
padding-left: 4px;
`;

// Empty Bottom
const BottomPaddingView = styled(View)`
padding-bottom: 200px;
`;

// Modal Style
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

const ModalCancelImage = styled(Image)`
width: 28px;
height: 28px;
`;

const ModalHeaderTitleText = styled(Text)`
font-weight: 600;
font-size: 16px;
line-height: 24px;
color: ${props => props.theme.color.White};
`;

const ModalRowContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
padding-top: 8px;
padding-bottom: 8px;
`;

const ModalInRowContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: flex-end;
align-items: center;
`;

const ModalInlineContainer = styled(View)`
display: flex;
flex-direction: row;
align-items: baseline;
`;

const ModalDetailTitle = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 24px;
color: ${props => props.theme.color.LightMidGray};
`;

const ModalDetailPricePositiveText = styled(Text)`
font-weight: 700;
font-size: 24px;
line-height: 30px;
color: ${props => props.theme.color.Secondary};
`;

const ModalDetailPriceNegativeText = styled(Text)`
font-weight: 700;
font-size: 24px;
line-height: 30px;
color: ${props => props.theme.color.SecondaryLight};
`;

const ModalDetailPriceCurrencyPositiveText = styled(Text)`
font-weight: 700;
font-size: 16px;
line-height: 20px;
color: ${props => props.theme.color.Secondary};
`;

const ModalDetailPriceCurrencyNegativeText = styled(Text)`
font-weight: 700;
font-size: 16px;
line-height: 20px;
color: ${props => props.theme.color.SecondaryLight};
`;

const ModalDetailSecondText = styled(Text)`
font-weight: 700;
font-size: 16px;
line-height: 20px;
color: ${props => props.theme.color.White};
`;

const ModalDetailThirdText = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 24px;
color: ${props => props.theme.color.LightMidGray};
`;

const ModalDetailPaymentText = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 24px;
color: ${props => props.theme.color.LightMidGray};
padding-left: 5px;
`;

const ModalLine = styled(View)`
height: 1px;
background-color: #18222D;
margin-top: 8px;
margin-bottom: 8px;
`;

const C2cHistoryScreen = ({ navigation, route }: RootStackScreenProps<"C2cHistoryScreen">) => {
    const dispatch = useAppDispatch()
    const { buying, selling } = useAppSelector((state) => state.otcOrder)
    const [historyOrder, setHistoryOrder] = useState<OtcOrder[]>([])

    const account = useAppSelector((state) => state.user.detail.account)
    const insets = useSafeAreaInsets();

    // 切換進行中或已完成
    const [swapPage, setSwapPage] = useState(0);

    // Countdown Timer (Import CountdownTimer)
    const FIFTEENMINUTES = 15 * 60 * 1000;

    const [loading, setLoading] = useState(false);

    const [waitingList, setWaitingList] = useState<OtcOrder[]>([]);
    const [cancelList, setCancelList] = useState<OtcOrder[]>([]);
    const [completeList, setCompleteList] = useState<OtcOrder[]>([]);
    // const {order:context} = useContext(Context)
    const { t } = useTranslation();
    // useEffect(()=>{    
    //     if(context.data){
    //         getWaitingList()
    //         getCompleteList()
    //         getCancelList()
    //     }

    //   },[context])
    const getWaitingList = () => {
        setLoading(true)
        otcOrderService.list({
            all: false,
            status: "0,1,3,4,5,-2"
        }).then((orders) => {
            setWaitingList(orders)
            orders.forEach((order) => {
                if (order.buyUser === account) {
                    dispatch(otcOrderActions.updateBuying(order))
                }
                if (order.sellUser === account) {
                    dispatch(otcOrderActions.updateSelling(order))
                }
            })
        }).finally(() => {
            setLoading(false)
        })
    };

    const getCancelList = () => {
        setLoading(true)
        otcOrderService.list({
            all: false,
            status: "-1"
        }).then((order) => {
            setCancelList(order)
        }).finally(() => {
            setLoading(false)
        })
    };

    const getCompleteList = () => {
        setLoading(true)
        otcOrderService.list({
            all: false,
            status: "2"
        }).then((order) => {
            setCompleteList(order)
        }).finally(() => {
            setLoading(false)
        })
    };

    // 詳情Modal
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [selectedOrder, setSelectOrder] = useState<OtcOrder>({ id: "" } as OtcOrder)
    const handleUpdateModal = (title: string, order: OtcOrder) => {
        setSelectOrder(order)
        setModalTitle(title)
        setIsDetailModalVisible(true)
    };

    // 轉換日期
    const handleCreateTime = (UnixTime: number) => {
        let unix = new Date(UnixTime);
        let year = unix.getFullYear();
        let month = unix.getMonth() + 1;
        let day = unix.getDate();
        let hours = unix.getHours();
        let minutes = unix.getMinutes();
        let seconds = unix.getSeconds();

        return (`${year}-${month}-${day} ${hours}:${seconds}:${seconds}`)
    };

    useEffect(() => {
        getWaitingList()
        getCompleteList()
        getCancelList()
    }, []);

    return (
        <Container insets={insets.top}>
            {
                loading &&
                <Spinner visible={true} textContent={t("loading")} color={'#FFFFFF'} textStyle={{ color: '#FFFFFF' }} />
            }
            <HeaderContainer>
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <PreviousIcon source={require("assets/images/global/previous.png")} />
                </TouchableOpacity>
                <HeaderTitleText>{t("order")}</HeaderTitleText>
                <HeaderEmptyContainer></HeaderEmptyContainer>
            </HeaderContainer>
            {swapPage === 0 &&
                <SwapContainer>
                    <SwapLeftButtonClicked onPress={() => { setSwapPage(0), getWaitingList() }}>
                        <SwapButtonClickedText>{t("fiatOngoOrderState")}</SwapButtonClickedText>
                    </SwapLeftButtonClicked>
                    <SwapMiddleButton onPress={() => { setSwapPage(1), getCompleteList() }}>
                        <SwapButtonText>{t("fiatFinishOrderState")}</SwapButtonText>
                    </SwapMiddleButton>
                    <SwapRightButton onPress={() => { setSwapPage(2), getCompleteList() }}>
                        <SwapButtonText>{t("fiatCancelOrderState")}</SwapButtonText>
                    </SwapRightButton>
                </SwapContainer>}
            {swapPage === 1 &&
                <SwapContainer>
                    <SwapLeftButton onPress={() => { setSwapPage(0), getWaitingList() }}>
                        <SwapButtonClickedText>{t("fiatOngoOrderState")}</SwapButtonClickedText>
                    </SwapLeftButton>
                    <SwapMiddleButtonClicked onPress={() => { setSwapPage(1), getCompleteList() }}>
                        <SwapButtonText>{t("fiatFinishOrderState")}</SwapButtonText>
                    </SwapMiddleButtonClicked>
                    <SwapRightButton onPress={() => { setSwapPage(2), getCompleteList() }}>
                        <SwapButtonText>{t("fiatCancelOrderState")}</SwapButtonText>
                    </SwapRightButton>
                </SwapContainer>}
            {swapPage === 2 &&
                <SwapContainer>
                    <SwapLeftButton onPress={() => { setSwapPage(0), getWaitingList() }}>
                        <SwapButtonClickedText>{t("fiatOngoOrderState")}</SwapButtonClickedText>
                    </SwapLeftButton>
                    <SwapMiddleButton onPress={() => { setSwapPage(1), getCompleteList() }}>
                        <SwapButtonText>{t("fiatFinishOrderState")}</SwapButtonText>
                    </SwapMiddleButton>
                    <SwapRightButtonClicked onPress={() => { setSwapPage(2), getCompleteList() }}>
                        <SwapButtonText>{t("fiatCancelOrderState")}</SwapButtonText>
                    </SwapRightButtonClicked>
                </SwapContainer>}

            {/* 
            {
                swapPage === 0 ?
                    <SwapContainer>
                        <SwapLeftButtonClicked onPress={() => { setSwapPage(0), getWaitingList() }}>
                            <SwapButtonClickedText>進行中</SwapButtonClickedText>
                        </SwapLeftButtonClicked>
                        <SwapRightButton onPress={() => { setSwapPage(1), getCompleteList() }}>
                            <SwapButtonText>已完成</SwapButtonText>
                        </SwapRightButton>
                    </SwapContainer> :
                    <SwapContainer>
                        <SwapLeftButton onPress={() => { setSwapPage(0), getWaitingList() }}>
                            <SwapButtonText>進行中</SwapButtonText>
                        </SwapLeftButton>
                        <SwapRightButtonClicked onPress={() => { setSwapPage(1), getCompleteList() }}>
                            <SwapButtonClickedText>已完成</SwapButtonClickedText>
                        </SwapRightButtonClicked>
                    </SwapContainer>
            } */}
            <DetailContainer>
                {
                    swapPage === 0 &&
                    (waitingList.length > 0 ?
                        waitingList.map((order, index) => {
                            return (
                                <CardContainer key={order.id} onPress={() => {
                                    if (order.status === OtcOrderStatus.APPEAL) {
                                        alert(t("orderAppealing"))
                                    } else {
                                        advertisementService.getAdvertisement({
                                            all: false,
                                            my: true
                                        }).then((advertisements) => {
                                            let orderAdvertisement = advertisements.find(advertisement => advertisement.id === order.advertisement)
                                            if (orderAdvertisement) {
                                                dispatch(c2cActions.setSelectedAdvertisement(orderAdvertisement))
                                            }
                                            else {
                                                console.log("advertisement not found", JSON.stringify(advertisements))
                                            }
                                            const targetScreen = order.buyUser === account ? "C2cBuyScreen" : "C2cSellScreen"
                                            navigation.navigate(targetScreen, { from: "order" })
                                        })
                                    }
                                }}>
                                    {
                                        order.buyUser === account ?
                                            <CardTitleContainer>
                                                <CardBuyTitleText>{t("fiatOrderBuy")}</CardBuyTitleText>
                                                <CardBuyTitleCurrencyText>{order.cryptoAsset}/{order.fiatCurrency}</CardBuyTitleCurrencyText>
                                            </CardTitleContainer>
                                            :
                                            <CardTitleContainer>
                                                <CardSellTitleText>{t("fiatOrderSell")}</CardSellTitleText>
                                                <CardSellTitleCurrencyText>{order.cryptoAsset}/{order.fiatCurrency}</CardSellTitleCurrencyText>
                                            </CardTitleContainer>
                                    }
                                    <CardMiddleContainer>
                                        <CardMiddleColumnContainer>
                                            {
                                                order.buyUser === account ?
                                                    <CardMiddleRowContainer>
                                                        <CardMiddleLeftTitleText>{t("fiatTrader")}</CardMiddleLeftTitleText>
                                                        <CardMiddleLeftValueText>{order.sellUser}</CardMiddleLeftValueText>
                                                    </CardMiddleRowContainer> :
                                                    <CardMiddleRowContainer>
                                                        <CardMiddleLeftTitleText>{t("fiatTrader")}</CardMiddleLeftTitleText>
                                                        <CardMiddleLeftValueText>{order.buyUser}</CardMiddleLeftValueText>
                                                    </CardMiddleRowContainer>
                                            }
                                            <CardMiddleRowContainer>
                                                <CardMiddleLeftTitleText>{t("amount")}</CardMiddleLeftTitleText>
                                                <CardMiddleLeftValueText>{order.quantity} {order.cryptoAsset}</CardMiddleLeftValueText>
                                            </CardMiddleRowContainer>
                                            <CardMiddleRowContainer>
                                                <CardMiddleLeftTitleText>{t("unitPrice")}</CardMiddleLeftTitleText>
                                                <CardMiddleLeftValueText>{order.price} {order.fiatCurrency}</CardMiddleLeftValueText>
                                            </CardMiddleRowContainer>
                                        </CardMiddleColumnContainer>
                                        {
                                            order.buyUser === account ?
                                                <CardMiddleRightRowContainer>
                                                    <CardMiddleRightBuyPriceText>{order.amount}</CardMiddleRightBuyPriceText>
                                                    <CardMiddleRightBuyCurrencyText>{order.fiatCurrency}</CardMiddleRightBuyCurrencyText>
                                                </CardMiddleRightRowContainer> :
                                                <CardMiddleRightRowContainer>
                                                    <CardMiddleRightSellPriceText>{order.amount}</CardMiddleRightSellPriceText>
                                                    <CardMiddleRightSellCurrencyText>{order.fiatCurrency}</CardMiddleRightSellCurrencyText>
                                                </CardMiddleRightRowContainer>
                                        }
                                    </CardMiddleContainer>
                                    {
                                        order.buyUser === account &&
                                        (order.status === OtcOrderStatus.WAIT_FOR_PAID &&
                                            <CardBottomContainer>
                                                <CardBottomInRowContainer>
                                                    <TouchableOpacity onPress={() => {
                                                        handleUpdateModal("查看", order)
                                                    }}><Text></Text></TouchableOpacity>
                                                    {/* <TopContainerTimerContainer>
                                                        <CountdownTimer targetDate={x.paymentTimeLimit} />
                                                    </TopContainerTimerContainer> */}
                                                </CardBottomInRowContainer>
                                                <CardBottomButton>
                                                    <CardBottomButtonText>請付款</CardBottomButtonText>
                                                </CardBottomButton>
                                            </CardBottomContainer>)
                                    }
                                    {
                                        order.buyUser === account &&
                                        (order.status === 1 &&
                                            <CardBottomContainer>
                                                <CardBottomStatusText></CardBottomStatusText>
                                                <CardBottomButton disabled onPress={() => {
                                                    // handleUpdateModal(
                                                    //     "查看",
                                                    //     x.id,
                                                    //     x.buyUser,
                                                    //     x.sellUser,
                                                    //     x.cryptoAsset,
                                                    //     x.fiatCurrency,
                                                    //     x.price,
                                                    //     x.quantity,
                                                    //     x.amount,
                                                    //     x.payments,
                                                    //     {
                                                    //         id: x.payment.id,
                                                    //         type: x.payment.type
                                                    //     },
                                                    //     x.createdDate,
                                                    //     x.status
                                                    // )
                                                }}>
                                                    <CardBottomButtonText>{t("waitSellerTransfer")}</CardBottomButtonText>
                                                </CardBottomButton>
                                            </CardBottomContainer>)
                                    }
                                    {
                                        order.sellUser === account &&
                                        (order.status === 3 &&
                                            <CardBottomContainer>
                                                <CardBottomStatusText></CardBottomStatusText>
                                                <CardBottomButton disabled>
                                                    <CardBottomButtonText>等待買方確認</CardBottomButtonText>
                                                </CardBottomButton>
                                            </CardBottomContainer>)
                                    }
                                    {
                                        order.buyUser === account &&
                                        (order.status === 4 &&
                                            <CardBottomContainer>
                                                <CardBottomStatusText></CardBottomStatusText>
                                                <CardBottomButton disabled>
                                                    <CardBottomButtonText>{t("waitSellerConfirm")}</CardBottomButtonText>
                                                </CardBottomButton>
                                            </CardBottomContainer>)
                                    }
                                    {
                                        order.sellUser === account &&
                                        (order.status === 4 &&
                                            <CardBottomContainer>
                                                <CardBottomStatusText></CardBottomStatusText>
                                                <CardBottomButton>
                                                    <CardBottomButtonText>請確認交易</CardBottomButtonText>
                                                </CardBottomButton>
                                            </CardBottomContainer>)
                                    }
                                    {
                                        order.buyUser === account &&
                                        (order.status === 3 &&
                                            <CardBottomContainer>
                                                <CardBottomStatusText></CardBottomStatusText>
                                                <CardBottomButton>
                                                    <CardBottomButtonText>請確認交易</CardBottomButtonText>
                                                </CardBottomButton>
                                            </CardBottomContainer>)
                                    }
                                    {

                                        (order.status === -1 &&
                                            <CardBottomContainer>
                                                <CardBottomStatusText>{t("fiatOrderCanceled")}  </CardBottomStatusText>
                                                <CardBottomButton disabled>
                                                    <CardBottomButtonText>{t("fiatCancelOrderState")}</CardBottomButtonText>
                                                </CardBottomButton>
                                            </CardBottomContainer>)
                                    }
                                    {

                                        (order.status === -2 &&
                                            <CardBottomContainer>
                                                <CardBottomStatusText></CardBottomStatusText>
                                                <CardBottomButton disabled>
                                                    <CardBottomButtonText>{t("apealing")} </CardBottomButtonText>
                                                </CardBottomButton>
                                            </CardBottomContainer>)
                                    }
                                    {
                                        order.sellUser === account &&
                                        (order.status === 0 &&
                                            <CardBottomContainer>
                                                <CardBottomStatusText></CardBottomStatusText>
                                                <CardBottomButton>
                                                    <CardBottomButtonText>請放行</CardBottomButtonText>
                                                </CardBottomButton>
                                            </CardBottomContainer>)
                                    }
                                    {
                                        order.sellUser === account &&
                                        (order.status === 1 &&
                                            <CardBottomContainer>
                                                <CardBottomInRowContainer>
                                                    <CardBottomStatusText></CardBottomStatusText>
                                                    {/* <TopContainerTimerContainer>
                                                        <CountdownTimer targetDate={FIFTEENMINUTES} />
                                                    </TopContainerTimerContainer> */}
                                                </CardBottomInRowContainer>
                                                <CardBottomButton>
                                                    <CardBottomButtonText>請放行</CardBottomButtonText>
                                                </CardBottomButton>
                                            </CardBottomContainer>)
                                    }
                                    {
                                        index !== waitingList.length - 1 &&
                                        <CardLine></CardLine>
                                    }
                                </CardContainer>
                            );
                        }) :
                        <EmptyCardContainer>
                            <OrderImage source={require("assets/images/c2c/illustration.png")} />
                            <EmptyCardTitleText>尚無訂單</EmptyCardTitleText>
                            <EmptyCardDetailText>請於 C2C 購買/出售加密貨幣</EmptyCardDetailText>
                            <EmptyCardButton onPress={() => { navigation.goBack() }}>
                                <EmptyCardButtonText>C2C 總覽</EmptyCardButtonText>
                            </EmptyCardButton>
                        </EmptyCardContainer>)
                }
                {
                    swapPage === 2 &&
                    (cancelList.length > 0 ?
                        cancelList.map((order, index) => {
                            return (

                                <CardContainer>
                                    {
                                        order.buyUser === account ?
                                            <CardTitleContainer>
                                                <CardBuyTitleText>{t("fiatOrderBuy")}</CardBuyTitleText>
                                                <CardBuyTitleCurrencyText>{order.cryptoAsset}/{order.fiatCurrency}</CardBuyTitleCurrencyText>
                                            </CardTitleContainer>
                                            :
                                            <CardTitleContainer>
                                                <CardSellTitleText>{t("fiatOrderSell")}</CardSellTitleText>
                                                <CardSellTitleCurrencyText>{order.cryptoAsset}/{order.fiatCurrency}</CardSellTitleCurrencyText>
                                            </CardTitleContainer>
                                    }
                                    <CardMiddleContainer>
                                        <CardMiddleColumnContainer>
                                            {
                                                order.buyUser === account ?
                                                    <CardMiddleRowContainer>
                                                        <CardMiddleLeftTitleText>{t("fiatTrader")}</CardMiddleLeftTitleText>
                                                        <CardMiddleLeftValueText>{order.sellUser}</CardMiddleLeftValueText>
                                                    </CardMiddleRowContainer> :
                                                    <CardMiddleRowContainer>
                                                        <CardMiddleLeftTitleText>{t("fiatTrader")}</CardMiddleLeftTitleText>
                                                        <CardMiddleLeftValueText>{order.buyUser}</CardMiddleLeftValueText>
                                                    </CardMiddleRowContainer>
                                            }
                                            <CardMiddleRowContainer>
                                                <CardMiddleLeftTitleText>{t("amount")}</CardMiddleLeftTitleText>
                                                <CardMiddleLeftValueText>{order.quantity} {order.cryptoAsset}</CardMiddleLeftValueText>
                                            </CardMiddleRowContainer>
                                            <CardMiddleRowContainer>
                                                <CardMiddleLeftTitleText>{t("unitPrice")}</CardMiddleLeftTitleText>
                                                <CardMiddleLeftValueText>{order.price} {order.fiatCurrency}</CardMiddleLeftValueText>
                                            </CardMiddleRowContainer>
                                        </CardMiddleColumnContainer>
                                        {
                                            order.buyUser === account ?
                                                <CardMiddleRightRowContainer>
                                                    <CardMiddleRightBuyPriceText>{order.amount}</CardMiddleRightBuyPriceText>
                                                    <CardMiddleRightBuyCurrencyText>{order.fiatCurrency}</CardMiddleRightBuyCurrencyText>
                                                </CardMiddleRightRowContainer> :
                                                <CardMiddleRightRowContainer>
                                                    <CardMiddleRightSellPriceText>{order.amount}</CardMiddleRightSellPriceText>
                                                    <CardMiddleRightSellCurrencyText>{order.fiatCurrency}</CardMiddleRightSellCurrencyText>
                                                </CardMiddleRightRowContainer>
                                        }
                                    </CardMiddleContainer>
                                    {
                                        order.buyUser === account &&
                                        (order.status === 0 &&
                                            <CardBottomContainer>
                                                <CardBottomInRowContainer>
                                                    <TouchableOpacity onPress={() => {
                                                        handleUpdateModal("查看", order)
                                                    }}><Text></Text></TouchableOpacity>
                                                    {/* <TopContainerTimerContainer>
                                                        <CountdownTimer targetDate={x.paymentTimeLimit} />
                                                    </TopContainerTimerContainer> */}
                                                </CardBottomInRowContainer>
                                                <CardBottomButton onPress={() => {
                                                    Alert.alert(
                                                        "已完成付款？",
                                                        "請確定您已向賣方完成付款，惡意點擊系統將直接凍結您的賬戶。",
                                                        [
                                                            {
                                                                text: "取消",
                                                                onPress: () => console.log("Cancel Pressed"),
                                                                style: "cancel"
                                                            },
                                                            {
                                                                text: "確定", onPress: () => {
                                                                    if (order.payment) {
                                                                        otcOrderService.paid(order.id, {
                                                                            payment: {
                                                                                id: order.payment?.id
                                                                            }
                                                                        })
                                                                    }
                                                                }
                                                            }
                                                        ]
                                                    );

                                                }}>
                                                    <CardBottomButtonText>通知付款</CardBottomButtonText>
                                                </CardBottomButton>
                                            </CardBottomContainer>)
                                    }
                                    {
                                        order.buyUser === account &&
                                        (order.status === 1 &&
                                            <CardBottomContainer>
                                                <CardBottomStatusText></CardBottomStatusText>
                                                <CardBottomButton disabled onPress={() => {
                                                    // handleUpdateModal(
                                                    //     "查看",
                                                    //     x.id,
                                                    //     x.buyUser,
                                                    //     x.sellUser,
                                                    //     x.cryptoAsset,
                                                    //     x.fiatCurrency,
                                                    //     x.price,
                                                    //     x.quantity,
                                                    //     x.amount,
                                                    //     x.payments,
                                                    //     {
                                                    //         id: x.payment.id,
                                                    //         type: x.payment.type
                                                    //     },
                                                    //     x.createdDate,
                                                    //     x.status
                                                    // )
                                                }}>
                                                    <CardBottomButtonText>等待放行</CardBottomButtonText>
                                                </CardBottomButton>
                                            </CardBottomContainer>)
                                    }
                                    {
                                        order.sellUser === account &&
                                        (order.status === 3 &&
                                            <CardBottomContainer>
                                                <CardBottomStatusText></CardBottomStatusText>
                                                <CardBottomButton disabled>
                                                    <CardBottomButtonText>等待買方確認</CardBottomButtonText>
                                                </CardBottomButton>
                                            </CardBottomContainer>)
                                    }
                                    {
                                        order.buyUser === account &&
                                        (order.status === 4 &&
                                            <CardBottomContainer>
                                                <CardBottomStatusText></CardBottomStatusText>
                                                <CardBottomButton disabled>
                                                    <CardBottomButtonText>{t("waitSellerConfirm")}</CardBottomButtonText>
                                                </CardBottomButton>
                                            </CardBottomContainer>)
                                    }
                                    {
                                        order.sellUser === account &&
                                        (order.status === 4 &&
                                            <CardBottomContainer>
                                                <CardBottomStatusText></CardBottomStatusText>
                                                <CardBottomButton onPress={
                                                    () => {

                                                        // api.postData(`/otc/api/otcOrder/${x.id}/check`).then(x=>{
                                                        //     console.log(x)
                                                        //     getWaitingList()
                                                        //     getCompleteList()
                                                        // })
                                                    }
                                                }>
                                                    <CardBottomButtonText>確認交易</CardBottomButtonText>
                                                </CardBottomButton>
                                            </CardBottomContainer>)
                                    }
                                    {
                                        order.buyUser === account &&
                                        (order.status === 3 &&
                                            <CardBottomContainer>
                                                <CardBottomStatusText></CardBottomStatusText>
                                                <CardBottomButton onPress={
                                                    () => {
                                                        // api.postData(`/otc/api/otcOrder/${x.id}/check`).then(x=>{
                                                        //     console.log(x)
                                                        //     getWaitingList()
                                                        //     getCompleteList()
                                                        // })
                                                    }
                                                }>
                                                    <CardBottomButtonText>確認交易</CardBottomButtonText>
                                                </CardBottomButton>
                                            </CardBottomContainer>)
                                    }
                                    {

                                        (order.status === -1 &&
                                            <CardBottomContainer>
                                                <CardBottomStatusText>{t("fiatOrderCanceled")}  </CardBottomStatusText>
                                                <CardBottomButton disabled>
                                                    <CardBottomButtonText>{t("fiatCancelOrderState")}</CardBottomButtonText>
                                                </CardBottomButton>
                                            </CardBottomContainer>)
                                    }
                                    {

                                        (order.status === -2 &&
                                            <CardBottomContainer>
                                                <CardBottomStatusText></CardBottomStatusText>
                                                <CardBottomButton disabled>
                                                    <CardBottomButtonText>{t("apealing")} </CardBottomButtonText>
                                                </CardBottomButton>
                                            </CardBottomContainer>)
                                    }
                                    {
                                        order.sellUser === account &&
                                        (order.status === 0 &&
                                            <CardBottomContainer>
                                                <CardBottomStatusText></CardBottomStatusText>
                                                <CardBottomButton onPress={() => {
                                                    // api.postData(`/otc/api/otcOrder/${x.id}/confirm`).then(x=>{
                                                    //     getWaitingList()
                                                    //     getCompleteList()
                                                    // })
                                                }}>
                                                    <CardBottomButtonText>放行</CardBottomButtonText>
                                                </CardBottomButton>
                                            </CardBottomContainer>)
                                    }
                                    {
                                        order.sellUser === account &&
                                        (order.status === 1 &&
                                            <CardBottomContainer>
                                                <CardBottomInRowContainer>
                                                    <CardBottomStatusText></CardBottomStatusText>
                                                    {/* <TopContainerTimerContainer>
                                                        <CountdownTimer targetDate={FIFTEENMINUTES} />
                                                    </TopContainerTimerContainer> */}
                                                </CardBottomInRowContainer>
                                                <CardBottomButton onPress={() => {
                                                    // api.postData(`/otc/api/otcOrder/${x.id}/confirm`).then(x=>{
                                                    //     console.log(x)
                                                    //     getWaitingList()
                                                    //     getCompleteList()
                                                    // })
                                                }}>
                                                    <CardBottomButtonText>放行</CardBottomButtonText>
                                                </CardBottomButton>
                                            </CardBottomContainer>)
                                    }
                                    {
                                        index !== waitingList.length - 1 &&
                                        <CardLine></CardLine>
                                    }
                                </CardContainer>
                            );
                        }) :
                        <EmptyCardContainer>
                            <OrderImage source={require("assets/images/c2c/illustration.png")} />
                            <EmptyCardTitleText>尚無訂單</EmptyCardTitleText>
                            <EmptyCardDetailText>請於 C2C 購買/出售加密貨幣</EmptyCardDetailText>
                            <EmptyCardButton onPress={() => { navigation.goBack() }}>
                                <EmptyCardButtonText>C2C 總覽</EmptyCardButtonText>
                            </EmptyCardButton>
                        </EmptyCardContainer>)
                }
                {/* ********* */}
                {/* Swap Page */}
                {
                    swapPage === 1 &&
                    (completeList.length > 0 ?
                        completeList.map((order, index) => {
                            return (
                                order.status === 2 &&
                                <CardContainer>
                                    {
                                        order.buyUser === account ?
                                            <CardTitleContainer>
                                                <CardBuyTitleText>{t("fiatOrderBuy")}</CardBuyTitleText>
                                                <CardBuyTitleCurrencyText>{order.cryptoAsset}/{order.fiatCurrency}</CardBuyTitleCurrencyText>
                                            </CardTitleContainer>
                                            :
                                            <CardTitleContainer>
                                                <CardSellTitleText>{t("fiatOrderSell")}</CardSellTitleText>
                                                <CardSellTitleCurrencyText>{order.cryptoAsset}/{order.fiatCurrency}</CardSellTitleCurrencyText>
                                            </CardTitleContainer>
                                    }
                                    <CardMiddleContainer>
                                        <CardMiddleColumnContainer>
                                            {
                                                order.buyUser === account ?
                                                    <CardMiddleRowContainer>
                                                        <CardMiddleLeftTitleText>{t("fiatTrader")}</CardMiddleLeftTitleText>
                                                        <CardMiddleLeftValueText>{order.sellUser}</CardMiddleLeftValueText>
                                                    </CardMiddleRowContainer> :
                                                    <CardMiddleRowContainer>
                                                        <CardMiddleLeftTitleText>{t("fiatTrader")}</CardMiddleLeftTitleText>
                                                        <CardMiddleLeftValueText>{order.buyUser}</CardMiddleLeftValueText>
                                                    </CardMiddleRowContainer>
                                            }
                                            <CardMiddleRowContainer>
                                                <CardMiddleLeftTitleText>{t("amount")}</CardMiddleLeftTitleText>
                                                <CardMiddleLeftValueText>{order.quantity} {order.cryptoAsset}</CardMiddleLeftValueText>
                                            </CardMiddleRowContainer>
                                            <CardMiddleRowContainer>
                                                <CardMiddleLeftTitleText>{t("unitPrice")}</CardMiddleLeftTitleText>
                                                <CardMiddleLeftValueText>{order.price} {order.fiatCurrency}</CardMiddleLeftValueText>
                                            </CardMiddleRowContainer>
                                        </CardMiddleColumnContainer>
                                        {
                                            order.buyUser === account ?
                                                <CardMiddleRightRowContainer>
                                                    <CardMiddleRightBuyPriceText>{order.amount}</CardMiddleRightBuyPriceText>
                                                    <CardMiddleRightBuyCurrencyText>{order.fiatCurrency}</CardMiddleRightBuyCurrencyText>
                                                </CardMiddleRightRowContainer> :
                                                <CardMiddleRightRowContainer>
                                                    <CardMiddleRightSellPriceText>{order.amount}</CardMiddleRightSellPriceText>
                                                    <CardMiddleRightSellCurrencyText>{order.fiatCurrency}</CardMiddleRightSellCurrencyText>
                                                </CardMiddleRightRowContainer>
                                        }
                                    </CardMiddleContainer>
                                    {
                                        order.buyUser === account ?
                                            <CardBottomContainer>
                                                <CardBottomStatusText>{t("orderFinished")} </CardBottomStatusText>
                                                <CardBottomButton onPress={() => {
                                                    handleUpdateModal(t("checkOrder"), order)
                                                }}>
                                                    <CardBottomButtonText>{t("checkOrder")}</CardBottomButtonText>
                                                </CardBottomButton>
                                            </CardBottomContainer>
                                            :
                                            <CardBottomContainer>
                                                <CardBottomStatusText>{t("orderFinished")} </CardBottomStatusText>
                                                <CardBottomButton onPress={() => {
                                                    handleUpdateModal(t("checkOrder"), order)
                                                }}>
                                                    <CardBottomButtonText>{t("checkOrder")}</CardBottomButtonText>
                                                </CardBottomButton>
                                            </CardBottomContainer>
                                    }
                                    {
                                        index !== completeList.length - 1 &&
                                        <CardLine></CardLine>
                                    }
                                </CardContainer>
                            );
                        }) :
                        <EmptyCardContainer>
                            <OrderImage source={require("assets/images/c2c/illustration.png")} />
                            <EmptyCardTitleText>尚無訂單</EmptyCardTitleText>
                            <EmptyCardDetailText>請於 C2C 購買/出售加密貨幣</EmptyCardDetailText>
                            <EmptyCardButton onPress={() => { navigation.goBack() }}>
                                <EmptyCardButtonText>C2C 總覽</EmptyCardButtonText>
                            </EmptyCardButton>
                        </EmptyCardContainer>)
                }
                <BottomPaddingView></BottomPaddingView>
            </DetailContainer>

            {/* Time Limit Modal {t("limitedTime")}*/}
            <Modal
                isVisible={isDetailModalVisible}
                deviceHeight={windowHeight}
                deviceWidth={windowWidth}
                animationInTiming={500}
                animationOutTiming={700}
                backdropOpacity={0.7}
                onBackdropPress={() => setIsDetailModalVisible(false)}
                onSwipeComplete={() => setIsDetailModalVisible(false)}
                style={{ justifyContent: 'flex-end', margin: 0 }}
                hideModalContentWhileAnimating={true}
            >
                <View style={{ backgroundColor: '#242D37', paddingBottom: 30 }}>
                    <ModalTitleBarHeaderContainer>
                        <View style={{
                            width: 28,
                            height: 28
                        }} />
                        <ModalHeaderTitleText>{modalTitle}</ModalHeaderTitleText>
                        <TouchableOpacity onPress={() => { setIsDetailModalVisible(false) }}>
                            <ModalCancelImage source={require("assets/images/c2c/cancel.png")} />
                        </TouchableOpacity>
                    </ModalTitleBarHeaderContainer>
                    <View style={{ paddingTop: 24, paddingLeft: 16, paddingRight: 16 }}>
                        <ModalRowContainer>
                            <ModalDetailTitle>{t("fiatTotal")}</ModalDetailTitle>
                            {
                                selectedOrder.buyUser === account ?
                                    <ModalInlineContainer>
                                        <ModalDetailPricePositiveText>{selectedOrder.amount}</ModalDetailPricePositiveText>
                                        <ModalDetailPriceCurrencyPositiveText>{selectedOrder.fiatCurrency}</ModalDetailPriceCurrencyPositiveText>
                                    </ModalInlineContainer> :
                                    <ModalInlineContainer>
                                        <ModalDetailPriceNegativeText>{selectedOrder.amount}</ModalDetailPriceNegativeText>
                                        <ModalDetailPriceCurrencyNegativeText>{selectedOrder.fiatCurrency}</ModalDetailPriceCurrencyNegativeText>
                                    </ModalInlineContainer>
                            }
                        </ModalRowContainer>
                        <ModalRowContainer>
                            <ModalDetailTitle>{t("amount")}</ModalDetailTitle>
                            <ModalDetailSecondText>{selectedOrder.quantity} {selectedOrder.cryptoAsset}</ModalDetailSecondText>
                        </ModalRowContainer>
                        <ModalRowContainer>
                            <ModalDetailTitle>{t("unitPrice")}</ModalDetailTitle>
                            <ModalDetailSecondText>{selectedOrder.price} {selectedOrder.fiatCurrency}</ModalDetailSecondText>
                        </ModalRowContainer>
                        <ModalLine />
                        {selectedOrder.buyUser === account ? <ModalRowContainer>
                            <ModalDetailTitle>{t("payments")}</ModalDetailTitle>
                            <ModalInRowContainer>
                                {
                                    selectedOrder.status != 0 ?
                                        selectedOrder.payment?.type == 'BANK' &&
                                        <ModalDetailPaymentText>{t("bankTransfer")}</ModalDetailPaymentText>
                                        :
                                        <ModalDetailThirdText>尚未付款</ModalDetailThirdText>
                                }
                            </ModalInRowContainer>
                        </ModalRowContainer> : <ModalRowContainer>
                            <ModalDetailTitle>{t("paymentMethod")} </ModalDetailTitle>
                            <ModalInRowContainer>
                                {
                                    selectedOrder.payments != null &&
                                    (selectedOrder.payments.some((x: any) => { return x.type == 'BANK' }) &&
                                        <ModalDetailPaymentText>{t("bankTransfer")}</ModalDetailPaymentText>)
                                }
                                {
                                    selectedOrder.payments != null &&
                                    (selectedOrder.payments.some((x: any) => { return x.type == 'TOUCHNGO' }) &&
                                        <ModalDetailPaymentText>Touch'n Go</ModalDetailPaymentText>)
                                }
                                {
                                    selectedOrder.payments != null &&
                                    (selectedOrder.payments.some((x: any) => { return x.type == 'PPAY' }) &&
                                        <ModalDetailPaymentText>Ppay</ModalDetailPaymentText>)
                                }
                            </ModalInRowContainer>
                        </ModalRowContainer>}




                        <ModalRowContainer>
                            <ModalDetailTitle>{t("fiatOrderNum")}</ModalDetailTitle>
                            <View style={{ alignItems: 'flex-end' }}>
                                <ModalDetailThirdText>{selectedOrder.id.slice(0, 28)}</ModalDetailThirdText>
                                <ModalDetailThirdText>{selectedOrder.id.slice(28)}</ModalDetailThirdText>
                            </View>
                        </ModalRowContainer>
                        <ModalRowContainer style={{ paddingBottom: 30 }}>
                            <ModalDetailTitle>{t("fiatOrderTime")}</ModalDetailTitle>
                            <ModalDetailThirdText>{handleCreateTime(selectedOrder.createdDate)}</ModalDetailThirdText>
                        </ModalRowContainer>
                    </View>
                </View>
            </Modal>
        </Container>
    );
}

export default C2cHistoryScreen