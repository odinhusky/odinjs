import React, { useEffect, useState } from 'react'
import { useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Text, View, TouchableOpacity, Image, ScrollView } from "react-native";
import { useAppSelector, useAppDispatch } from "hooks"
import { userActions } from 'store/slice';
import { useTranslation } from "react-i18next";
import { Images } from "components/Images"
import styled from "styled-components";
import { parsePrice } from 'utils/parse';
import InvestorService from 'services/investor.service';
import RenderCounter from "components/render-counter"

const ColumnText = styled(Text)`
  font-size: 12px;
  color: ${props => props.theme.color.MidGray};
`;

interface FavoriteSymbolProps {
    all: boolean
    condition: string
}

interface SymbolInfo {
    name: string
    volume: string
    current: string
    change: string
    isPicked: boolean
}

const SymbolList = (props: FavoriteSymbolProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch()
    const { all, condition } = props;
    const navigation = useNavigation();
    const [symbolsInfo, setSymbolsInfo] = useState([] as SymbolInfo[]);
    const focus = useIsFocused();
    const market = useAppSelector((state) => focus ? state.market.price : "")
    const { favorite, token } = useAppSelector((state) => state.user)
    useFocusEffect(
        React.useCallback(() => {
            if (market) {
                setSymbolsInfo(market.filter(price => price.s.includes(condition)).map(price => {
                    return {
                        name: price.s,
                        volume: price.v,
                        current: price.c,
                        change: price.P,
                        isPicked: favorite.includes(price.s)
                    } as SymbolInfo
                }))
            }
        }, [market])
    )

    const getFavorite = () => {
        InvestorService.getFavoriteSymbol().then((response) => {
            dispatch(userActions.setFavorite(response.data))
        })
    }

    useEffect(() => {
        getFavorite()
    }, [])

    return (
        <View>
            <RenderCounter name="SymbolList" debug={false} />
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}
            >
                <ColumnText>{t("marketPair")}</ColumnText>

                <View style={{ display: "flex", flexDirection: "row" }}>
                    <ColumnText style={{ marginRight: 40 }}>{t("price")}/{t("vol")}</ColumnText>
                    <View
                        style={{
                            width: 88,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-end"
                        }}
                    >
                        <ColumnText>{t("24Hchg")}</ColumnText>
                    </View>
                </View>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 180 }}>
                {
                    favorite.length === 0 && !all && (
                        <Text
                            style={{
                                color: "#FFFFFF",
                                fontWeight: "600",
                                fontSize: 18,
                                marginTop: 20
                            }}
                        >
                            {t("noneFavorite")}
                        </Text>
                    )
                }
                {
                    symbolsInfo.filter(s => s.isPicked || all).map(symbolInfo => {
                        return (
                            <TouchableOpacity
                                key={symbolInfo.name}
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    marginTop: 24,
                                    alignItems: "center"
                                }}
                                onPress={() => {
                                    navigation.navigate("Root", { screen: 'Trade', params: { screen: 'TradeScreen', params: { symbol: symbolInfo.name } } })
                                }}
                            >
                                <View
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center"
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            if (symbolInfo.isPicked) {
                                                dispatch(userActions.removeFavorite(symbolInfo.name))
                                                InvestorService.deleteFavoriteSymbol({ symbol: symbolInfo.name }).then(() => {
                                                })
                                            } else {
                                                dispatch(userActions.addFavorite(symbolInfo.name))
                                                InvestorService.addFavoriteSymbol({ symbol: symbolInfo.name }).then(() => {
                                                })
                                            }
                                        }}
                                    >
                                        {
                                            token !== "" && <Image source={Images[symbolInfo.isPicked ? "star-full" : "star-empty"]} style={{ width: 24, height: 24, marginRight: 5 }}
                                            />
                                        }
                                    </TouchableOpacity>
                                    <Text
                                        style={{
                                            color: "#F4F5F6",
                                            fontSize: 15,
                                            fontWeight: "400"
                                        }}
                                    >
                                        {symbolInfo.name}
                                    </Text>
                                </View>
                                <View style={{ display: "flex", flexDirection: "row" }}>
                                    <View
                                        style={{
                                            marginRight: 40,
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-end"
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: "#F4F5F6",
                                                fontSize: 15,
                                                fontWeight: "400"
                                            }}
                                        >
                                            {parsePrice(symbolInfo.current)}
                                        </Text>
                                        <Text
                                            style={{
                                                color: "#8D97A2",
                                                fontSize: 12,
                                                fontWeight: "400"
                                            }}
                                        >
                                            {symbolInfo.volume}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            width: 88,
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "center",
                                            backgroundColor: parseFloat(symbolInfo.change) > 0 ? "#2FB364" : "#FB4C51",
                                            borderRadius: 4,
                                            alignItems: "center"
                                        }}
                                    >
                                        <Text style={{ color: "white" }}>{`${parseFloat(symbolInfo.change) > 0 ? "+" : ""}${symbolInfo.change}%`}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                }
            </ScrollView>
        </View>
    )
}

export default SymbolList