import React from "react";
// import { COLORS } from "../../constants/colors";
import { Dispatch, SetStateAction } from "react";
import "rc-slider/assets/index.css";
import "./Slider.css";
import Slider from "rc-slider";

const CustomSlider: React.FC<{
  Amount: number;
  handleCurrencyAmount: Dispatch<SetStateAction<number>>;
  setInputPrice
  total
}> = ({ Amount, handleCurrencyAmount,setInputPrice ,total}) => {
  return (
    <div
      style={{
        width: "100%",
        height: 30,
        display: "flex",
        alignItems: "center",
        padding: "15px 0 0 0",
        position: "relative",
      }}
    >
      {/* <div
        style={{
          position: "absolute",
          width: "100%",
          height: 4,
          background: "#DEDDE3",
          zIndex: 10,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 8,
          height: 8,
          background: "#fff",
          borderRadius: 4,
          zIndex: 10,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 4,
          height: 4,
          background: COLORS.Mid_gray,
          borderRadius: 2,
          zIndex: 20,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 47.25,
          width: 8,
          height: 8,
          background: "#fff",
          borderRadius: 4,
          zIndex: 10,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 49.25,
          width: 4,
          height: 4,
          background: COLORS.Mid_gray,
          borderRadius: 4,
          zIndex: 20,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 94.5,
          width: 8,
          height: 8,
          background: "#fff",
          borderRadius: 4,
          zIndex: 10,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 96.5,
          width: 4,
          height: 4,
          background: COLORS.Mid_gray,
          borderRadius: 2,
          zIndex: 20,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 143.75,
          width: 8,
          height: 8,
          background: "#fff",
          borderRadius: 4,
          zIndex: 10,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 145.75,
          width: 4,
          height: 4,
          background: COLORS.Mid_gray,
          borderRadius: 4,
          zIndex: 20,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 187,
          width: 8,
          height: 8,
          background: "#fff",
          borderRadius: 4,
          zIndex: 10,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 189,
          width: 4,
          height: 4,
          background: COLORS.Mid_gray,
          borderRadius: 4,
          zIndex: 10,
        }}
      /> */}
      {/* <div
        onTouchMove={(evt) => {
          if (evt.touches && evt.touches[0]) {
            handleCurrencyAmount(evt.touches[0].clientX);
          }
        }}
        style={{
          position: "absolute",
          width: 18,
          height: 18,
          border: "3px solid #5F5C70",
          borderRadius: 9,
          background: "#fff",
          left: Amount > 189 ? 189 : Amount < 6 ? 0 : Amount,
          zIndex: 100,
        }}
      /> */}
      <Slider
        min={0}
        max={100}
        defaultValue={0}
        step={1}
        value={Amount}
        onChange={(value) => {
          setInputPrice((value / 100) * total)
          handleCurrencyAmount(value);
        }}
        marks={{
          0: { background: "#000" },
          25: { background: "#000" },
          50: { background: "#000" },
          75: { background: "#000" },
          100: { background: "#000" },
        }}
      />
    </div>
  );
};

export default CustomSlider;
