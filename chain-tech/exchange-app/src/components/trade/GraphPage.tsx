import * as React from "react";
import { Text, TouchableOpacity, View, Image, ScrollView, Dimensions } from "react-native"
import styled from "styled-components"
import { useState,useEffect,useContext } from "react";
import axios from "axios"
import { WebView } from 'react-native-webview';
import { useTranslation } from "react-i18next";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useAppSelector } from "hooks"
import _ from "lodash";
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

// Graph Page Header Style
const GraphHeaderContainer = styled(View)`
display: flex;
flex-direction: column;
margin-top: 13px;
padding-left: 16px;
padding-right: 16px;
padding-bottom: 12px;
`;

const GraphHeaderTopRowContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: flex-start;
align-items: center;
padding-bottom: 13px;
`;

const GraphHeaderBottomRowContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
`;

const GraphHeaderBottomRowColumnContainer = styled(View)`
display: flex;
flex-direction: column;
`;

const GraphHeaderBottomInlineRowContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
`;

const GraphHeaderBigTitleText = styled(Text)`
font-weight: 700;
font-size: 20px;
line-height: 24px;
color: ${props => props.theme.color.White};
`;

const GraphHeaderFluctuationRiseText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 20px;
color: ${props => props.theme.color.Secondary};
background-color: rgba(47, 178, 100, 0.3);
margin-left: 12px;
`;

const GraphHeaderFluctuationFallText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 20px;
color: ${props => props.theme.color.SecondaryLight};
background-color: rgba(251, 76, 81, 0.3);
margin-left: 12px;
`;

const GraphHeaderTitleRisePriceText = styled(Text)`
font-weight: 700;
font-size: 32px;
line-height: 40px;
color: ${props => props.theme.color.Secondary};
`;

const GraphHeaderTitleFallPriceText = styled(Text)`
font-weight: 700;
font-size: 32px;
line-height: 40px;
color: ${props => props.theme.color.SecondaryLight};
`;

const GraphHeaderSmallTitleText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 18px;
color: ${props => props.theme.color.MidGray};
margin-right: 8px;
`;

const GraphHeaderSmallValueText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 15px;
color: ${props => props.theme.color.White};
`;

// Graph Page Style
const GraphContainer = styled(ScrollView)`
display: flex;
flex-direction: column;
width: 100%;

`;

const GraphContentContainer = styled(View)`
padding-top: 12px;
`;

const GraphTempImage = styled(Image)`
height: 400px;
width: 420px;
`;

// Graph Page Detail Buy Style
const GraphDetailContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
padding-left: 16px;
padding-right: 16px;
`;

const GraphDetailTitleText = styled(Text)`
font-weight: 600;
font-size: 16px;
line-height: 24px;
color: ${props => props.theme.color.White};
padding-top: 24px;
padding-left: 16px;
padding-right: 16px;
margin-bottom: 16px;
`;

const GraphDetailBuyContainer = styled(View)`
display: flex;
flex-direction: column;
justify-content: space-between;
align-items:flex-end;
`;

const GraphDetailRowContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
padding-left: 16px;
padding-right: 16px;
`;

const GraphDetailColumnContainer = styled(View)`
display: flex;
flex-direction: column;
`;

const GraphDetailBuyRightTitleText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 18px;
text-align: right;
color: ${props => props.theme.color.MidGray};
`;

const GraphDetailBuyLeftTitleText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 18px;
text-align: left;
color: ${props => props.theme.color.MidGray};
`;

const GraphDetailBuyMiddleTitleText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 18px;
text-align: center;
padding-left: 10px;
color: ${props => props.theme.color.MidGray};
`;

const GraphDetailBuyPriceTitleText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 15px;
color: ${props => props.theme.color.SecondaryLight};
`;

const GraphDetailBuyDetailText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 15px;
color: ${props => props.theme.color.ExtraLightGray};
`;

// Graph Detail Price Container Style
const GraphDetailPriceRowContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
padding-top: 8px;
padding-left: 16px;
padding-right: 16px;
padding-bottom: 8px;
`;

const GraphDetailPriceColumnContainer = styled(View)`
display: flex;
flex-direction: column;
`;

const GraphDetailPriceRightTitleText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 18px;
color: ${props => props.theme.color.MidGray};
text-align: right;
`;

