import * as React from "react";
import {
    Text,
    TouchableOpacity,
    View,
    Image,
    Alert,
    Modal as Modal2
} from "react-native";
import styled from "styled-components";
import { useState, useEffect, useContext } from "react";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { useAppSelector } from 'hooks';
import RenderCounter from "components/render-counter"
import { useIsFocused } from '@react-navigation/native';
import { futureService } from "services";

// Trade Page Commit Style
const TradeCommitContainer = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 280px;
`;

const TradeCommitBackgroundImage = styled(Image)`
  width: 99px;
  height: 135px;
`;

const TradeCommitCardContainer = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`;

const TradeCommitCardTitleContainer = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 20px;
`;

const TradeCommitCardTitleText = styled(Text)`
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: ${props => props.theme.color.Secondary};
`;

const TradeCommitCardDetailRowContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 12px;
`;

const TradeCommitCardDetailColumnContainer = styled(View)`
  display: flex;
  flex-direction: column;
  width: 30%;
`;

const TradeCommitCardSmallTitleText = styled(Text)`
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: ${props => props.theme.color.MidGray};
`;

const TradeCommitCardBuyDirectionLongText = styled(Text)`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  color: ${props => props.theme.color.Secondary};
`;

const TradeCommitCardBuyDirectionShortText = styled(Text)`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  color: ${props => props.theme.color.SecondaryLight};
`;

const TradeCommitCardSmallValueText = styled(Text)`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  color: ${props => props.theme.color.ExtraLightGray};
`;

const TradeCommitCardButtonContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 12px;
`;

const TradeCommitCardButton = styled(TouchableOpacity)`
  height: 26px;
  width: 48%;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.color.DarkGray};
`;

const TradeCommitCardButtonText = styled(Text)`
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: ${props => props.theme.color.White};
`;

const ThumbImage = styled(Image)`
  width: 20px;
  height: 20px;
`;

const IconImg = styled(Image)`
  width: 24px;
  height: 24px;
