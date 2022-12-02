import * as React from "react";
import {
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    useSafeAreaInsets
} from "react-native-safe-area-context";
import styled from "styled-components";
import { RootStackScreenProps } from "common/types";
import { useState } from "react";
import GraphPage from "components/trade/GraphPage";
import Spinner from "react-native-loading-spinner-overlay";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import Trading from "./component/Trading"

const Container = styled(View) <{ insets: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: ${props => props.insets}px;
  background-color: #18222d;
`;

// Header Style
const SwapContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 11px;
`;

const SwapTradeButton = styled(TouchableOpacity)`
  width: 50%;
  height: 30px;
  border: 1px solid ${props => props.theme.color.DarkGray};
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  justify-content: center;
  align-items: center;
`;

const SwapTradeButtonClicked = styled(TouchableOpacity)`
  width: 50%;
  height: 30px;
  background-color: ${props => props.theme.color.DarkGray};
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  justify-content: center;
  align-items: center;
`;

const SwapGraphButton = styled(TouchableOpacity)`
  width: 50%;
  height: 30px;
  border: 1px solid ${props => props.theme.color.DarkGray};
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  justify-content: center;
  align-items: center;
`;

const SwapGraphButtonClicked = styled(TouchableOpacity)`
  width: 50%;
  height: 30px;
  background-color: ${props => props.theme.color.DarkGray};
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  justify-content: center;
  align-items: center;
`;

const SwapButtonText = styled(Text)`
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: ${props => props.theme.color.MidGray};
`;

const SwapButtonClickedText = styled(Text)`
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: ${props => props.theme.color.White};
`;

const TradeScreen = ({ route }: RootStackScreenProps<"TradeScreen">) => {

    const insets = useSafeAreaInsets();
    // Swap Page
    const [swapIndex, setSwapIndex] = useState(0);
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    return (
        <Container insets={insets.top}>
            {loading && <Spinner visible={true} textContent={""} />}
            {swapIndex === 0 ? (
                <SwapContainer>
                    <SwapTradeButtonClicked
                        onPress={() => {
                            setSwapIndex(0);
                        }}
                    >
                        <SwapButtonClickedText>{t("trade")} </SwapButtonClickedText>
                    </SwapTradeButtonClicked>
                    <SwapGraphButton
                        onPress={() => {
                            setSwapIndex(1);
                        }}
                    >
                        <SwapButtonText>{t("charts")}</SwapButtonText>
                    </SwapGraphButton>
                </SwapContainer>
            ) : (
                <SwapContainer>
                    <SwapTradeButton
                        onPress={() => {
                            setSwapIndex(0);
                        }}
                    >
                        <SwapButtonText>{t("trade")} </SwapButtonText>
                    </SwapTradeButton>
                    <SwapGraphButtonClicked
                        onPress={() => {
                            setSwapIndex(1);
                        }}
                    >
                        <SwapButtonClickedText>{t("charts")}</SwapButtonClickedText>
                    </SwapGraphButtonClicked>
                </SwapContainer>
            )}
            {
                swapIndex === 0 ? <Trading symbol={route.params ? route.params.symbol : "BTC-USDT"} /> : (
                    <GraphPage
                        trade={route.params ? route.params.symbol : "BTC-USDT"}
                        symbol={route.params ? route.params.symbol : "BTC-USDT"}
                    />
                )
            }
        </Container>
    );
};


export default TradeScreen;
