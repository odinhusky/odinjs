import * as React from "react";
import { Text, TouchableOpacity, View, ScrollView, Dimensions, Image, } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled from "styled-components"
import { RootStackScreenProps } from "common/types";
import { useState, useEffect } from "react";
import { useAppSelector } from "hooks";
import { useTranslation } from "react-i18next";
import { investorService } from "services";
import { FinanceType } from "common/constant";

const Container = styled(View) <{ insets: number }>`
    display: flex;
    flex-direction: column;
    background-color: #18222D;
    padding-top: ${props => props.insets}px;
    border: none;
`;

// Main Header Container
const MainHeaderContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
padding-top: 16px;
padding-left: 16px;
padding-right: 16px;
`;

const PreviousButton = styled(Image)`
width: 28px;
height: 28px;
`;

const MainHeaderTitleText = styled(Text)`
font-weight: 600;
font-size: 16px;
line-height: 24px;
color: ${props => props.theme.color.White};
margin-right: 25px;
`;

const EmptyDiv = styled(View)``;

// Header Container Style

const HeaderContainer = styled(View)`
display: flex;
flex-direction: row;
padding-top: 16px;
padding-left: 16px;
padding-right: 16px;
`;

const BottomContainer = styled(ScrollView)`
display: flex;
flex-direction: column;
padding-bottom: 1000px;
`;

const SwapButtonText = styled(Text)`
font-weight: 500;
font-size: 14px;
line-height: 22px;
color: ${props => props.theme.color.LightMidGray};
`;

const SwapButtonClickedText = styled(Text)`
font-weight: 500;
font-size: 14px;
line-height: 22px;
color: ${props => props.theme.color.White};
`;

const SwapContainerLine = styled(View)`
height: 1px;
background-color: #242D37;
margin-bottom: 11px;
`;

// Global Style
const CardContainer = styled(View)`
display: flex;
flex-direction: column;
padding-top: 20px;
padding-left: 16px;
padding-right: 16px;
`;

const CardTitleContainer = styled(View)`
display: flex;
flex-direction: column;
`;

const CardTitleRowContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
`;

const CardDetailContainer = styled(View)`
display: flex;
flex-direction: row;
margin-top: 3px;
`;

const CardDetailColumnContainer = styled(View)`
display: flex;
flex-direction: column;
width: 38%;
`;

const CardDetailInColumnContainer = styled(View)`
display: flex;
flex-direction: column;
padding-top: 10px;
`;

const CardTitleTimeText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 15px;
color: ${props => props.theme.color.ExtraLightGray};
margin-top: 4px;
`;

const CardTitleSecondaryText = styled(Text)`
font-weight: 700;
font-size: 20px;
line-height: 24px;
color: ${props => props.theme.color.Secondary};
`;

const CardTitleSecondaryLightText = styled(Text)`
font-weight: 700;
font-size: 20px;
line-height: 24px;
color: ${props => props.theme.color.SecondaryLight};
`;

const CardDetailTitleText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 18px;
color: ${props => props.theme.color.MidGray};
`;

const CardDetailValueText = styled(Text)`
font-weight: 500;
font-size: 13px;
line-height: 20px;
color: ${props => props.theme.color.ExtraLightGray};
`;

const CardDetailValueDirectionShort = styled(Text)`
font-weight: 500;
font-size: 13px;
line-height: 20px;
color: ${props => props.theme.color.SecondaryLight};
`;

const CardDetailValueDirectionLong = styled(Text)`
font-weight: 500;
font-size: 13px;
line-height: 20px;
color: ${props => props.theme.color.Secondary};
`;

const CardLine = styled(View)`
height: 2px;
background-color: #242D37;
margin-top: 20px;
`;

// History Commit Style
const HistoryCommitCardTitleProgressCommitText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 18px;
color: ${props => props.theme.color.SecondaryLight};
`;

const HistoryCommitCardTitleProgressCancelText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 18px;
color: ${props => props.theme.color.MidGray};
`;

// Assets Record Style
const AssetsRecordTitleContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
`;

const AssetsRecordDetailContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
padding-top: 5px;
`;

