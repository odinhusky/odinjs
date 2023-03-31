import {
  StyleSheet,
  Image,
  ImageSourcePropType,
  ImageURISource
} from 'react-native';

// ^ Plugins
import SvgUri from 'react-native-svg-uri';

interface BaseImgProps {
  src?: ImageSourcePropType | undefined;
  svgSrc?: ImageURISource | undefined,
  style?: object | undefined;
  ratioTop?: number | undefined;
  ratioBottom?: number | undefined;
}

export const BaseImg = ({
  src,
  svgSrc,
  ratioTop = 16,
  ratioBottom = 9,
  style = {}
}: BaseImgProps) : JSX.Element => {

  if (svgSrc) {
    return <SvgUri width="100%" height="100%" source={svgSrc} />;
  } else {
    return <Image source={src} resizeMode="contain" style={[styles.defaultImgStyle, style, { aspectRatio: ratioTop / ratioBottom }]} />;
  }
}

export default BaseImg;

const styles = StyleSheet.create({
  defaultImgStyle: {
    width: '100%',
    height: undefined,
  }
});