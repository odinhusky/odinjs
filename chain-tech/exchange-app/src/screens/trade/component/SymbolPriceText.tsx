import * as React from "react";
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    Alert,
    StyleSheet,
} from "react-native";
import styled from "styled-components";
import { useState, useEffect } from "react";
import SmallSliderContainer from "components/trade/SmallSlider";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import FutureTypeModal from "./FutureTypeModal"
import { Theme } from "constants/Theme";
import { useAppDispatch, useAppSelector } from 'hooks';
import { tradingActions } from "store/slice";
import { getAvailableQuantityTrunk } from "store/slice/trading";
import { investorService, futureService } from "services";
import { ContractSide } from "common/types";
import RenderCounter from "components/render-counter";
import { useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';

const TradeHeaderLeftContainer = styled(View)`
  display: flex;
  flex-direction: row;
  /* justify-content: flex-start; */
  align-items: center;
`;

const IconImg = styled(Image)`
  width: 24px;
  height: 24px;
`;

const TradeHeaderTitleText = styled(Text)`
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: ${props => props.theme.color.White};
`;

const PercentText = styled(Text) <{ isPositive: boolean }>`
    margin-left: 5px;
    font-size: 12px;
    color: ${props => props.isPositive ? props.theme.color.Secondary : props.theme.color.SecondaryLight};
    font-weight: 700;
`;

const SymbolPriceText = (props: { symbol: string }) => {
    const navigation = useNavigation();
    const { symbol } = props
    const focus = useIsFocused()
    const market = useAppSelector((state) => focus ? state.market.price : "")
    const [percent, setPercent]=useState("")
    useFocusEffect(
        React.useCallback(() => {
            if (market) {
                const remark = _.find(market, (o: MarketPrice) => {
                    return o.s === symbol;
                });
                setPercent((remark as MarketPrice).P);
            }
        }, [market, symbol])
    );

    return (
        <>
            <RenderCounter name={"PriceText"} debug={true} />
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate("AllTradeScreen");
                }}
            >
                <IconImg source={require("assets/images/trade/search.png")} />
            </TouchableOpacity>
            <TradeHeaderTitleText>{symbol}</TradeHeaderTitleText>
            <PercentText isPositive={parseFloat(percent)>=0}>{`${percent}%`}</PercentText>
        </>
    )
}

export default SymbolPriceText