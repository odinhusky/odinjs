import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
import styled from "styled-components";
import React, { useState } from "react";
// import api from "common/api";
import { useAppSelector, useAppDispatch } from "hooks"
import { positionsActions } from "store/slice";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { useNavigation, useIsFocused } from '@react-navigation/native';
import RenderCounter from "components/render-counter"
import { positionService } from "services";

// Trade Page Position Style
const TradePositionContainer = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 280px;
`;

const TradePositionBackgroundImage = styled(Image)`
  width: 99px;
  height: 135px;
`;

const TradePositionCardContainer = styled(View)`
  display: flex;
  flex-direction: column;
`;

const TradePositionCardTitleContainer = styled(View)`
  display: flex;
  flex-direction: column;
  padding-top: 20px;
`;

const TradePositionCardTitleRowContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const TradePositionCardTitleText = styled(Text)`
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: ${props => props.theme.color.Secondary};
`;

const TradePositionCardTitleValueText = styled(Text)`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  color: ${props => props.theme.color.ExtraLightGray};
`;

const TradePositionCardDetailRowContainer = styled(View)`
  display: flex;
  flex-direction: row;
  padding-top: 12px;
`;

const TradePositionCardDetailColumnContainer = styled(View)`
  display: flex;
  flex-direction: column;
  width: 50%;
`;

const TradePositionCardSmallTitleText = styled(Text)`
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: ${props => props.theme.color.MidGray};
`;

const TradePositionCardBigValueText = styled(Text)`
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  color: ${props => props.theme.color.Secondary};
`;

const TradePositionCardSmallValueText = styled(Text)`
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  color: ${props => props.theme.color.ExtraLightGray};
`;

const TradePositionCardButtonContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 12px;
`;

const TradePositionCardButton = styled(TouchableOpacity)`
  height: 26px;
  width: 48%;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.color.DarkGray};
`;

const TradePositionCardButtonText = styled(Text)`
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: ${props => props.theme.color.White};
`;

interface PositionListProps {
    symbol: string
  }

