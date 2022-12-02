import React, { useContext, useEffect, useState } from "react";
import { useAppSelector } from "hooks"
import {  View, TouchableOpacity, Text, Image } from "react-native";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Images } from "components/Images"
import {find} from "lodash"

const GrayHeader = styled(View)`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 52px;
  background-color: ${props => props.theme.color.DarkGray};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  align-items: center;
  padding-left:16px;
`;

const GrayText = styled(Text)`
  font-size: 13px;
  color: ${props => props.theme.color.ExtraLightGray};
  margin-left:12px;
  font-weight:600;
`;

const IconImg = styled(Image)`
  width: 28px;
  height:28px;
`

const PriceText = styled(Text)`
  font-size: 20px;
  color: white;
  font-weight: 700;
`;

const USDText = styled(Text)`
  font-size: 12px;
  color: ${props => props.theme.color.LightMidGray};
  margin-top:4px;
`;

const PercentText = styled(Text)`
  font-size: 32px;
  color: ${props => props.theme.color.Secondary};
  font-weight: 700;

`;

const RedPercentText = styled(Text)`
  font-size: 32px;
  color: ${props => props.theme.color.SecondaryLight};
  font-weight: 700;

`;
// not use component
const SymbolBox = ( props ) => {
    const { navigation, coin } = props;
    const { t } = useTranslation();
    const market = useAppSelector((state)=>state.market.price)

    const [ symbol, _ ] = useState({
        base: coin,
        name: `${coin.toUpperCase()}-USDT`,
        id: `${coin.toUpperCase()}USDT`
    });

    const [ price, setPrice ] = useState({
      last: "",
      rate: "",
      amt: "",
    });

    useEffect(()=>{
      const coinPrice = find(market, function (o) { return o.s == symbol.name })
      if ( coinPrice ){
        setPrice({
          last: (parseFloat(coinPrice.c) < 0.006 && parseFloat(coinPrice.c) > 0) ? coinPrice.c : (parseFloat(coinPrice.c) < 0.1 && parseFloat(coinPrice.c) > 0.006) ? coinPrice.c.slice(0, -1) : (parseFloat(coinPrice.c) < 1 && parseFloat(coinPrice.c) > 0.1) ? coinPrice.c.slice(0, -2) : (parseFloat(coinPrice.c) < 50 && parseFloat(coinPrice.c) > 1) ? coinPrice.c.slice(0, -3) : coinPrice.c.slice(0, -4),
          rate: coinPrice.P,
          amt: coinPrice.v.split(".")[0]
        })
      }
    },[market])

    return (
        <TouchableOpacity 
          style={{ width: "100%", borderRadius: 8, backgroundColor: "#242D37",marginBottom:10 }}  
          onPress={()=>{
            navigation.navigate("Root", { screen: 'Trade', params: { symbol: symbol.name } as any }) 
          }}
        >
          <GrayHeader>
            <IconImg source={Images[coin]} />
            <GrayText>{t(`coin.${symbol.name}`)}{symbol.name}</GrayText>
          </GrayHeader>
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 16 }}>
            <View>
              <PriceText>{price.last}</PriceText>
              <USDText>≈ {price.last} USD</USDText>
            </View>
            {parseFloat(price.rate) > 0 ? <PercentText>{"+"+price.rate}%</PercentText> : <RedPercentText>{price.rate}%</RedPercentText>}
          </View>
        </TouchableOpacity>
    );
}

export default SymbolBox;