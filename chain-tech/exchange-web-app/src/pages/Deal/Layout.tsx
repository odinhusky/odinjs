import React from 'react'
import styled from "styled-components";


const ChartContainer = styled.div`
display: flex;
flex-direction: column;
margin-top: 100px;
border-radius: 2px;
box-shadow: 0 2px 4px rgba(0, 0, 0, .3);
background-color: #FFFFFF;
width: 100%;
height: 400px;
padding: 16px 6px 16px 16px;
overflow: scroll;
`

export default function Layout ({ title, children }) {
  return (
    <ChartContainer
      className="k-line-chart-container">
      {/* <ChartTitle
        className="k-line-chart-title">{title}</ChartTitle> */}
      {children}
    </ChartContainer>
  )
}