`;

interface FutureListProps {
    symbol: string
}
const FutureList = (props: FutureListProps) => {
    const { symbol } = props
    const { t } = useTranslation();
    // Function Button
    const [loading, setLoading] = useState(false);
    const focus = useIsFocused();
    const futures = useAppSelector((state) => focus ? state.futures.create : "");
    const [isCommitStopVisible, setIsCommitStopVisible] = useState(false);
    const toggleCommitStopModal = () => {
        setIsCommitStopVisible(!isCommitStopVisible);
    };

    const cancelCommitAlert = (id: any) =>
        Alert.alert("撤銷委託單？", "確定撤銷後將無法再次回復該筆委託單內容。", [ //translate
            {
                text: "取消",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },
            {
                text: "確定",
                onPress: () => {
                    setLoading(true);
                    futureService.cancel({ orderId: id }).finally(() => {
                        setLoading(false);
                    })
                }
            }
        ]);

    return (
        <><RenderCounter name="FutureList" debug={false} />{
            futures ? (
                <TradeCommitContainer>
                    {futures.filter(f => f.status === "CREATE").map((x: any, i) => {
                        return (
                            <TradeCommitCardContainer>
                                <TradeCommitCardTitleContainer>
                                    <TradeCommitCardTitleText>
                                        {x.symbol}
                                    </TradeCommitCardTitleText>
                                    {/* <TradeCommitCardTitleTimeText>{x.time}</TradeCommitCardTitleTimeText> */}
                                </TradeCommitCardTitleContainer>
                                <TradeCommitCardDetailRowContainer>
                                    <TradeCommitCardDetailColumnContainer>
                                        <TradeCommitCardSmallTitleText>
                                            {t("tradeType")}
                                        </TradeCommitCardSmallTitleText>
                                        {x.type === "LIMIT" && (
                                            <TradeCommitCardSmallValueText>
                                                {t("limitedOrder")}
                                            </TradeCommitCardSmallValueText>
                                        )}
                                        {x.type === "MARKET" && (
                                            <TradeCommitCardSmallValueText>
                                                {t("marketOrder")}
                                            </TradeCommitCardSmallValueText>
                                        )}
                                        {x.type === "STOP_MARKET" && (
                                            <TradeCommitCardSmallValueText>
                                                {t("stopMarketOrder")}
                                            </TradeCommitCardSmallValueText>
                                        )}
                                        {x.type === "STOP_LIMIT" && (
                                            <TradeCommitCardSmallValueText>
                                                {t("stopLimitOrder")}
                                            </TradeCommitCardSmallValueText>
                                        )}
                                    </TradeCommitCardDetailColumnContainer>
                                    <TradeCommitCardDetailColumnContainer>
                                        <TradeCommitCardSmallTitleText>
                                            {t("orderType")}
                                        </TradeCommitCardSmallTitleText>
                                        {x.side === "BUY" && (
                                            <TradeCommitCardBuyDirectionLongText>
                                                {t("buyOrder")}
                                            </TradeCommitCardBuyDirectionLongText>
                                        )}
                                        {x.side === "SELL" && (
                                            <TradeCommitCardBuyDirectionShortText>
                                                {t("sellOrder")}
                                            </TradeCommitCardBuyDirectionShortText>
                                        )}
                                    </TradeCommitCardDetailColumnContainer>
                                    <TradeCommitCardDetailColumnContainer>
                                        <TradeCommitCardSmallTitleText>
                                            {t("orderStatus")}
                                        </TradeCommitCardSmallTitleText>
                                        <TradeCommitCardSmallValueText>
                                            {x.status}
                                        </TradeCommitCardSmallValueText>
                                    </TradeCommitCardDetailColumnContainer>
                                </TradeCommitCardDetailRowContainer>
                                <TradeCommitCardDetailRowContainer>
                                    <TradeCommitCardDetailColumnContainer>
                                        <TradeCommitCardSmallTitleText>
                                            {t("orderSize")}
                                        </TradeCommitCardSmallTitleText>
                                        <TradeCommitCardSmallValueText>
                                            {x.origQty}
                                        </TradeCommitCardSmallValueText>
                                    </TradeCommitCardDetailColumnContainer>
                                    <TradeCommitCardDetailColumnContainer>
                                        <TradeCommitCardSmallTitleText>
                                            {t("orderPrice")}
                                        </TradeCommitCardSmallTitleText>
                                        <TradeCommitCardSmallValueText>
                                            {x.type == "STOP_MARKET"
                                                ? t("marketOrder")
                                                : x.price}
                                        </TradeCommitCardSmallValueText>
                                    </TradeCommitCardDetailColumnContainer>
                                    <TradeCommitCardDetailColumnContainer>
                                        <TradeCommitCardSmallTitleText>
                                            {t("conditionPrice")}
                                        </TradeCommitCardSmallTitleText>
                                        <TradeCommitCardSmallValueText>
                                            {x.stopPrice}
                                        </TradeCommitCardSmallValueText>
                                    </TradeCommitCardDetailColumnContainer>
                                </TradeCommitCardDetailRowContainer>
                                <TradeCommitCardButtonContainer>
                                    <TradeCommitCardButton
                                        onPress={() => {
                                            toggleCommitStopModal();
                                        }}
                                    >
                                        <TradeCommitCardButtonText>
                                            {t("stopProfitLoss")}
                                        </TradeCommitCardButtonText>
                                    </TradeCommitCardButton>
                                    <TradeCommitCardButton
                                        onPress={() => {
                                            cancelCommitAlert(x.orderId);
                                        }}
                                    >
                                        <TradeCommitCardButtonText>
                                            {t("cancelOrder")}
                                        </TradeCommitCardButtonText>
                                    </TradeCommitCardButton>
                                </TradeCommitCardButtonContainer>
                            </TradeCommitCardContainer>
                        );
                    })}
                </TradeCommitContainer>
            ) : (
                <TradeCommitContainer>
                    <TradeCommitBackgroundImage
                        source={require("assets/images/trade/norecord.png")}
                    />
                </TradeCommitContainer>
            )
        }</>
    )
}

export default FutureList