const PositionList = (props: PositionListProps) =>{
    const { symbol } = props
    // Swap Page
    const { t } = useTranslation();
    const navigation = useNavigation();
    // Function Button
    const [loading, setLoading] = useState(false);
    const [lock,setLock] = useState(false)
    const focus = useIsFocused();
    const market = useAppSelector((state)=> focus ? state.market.price : "")
    const positions = useAppSelector((state)=> focus ? state.positions.trading : "");
    const dispatch = useAppDispatch()

    const getRemark = (s: string) => {
        const remark = market && _.find(market, (o :MarketPrice) => {
        return o.s == s;
        });
        return remark ? remark.m : "";
    };

    return (
        <><RenderCounter name="PositionList" debug={false}/>{
        positions.length !== 0 ? (
            <TradePositionContainer>
                {
                    positions!=="" && positions.filter(p=>p.status==="TRADING").map((position, i) => {
                        return (
                            <TradePositionCardContainer key={position.positionId}>
                                <TradePositionCardTitleContainer>
                                    <TradePositionCardTitleRowContainer>
                                        {position.side === "BUY" ? (
                                        <TradePositionCardTitleText>
                                            {t("long")} {position.symbol}
                                        </TradePositionCardTitleText>
                                        ) : (
                                        <TradePositionCardTitleText
                                            style={{ color: "#FB4C51" }}
                                        >
                                            {t("short")} {position.symbol}
                                        </TradePositionCardTitleText>
                                        )}
                                        <TradePositionCardSmallTitleText>
                                        {t("pnlU")}
                                        </TradePositionCardSmallTitleText>
                                    </TradePositionCardTitleRowContainer>
                                    <TradePositionCardTitleRowContainer>
                                        <TradePositionCardTitleValueText>
                                        {position.type === "FULL" ? t("crossPosition") : "逐倉"}{" "}
                                        {position.leverage}X
                                        </TradePositionCardTitleValueText>
                                        {position.profitAndLoss > 0 ? (
                                        <TradePositionCardBigValueText>
                                            {position.profitAndLoss}
                                        </TradePositionCardBigValueText>
                                        ) : (
                                        <TradePositionCardBigValueText
                                            style={{ color: "#FB4C51" }}
                                        >
                                            {position.profitAndLoss}
                                        </TradePositionCardBigValueText>
                                        )}
                                    </TradePositionCardTitleRowContainer>
                                </TradePositionCardTitleContainer>
                                <TradePositionCardDetailRowContainer>
                                    <TradePositionCardDetailColumnContainer>
                                        <TradePositionCardSmallTitleText>
                                        {t("positionSize")}
                                        </TradePositionCardSmallTitleText>
                                        <TradePositionCardSmallValueText>
                                        {position.quantity}
                                        </TradePositionCardSmallValueText>
                                    </TradePositionCardDetailColumnContainer>
                                    <TradePositionCardDetailColumnContainer>
                                        <TradePositionCardSmallTitleText>{t("entryPrice")}</TradePositionCardSmallTitleText>
                                        <TradePositionCardSmallValueText>
                                        {parseFloat(position.avgPrice.toFixed(6)) < 0.006 &&
                                            parseFloat(position.avgPrice.toFixed(6)) > 0
                                            ? position.avgPrice.toFixed(6)
                                            : parseFloat(position.avgPrice.toFixed(6)) < 0.1 &&
                                            parseFloat(position.avgPrice.toFixed(6)) > 0.006
                                            ? position.avgPrice.toFixed(6).toString().slice(0, -1)
                                            : parseFloat(position.avgPrice.toFixed(6)) < 1 &&
                                                parseFloat(position.avgPrice.toFixed(6)) > 0.1
                                                ? position.avgPrice.toFixed(6).toString().slice(0, -2)
                                                : parseFloat(position.avgPrice.toFixed(6)) < 50 &&
                                                parseFloat(position.avgPrice.toFixed(6)) > 1
                                                ? position.avgPrice.toFixed(6).toString().slice(0, -3)
                                                : position.avgPrice.toFixed(6).toString().slice(0, -4)}
                                        </TradePositionCardSmallValueText>
                                    </TradePositionCardDetailColumnContainer>
                                </TradePositionCardDetailRowContainer>
                                <TradePositionCardDetailRowContainer>
                                    <TradePositionCardDetailColumnContainer>
                                        <TradePositionCardSmallTitleText>{t("marketPrice")}</TradePositionCardSmallTitleText>
                                        <TradePositionCardSmallValueText>
                                            {parseFloat(getRemark(position.symbol)) < 0.006 &&
                                            parseFloat(getRemark(position.symbol)) > 0
                                            ? getRemark(position.symbol)
                                            : parseFloat(getRemark(position.symbol)) < 0.1 &&
                                            parseFloat(getRemark(position.symbol)) > 0.006
                                            ? getRemark(position.symbol)
                                                .toString()
                                                .slice(0, -1)
                                            : parseFloat(getRemark(position.symbol)) < 1 &&
                                                parseFloat(getRemark(position.symbol)) > 0.1
                                                ? getRemark(position.symbol)
                                                .toString()
                                                .slice(0, -2)
                                                : parseFloat(getRemark(position.symbol)) < 50 &&
                                                parseFloat(getRemark(position.symbol)) > 1
                                                ? getRemark(position.symbol)
                                                    .toString()
                                                    .slice(0, -3)
                                                : getRemark(position.symbol)
                                                    .toString()
                                                    .slice(0, -4)}
                                        </TradePositionCardSmallValueText>
                                    </TradePositionCardDetailColumnContainer>
                                    <TradePositionCardDetailColumnContainer>
                                        <TradePositionCardSmallTitleText>{t("liqPrice")}</TradePositionCardSmallTitleText>
                                        <TradePositionCardSmallValueText>{position.forceClose}</TradePositionCardSmallValueText>
                                    </TradePositionCardDetailColumnContainer>
                                </TradePositionCardDetailRowContainer>
                                <TradePositionCardButtonContainer>
                                    <TradePositionCardButton
                                        onPress={() => {
                                            navigation.navigate("StopPositionScreen", {
                                                remarkPrice: getRemark(position.symbol),
                                                position: position
                                            });
                                        }}
                                    >
                                        <TradePositionCardButtonText>{t("stopProfitLoss")}</TradePositionCardButtonText>
                                    </TradePositionCardButton>
                                    <TradePositionCardButton
                                        disabled={lock}
                                        onPress={() => {
                                            dispatch(positionsActions.close(position.positionId))
                                            setLoading(true);
                                            positionService.close({
                                                positionId: position.positionId
                                            }).finally(()=>{
                                                setLoading(false);
                                            })
                                        }}
                                    >
                                        <TradePositionCardButtonText>{t("closePosition")}</TradePositionCardButtonText>
                                    </TradePositionCardButton>
                                </TradePositionCardButtonContainer>
                            </TradePositionCardContainer>
                        );
                    })
                }
            </TradePositionContainer>
        ) : (
            <TradePositionContainer>
                <TradePositionBackgroundImage
                    source={require("assets/images/trade/norecord.png")}
                />
            </TradePositionContainer>
        )
        }</>
    )
}

export default PositionList