import {
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    Image,
    Pressable,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    StyleSheet
} from "react-native";
import styled from "styled-components";
import { RootStackScreenProps } from "common/types";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from 'react-native-webview';
import { useTranslation } from "react-i18next";
import { infoService } from "services";
const windowHeight = Dimensions.get('window').height;

const Container = styled(View)`
  display: flex;
  flex-direction: column;
  background: #18222d;
  flex: 1;
`;

const ColumnText = styled(Text)`
  font-size: 12px;
  color: ${props => props.theme.color.MidGray};
`;

const HeaderTitleTextClicked = styled(Text)`
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
  color: ${props => props.theme.color.White};
`;

const HeaderTitleText = styled(Text)`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: ${props => props.theme.color.Gray};
`;

const Header = styled(View) <{ insets: number }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: ${props => props.insets}px;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 11px;
`;

const IconImg = styled(Image)`
  width: 28px;
  height:28px;
`
const HeaderText = styled(Text)`
  font-size: 16px;
  color: white;
  font-weight:600;
  margin-right:50;
`;

const AnnouncementDetail = ({ navigation, route }: RootStackScreenProps<"AnnouncementDetail">) => {
    const { id } = route.params;
    const [announce, setAnnounce] = useState({} as Announcement);
    const insets = useSafeAreaInsets();
    const TextEl = useRef<TextInput | null>(null);
    useEffect(() => {
        infoService.getAnnouncement(id).then((response) => {
            setAnnounce(response.data)
        })
    }, []);

    const [webviewHeight, setWebviewHeight] = useState("0")
    const [loading, setLoading] = useState(true)
    const { t } = useTranslation();
    const onProductDetailsWebViewMessage = (event: any) => {
        setWebviewHeight(event.nativeEvent.data)
    }
    const webViewScript = `
    setTimeout(function() { 
      window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight); 
    }, 500);
    true; // note: this is required, or you'll sometimes get silent failures
  `;

    const ActivityIndicatorElement = () => {
        return (
            <View style={styles.activityIndicatorStyle}>
                <ActivityIndicator color="#009688" size="large" />
            </View>
        );
    };

    return (
        <Container>
            <Header insets={insets.top}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <IconImg source={require("assets/images/global/previous.png")} />
                </TouchableOpacity>
                <HeaderText>{t("announcement")}</HeaderText>
                <View></View>
            </Header>
            <View style={{ paddingHorizontal: 16 }}>

                <ScrollView style={{ display: "flex", flexDirection: "column" }} contentContainerStyle={{}}>

                    <View style={{ display: "flex", flexDirection: "column", height: 60, borderBottomWidth: 1, borderBottomColor: "#242D37", justifyContent: "center", paddingBottom: 10 }}>
                        <Text style={{ color: "#F4F5F6", fontSize: 25, fontWeight: "700" }}>{announce.subject}</Text>
                        <Text style={{ color: "#8D97A2", fontSize: 13, fontWeight: "600", marginTop: 4 }}>{new Date(announce.createdDate).getFullYear()}-{new Date(announce.createdDate).getMonth() + 1 < 10 ? "0" + (new Date(announce.createdDate).getMonth() + 1) : new Date(announce.createdDate).getMonth() + 1}-{new Date(announce.createdDate).getDate() < 10 ? "0" + (new Date(announce.createdDate).getDate()) : new Date(announce.createdDate).getDate()} {new Date(announce.createdDate).getHours() < 10 ? "0" + (new Date(announce.createdDate).getHours()) : new Date(announce.createdDate).getHours()}:{new Date(announce.createdDate).getMinutes() < 10 ? "0" + (new Date(announce.createdDate).getMinutes()) : new Date(announce.createdDate).getMinutes()}</Text>
                    </View>
                    <View style={{ flex: 1, backgroundColor: "#18222d" }}>
                        <WebView
                            style={{ height: windowHeight - 180, backgroundColor: "#18222d", marginTop: 10 }}
                            originWhitelist={['*']}
                            onMessage={onProductDetailsWebViewMessage}
                            javaScriptEnabled={true}
                            injectedJavaScript={webViewScript}
                            useWebKit={true}
                            onLoadEnd={x => setLoading(false)}
                            source={{
                                html: `
              <body style="
                background-color: #18222d; color:white; height: 100%;">
                  ${announce.content}
               </body>` }}
                        />
                        {loading ? <ActivityIndicatorElement /> : null}
                    </View>

                    {/* <Text style={{ color: "white", fontSize: 13, fontWeight: "600", marginTop: 4 }}>{announce.content}</Text>             */}
                </ScrollView>
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF',
        flex: 1,
    },
    activityIndicatorStyle: {
        flex: 1,
        position: 'absolute',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
    },
});

export default AnnouncementDetail;