const GraphDetailPriceLeftTitleText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 18px;
color: ${props => props.theme.color.MidGray};
text-align: left;
`;

const GraphDetailLatestPriceText = styled(Text)`
font-weight: 700;
font-size: 16px;
line-height: 20px;
color: ${props => props.theme.color.Secondary};
`;

const GraphDetailIndexPriceText = styled(Text)`
font-weight: 700;
font-size: 16px;
line-height: 20px;
color: ${props => props.theme.color.White};
`;

// Graph Page Detail Sell Style
const GraphDetailSellContainer = styled(View)`
display: flex;
flex-direction: column;
justify-content: space-between;
align-items:flex-end;
`;

const GraphDetailSellPriceText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 15px;
color: ${props => props.theme.color.Secondary};
`;

const GraphDetailSellDetailText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 15px;
color: ${props => props.theme.color.White};
`;

const GraphPage = (props: {
    trade:string
    symbol: string
}) => {
    const {trade,symbol} = props
    // Value is Positive
    const [isPositive, setIsPositive] = useState(true);
    const focus = useIsFocused()
    const market = useAppSelector((state) => focus ? state.market.price : "")

    const { t } = useTranslation();
    const [bidsArray, setBidsArray] = useState([]);
    const [asksArray, setAsksArray] = useState([]);
    const [price, setPrice] = useState("");
    const [remarkPrice, setRemarkPrice] = useState("");
    // const [wareHousedPrice, setWareHousedPrice] = useState("");

    const getDepth = (trade: string) => {
        axios.get(`https://api1.binance.com/api/v3/depth?symbol=${trade}&limit=12`)
        .then(x => {
            setAsksArray(x.data.asks.reverse());
            setBidsArray(x.data.bids);
        }).catch((e)=>{
            console.log(e)
        });
    };

    useEffect(() => {
        getDepth(symbol.replace("-",""));
        const interval = setInterval(() => {
            getDepth(symbol.replace("-",""));
        }, 2000);
        return () => clearInterval(interval);         
    }, []);

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
        <View style={{width:"100%"}}>
            <GraphHeaderContainer>
                <GraphHeaderTopRowContainer>
                    <GraphHeaderBigTitleText>{trade}</GraphHeaderBigTitleText>
                    {/* {
                        isPositive === true ?
                            <GraphHeaderFluctuationRiseText>+2.90%</GraphHeaderFluctuationRiseText> :
                            <GraphHeaderFluctuationFallText>-2.90%</GraphHeaderFluctuationFallText>
                    } */}
                </GraphHeaderTopRowContainer>
                <GraphHeaderBottomRowContainer>
                    {
                        isPositive === true ?
                            <GraphHeaderTitleRisePriceText>{(parseFloat(price) < 0.006 && parseFloat(price) > 0) ? price : (parseFloat(price) < 0.1 && parseFloat(price) > 0.006)  ? price.slice(0, -1) : (parseFloat(price) < 1 && parseFloat(price) > 0.1) ?price.slice(0, -2): (parseFloat(price) < 50 && parseFloat(price) > 1) ?price.slice(0, -3) : price.slice(0, -4)}</GraphHeaderTitleRisePriceText> :
                            <GraphHeaderTitleFallPriceText>{(parseFloat(price) < 0.006 && parseFloat(price) > 0) ? price : (parseFloat(price) < 0.1 && parseFloat(price) > 0.006)  ? price.slice(0, -1) : (parseFloat(price) < 1 && parseFloat(price) > 0.1) ?price.slice(0, -2): (parseFloat(price) < 50 && parseFloat(price) > 1) ?price.slice(0, -3) : price.slice(0, -4)}</GraphHeaderTitleFallPriceText>
                    }
                    <GraphHeaderBottomRowColumnContainer>
                        <GraphHeaderBottomInlineRowContainer>
                            <GraphHeaderSmallTitleText>{t("marketPrice")}</GraphHeaderSmallTitleText>
                            <GraphHeaderSmallValueText>{(parseFloat(remarkPrice) < 0.006 && parseFloat(remarkPrice) > 0) ? remarkPrice : (parseFloat(remarkPrice) < 0.1 && parseFloat(remarkPrice) > 0.006)  ? remarkPrice.slice(0, -1) : (parseFloat(remarkPrice) < 1 && parseFloat(remarkPrice) > 0.1) ?remarkPrice.slice(0, -2): (parseFloat(remarkPrice) < 50 && parseFloat(remarkPrice) > 1) ?remarkPrice.slice(0, -3) : remarkPrice.slice(0, -4)}</GraphHeaderSmallValueText>
                        </GraphHeaderBottomInlineRowContainer>
                        <GraphHeaderBottomInlineRowContainer>
                            <GraphHeaderSmallTitleText>{t("indexPrice")}</GraphHeaderSmallTitleText>
                            <GraphHeaderSmallValueText>{(parseFloat(price) < 0.006 && parseFloat(price) > 0) ? price : (parseFloat(price) < 0.1 && parseFloat(price) > 0.006)  ? price.slice(0, -1) : (parseFloat(price) < 1 && parseFloat(price) > 0.1) ?price.slice(0, -2): (parseFloat(price) < 50 && parseFloat(price) > 1) ?price.slice(0, -3) : price.slice(0, -4)}</GraphHeaderSmallValueText>
                        </GraphHeaderBottomInlineRowContainer>
                        {/* <GraphHeaderBottomInlineRowContainer>
                            <GraphHeaderSmallTitleText>資金費率</GraphHeaderSmallTitleText>
                            <GraphHeaderSmallValueText>0.0193%</GraphHeaderSmallValueText>
                        </GraphHeaderBottomInlineRowContainer> */}
                    </GraphHeaderBottomRowColumnContainer>
                </GraphHeaderBottomRowContainer>
            </GraphHeaderContainer>

            <GraphContainer contentContainerStyle={{paddingBottom:350}}>
                <GraphContentContainer>
                <WebView style={{width:"100%",height:470}}
                 source={{ uri: `https://chart.mahjongshiba.com/?trade=${symbol.replace("-","")}` }}
                />
                </GraphContentContainer>
                <GraphDetailTitleText>{t("orderBook")}</GraphDetailTitleText>
                <GraphDetailRowContainer>
                    <GraphDetailColumnContainer>
                        <GraphDetailBuyLeftTitleText>{t("price")}</GraphDetailBuyLeftTitleText>
                        <GraphDetailBuyLeftTitleText>(USDT)</GraphDetailBuyLeftTitleText>
                    </GraphDetailColumnContainer>
                    {/* <GraphDetailColumnContainer>
                        <GraphDetailBuyMiddleTitleText>數量</GraphDetailBuyMiddleTitleText>
                        <GraphDetailBuyMiddleTitleText>(BTC)</GraphDetailBuyMiddleTitleText>
                    </GraphDetailColumnContainer> */}
                    <GraphDetailColumnContainer>
                        <GraphDetailBuyRightTitleText>{t("amount")}</GraphDetailBuyRightTitleText>
                        <GraphDetailBuyRightTitleText>({trade.split("-")[0]})</GraphDetailBuyRightTitleText>
                    </GraphDetailColumnContainer>
                </GraphDetailRowContainer>

                <GraphDetailContainer>
                    <GraphDetailBuyContainer>

                        {
                            bidsArray.map((x:any) => {
                                return (
                                    <GraphDetailBuyContainer>
                                        <GraphDetailBuyPriceTitleText>{(parseFloat(x[0]) < 0.006 && parseFloat(x[0]) > 0) ? price.slice(0,-2) : (parseFloat(x[0]) < 0.1 && parseFloat(x[0]) > 0.006)  ? x[0].slice(0, -3) : (parseFloat(x[0]) < 1 && parseFloat(x[0]) > 0.1) ? x[0].slice(0, -4): (parseFloat(x[0]) < 50 && parseFloat(x[0]) > 1) ?x[0].slice(0, -5) : x[0].slice(0, -6)}</GraphDetailBuyPriceTitleText>
                                    </GraphDetailBuyContainer>
                                )
                            })
                        }
                    </GraphDetailBuyContainer>
                    {/* <GraphDetailBuyContainer>
                        {
                            bidsArray.map((x:any) => {
                                return (
                                    <GraphDetailBuyContainer>
                                        <GraphDetailBuyDetailText>{x[1].slice(0, -5)}</GraphDetailBuyDetailText>
                                    </GraphDetailBuyContainer>
                                )
                            })
                        }
                    </GraphDetailBuyContainer> */}
                    <GraphDetailBuyContainer>
                        {
                            bidsArray.map((x:any) => {
                                return (
                                    <GraphDetailBuyContainer>
                                        <GraphDetailBuyDetailText>{x[1].slice(0, -5)}</GraphDetailBuyDetailText>
                                    </GraphDetailBuyContainer>
                                )
                            })
                        }
                    </GraphDetailBuyContainer>

                </GraphDetailContainer>
                <GraphDetailPriceRowContainer>
                    <GraphDetailPriceColumnContainer>
                        <GraphDetailPriceLeftTitleText>{t("lastPrice")}</GraphDetailPriceLeftTitleText>
                        <GraphDetailLatestPriceText>{(parseFloat(price) < 10 && parseFloat(price) > 1) ? price.slice(0, -3) : parseFloat(price) < 10 ? price.slice(0, -2) :price.slice(0, -4)}</GraphDetailLatestPriceText>
                    </GraphDetailPriceColumnContainer>
                    <GraphDetailPriceColumnContainer>
                        <GraphDetailPriceRightTitleText>{t("indexPrice")}</GraphDetailPriceRightTitleText>
                        <GraphDetailIndexPriceText>{(parseFloat(price) < 10 && parseFloat(price) > 1) ? price.slice(0, -3) : parseFloat(price) < 10 ? price.slice(0, -2) :price.slice(0, -4)}</GraphDetailIndexPriceText>
                    </GraphDetailPriceColumnContainer>
                </GraphDetailPriceRowContainer>
                <GraphDetailContainer>
                    <GraphDetailSellContainer>
                        {
                            asksArray.map((x:any) => {
                                return (
                                    <GraphDetailSellContainer>
                                        <GraphDetailSellPriceText>{(parseFloat(x[0]) < 0.006 && parseFloat(x[0]) > 0) ? price.slice(0,-2) : (parseFloat(x[0]) < 0.1 && parseFloat(x[0]) > 0.006)  ? x[0].slice(0, -3) : (parseFloat(x[0]) < 1 && parseFloat(x[0]) > 0.1) ? x[0].slice(0, -4): (parseFloat(x[0]) < 50 && parseFloat(x[0]) > 1) ?x[0].slice(0, -5) : x[0].slice(0, -6)}</GraphDetailSellPriceText>
                                    </GraphDetailSellContainer>
                                )
                            })
                        }
                    </GraphDetailSellContainer>
                    {/* <GraphDetailSellContainer>
                        {
                            asksArray.map((x:any) => {
                                return (
                                    <GraphDetailSellContainer>
                                        <GraphDetailSellDetailText>{x[1].slice(0, -5)}</GraphDetailSellDetailText>
                                    </GraphDetailSellContainer>
                                )
                            })
                        }
                    </GraphDetailSellContainer> */}
                    <GraphDetailSellContainer>
                        {
                            asksArray.map((x:any) => {
                                return (
                                    <GraphDetailSellContainer>
                                        <GraphDetailSellDetailText>{x[1].slice(0, -5)}</GraphDetailSellDetailText>
                                    </GraphDetailSellContainer>
                                )
                            })
                        }
                    </GraphDetailSellContainer>
                </GraphDetailContainer>
                {/* <GraphButtonContainer>
                    <GraphOpenPositionButton>
                        <GraphButtonText>開倉</GraphButtonText>
                    </GraphOpenPositionButton>
                    <GraphClosePositionButton>
                        <GraphButtonText>平倉</GraphButtonText>
                    </GraphClosePositionButton>
                </GraphButtonContainer> */}
            </GraphContainer>
        </View>
    );
};

export default GraphPage