const AssetsRecordTitleText = styled(Text)`
font-weight: 400;
font-size: 15px;
line-height: 24px;
color: ${props => props.theme.color.ExtraLightGray};
`;

const AssetsRecordTimeText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 15px;
color: ${props => props.theme.color.MidGray};
`;

const AssetsRecordAmountText = styled(Text)`
font-weight: 700;
font-size: 16px;
line-height: 20px;
color: ${props => props.theme.color.ExtraLightGray};
`;

const HistoryScreen = ({
    navigation
}: RootStackScreenProps<"HistoryScreen">) => {
    const { token } = useAppSelector((state) => state.user)
    const insets = useSafeAreaInsets();

    const [swapView, setSwapView] = useState('HistoryCommit');
    const [entrustArray, setEntrustArray] = useState<Future[]>([]);
    const [dealEntrustArray, setDealEntrustArray] = useState<Future[]>([]);
    const [recordArray, setRecord] = useState<FinanceRecord[]>([]);
    const { t } = useTranslation();

    const getDealEntrust = () => {
        investorService.getOwnFutures({
            status: "DEAL"
        }).then((response) => {
            setDealEntrustArray(response.data)
        })
    };

    const getRecord = () => {
        investorService.getOwnFinanceRecord({
            type: FinanceType.CONTRACT
        }).then((response) => {
            setRecord(response.data.filter(record=>record.type!==FinanceType.CONTRACT_MARGIN));
        })
    }

    const getHistoryEntrust = () => {
        investorService.getOwnFutures({}).then((response) => {
            setEntrustArray(response.data)
        })
    };

    useEffect(() => {
        getHistoryEntrust();
        getDealEntrust()
        getRecord()
    }, []);

    return (
        <Container insets={insets.top}>
            <MainHeaderContainer>
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <PreviousButton source={require("assets/images/global/previous.png")} />
                </TouchableOpacity>
                <MainHeaderTitleText>{t("orderHistory")}</MainHeaderTitleText>
                <EmptyDiv></EmptyDiv>
            </MainHeaderContainer>
            <HeaderContainer>
                {
                    swapView === 'HistoryCommit' ?
                        <TouchableOpacity onPress={() => { setSwapView('HistoryCommit') }} style={{ borderBottomWidth: 2, borderBottomColor: '#6699CC', marginRight: 24, paddingRight: 1, paddingLeft: 1 }}>
                            <SwapButtonClickedText>{t("historyOrder")}</SwapButtonClickedText>
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={() => { setSwapView('HistoryCommit') }} style={{ marginRight: 24 }}>
                            <SwapButtonText>{t("historyOrder")}</SwapButtonText>
                        </TouchableOpacity>
                }
                {
                    swapView === 'assetsRecord' ?
                        <TouchableOpacity onPress={() => { setSwapView('assetsRecord') }} style={{ borderBottomWidth: 2, borderBottomColor: '#6699CC', marginRight: 24, paddingRight: 1, paddingLeft: 1 }}>
                            <SwapButtonClickedText>{t("transactionHistory")} </SwapButtonClickedText>
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={() => { setSwapView('assetsRecord') }} style={{ marginRight: 24 }}>
                            <SwapButtonText>{t("transactionHistory")} </SwapButtonText>
                        </TouchableOpacity>
                }

            </HeaderContainer>
            <SwapContainerLine></SwapContainerLine>
            <BottomContainer contentContainerStyle={{ paddingBottom: 420 }}>
                {
                    swapView === 'HistoryCommit' &&
                    entrustArray.map((future, index) => {
                        return (
                            <CardContainer key={future.orderId}>
                                <CardTitleContainer>
                                    <CardTitleRowContainer>
                                        {
                                            future.side === 'SELL' ?
                                                <CardTitleSecondaryLightText>{future.symbol}</CardTitleSecondaryLightText> :
                                                <CardTitleSecondaryText>{future.symbol}</CardTitleSecondaryText>
                                        }
                                        {
                                            future.status === "CREATE" ?
                                                <HistoryCommitCardTitleProgressCancelText>已建立</HistoryCommitCardTitleProgressCancelText> : future.status === "DEAL" ?
                                                    <HistoryCommitCardTitleProgressCancelText>{t("orderFilled")}    </HistoryCommitCardTitleProgressCancelText> :
                                                    <HistoryCommitCardTitleProgressCancelText>{t("orderCanceled")} </HistoryCommitCardTitleProgressCancelText>
                                        }
                                    </CardTitleRowContainer>
                                    <CardTitleTimeText>{new Date(future.createdDate).getFullYear()}-{new Date(future.createdDate).getMonth() + 1 < 10 ? "0" + (new Date(future.createdDate).getMonth() + 1) : new Date(future.createdDate).getMonth() + 1}-{new Date(future.createdDate).getDate() < 10 ? "0" + (new Date(future.createdDate).getDate()) : new Date(future.createdDate).getDate()} {new Date(future.createdDate).getHours() < 10 ? "0" + (new Date(future.createdDate).getHours()) : new Date(future.createdDate).getHours()}:{new Date(future.createdDate).getMinutes() < 10 ? "0" + (new Date(future.createdDate).getMinutes()) : new Date(future.createdDate).getMinutes()}</CardTitleTimeText>
                                </CardTitleContainer>
                                <CardDetailContainer>
                                    <CardDetailColumnContainer>
                                        <CardDetailInColumnContainer>
                                            <CardDetailTitleText>{t("tradeType")}</CardDetailTitleText>
                                            <CardDetailValueText>{future.type === "LIMIT" ? t("limitedOrder") : future.type === "MARKET" ? t("marketOrder") : future.type === "STOP_LIMIT" ? t("stopLimitOrder") : t("stopMarketOrder")}</CardDetailValueText>
                                        </CardDetailInColumnContainer>
                                        <CardDetailInColumnContainer>
                                            <CardDetailTitleText>{t("orderSize")}</CardDetailTitleText>
                                            <CardDetailValueText>{future.origQty}</CardDetailValueText>
                                        </CardDetailInColumnContainer>
                                        <CardDetailInColumnContainer>
                                            <CardDetailTitleText>{t("withdrawFee")}</CardDetailTitleText>
                                            <CardDetailValueText>{future.handlingFee && future.handlingFee.toFixed(2) + " USDT"}</CardDetailValueText>
                                        </CardDetailInColumnContainer>
                                    </CardDetailColumnContainer>
                                    <CardDetailColumnContainer>
                                        <CardDetailInColumnContainer>
                                            <CardDetailTitleText>{t("side")}</CardDetailTitleText>
                                            {
                                                future.side === 'BUY' ?
                                                    <CardDetailValueDirectionLong>{t("buyOrder")}</CardDetailValueDirectionLong> :
                                                    <CardDetailValueDirectionShort>{t("sellOrder")}</CardDetailValueDirectionShort>
                                            }
                                        </CardDetailInColumnContainer>
                                        <CardDetailInColumnContainer>
                                            <CardDetailTitleText>{t("dealPrice")}  </CardDetailTitleText>
                                            <CardDetailValueText>{future.type == "STOP_MARKET" ? t("marketOrder") : future.price}</CardDetailValueText>
                                        </CardDetailInColumnContainer>
                                        <CardDetailInColumnContainer>
                                            <CardDetailTitleText>{t("realizedPNL")}   </CardDetailTitleText>
                                            <CardDetailValueText>{future.profitAndLoss && future.profitAndLoss.toFixed(2) + " USDT"}</CardDetailValueText>
                                        </CardDetailInColumnContainer>
                                        {/* <CardDetailInColumnContainer>
                                            <CardDetailTitleText>止盈/止損</CardDetailTitleText>
                                            <TouchableOpacity onPress={() => { }}>
                                                <CardDetailValueText>查看</CardDetailValueText>
                                            </TouchableOpacity>
                                        </CardDetailInColumnContainer> */}
                                    </CardDetailColumnContainer>
                                    <CardDetailColumnContainer>
                                        <CardDetailInColumnContainer>
                                            <CardDetailTitleText>{t("orderStatus")} </CardDetailTitleText>
                                            <CardDetailValueText>{future.status}</CardDetailValueText>
                                        </CardDetailInColumnContainer>
                                        <CardDetailInColumnContainer>
                                            <CardDetailTitleText>{t("conditionPrice")}</CardDetailTitleText>
                                            <CardDetailValueText>{future.stopPrice}</CardDetailValueText>
                                        </CardDetailInColumnContainer>
                                        {/* <CardDetailInColumnContainer>
                                            <CardDetailTitleText>觸發價</CardDetailTitleText>
                                            <CardDetailValueText>{x.stopPrice}</CardDetailValueText>
                                        </CardDetailInColumnContainer> */}
                                    </CardDetailColumnContainer>
                                </CardDetailContainer>
                                {
                                    index !== entrustArray.length - 1 &&
                                    <CardLine></CardLine>
                                }
                            </CardContainer>
                        )
                    })
                }
                {
                    swapView === 'assetsRecord' &&

                    recordArray.map((record) => {
                        return (
                            <CardContainer>
                                <AssetsRecordTitleContainer>
                                    <AssetsRecordTitleText>
                                        {record.remark === "手續費" && t("orderFee")}
                                        {record.remark === "反佣增加餘額" && t("commisionAdd")}
                                        {record.remark === "建立倉位佔用合約帳戶保證金" && t("positionBuildMargin")}
                                        {record.remark === "加倉佔用合約帳戶保證金" && t("positionAddMargin")}
                                        {record.remark === "倉位實現損益" && t("positionPNL")}
                                        {record.remark === "強平結算" && t("positionLiqudation")}
                                        {record.remark === "內部劃轉" && t("internalTransfer")}
                                        {record.remark === "調整槓桿變更倉位佔用保證金" && t("leverageMargin")}
                                        {record.remark === "保證金為負值" && t("marginNegtive")}
                                        {record.remark === "餘額為負值" && t("balanceNegtive")}
                                        {record.remark === "投資人充值" && t("spotDeposit")}
                                        {record.remark === "委託單成交扣除餘額" && t("orderFee")}
                                        {record.remark === "投資人提現" && t("spotWithdraw")}
                                        {record.remark === "減倉釋放合約帳戶保證金" && t("positionReleaseMargin")}
                                    </AssetsRecordTitleText>
                                    <AssetsRecordAmountText>{`${record.payment} ${record.coin}`}</AssetsRecordAmountText>
                                </AssetsRecordTitleContainer>
                                <AssetsRecordDetailContainer>
                                    <AssetsRecordTimeText>{new Date(record.createdDate).getFullYear()}-{new Date(record.createdDate).getMonth() + 1 < 10 ? "0" + (new Date(record.createdDate).getMonth() + 1) : new Date(record.createdDate).getMonth() + 1}-{new Date(record.createdDate).getDate() < 10 ? "0" + (new Date(record.createdDate).getDate()) : new Date(record.createdDate).getDate()} {new Date(record.createdDate).getHours() < 10 ? "0" + (new Date(record.createdDate).getHours()) : new Date(record.createdDate).getHours()}:{new Date(record.createdDate).getMinutes() < 10 ? "0" + (new Date(record.createdDate).getMinutes()) : new Date(record.createdDate).getMinutes()}</AssetsRecordTimeText>
                                    {/* {
                                        x.type === 'buy' ?
                                            <AssetsRecordTypeLeverageTextSecondary>{x.typeName}・{x.leverage}X</AssetsRecordTypeLeverageTextSecondary> :
                                            <AssetsRecordTypeLeverageTextSecondaryLight>{x.typeName}・{x.leverage}X</AssetsRecordTypeLeverageTextSecondaryLight>
                                    } */}
                                </AssetsRecordDetailContainer>
                                <CardLine></CardLine>
                            </CardContainer>
                        )
                    })
                }
            </BottomContainer>
        </Container>

    )
}

export default HistoryScreen