import React, {
    useEffect,
    useState
} from "react";
import { useAppSelector } from "hooks"
import { View, TouchableOpacity, Text } from "react-native";

// ? Self-packed Components || Functions
import { theme } from "constants/Theme";

// ^ Plugins
import { find } from "lodash"
import { useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';

// = Style Component
import styled from "styled-components";

const TradingPair = styled(View)`
  width: 100%;
`;

const Header = styled(View)`
  width: 100%;
  margin-bottom: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const HeaderText = styled(Text)`
  font-size: 12px;
  color: ${theme.White};
`;

const Content = styled(Text)`
  width: 100%;
  font-size: 20px;
  color: ${theme.White};
  margin-bottom: 8px;
`;

const Foot = styled(Text)`
  width: 100%;
  font-size: 14px;
  color: ${theme.White}
`;

// ? Interface
interface TradingPairBoxProps {
    coin: string,
    styleObj?: object
}

/**
 * @author odin
 * @level screens/home/TradingPairBox
 * @component TradingPairBox
 * @description Trading pair with text description with box shape
*/
const TradingPairBox = (props: TradingPairBoxProps) => {

    // $ init data
    const { coin } = props;
    const focus = useIsFocused();
    const navigation = useNavigation();

    const market = useAppSelector((state) => focus ? state.market.price : "")

    // # states
    const [symbol, _] = useState({
        base: coin,
        name: `${coin.toUpperCase()}-USDT`,
        id: `${coin.toUpperCase()}USDT`
    });

    const [price, setPrice] = useState({
        last: "",
        rate: "",
        amt: "",
    });
    // - methods

    useFocusEffect(
        React.useCallback(() => {
            const coinPrice = market && find(market, function (o) { return o.s == symbol.name })
            if (coinPrice) {
                setPrice({
                    last: (parseFloat(coinPrice.c) < 0.006 && parseFloat(coinPrice.c) > 0)
                        ? coinPrice.c
                        : (parseFloat(coinPrice.c) < 0.1 && parseFloat(coinPrice.c) > 0.006)
                            ? coinPrice.c.slice(0, -1)
                            : (parseFloat(coinPrice.c) < 1 && parseFloat(coinPrice.c) > 0.1)
                                ? coinPrice.c.slice(0, -2)
                                : (parseFloat(coinPrice.c) < 50 && parseFloat(coinPrice.c) > 1)
                                    ? coinPrice.c.slice(0, -3)
                                    : coinPrice.c.slice(0, -4),
                    rate: coinPrice.P,
                    amt: coinPrice.v.split(".")[0]
                })
            }
        }, [market])
    );

    // & handled data
    const priceColor = Number(price.rate) >= 0 ? theme.Secondary : theme.SecondaryLight;

    return (

        <TouchableOpacity
            style={{ width: '30%' }}
            onPress={() => {
                navigation.navigate("Root", { screen: 'Trade', params: { screen: 'TradeScreen', params: { symbol: symbol.name } } })
            }}
        >
            <TradingPair>
                <Header>
                    <HeaderText style={{ marginRight: 6 }}>{symbol.name}</HeaderText>
                    <HeaderText style={{ color: priceColor }}>{`${price.rate}%`}</HeaderText>
                </Header>

                <Content style={{ color: priceColor }}>{price.last}</Content>

                <Foot>{`= ${price.last} USD`}</Foot>
            </TradingPair>
        </TouchableOpacity>
    );
}

export default TradingPairBox;