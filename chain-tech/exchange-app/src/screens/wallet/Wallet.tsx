import * as React from "react";
import { Text, TextInput, TouchableOpacity, View, Image, ScrollView, SafeAreaView, Button, Alert } from "react-native"
import styled from "styled-components"
import { RootStackScreenProps } from "common/types";
import { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay'
import { useAppSelector } from "hooks"
import { useTranslation } from "react-i18next";
import _ from "lodash"
import RenderCounter from "components/render-counter"
import { investorService, userService, positionService } from "services";
const Container = styled(View) <{ insets: number }>`
    display: flex ;
    flex-direction: column;
    width: 100%;
    background-color: #18222D;
    flex:1;
    padding-top: ${props => props.insets}px;
    padding-left:16px;
    padding-right:16px;
`;

const Row = styled(View)`
  display:flex;
  flex-direction: row;
  align-items:center;
  /* padding:16px; */
  padding-top:16px;
  padding-bottom:16px;
`;

const TitleTitle = styled(Text)`
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.4px;
    color: #18222D;
`;

const Number = styled(Text)`
   /* font-family: 'SF Pro Display'; */
    font-style: normal;
    font-weight: 700;
    font-size: 28px;
    line-height: 34px;
    color: #18222D;
`;

const ValueText = styled(Text)`
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: center;
    letter-spacing: 0.4px;
    color: #18222D;
`;

const TopArea = styled(View)`
  /* margin-top:20px; */
  margin:16px;
`;

const BG0 = styled(View)`
    /* background: linear-gradient(90deg, #A8C2DC 0%, #6699CC 100%); */
    background: #6699CC; 
    border-radius: 8px;
    margin-top:20px;

`;

const BG000 = styled(View)`
   background: #A8C2DC;
   padding:20px;
   width:100%;
   border-top-left-radius: 8px;
   border-top-right-radius: 8px;

`;

const Body = styled(View)`
 margin-top:30px;
 
`;

const NumArea = styled(View)`
  display:flex;
  flex-direction:row;
  align-items:baseline;
`;



const Content = styled(View)`
    display:flex;
    flex-direction: row;
    justify-content:space-between;
    margin-top:30px;
`;

const Num1 = styled(Text)`
    /* font-family: 'SF Pro Display'; */
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    /* letter-spacing: 0.002em; */
    color: #F4F5F6;
`;

const BG1 = styled(View)`
    /* gradient(97.81deg, #333C47 0%, #242D37 100%); */
    background:#242D37;
    border-radius: 8px;
    /* padding:20px; */
    width:100%;
`;

const BG001 = styled(View)`
   background: #333C47;
   border-top-left-radius: 8px;
   border-top-right-radius: 8px;
   padding:20px;
   width:100%;
   display:flex;
   flex-direction:row;
   justify-content:space-between;


`;

const Title = styled(Text)`
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    display: flex;
    align-items: center;
    /* letter-spacing: 0.4px; */
    color: #FFFFFF;
`;

const Title1 = styled(Text)`
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    /* letter-spacing: 0.4px; */
    color: #FFFFFF;

`;


const Number0 = styled(Number)`
    /* font-family: 'SF Pro Display'; */
    font-style: normal;
    font-weight: 700;
    font-size: 28px;
    line-height: 34px;
    color: #18222D;
`;

const Number01 = styled(Number)`
    /* font-family: 'SF Pro Text'; */
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 16px;
    /* letter-spacing: 0.004em; */
    color: #333C47;

`;

const USDT = styled(Text)`
    /* font-family: 'SF Pro Text'; */
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 16px;
    /* letter-spacing: 0.004em; */
    color: #18222D;
    margin-top:13px;
`;

const USDTcontent = styled(View)`
  display:flex;
  flex-direction: row;
`;

const Number001 = styled(Number)`
    /* font-family: 'SF Pro Display'; */
    font-style: normal;
    font-weight: 700;
    font-size: 28px;
    line-height: 34px;
    color: #F4F5F6;

`;

const USDT1 = styled(Text)`
    /* font-family: 'SF Pro Text'; */
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 16px;
    /* letter-spacing: 0.004em; */
    color: #F4F5F6;
    margin-top:13px;
`;

const Number1 = styled(Text)`
    /* font-family: 'SF Pro Text'; */
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 16px;
    /* letter-spacing: 0.004em; */
    color: rgb(141, 151, 162);
`;

const Img1 = styled(Image)`
  width:28px;
  height:28px;
`;

const Background01 = styled(View)`
 background: #18222D;
 margin-top:20px;
 /* height:200px; */
`;

const ButtonArea = styled(View)`
    display:flex;
    justify-content: space-between;
    flex-direction:row;
`;

const Withdraw = styled(TouchableOpacity)`
    
    background: #3D6A97;
   border-radius: 4px;
   width:30%;
   height:38px;
   margin-top:20px;
`;

const Recharge = styled(TouchableOpacity)`
    border: 1px solid #6699CC;
    /* box-sizing: border-box; */
    border-radius: 4px;
    width:30%;
    height:38px;
    align-items: center;
    display:flex;
    justify-content: center;
    margin-top:20px;

`;

const WithdrawText = styled(Text)`
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 38px;
    text-align: center;
    /* letter-spacing: 0.012em; */
    color: #FFFFFF;
`;

const RechargeText = styled(Text)`
    
    line-height:38px;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
    text-align: center;
    /* letter-spacing: 0.012em; */
    color: #6699CC;

`;

const BelowArea1 = styled(View)`
  margin-top:30px;
`;


const Img2 = styled(Image)`
  width: 28px;
  height:28px;
  margin-top:3px;

`;

const Below1 = styled(View)`
  margin-top:10px;
  display:flex;
  flex-direction: row;
  justify-content: space-between;
  align-items:center;
`;
const Below = styled(View)`
  margin-top:40px;
  display:flex;
  flex-direction: row;
  justify-content: space-between;
  align-items:center;

 
`;

const Text1 = styled(Text)`
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    /* line-height: 18px; */
    /* letter-spacing: 0.004em; */
    color: #FFFFFF;
`;

const Text01 = styled(Text)`
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    /* line-height: 15px; */
    /* letter-spacing: 0.004em; */
    color: #8D97A2;
`;

const Num = styled(Text)`
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    text-align: right;
    /* letter-spacing: 0.004em; */
    color: #F4F5F6;
    /* margin-left:180px; */
`;

const ImgArea = styled(View)`
  display:flex;
  justify-content: space-between;
  flex-direction:row;

`;



const TextContener = styled(View)`
   margin-left:20px; 

`;

// Trade Page Position Style
const TradePositionContainer = styled(ScrollView)`
/* display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
padding-bottom: 280px; */
`;

const TradePositionBackgroundImage = styled(Image)`
width: 99px;
height: 135px;
`;

const TradePositionCardContainer = styled(View)`
display: flex;
flex-direction: column;
`;

const TradePositionCardTitleContainer = styled(View)`
display: flex;
flex-direction: column;
padding-top: 20px;
`;

const TradePositionCardTitleRowContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
`;

const TradePositionCardTitleText = styled(Text)`
font-weight: 700;
font-size: 20px;
line-height: 24px;
color: ${props => props.theme.color.Secondary};
`;

const TradePositionCardTitleValueText = styled(Text)`
font-weight: 500;
font-size: 13px;
line-height: 20px;
color: ${props => props.theme.color.ExtraLightGray};
`;

const TradePositionCardDetailRowContainer = styled(View)`
display: flex;
flex-direction: row;
padding-top: 12px;
`;

const TradePositionCardDetailColumnContainer = styled(View)`
display: flex;
flex-direction: column;
width: 50%;
`;

const TradePositionCardSmallTitleText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 18px;
color: ${props => props.theme.color.MidGray};
`;

const TradePositionCardBigValueText = styled(Text)`
font-weight: 700;
font-size: 16px;
line-height: 20px;
color: ${props => props.theme.color.Secondary};
`;

const TradePositionCardSmallValueText = styled(Text)`
font-weight: 600;
font-size: 13px;
line-height: 16px;
color: ${props => props.theme.color.ExtraLightGray};
`;

const TradePositionCardButtonContainer = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
padding-top: 12px;
`;

const TradePositionCardButton = styled(TouchableOpacity)`
height: 26px;
width: 48%;
justify-content: center;
align-items: center;
background-color: ${props => props.theme.color.DarkGray};
`;

const TradePositionCardButtonText = styled(Text)`
font-weight: 400;
font-size: 12px;
line-height: 18px;
color: ${props => props.theme.color.White};
`;


const WalletScreen = ({
    navigation
}: RootStackScreenProps<"WalletScreen">) => {
    const [index, setIndex] = useState(0)
    const insets = useSafeAreaInsets();
    const [futuresBalance, setFuturesBalance] = useState(0)
    const [spotBalance, setSpotBalance] = useState(0)
    const [totalBalance, setTotalBalance] = useState(0)
    const [position, setPosition] = useState(0)
    const [marginBalance, setMarginBalance] = useState(0)
    // const [positionArray,setPositionArray] = useState([])
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState(0)
    const [freeze, setFreeze] = useState(0)
    const focus = useIsFocused();
    const positions = useAppSelector((state) => focus ? state.positions.trading : "")
    const market = useAppSelector((state) => focus ? state.market.price : "")
    const { detail: user, token } = useAppSelector((state) => state.user)

    const { t } = useTranslation();
    const getBalance = async () => {
        investorService.getProperty().then((response) => {
            const property = response.data
            setFuturesBalance(property.futures.balance)
            setTotalBalance(property.spot.equityValue)
            property.spot.coins.filter(coin => coin.symbol === "USDT").forEach((coin) => {
                setSpotBalance(coin.balance)
            })
        })

        investorService.getAvailableBalance().then((response) => {
            setMarginBalance(response.data)
        }).catch((error) => {
            console.log(error.response.data)
        })

        userService.getOtcUserInfo(user.account).then((response) => {
            response.wallet.coins.filter(coin => coin.symbol === "USDT").forEach((coin) => {
                setBalance(coin.balance)
                setFreeze(coin.freeze)
            })
        })
    };

    const getRemark = (s: string) => {
        const remark = market && _.find(market, function (o) { return o.s == s })
        return remark ? remark.m : ""
    }

    useFocusEffect(
        React.useCallback(() => {
            if (!token) {
                setFuturesBalance(0)
                setTotalBalance(0)
                setSpotBalance(0)
                setPosition(0)
            }
            else {
                getBalance()
            }

            if (positions) {
                let sum = 0;
                for (let i = 0; i < positions.length; i++) {
                    sum = sum + positions[i].profitAndLoss
                }
                setPosition(sum)
            }
        }, [positions])
    );

    return (
        <Container insets={insets.top}>
            <RenderCounter name="Wallet" debug={false} />
            {loading &&
                <Spinner visible={true} textContent={''} />
            }
            <Row>
                <TouchableOpacity onPress={() => setIndex(0)} style={{ marginRight: 24 }}>
                    <Text style={index === 0 ? { color: "white", fontSize: 20, fontWeight: "600" } : { color: "#5C6670", fontSize: 16, fontWeight: "600" }}>{t("fundOverview")}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIndex(1)} style={{ marginRight: 24 }}>
                    <Text style={index === 1 ? { color: "white", fontSize: 20, fontWeight: "600" } : { color: "#5C6670", fontSize: 16, fontWeight: "600" }}>{t("fundSpot")}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIndex(2)} style={{ marginRight: 24 }}>
                    <Text style={index === 2 ? { color: "white", fontSize: 20, fontWeight: "600" } : { color: "#5C6670", fontSize: 16, fontWeight: "600" }}>{t("fundFutures")}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIndex(3)}>
                    <Text style={index === 3 ? { color: "white", fontSize: 20, fontWeight: "600" } : { color: "#5C6670", fontSize: 16, fontWeight: "600" }}>{t("fundFiat")}</Text>
                </TouchableOpacity>
            </Row>
            {index === 0 &&
                <>
                    <BG0>
                        <BG000>
                            <TitleTitle>{t("fundTotal")}</TitleTitle>
                        </BG000>
                        <TopArea>
                            <USDTcontent>
                                <Number>{totalBalance} </Number>
                                <USDT>USDT</USDT>
                            </USDTcontent>
                        </TopArea>
                    </BG0>

                    <Body>
                        <Content>
                            <Title>{t("fundSpot")}</Title>
                            <NumArea>
                                <Num1>{totalBalance} </Num1>
                                <Text style={{ color: "#F4F5F6", fontSize: 12, fontWeight: "400" }}>USDT</Text>
                            </NumArea>
                        </Content>

                        <Content>
                            <Title>{t("fundFutures")}</Title>
                            <NumArea>
                                <Num1>{futuresBalance} </Num1>
                                <Text style={{ color: "#F4F5F6", fontSize: 12, fontWeight: "400" }}>USDT</Text>

                            </NumArea>
                        </Content>

                        <Content>
                            <Title>{t("fundFiat")}</Title>
                            <NumArea>
                                <Num1>{balance} </Num1>
                                <Text style={{ color: "#F4F5F6", fontSize: 12, fontWeight: "400" }}>USDT</Text>
                            </NumArea>
                        </Content>
                    </Body>
                </>
            }
            {index === 1 &&
                <>
                    <Background01>
                        <BG1>
                            <BG001>
                                <Title1>{t("fundTotal")}</Title1>
                                <TouchableOpacity onPress={() => { navigation.navigate("History") }}>
                                    <Img1 source={require("assets/images/wallet/history.png")} />
                                </TouchableOpacity>
                            </BG001>
                            <TopArea>
                                <USDTcontent>
                                    <Number001>{totalBalance} </Number001>
                                    <USDT1>USDT</USDT1>
                                </USDTcontent>
                            </TopArea>
                        </BG1>

                        <ButtonArea>

                            <Withdraw onPress={() => {
                                navigation.navigate("Recharge")
                            }}>
                                <WithdrawText>{t("deposit")}</WithdrawText>
                            </Withdraw>


                            <Recharge onPress={() => {
                                navigation.navigate("Withdraw")
                            }}>
                                <RechargeText>{t("widthdraw")}</RechargeText>
                            </Recharge>

                            <Recharge onPress={() => {
                                navigation.navigate("Funds")
                            }}>
                                <RechargeText>{t("fundingTransfer")}</RechargeText>
                            </Recharge>

                        </ButtonArea>
                    </Background01>

                    <BelowArea1>
                        <Below1>
                            <ImgArea>
                                <Img2 source={require("assets/images/wallet/usdt.png")} />
                                <TextContener>
                                    <Text1>USDT</Text1>
                                    <Text01>TetherUS</Text01>
                                </TextContener>
                            </ImgArea>
                            <Num>{spotBalance}</Num>
                        </Below1>
                        {/* <Below>
                            <ImgArea>
                                <Img2 source={require("assets/images/wallet/btc.png")} />
                                <TextContener>
                                    <Text1>BTC</Text1>
                                    <Text01>Bitcoin</Text01>
                                </TextContener>
                            </ImgArea>
                            <Num>33,720.87</Num>
                        </Below>

                        <Below>
                            <ImgArea>
                                <Img2 source={require("assets/images/wallet/eth.png")} />
                                <TextContener>
                                    <Text1>ETH</Text1>
                                    <Text01>Ethereum</Text01>
                                </TextContener>
                            </ImgArea>
                            <Num>25,000.00</Num>
                        </Below>

                        <Below>
                            <ImgArea>
                                <Img2 source={require("assets/images/wallet/doge.png")} />
                                <TextContener>
                                    <Text1>DOGE</Text1>
                                    <Text01>Dogecoin</Text01>
                                </TextContener>
                            </ImgArea>
                            <Num>14,000.00</Num>
                        </Below> */}
                    </BelowArea1>
                    {/* <TouchableOpacity style={{ backgroundColor: "#3D6A97",borderRadius:4,justifyContent:"center",display:"flex",flexDirection:"row",padding:12,marginTop:20}}>
                        <Text style={{color:"white",fontSize:14,fontWeight:"500"}}>資金劃轉</Text>
                    </TouchableOpacity> */}
                </>
            }
            {index === 2 &&
                <>
                    <Background01>
                        <BG1>
                            <BG001>
                                <Title1>{t("fundTotal")}</Title1>
                                <TouchableOpacity onPress={() => { navigation.navigate("ContractHistory") }}>
                                    <Img1 source={require("assets/images/wallet/history.png")} />
                                </TouchableOpacity>
                            </BG001>
                            <TopArea>
                                <USDTcontent>
                                    <Number001>{(futuresBalance + position).toFixed(7)} </Number001>
                                    <USDT1>USDT</USDT1>
                                </USDTcontent>
                            </TopArea>
                        </BG1>
                    </Background01>

                    <BelowArea1>
                        <Below1>
                            <ImgArea>
                                <View>
                                    <Text1>{t("marginBalance")}</Text1>
                                </View>
                            </ImgArea>
                            <Num>{marginBalance}</Num>
                        </Below1>
                        <Below1 style={{ marginTop: 30 }}>
                            <ImgArea>
                                <View>
                                    <Text1>{t("walletBalance")}</Text1>
                                </View>
                            </ImgArea>
                            <Num>{futuresBalance}</Num>
                        </Below1>
                        <Below1 style={{ marginTop: 30 }}>
                            <ImgArea>
                                <View>
                                    <Text1>{t("pnlU")}</Text1>
                                </View>
                            </ImgArea>
                            <Num>{position.toFixed(7)}</Num>
                        </Below1>

                    </BelowArea1>

                    <TouchableOpacity style={{ backgroundColor: "#3D6A97", borderRadius: 4, justifyContent: "center", display: "flex", flexDirection: "row", padding: 12, marginTop: 30 }} onPress={() => {
                        navigation.navigate("Funds")
                    }}>
                        <Text style={{ color: "white", fontSize: 14, fontWeight: "500" }}>{t("fundingTransfer")}</Text>
                    </TouchableOpacity>

                    <TradePositionContainer contentContainerStyle={{ paddingBottom: 20 }}>
                        {
                            positions!=="" && positions.map((position, index) => {
                                return (
                                    <TradePositionCardContainer key={position.positionId}>
                                        <TradePositionCardTitleContainer>
                                            <TradePositionCardTitleRowContainer>
                                                {position.side === "BUY" ? <TradePositionCardTitleText>{t("long")} {position.symbol}</TradePositionCardTitleText>
                                                    : <TradePositionCardTitleText style={{ color: "#FB4C51" }}>{t("short")} {position.symbol}</TradePositionCardTitleText>
                                                }
                                                <TradePositionCardSmallTitleText>{t("pnlU")}</TradePositionCardSmallTitleText>
                                            </TradePositionCardTitleRowContainer>
                                            <TradePositionCardTitleRowContainer>
                                                <TradePositionCardTitleValueText>{position.type === 'FULL' ? t("crossPosition") : '逐倉'} {position.leverage}X</TradePositionCardTitleValueText>
                                                {position.profitAndLoss > 0 ? <TradePositionCardBigValueText>{position.profitAndLoss}</TradePositionCardBigValueText> : <TradePositionCardBigValueText style={{ color: "#FB4C51" }}>{position.profitAndLoss}</TradePositionCardBigValueText>}
                                            </TradePositionCardTitleRowContainer>
                                        </TradePositionCardTitleContainer>
                                        <TradePositionCardDetailRowContainer>
                                            <TradePositionCardDetailColumnContainer>
                                                <TradePositionCardSmallTitleText>{t("positionSize")}</TradePositionCardSmallTitleText>
                                                <TradePositionCardSmallValueText>{position.quantity}</TradePositionCardSmallValueText>
                                            </TradePositionCardDetailColumnContainer>
                                            <TradePositionCardDetailColumnContainer>
                                                <TradePositionCardSmallTitleText>{t("entryPrice")}</TradePositionCardSmallTitleText>
                                                <TradePositionCardSmallValueText>{(parseFloat(position.avgPrice.toFixed(6)) < 0.006 && parseFloat(position.avgPrice.toFixed(6)) > 0) ? position.avgPrice.toFixed(6) : (parseFloat(position.avgPrice.toFixed(6)) < 0.1 && parseFloat(position.avgPrice.toFixed(6)) > 0.006) ? position.avgPrice.toFixed(6).toString().slice(0, -1) : (parseFloat(position.avgPrice.toFixed(6)) < 1 && parseFloat(position.avgPrice.toFixed(6)) > 0.1) ? position.avgPrice.toFixed(6).toString().slice(0, -2) : (parseFloat(position.avgPrice.toFixed(6)) < 50 && parseFloat(position.avgPrice.toFixed(6)) > 1) ? position.avgPrice.toFixed(6).toString().slice(0, -3) : position.avgPrice.toFixed(6).toString().slice(0, -4)}</TradePositionCardSmallValueText>
                                            </TradePositionCardDetailColumnContainer>
                                        </TradePositionCardDetailRowContainer>
                                        <TradePositionCardDetailRowContainer>
                                            <TradePositionCardDetailColumnContainer>
                                                <TradePositionCardSmallTitleText>{t("marketPrice")}</TradePositionCardSmallTitleText>
                                                <TradePositionCardSmallValueText>{(parseFloat(getRemark(position.symbol)) < 0.006 && parseFloat(getRemark(position.symbol)) > 0) ? getRemark(position.symbol) : (parseFloat(getRemark(position.symbol)) < 0.1 && parseFloat(getRemark(position.symbol)) > 0.006) ? getRemark(position.symbol).toString().slice(0, -1) : (parseFloat(getRemark(position.symbol)) < 1 && parseFloat(getRemark(position.symbol)) > 0.1) ? getRemark(position.symbol).toString().slice(0, -2) : (parseFloat(getRemark(position.symbol)) < 50 && parseFloat(getRemark(position.symbol)) > 1) ? getRemark(position.symbol).toString().slice(0, -3) : getRemark(position.symbol).toString().slice(0, -4)}</TradePositionCardSmallValueText>
                                            </TradePositionCardDetailColumnContainer>
                                            <TradePositionCardDetailColumnContainer>
                                                <TradePositionCardSmallTitleText>{t("liqPrice")}</TradePositionCardSmallTitleText>
                                                <TradePositionCardSmallValueText>{position.forceClose}</TradePositionCardSmallValueText>
                                            </TradePositionCardDetailColumnContainer>
                                        </TradePositionCardDetailRowContainer>
                                        <TradePositionCardButtonContainer>
                                            <TradePositionCardButton onPress={() => {
                                                navigation.push("StopPositionScreen", { remarkPrice: getRemark(position.symbol), position: position })
                                            }}>
                                                <TradePositionCardButtonText>{t("stopProfitLoss")}</TradePositionCardButtonText>
                                            </TradePositionCardButton>
                                            <TradePositionCardButton onPress={() => {
                                                setLoading(true)
                                                positionService.close({
                                                    positionId: position.positionId
                                                }).finally(()=>{
                                                    setLoading(false);
                                                })
                                            }}>
                                                <TradePositionCardButtonText>{t("closePosition")}</TradePositionCardButtonText>
                                            </TradePositionCardButton>
                                        </TradePositionCardButtonContainer>
                                    </TradePositionCardContainer>
                                )
                            })
                        }
                    </TradePositionContainer>
                </>
            }
            {index === 3 &&
                <>
                    <Background01>
                        <BG1>
                            <BG001>
                                <Title1>{t("fundTotal")}</Title1>
                                <TouchableOpacity onPress={() => { navigation.navigate("C2cHistoryScreen") }}>
                                    <Img1 source={require("assets/images/wallet/history.png")} />
                                </TouchableOpacity>
                            </BG001>
                            <TopArea>
                                <USDTcontent>
                                    <Number001>{balance} </Number001>
                                    <USDT1>USDT</USDT1>
                                </USDTcontent>
                            </TopArea>
                        </BG1>
                        <Below1 style={{ marginTop: 20 }}>
                            <ImgArea>
                                <View>
                                    <Text1>{t("freezeAmount")} </Text1>
                                </View>
                            </ImgArea>
                            <Num>{freeze}</Num>
                        </Below1>
                        <ButtonArea>

                            <TouchableOpacity style={{ backgroundColor: "#3D6A97", borderRadius: 4, justifyContent: "center", display: "flex", flexDirection: "row", padding: 12, marginTop: 20, width: "100%" }} onPress={() => {
                                navigation.navigate("OtcFunds")
                            }}>
                                <Text style={{ color: "white", fontSize: 14, fontWeight: "500" }}>{t("fundingTransfer")}</Text>
                            </TouchableOpacity>

                            {/* <Recharge style={{width:"45%"}}>
                                <RechargeText>提現</RechargeText>
                            </Recharge> */}

                        </ButtonArea>
                    </Background01>

                    <BelowArea1>
                        <Below1>
                            <ImgArea>
                                <Img2 source={require("assets/images/wallet/usdt.png")} />
                                <TextContener>
                                    <Text1>USDT</Text1>
                                    <Text01>TetherUS</Text01>
                                </TextContener>
                            </ImgArea>
                            <Num>{balance}</Num>
                        </Below1>
                        {/* <Below>
                            <ImgArea>
                                <Img2 source={require("assets/images/wallet/btc.png")} />
                                <TextContener>
                                    <Text1>BTC</Text1>
                                    <Text01>Bitcoin</Text01>
                                </TextContener>
                            </ImgArea>
                            <Num>33,720.87</Num>
                        </Below>

                        <Below>
                            <ImgArea>
                                <Img2 source={require("assets/images/wallet/eth.png")} />
                                <TextContener>
                                    <Text1>ETH</Text1>
                                    <Text01>Ethereum</Text01>
                                </TextContener>
                            </ImgArea>
                            <Num>25,000.00</Num>
                        </Below>

                        <Below>
                            <ImgArea>
                                <Img2 source={require("assets/images/wallet/doge.png")} />
                                <TextContener>
                                    <Text1>DOGE</Text1>
                                    <Text01>Dogecoin</Text01>
                                </TextContener>
                            </ImgArea>
                            <Num>14,000.00</Num>
                        </Below> */}
                    </BelowArea1>
                    {/* <TouchableOpacity style={{ backgroundColor: "#3D6A97",borderRadius:4,justifyContent:"center",display:"flex",flexDirection:"row",padding:12,marginTop:20}}>
                        <Text style={{color:"white",fontSize:14,fontWeight:"500"}}>資金劃轉</Text>
                    </TouchableOpacity> */}
                </>
            }



        </Container>
    )
}

export default WalletScreen