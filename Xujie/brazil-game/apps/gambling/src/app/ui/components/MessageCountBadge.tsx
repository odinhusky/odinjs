import styled from "styled-components";

export const MessageCountBadge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAiCAYAAAA+stv/AAAAAXNSR0IArs4c6QAABXRJREFUWEetV22IVGUUfs57Z1gNWjUN1F1h2WJdFDMtWdcStX60QpsGQkVREmERJfWziH5E1M9CI0qiDIoKhDIL909fZG1LRVgUKrUsuOsKKdkG2TZz74nz3ve8c+6dWV2kgWEudz6e5zzPc855h3CJD961q4rq7+3+67Urp2jfvtql/BTN9kv88LZlAHaA+CaQWw1HnQD0+4yMx8HZUTB/CrgD9PLBk7P57YsS4PsH+uGSp5DQABLn4ByQEPwrha8zA2kGZAxkmVxnSHkIWfosvT40fCEiMxLgnZvnI2vbg4TuQeIIlQRIHFBxObhcK4EGcE7EP1OgnjGY3wKmd9P+z8+1ItKSAN9xcw+q9CGcW+4BkyQHFhIC7u+FJ0OrFkALnl/XU3n/OGp8G733yYkyiSYCvGPTRlTcQSTJAg9StaCBiBBSNeQXBVikFzBPIm0oUdPr9A/Us2104IsvLYkCAd6+4SpUqiNI3MKC5BFQgClXQgiIGvLIfS+CKxFVRcil2VnUa330wde/KYlIgLf2taOtOoyKW+El9xWGV61W73vwEERI8MJT/c/BWtuRZr9gutZPh0emhESDwGD/K3DuwQKoeq9+66tULgRsF2gnRGAlEKyx92vpq/Tx8EORAA/0XYMK/YAkydvMV055+MrJF2C5L9SbCIQ2FEXyLmioYC3Ksgx1XkNDIz96BXhg3TtwyZ0RLFZsAihg2oJyLUTsQ0BFBc1Daq8tmUAqS9+loW/vIr5l5RXI5p5CJWmLrdVS8tIAEhINA4FMKlFQVcLYEPMRu2Qa7vxS4i1r7kXi3szBTeii3yJ5SLz67qdgsEBAvYzy1Gloqw/3CtmIIb2PePPaN+Cws2X1OvE08UrAV28U8BxCJ6gK2hnRkhZqZNhPvGn1d3DuukigDCq+e89N8hW8EMJggSdgwqgE9J4OLb87su+JN646A5csjEvG+m+BCwRU/pBCsUOAvQ2GgF1SaoEQ8l3iCZwl3rDqXziqFiwQYPVd2lFTbzeg2CGAHjwAy4XuhtgVEawBHMlwjXj9yvNwbo5vKzto/MoVcCO9zYAdYyGHuQqGhKqhq1pCGi0QpdJ/iNetmERCi/OK1etSy8X02/CFECq4Vq8krAI+B6Y11YKUTxNf33sERDfE6qP85tBRIGDWiA2h9qJaYPMgCtjuUAuYvyJe27MXRI/EQ4Zaoa2mqtjp5wdQ4zQWg6Cg8TX4X+6MPIBC6iXia3u2g/B+Q/7gvU19uf9Fbl+9IdGUAzsXSq2pinB6O3FX1xy0Vybh3Hy/gAqtp56bTvDFl88xoR1sCAuDqTwbfB7OYaq+JF9Gq65+AeDH4jmvLLsdPApeJhFHsukElb7VdAS9SD/9+nhOoKezA9XqCTh3WVPPR/mD7/4QFBSwMdAQylKK80A3pNmUOZm/Uav10InxicY+6+16Ao6eKxKAOXjoChb/w1EsTiIdRLoTlISAmSUVw8hP0rGx54snIiDB8q5DIGzNA1nyvzD/dQTaURyubQ6sBfEah3F8bJCAtEDAc+5eMA+V9m9A6G0mED4ew9/iRK9TcKahxDiGerKeRkf/bDqU6g3uWtyFSvUjEFbmY9ik3gYwzgJzHvBVhFFs90I+F35GvXYrjZ0eswep1n9MFi26HO1z3wbxYNz7MhdU+fIg8vdlOZXAox18CNXpu+n4mb+K5zhzqCq/wVJ7d+ej4OwZELX7j3oFwhCyJOypyLOMZ4MpkHsao+N7KY9j0+Pif047OhaiyrvBeADAUp8NAfQVa0eGyhsqnALhNdRoD01MnG0FPGMGZvqwV2TZkhtBtAXMqwF0gzDPj4QMEqpREB8F02c4OXlkpopnbcGFWP+f7/0HeBleMKSegf0AAAAASUVORK5CYII=);
  width: 17px;
  height: 17px;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #fff;
`

export const MsgCountBadge = styled.div<{bgColor?: string;}>`
  position: absolute;
  top: -5px;
  right: -5px;
  height: 17px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #fff;
  background-color: ${props => props?.bgColor || '#F59E0B'};
  border-radius: 20px;
  padding-left: 5px;
  padding-right: 5px;
`