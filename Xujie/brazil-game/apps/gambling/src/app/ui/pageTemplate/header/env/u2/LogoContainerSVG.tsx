import {ISVGComponent} from "../../../../ISVGComponent";
import React from "react";


export const LogoContainerSVG = (props: ISVGComponent) => {
  return (
    <svg width="308" height="104" viewBox="0 0 308 104" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_777_38988)">
        <path d="M4 96V0H304L280.102 74.2737C277.051 79.3263 274 81.3474 265.864 82.3579L4 96Z" fill={props.fill}/>
      </g>
      <defs>
        <filter id="filter0_d_777_38988" x="0" y="0" width="308" height="104" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="4"/>
          <feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_777_38988"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_777_38988" result="shape"/>
        </filter>
      </defs>
    </svg>
  )
}

export default LogoContainerSVG;
