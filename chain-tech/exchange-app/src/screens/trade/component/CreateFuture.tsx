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
import { useFocusEffect } from '@react-navigation/native';

// Trade Page Function Style
const TradeFunctionContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 50%;
  padding-left: 8px;
`;

const TradeFunctionColumnContainer = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TradeFunctionPriceOption = styled(TouchableOpacity)`
  height: 36px;
  border-radius: 4px;
  background-color: #242d37;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 12px;
  padding-right: 8px;
  margin-top: 2;
`; // Input Select

const TradeFunctionPriceOptionText = styled(Text)`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  color: ${props => props.theme.color.White};
`;

const TradeFunctionPriceOptionIcon = styled(Image)`
  width: 20px;
  height: 20px;
`;

const TradeFunctionPriceInputContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 2;
`;

const TradeFunctionPriceInputRightContainer = styled(View)`
  height: 36px;
  width: 30%;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  background-color: #242d37;
  justify-content: center;
  align-items: center;
`;

const TradeFunctionPriceInputRightText = styled(Text)`
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: ${props => props.theme.color.ExtraLightGray};
`;

const TradeFunctionPositionViewContainer = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const TradeFunctionPositionViewTitleText = styled(Text)`
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: ${props => props.theme.color.MidGray};
`;

const TradeFunctionPositionViewValueText = styled(Text)`
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: ${props => props.theme.color.White};
`;

const TradeFunctionBuySellButtonText = styled(Text)`
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: ${props => props.theme.color.White};
`;

const styles = StyleSheet.create({
    container: {
        "display": "flex",
        "flexDirection": "row",
        "justifyContent": "center",
        "alignItems": "flex-end"
    },
    checked: {
        width: "50%",
        height: 30,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Theme.color.DarkGray,
    },
    unChecked: {
        "width": "50%",
        "height": 30,
        "borderWidth": 1,
        "borderColor": Theme.color.DarkGray,
        "borderStyle": "solid",
        "borderTopLeftRadius": 4,
        "borderBottomLeftRadius": 4,
        "justifyContent": "center",
        "alignItems": "center"
    },
    checkedText: {
        fontWeight: "400",
        fontSize: 12,
        lineHeight: 18,
        color: Theme.color.White
    },
    unCheckedText: {
        "fontWeight": "400",
        "fontSize": 12,
        "lineHeight": 18,
        "color": Theme.color.MidGray
    },
    input: {
        backgroundColor: "#242D37",
        width: "70%",
        height: 36,
        color: "#F4F5F6",
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        paddingLeft: 12
    }
});


