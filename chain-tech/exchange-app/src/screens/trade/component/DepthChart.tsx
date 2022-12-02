import * as React from "react";
import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styled from "styled-components";
import { useState, useContext } from "react";
import { useAppSelector } from "hooks"
import axios from "axios";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import RenderCounter from "components/render-counter"

// Trade Page Table Style
const TradeTableContainer = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 50%;
  padding-right: 8px;
`;

const TradeTableTopTitleContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const TradeTableTopTitleText = styled(Text)`
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: ${props => props.theme.color.MidGray};
`;

const TradeTableBuyContainer = styled(View)`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
`;

const TradeTableRowContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
  align-items: center;
  padding-top: 2px;
`;

const TradeTableBuyPriceText = styled(Text)`
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: ${props => props.theme.color.Secondary};
`;

const TradeTableNumberText = styled(Text)`
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: ${props => props.theme.color.ExtraLightGray};
`;

const TradeTableBottomTitleContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const TradeTableBottomTitlePriceRiseText = styled(Text)`
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  color: ${props => props.theme.color.Secondary};
`;

const TradeTableBottomTitlePriceFallText = styled(Text)`
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  color: ${props => props.theme.color.SecondaryLight};
`;

const TradeTableBottomTitleOwnValueText = styled(Text)`
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: ${props => props.theme.color.ExtraLightGray};
`;

const TradeTableSellContainer = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const TradeTableSellPriceText = styled(Text)`
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: ${props => props.theme.color.SecondaryLight};
`;

interface DepthChartProps {
    symbol: string
}

