import * as React from "react";
import {
    Text,
    TouchableOpacity,
    View,
    Image,
    ScrollView
} from "react-native";
import styled from "styled-components";
import { useState, useEffect } from "react";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import PositionTypeModal from "./PositionTypeModal"
import LeverageModal from "./LeverageModal"
import DepthChart from "./DepthChart"
import CreateFuture from "./CreateFuture"
import PositionList from "./PositionList"
import FutureList from "./FutureList"
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from 'hooks';
import { tradingActions } from 'store/slice';
import { investorService, futureService, marketService } from "services";
import RenderCounter from "components/render-counter"
import SymbolPriceText from "./SymbolPriceText";

const MainSwapPageContainer = styled(View)`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

//Trade Page Header Style
const TradeHeaderContainer = styled(View)`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  margin-top: 24px;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 12px;
`;

const TradeHeaderLeftContainer = styled(View)`
  display: flex;
  flex-direction: row;
  /* justify-content: flex-start; */
  align-items: center;
`;

const TradeHeaderRightContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const TradeHeaderPositionButton = styled(TouchableOpacity)`
  width: 51px;
  height: 26px;
  border-radius: 4px;
  background-color: ${props => props.theme.color.DarkGray};
  margin-right: 8px;
  justify-content: center;
  align-items: center;
`;

const TradeHeaderLeverageButton = styled(TouchableOpacity)`
  width: 51px;
  height: 26px;
  border-radius: 4px;
  background-color: ${props => props.theme.color.DarkGray};
  justify-content: center;
  align-items: center;
`;

const TradeHeaderButtonText = styled(Text)`
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: ${props => props.theme.color.White};
`;

// Trade Page Style
const TradeContainer = styled(ScrollView)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-top: 12px;
  padding-left: 16px;
  padding-right: 16px;
`;

const TradeRowContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

// Trade Page Position Header Style
const TradePositionHeaderContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  height: 40px;
  padding-top: 25px;
`;

const TradePositionHeaderRowContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  padding-top: 4px;
`;

const TradePositionHeaderLeftSwapButton = styled(TouchableOpacity)`
  height: 32px;
  border: none;
`;

const TradePositionHeaderLeftSwapButtonClicked = styled(TouchableOpacity)`
  height: 32px;
  border-bottom-width: 2px;
  border-bottom-color: ${props => props.theme.color.Primary};
`;

const TradePositionHeaderRightSwapButton = styled(TouchableOpacity)`
  height: 32px;
  border: none;
  margin-left: 25px;
`;

const TradePositionHeaderRightSwapButtonClicked = styled(TouchableOpacity)`
  height: 32px;
  border-bottom-width: 2px;
  border-bottom-color: ${props => props.theme.color.Primary};
  margin-left: 25px;
`;

const TradePositionHeaderSwapButtonText = styled(Text)`
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: ${props => props.theme.color.LightMidGray};
`;

const TradePositionHeaderSwapButtonTextClicked = styled(Text)`
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: ${props => props.theme.color.White};
`;

const TradePositionLine = styled(Text)`
  height: 1px;
  background-color: #242d37;
  margin-top: 20px;
`;

const TradePositionHeaderHistoryIcon = styled(Image)`
  width: 24px;
  height: 24px;
`;

const TradePositionHeaderHistoryButton = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  height: 32px;
  border: none;
