import { ReactNode } from 'react';

import Slider, { Settings, CustomArrowProps } from '@ant-design/react-slick';
// Import css files
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CustomNextArrow = (props: CustomArrowProps) => {
  const { className, style, onClick } = props;
  const isDisabled = className?.includes('slick-disabled');

  return (
    <div
      className={className}
      style={{
        ...style,
        right: '12px',
        display: isDisabled ? 'none' : 'block',
        zIndex: 100,
      }}
      onClick={onClick}
    />
  );
};

function CustomPrevArrow(props: CustomArrowProps) {
  const { className, style, onClick } = props;
  const isDisabled = className?.includes('slick-disabled');

  return (
    <div
      className={className}
      style={{
        ...style,
        left: '12px',
        display: isDisabled ? 'none' : 'block',
        zIndex: 100,
      }}
      onClick={onClick}
    />
  );
}

interface U9DragSliderProps {
  children: ReactNode;
  settings?: Settings;
}

export const U9DragSlider = ({
  children,
  settings = {},
}: U9DragSliderProps) => {
  const defaultSettings = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 6,
    slidesToScroll: 4,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 414,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 375,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 320,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
    ],
  };

  const finalSetting = {
    ...defaultSettings,
    ...settings,
  };

  return <Slider {...finalSetting}>{children}</Slider>;
};

export default U9DragSlider;