const DepthChart = (props: DepthChartProps) => {
    const { symbol } = props
    const { t } = useTranslation();
    const [newTrade, setNewTrade] = useState("");
    const [price, setPrice] = useState("");
    const [remarkPrice, setRemarkPrice] = useState("");
    const [isPositive, setIsPositive] = useState(true);
    const focus = useIsFocused()
    const market = useAppSelector((state) => focus ? state.market.price : "")
    const [asksArray, setAsksArray] = useState([]);
    const [bidsArray, setBidsArray] = useState([]);
    const getDepth = (trade: string) => {
        axios.get(`https://api1.binance.com/api/v3/depth?symbol=${trade}&limit=12`)
            .then(x => {
                setAsksArray(x.data.asks.reverse());
                setBidsArray(x.data.bids);
            }).catch((e) => {
                console.log(e)
            });
    };

    useFocusEffect(
        React.useCallback(() => {
            if (market) {
                getDepth(symbol.replace("-", ""))
                const remark = _.find(market, (o: MarketPrice) => {
                    return o.s === symbol;
                });
                setRemarkPrice((remark as MarketPrice).m);
                setPrice((remark as MarketPrice).c);
            }
        }, [market, symbol])
    );

    return (
        <TradeTableContainer>
            <RenderCounter name="DepthChart" debug={false} />
            <TradeTableTopTitleContainer>
                <TradeTableTopTitleText>{t("price")}</TradeTableTopTitleText>
                <TradeTableTopTitleText>{t("amount")}</TradeTableTopTitleText>
            </TradeTableTopTitleContainer>
            <TradeTableTopTitleContainer>
                <TradeTableTopTitleText>(USDT)</TradeTableTopTitleText>
                <TradeTableTopTitleText>
                    ({symbol ? symbol.replace("-USDT", "") : ""})
                </TradeTableTopTitleText>
            </TradeTableTopTitleContainer>
            <TradeTableSellContainer>
                {asksArray.map((x: string, i) => {
                    let percent = Number((1 - parseFloat(x[1])).toPrecision());
                    if (
                        parseInt(
                            (
                                parseFloat(x[0].slice(0, 2) + x[0].slice(2, -9)) *
                                parseFloat(x[1].slice(0, -5)) +
                                20
                            )
                                .toString()
                                .slice(-2)
                        )
                    ) {
                        percent =
                            parseInt(
                                (
                                    parseFloat(x[0].slice(0, 2) + x[0].slice(2, -9)) *
                                    parseFloat(x[1].slice(0, -5)) +
                                    20
                                )
                                    .toString()
                                    .slice(-2)
                            ) / 100;
                    }
                    if (i < 6) {
                        return (
                            <LinearGradient
                                key={`asks-${i}`}
                                colors={["transparent", "rgba(251, 76, 81, 0.2)"]}
                                start={{ x: 0, y: 0.0 }}
                                end={{ x: percent, y: 0.0 }}
                            >
                                <TradeTableRowContainer>
                                    <TradeTableSellPriceText>
                                        {parseFloat(x[0]) < 0.006 &&
                                            parseFloat(x[0]) > 0
                                            ? price.slice(0, -2)
                                            : parseFloat(x[0]) < 0.1 &&
                                                parseFloat(x[0]) > 0.006
                                                ? x[0].slice(0, -3)
                                                : parseFloat(x[0]) < 1 &&
                                                    parseFloat(x[0]) > 0.1
                                                    ? x[0].slice(0, -4)
                                                    : parseFloat(x[0]) < 50 &&
                                                        parseFloat(x[0]) > 1
                                                        ? x[0].slice(0, -5)
                                                        : x[0].slice(0, -6)}
                                    </TradeTableSellPriceText>
                                    <TradeTableNumberText>
                                        {x[1].slice(0, -5)}
                                    </TradeTableNumberText>
                                </TradeTableRowContainer>
                            </LinearGradient>
                        );
                    }
                })}
            </TradeTableSellContainer>
            <TradeTableBottomTitleContainer>
                {isPositive === true ? (
                    <TradeTableBottomTitlePriceRiseText>
                        {parseFloat(price) < 0.006 && parseFloat(price) > 0
                            ? price
                            : parseFloat(price) < 0.1 && parseFloat(price) > 0.006
                                ? price.slice(0, -1)
                                : parseFloat(price) < 1 && parseFloat(price) > 0.1
                                    ? price.slice(0, -2)
                                    : parseFloat(price) < 50 && parseFloat(price) > 1
                                        ? price.slice(0, -3)
                                        : price.slice(0, -4)}
                    </TradeTableBottomTitlePriceRiseText>
                ) : (
                    <TradeTableBottomTitlePriceFallText>
                        {parseFloat(price) < 0.006 && parseFloat(price) > 0
                            ? price
                            : parseFloat(price) < 0.1 && parseFloat(price) > 0.006
                                ? price.slice(0, -1)
                                : parseFloat(price) < 1 && parseFloat(price) > 0.1
                                    ? price.slice(0, -2)
                                    : parseFloat(price) < 50 && parseFloat(price) > 1
                                        ? price.slice(0, -3)
                                        : price.slice(0, -4)}
                    </TradeTableBottomTitlePriceFallText>
                )}
            </TradeTableBottomTitleContainer>
            <TradeTableBottomTitleContainer>
                <TradeTableBottomTitleOwnValueText>
                    {parseFloat(remarkPrice) < 0.006 &&
                        parseFloat(remarkPrice) > 0
                        ? remarkPrice
                        : parseFloat(remarkPrice) < 0.1 &&
                            parseFloat(remarkPrice) > 0.006
                            ? remarkPrice.slice(0, -1)
                            : parseFloat(remarkPrice) < 1 &&
                                parseFloat(remarkPrice) > 0.1
                                ? remarkPrice.slice(0, -2)
                                : parseFloat(remarkPrice) < 50 &&
                                    parseFloat(remarkPrice) > 1
                                    ? remarkPrice.slice(0, -3)
                                    : remarkPrice.slice(0, -4)}
                </TradeTableBottomTitleOwnValueText>
            </TradeTableBottomTitleContainer>
            <TradeTableBuyContainer>
                {bidsArray.map((x: string, i) => {
                    let percent = Number((1 - parseFloat(x[1])).toPrecision());
                    if (
                        parseInt(
                            (
                                parseFloat(x[0].slice(0, 2) + x[0].slice(2, -9)) *
                                parseFloat(x[1].slice(0, -5)) +
                                20
                            )
                                .toString()
                                .slice(-2)
                        )
                    ) {
                        percent =
                            parseInt(
                                (
                                    parseFloat(x[0].slice(0, 2) + x[0].slice(2, -9)) *
                                    parseFloat(x[1].slice(0, -5)) +
                                    20
                                )
                                    .toString()
                                    .slice(-2)
                            ) / 100;
                    }
                    if (i < 6) {
                        return (
                            <LinearGradient
                                key={`bids-${i}`}
                                colors={["transparent", "rgba(47, 178, 100, 0.2)"]}
                                start={{ x: 0, y: 0.0 }}
                                end={{ x: percent, y: 0.0 }}
                            >
                                <TradeTableRowContainer>
                                    <TradeTableBuyPriceText>
                                        {parseFloat(x[0]) < 0.006 &&
                                            parseFloat(x[0]) > 0
                                            ? price.slice(0, -2)
                                            : parseFloat(x[0]) < 0.1 &&
                                                parseFloat(x[0]) > 0.006
                                                ? x[0].slice(0, -3)
                                                : parseFloat(x[0]) < 1 &&
                                                    parseFloat(x[0]) > 0.1
                                                    ? x[0].slice(0, -4)
                                                    : parseFloat(x[0]) < 50 &&
                                                        parseFloat(x[0]) > 1
                                                        ? x[0].slice(0, -5)
                                                        : x[0].slice(0, -6)}
                                    </TradeTableBuyPriceText>
                                    <TradeTableNumberText>
                                        {x[1].slice(0, -5)}
                                    </TradeTableNumberText>
                                </TradeTableRowContainer>
                            </LinearGradient>
                        )
                    }
                })}
            </TradeTableBuyContainer>
        </TradeTableContainer>
    )
}

export default DepthChart