const CreateFuture = (props: { symbol: string }) => {
    const { symbol } = props
    const [visibleModal, setVisibleModal] = useState("");
    const { t } = useTranslation();
    const [swapCurrency, setSwapCurrency] = useState(0);
    const [loading, setLoading] = useState(false);
    const [coin, setCoin] = useState("")
    const [priceText, setPriceText] = useState("")
    const { availableBalance, availableQuantity, leverage } = useAppSelector((state) => state.trading.information)
    const request = useAppSelector((state) => state.trading.request)
    // const focus = useIsFocused();
    // const market = useAppSelector((state)=> focus ? state.market.price : "")
    const dispatch = useAppDispatch()
    const showModal = (modalName: string) => {
        setVisibleModal(modalName);
    };

    const handleCancel = () => {
        setVisibleModal("");
    };

    const isLimit = (futureType: string) => {
        return futureType === "LIMIT" || futureType === "STOP_LIMIT";
    }

    const isStop = (futureType: string) => {
        return futureType === "STOP_MARKET" || futureType === "STOP_LIMIT";
    }

    const createFuture = () => {
        if (!request.price && isLimit(request.type)) {
            Alert.alert("請輸入價格"); //translate
        }
        else if (!request.stopPrice && isStop(request.type)) {
            Alert.alert("請輸入觸發價"); //translate
        }
        else if (!request.origQty) {
            Alert.alert(t("fiatSellQty"));
        }
        else {
            setLoading(true);
            futureService.openOrder(request).then(() => {
                dispatch(tradingActions.cleanRequest())
                dispatch(getAvailableQuantityTrunk({
                    symbol: symbol,
                    side: request.side
                }))
                setPriceText("")
            }).finally(() => {
                setLoading(false);
            })
        }
    }
    const getAvailable = () => {
        investorService.getAvailableBalance().then((response) => {
            dispatch(tradingActions.setAvailableBalance(response.data))
        }).catch((error) => {
            console.log(error.response.data)
        })
        dispatch(getAvailableQuantityTrunk({
            symbol: symbol,
            side: request.side
        }))
    }

    const setSide = (side: ContractSide) => {
        dispatch(tradingActions.setRequestSide(side))
    }

    useEffect(() => {
        setCoin(symbol ? symbol.replace("-USDT", "") : "");
        dispatch(tradingActions.cleanRequest())
        
        setPriceText("")

    }, [symbol])

    useFocusEffect(
        React.useCallback(() => {
            const availableTimer = setInterval(()=>{
                getAvailable()
            }, 1000)
    
            return ()=> clearInterval(availableTimer)
        }, [symbol])
    );

    useEffect(() => {
        setPriceText("")
    }, [request.type])

    return (
        <TradeFunctionContainer>
            <RenderCounter name="CreateFeature" debug={false} />
            <>
                <FutureTypeModal visible={visibleModal === "futureType"} onCancel={handleCancel} />
            </>
            <TradeFunctionColumnContainer>
                <View style={styles.container}>
                    <TouchableOpacity
                        onPress={() => setSide("BUY")}
                        style={request.side === "BUY" ? styles.checked : styles.unChecked}
                    >
                        <Text style={request.side === "BUY" ? styles.checkedText : styles.unCheckedText}>
                            {t(`future.side.BUY`)}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setSide("SELL")}
                        style={request.side === "SELL" ? styles.checked : styles.unChecked}
                    >
                        <Text style={request.side === "SELL" ? styles.checkedText : styles.unCheckedText}>
                            {t(`future.side.SELL`)}
                        </Text>
                    </TouchableOpacity>
                </View>
                <TradeFunctionPriceOption onPress={() => showModal("futureType")}>
                    <TradeFunctionPriceOptionText>{t(`future.type.${request.type}`)}</TradeFunctionPriceOptionText>
                    <TradeFunctionPriceOptionIcon source={require("assets/images/trade/dropdown.png")} />
                </TradeFunctionPriceOption>
                {(request.type === "STOP_LIMIT" || request.type === "STOP_MARKET") && (
                    <TradeFunctionPriceInputContainer>
                        <TextInput
                            placeholder={t("conditionPrice")}
                            value={request.stopPrice ? `${request.stopPrice}` : ""}
                            onChangeText={stopPrice => dispatch(tradingActions.setRequestStopPrice(parseFloat(stopPrice)))}
                            placeholderTextColor={"#8D97A2"}
                            autoCorrect={false}
                            keyboardType={"decimal-pad"}
                            style={styles.input}
                        />
                        <TradeFunctionPriceInputRightContainer>
                            <TradeFunctionPriceInputRightText>USDT</TradeFunctionPriceInputRightText>
                        </TradeFunctionPriceInputRightContainer>
                    </TradeFunctionPriceInputContainer>
                )}
                <TradeFunctionPriceInputContainer>
                    <TextInput
                        placeholder={isLimit(request.type) ? t("price") : t("marketOrder")}
                        value={priceText}
                        onChangeText={value => {
                            if (isLimit(request.type)) {
                                setPriceText(value)
                                const price = value ? parseFloat(value) : null
                                dispatch(tradingActions.setRequestPrice(price))
                            }
                            else {
                                dispatch(tradingActions.setRequestPrice(null))
                            }
                        }}
                        placeholderTextColor={request.type === "MARKET" ? "#FFFFFF" : "#8D97A2"}
                        editable={isLimit(request.type) ? true : false}
                        autoCorrect={false}
                        keyboardType={"decimal-pad"}
                        style={styles.input}
                    />
                    <TradeFunctionPriceInputRightContainer>
                        <TradeFunctionPriceInputRightText>
                            USDT
                        </TradeFunctionPriceInputRightText>
                    </TradeFunctionPriceInputRightContainer>
                </TradeFunctionPriceInputContainer>
                <View style={styles.container}>
                    <TouchableOpacity
                        onPress={() => setSwapCurrency(0)}
                        style={swapCurrency === 0 ? styles.checked : styles.unChecked}
                    >
                        <Text style={swapCurrency === 0 ? styles.checkedText : styles.unCheckedText}>{coin}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setSwapCurrency(1)}
                        style={swapCurrency === 1 ? styles.checked : styles.unChecked}
                    >
                        <Text style={swapCurrency === 1 ? styles.checkedText : styles.unCheckedText}>USDT</Text>
                    </TouchableOpacity>
                </View>
                <SmallSliderContainer
                    isBaseUsdt={swapCurrency === 1}
                    symbol={symbol}
                />
                <TradeFunctionPositionViewContainer>
                    <TradeFunctionPositionViewTitleText>{t("availableU")}</TradeFunctionPositionViewTitleText>
                    <TradeFunctionPositionViewValueText>{availableBalance*leverage} USDT</TradeFunctionPositionViewValueText>
                </TradeFunctionPositionViewContainer>
                <TradeFunctionPositionViewContainer>
                    <TradeFunctionPositionViewTitleText>{t("availableQ")}</TradeFunctionPositionViewTitleText>
                    <TradeFunctionPositionViewValueText>
                        {availableQuantity}{" "}
                        {coin}
                    </TradeFunctionPositionViewValueText>
                </TradeFunctionPositionViewContainer>
                <TradeFunctionPositionViewContainer>
                    <TouchableOpacity
                        disabled={loading}
                        onPress={() => createFuture()}
                        style={{
                            "width": "100%",
                            "height": 38,
                            "borderRadius": 4,
                            "backgroundColor": request.side === "BUY" ? Theme.color.Secondary : Theme.color.SecondaryLight,
                            "alignItems": "center",
                            "justifyContent": "center",
                            "marginTop": 5
                        }}
                    >
                        <TradeFunctionBuySellButtonText>{`開倉${t(`future.side.${request.side}`)}`}</TradeFunctionBuySellButtonText>
                    </TouchableOpacity>
                </TradeFunctionPositionViewContainer>
            </TradeFunctionColumnContainer>
        </TradeFunctionContainer>
    )
}

export default CreateFuture