`;

const TradePositionHeaderHistoryText = styled(Text)`
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: ${props => props.theme.color.White};
`;

const Trading = (props: { symbol: string }) => {
    const { symbol } = props
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const leverage = useAppSelector((state) => state.trading.information.leverage)
    const [visibleModal, setVisibleModal] = useState("");
    const { t } = useTranslation();
    // Function Button
    const [positionView, setPositionView] = useState("Full");
    const [swapPositionView, setSwapPositionView] = useState(0);
    const [fund, setFund] = useState(0);

    const getLeverage = () => {
        investorService.getLeverage(symbol).then((response) => {
            dispatch(tradingActions.setLeverage(response.data))
        }).catch((e) => {
            console.log(e)
        })
    };

    const setLeverage = (leverage: number) => {
        setVisibleModal("")
        futureService.adjustLeverage({
            symbol: symbol,
            leverage: leverage
        }).then(() => dispatch(tradingActions.setLeverage(leverage)))
    };

    const getFundingRate = () => {
        marketService.getFundingRate(symbol).then((response) => {
            const fundingRate = response[symbol]
            if (fundingRate) {
                setFund(parseFloat(fundingRate))
            }
        })
    };

    useEffect(() => {
        getFundingRate()
        getLeverage()
        dispatch(tradingActions.setRequestSymbol(symbol))
    }, [symbol])

    const showModal = (modalName: string) => {
        setVisibleModal(modalName);
    };

    const handleCancel = () => {
        setVisibleModal("");
    };

    return (
        <MainSwapPageContainer>
            <RenderCounter name="Trading" debug={true} />
            <TradeHeaderContainer>
                <TradeHeaderLeftContainer>
                    <SymbolPriceText symbol={symbol}/>
                </TradeHeaderLeftContainer>
                <TradeHeaderRightContainer>
                    <TradeHeaderPositionButton
                        onPress={() => {
                            showModal("positionType");
                        }}
                    >
                        <TradeHeaderButtonText>{t(`position.type.${positionView}`)}</TradeHeaderButtonText>
                    </TradeHeaderPositionButton>
                    <TradeHeaderLeverageButton
                        onPress={() => {
                            showModal("leverage");
                        }}
                    >
                        <TradeHeaderButtonText>
                            {leverage}X
                        </TradeHeaderButtonText>
                    </TradeHeaderLeverageButton>
                </TradeHeaderRightContainer>
            </TradeHeaderContainer>
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "flex-end",
                    paddingRight: 16
                }}
            >
                <Text style={{ color: "white", fontSize: 12 }}>
                    {t("fundingRate")} {fund != 0 ? (fund * 100).toFixed(4) : fund} %
                </Text>
            </View>

            <TradeContainer>
                <TradeRowContainer>
                    <DepthChart symbol={symbol} />
                    <CreateFuture symbol={symbol} />
                </TradeRowContainer>
                {
                    swapPositionView === 0 ? (
                        <TradePositionHeaderContainer>
                            <TradePositionHeaderRowContainer>
                                <TradePositionHeaderLeftSwapButtonClicked
                                    onPress={() => {
                                        setSwapPositionView(0);
                                    }}
                                >
                                    <TradePositionHeaderSwapButtonTextClicked>
                                        {t("activePosition")}
                                    </TradePositionHeaderSwapButtonTextClicked>
                                </TradePositionHeaderLeftSwapButtonClicked>
                                <TradePositionHeaderRightSwapButton
                                    onPress={() => {
                                        setSwapPositionView(1);
                                    }}
                                >
                                    <TradePositionHeaderSwapButtonText>
                                        {t("activeOrder")}
                                    </TradePositionHeaderSwapButtonText>
                                </TradePositionHeaderRightSwapButton>
                            </TradePositionHeaderRowContainer>
                            <TradePositionHeaderHistoryButton
                                onPress={() => {
                                    navigation.navigate("HistoryScreen");
                                }}
                            >
                                <TradePositionHeaderHistoryIcon
                                    source={require("assets/images/trade/order.png")}
                                />
                                <TradePositionHeaderHistoryText>
                                    {t("orderHistory")}
                                </TradePositionHeaderHistoryText>
                            </TradePositionHeaderHistoryButton>
                        </TradePositionHeaderContainer>
                    ) :
                        (
                            <TradePositionHeaderContainer>
                                <TradePositionHeaderRowContainer>
                                    <TradePositionHeaderLeftSwapButton
                                        onPress={() => {
                                            setSwapPositionView(0);
                                        }}
                                    >
                                        <TradePositionHeaderSwapButtonText>
                                            {t("activePosition")}
                                        </TradePositionHeaderSwapButtonText>
                                    </TradePositionHeaderLeftSwapButton>
                                    <TradePositionHeaderRightSwapButtonClicked
                                        onPress={() => {
                                            setSwapPositionView(1);
                                        }}
                                    >
                                        <TradePositionHeaderSwapButtonTextClicked>
                                            {t("activeOrder")}
                                        </TradePositionHeaderSwapButtonTextClicked>
                                    </TradePositionHeaderRightSwapButtonClicked>
                                </TradePositionHeaderRowContainer>
                                <TradePositionHeaderHistoryButton
                                    onPress={() => {
                                        navigation.navigate("HistoryScreen");
                                    }}
                                >
                                    <TradePositionHeaderHistoryIcon
                                        source={require("assets/images/trade/order.png")}
                                    />
                                    <TradePositionHeaderHistoryText>
                                        {t("orderHistory")}
                                    </TradePositionHeaderHistoryText>
                                </TradePositionHeaderHistoryButton>
                            </TradePositionHeaderContainer>
                        )
                }
                <TradePositionLine></TradePositionLine>
                {
                    swapPositionView === 0 ? (
                        <PositionList symbol={symbol} />
                    ) : (
                        <FutureList symbol={symbol} />
                    )
                }
            </TradeContainer>
            <>
                <PositionTypeModal visible={visibleModal === "positionType"} positionType="FULL" onCancel={handleCancel} />
                <LeverageModal visible={visibleModal === "leverage"} onCancel={handleCancel} onFinish={setLeverage} />
            </>
        </MainSwapPageContainer>
    );
}

export default Trading