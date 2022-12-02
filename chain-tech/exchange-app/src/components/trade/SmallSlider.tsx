import React, { useState } from "react";
import { View, TextInput, Text } from "react-native"
// import { Slider } from '@miblanchard/react-native-slider';
import styled from "styled-components"
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Slider from "@react-native-community/slider";
import { useAppSelector, useAppDispatch, useGetPrice } from "hooks";
import { tradingActions } from "store/slice";
import RenderCounter from "components/render-counter";
const Container = styled(View)`
display: flex;
flex-direction: column;

`;

const TradeFunctionNumberInputContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
padding-bottom: 18px;
margin-top:2;

`;

const TradeFunctionNumberInputRightContainer = styled(View)`
height: 36px;
width: 30%;
border-top-right-radius: 4px;
border-bottom-right-radius: 4px;
background-color: #242D37;
justify-content: center;
align-items: center;
`;

const TradeFunctionNumberInputRightText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 15px;
color: ${props => props.theme.color.ExtraLightGray};
`;

interface SliderProps {
    isBaseUsdt: boolean
    symbol: string
}

const SliderContainer = (props: SliderProps) => {
    const { isBaseUsdt, symbol } = props;
    const dispatch = useAppDispatch()
    const { leverage, availableBalance, availableQuantity} = useAppSelector((state)=> state.trading.information)
    const { origQty } = useAppSelector((state)=>state.trading.request)
    const marketPrice = useGetPrice(symbol)
    const [quantity, setQuantity] = React.useState(0);
    const [userInput,setUserInput] = useState("")
    const { t } = useTranslation();
    // buy 2000U, 100x leverage buy market price ETH(2000) => 2000U x 100 / 2000
    const setOrigQty = (finalQuantity: number) => {
        setQuantity(finalQuantity)
        const {c} = marketPrice.selected
        const price = parseFloat( c ?? "0" )
        if ( price ) {
            const origQty = isBaseUsdt ? (finalQuantity / price) : finalQuantity
            dispatch(tradingActions.setRequestOrigQty(origQty))
        }
    }

    useEffect(() => {
        setQuantity(0)
        setUserInput("")
    },[isBaseUsdt, symbol])

    useEffect(() => {
        if ( origQty===0 ){
            setQuantity(0)
            setUserInput("")
        }
    },[origQty])

    return (
        <Container>
            <RenderCounter name="SliderContainer" debug={false}/>
            <TradeFunctionNumberInputContainer>
                <TextInput
                    placeholder={t("amount")}
                    value={userInput}
                    onChangeText={(value) => {
                        setUserInput(value)
                        const finalQuantity = value ? parseFloat(value) : 0
                        if (finalQuantity===NaN){
                            return
                        }

                        const maxValue = isBaseUsdt ? availableBalance : availableQuantity
                        if (value==="."){
                            setUserInput("")
                            return
                        }
                        
                        if ( finalQuantity>maxValue ){
                            setOrigQty(maxValue)
                            setUserInput(maxValue.toString())
                        }
                        else {
                            setOrigQty(finalQuantity)
                        }
                    }}
                    placeholderTextColor={'#8D97A2'}
                    keyboardType={"decimal-pad"}
                    style={{ backgroundColor: '#242D37', width: '70%', height: 36, color: '#F4F5F6', borderTopLeftRadius: 4, borderBottomLeftRadius: 4, paddingLeft: 12 }}
                />
                <TradeFunctionNumberInputRightContainer>
                    <TradeFunctionNumberInputRightText>{isBaseUsdt ? "USDT" : symbol.replace("-USDT","")}</TradeFunctionNumberInputRightText>
                </TradeFunctionNumberInputRightContainer>
            </TradeFunctionNumberInputContainer>
            <Slider
                minimumValue={0}
                maximumValue={isBaseUsdt ? availableBalance : availableQuantity}
                step={1}
                minimumTrackTintColor="#F4F5F6"
                maximumTrackTintColor="#333C47"
                thumbImage={require("assets/images/trade/indicator2.png")}
                onValueChange={(currentSlideValue)=>{
                    setUserInput(`${currentSlideValue ? currentSlideValue : ""}`)
                    setQuantity(currentSlideValue)
                }}
                onSlidingComplete={(finalSlideValue) => { 
                    setUserInput(`${finalSlideValue ? finalSlideValue : ""}`)
                    setOrigQty(finalSlideValue)
                }}
                value={quantity}
            />
        </Container>
    );
};

export default SliderContainer