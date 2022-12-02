import * as React from "react";

import {
    View,
    TouchableOpacity,
    Text,
    Image
} from "react-native";


// ^ Plugins
import { isEmpty, get, cloneDeep } from "lodash"
import { useTranslation } from "react-i18next";

// = styled Element Component
import styled from "styled-components";
import { theme } from 'constants/Theme';
import { useNavigation } from '@react-navigation/native';

const LinkBtn = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
  flex-direction: row;
  width: 100%;
  background-color: ${theme.DarkGray};
  border-radius: 4px;
  padding: 16px 8px;
  flex: 1
`;

const LinkTextContainer = styled(View)`
  marginLeft: 16px;
`;

const LinkBtnTitle = styled(Text)`
  font-size: 18px;
  color: ${theme.White};
  marginBottom: 10px;
  font-weight: normal;
`;

const LinkBtnSubTitle = styled(Text)`
  font-size: 12px;
  color: ${theme.White};
  font-weight: normal;
`;

const IconImg = styled(Image)`
  width: 50px;
  height: 50px;
`;

// ? Interface
interface LinkBannerProps {
    naviDetail: object,
    imgSrc: number | string,
    title: string,
    subTitle: string,
    styleObj?: object
}

/**
 * @author odin
 * @level screens/home/LinkBanner
 * @component LinkBanner
 * @description Link Banner Zone With Icon
*/
const LinkBanner = (props: LinkBannerProps) => {
    // $ init data
    const navigation = useNavigation();
    const { naviDetail, imgSrc, title, subTitle, styleObj } = props;
    const { t } = useTranslation();

    return (
        <LinkBtn
            style={get(styleObj, 'btn', {})}
            onPress={() => {
                navigation.navigate(naviDetail.pathName, !isEmpty(naviDetail.props) ? cloneDeep(naviDetail.props) : {})
            }}
        >
            <IconImg
                style={get(styleObj, 'img', {})}
                source={imgSrc}
            />

            <LinkTextContainer>
                <LinkBtnTitle
                    style={{
                        marginBottom: 10,
                        ...get(styleObj, 'title', {})
                    }}
                >
                    {t(`${title}`)}
                </LinkBtnTitle>

                <LinkBtnSubTitle
                    style={get(styleObj, 'subTitle', {})}
                >
                    {t(`${subTitle}`)}
                </LinkBtnSubTitle>
            </LinkTextContainer>
        </LinkBtn>
    );
}

export default LinkBanner;