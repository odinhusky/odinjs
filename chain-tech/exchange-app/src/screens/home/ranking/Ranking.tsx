import React, { useState } from "react";
import { useAppSelector } from "hooks"
import {  View, TouchableOpacity, Text, ScrollView } from "react-native";
import { useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';

interface RankingSymbol {
    percentChange: number
    key: string
    lastPrice: string
    volume: string
}

interface RankingProps {
    direction: boolean
}

const Ranking = (props: RankingProps)=>{
    const navigation = useNavigation();
    const { direction } = props
    const focus = useIsFocused();
    const market = useAppSelector((state)=> focus ? state.market.price : "")
    const [ sortedSymbols, setSortedSymbols ] = useState([] as RankingSymbol[])

    useFocusEffect(
        React.useCallback(() => {
            if ( market ){
                const rankingSymbol: RankingSymbol[] = market.map( (p: MarketPrice) => {
                    const item = {
                        percentChange: parseFloat(p.P),
                        key: p.s,
                        lastPrice: p.c,
                        volume: p.v
                    }
                    return item;
                })
                if (direction){
                    setSortedSymbols(rankingSymbol.filter( (p: RankingSymbol) => p.percentChange > 0 ).sort( (a,b) => b.percentChange-a.percentChange))
                }
                else {
                    setSortedSymbols(rankingSymbol.filter( (p: RankingSymbol) => p.percentChange < 0 ).sort( (a,b) => a.percentChange-b.percentChange))
                }
            }
        }, [market, direction])
    );

    const getPrice = (price: string) => {
        const priceFloat: number = parseFloat(price)
        return ( priceFloat < 0.006 && priceFloat > 0) ? price : (priceFloat < 0.1 && priceFloat > 0.006) ? price.slice(0, -1) : (priceFloat < 1 && priceFloat > 0.1) ? price.slice(0, -2): (priceFloat < 50 && priceFloat > 1) ? price.slice(0, -3) : price.slice(0, -4)
    }

    return (
        <ScrollView contentContainerStyle={{}}>
            {
                sortedSymbols.map((symbol: RankingSymbol)=>{
                    return (
                        <TouchableOpacity
                            key={symbol.key}
                            style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 12, alignItems: "center" }} 
                            onPress={()=>{
                                navigation.navigate("Root", { screen: 'Trade', params: { screen: 'TradeScreen', params: { symbol: symbol.key } }})
                            }}
                        >
                        <Text style={{ color: "#F4F5F6", fontSize: 15, fontWeight: "400" }}>{symbol.key}</Text>
                        <View style={{ display: "flex", flexDirection: "row" }}>
                            <View style={{ marginRight: 40, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                            <Text style={{ color: "#F4F5F6", fontSize: 15, fontWeight: "400" }}>{getPrice(symbol.lastPrice)}</Text>
                            <Text style={{ color: "#8D97A2", fontSize: 12, fontWeight: "400" }}>{symbol.volume}</Text>
                            </View>
                            <View style={{ width: 88, display: "flex", flexDirection: "row", justifyContent: "center", backgroundColor: direction ? "#2FB364" : "#FB4C51", borderRadius: 4, alignItems: "center" }}>
                                <Text style={{ color: "white" }}>{`${direction ? "+" : ""}${symbol.percentChange}%`}</Text>
                            </View>
                        </View>
                        </TouchableOpacity> 
                    )
                })
            }
        </ScrollView>
    );
}

export default Ranking