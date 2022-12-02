import React, {
  useState,
  useEffect,
  useCallback,
  useMemo
} from 'react'

// # API
import { getKline } from 'api';

// ? Self-packed Components || Functions
import Layout from './Layout'

// ^ Plugins
import { init, dispose } from 'klinecharts';
import { isNil, isEmpty } from 'lodash';

// = Styled Component
import styled from "styled-components";

const MenuContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  font-size: 12px;
  color: #606060;
`;

const KLine = styled.div`
  display: flex;
  flex: 1;
`;

interface KLineDataUnit {
  close: number;
  timestamp: number;
  low: number;
  high: number;
  volume: number;
}

interface KlineChartProps {
  trade: string;
  timeScale: string;
}

/**
 * @author odin
 * @level Layout/Deal/Chart/KlineChart
 * @description K線 的元件
*/
export const KlineChart = ({
  trade,
  timeScale
}: KlineChartProps) => {

  // $ init data
  const KLineIDName = useMemo(() => 'tooltip-k-line', []);

  // # state
  const [kline, setKline] = useState<any>();
  const [klineData, setKlineData] = useState<KLineDataUnit[]>();


  // - methods
  const getKlineData = useCallback(async() => {
    try {
      const res: any = await getKline({
        symbol: trade,
        intv: timeScale
      });

      const data = res.map((item: string) => {
        const formatedItem = JSON.parse(item);

        return {
          timestamp: formatedItem[0],
          open: parseFloat(formatedItem[1]),
          high: parseFloat(formatedItem[2]),
          low: parseFloat(formatedItem[3]),
          close: parseFloat(formatedItem[4]),
          volume:formatedItem[5]
        };
      });

      setKlineData(data);
    } catch (e) {
      console.log(e);
    }
  }, [trade, timeScale, setKlineData]);

  // * hooks
  /**
   * @author odin
   * @description K Line 套件初始化
  */
  useEffect(() => {
    const kLineChart = init(KLineIDName);

    if(kLineChart){
      kLineChart.createTechnicalIndicator('MA', false, { id: 'candle_pane' })
      kLineChart.createTechnicalIndicator('VOL', false, { height: 40 })

      setKline(kLineChart);
    }
  }, [KLineIDName]);

  /**
   * @author odin
   * @description 每兩秒都去去得 KLine 的資料
  */
  useEffect(() => {
    getKlineData();

    const interval = setInterval(() => {
      getKlineData();
    }, 2000);

    return function cleanUp () {
      dispose('tooltip-k-line');
      clearInterval(interval);
    };
  }, []); // eslint-disable-line

  /**
   * @author odin
   * @description 每兩秒更新 K Line 的資料
  */
  useEffect(() => {
    if(isNil(kline) || isEmpty(klineData)) return;

    kline.applyNewData(klineData);
  }, [kline, klineData]);

  return (
    <Layout
      title="图表类型">
      <KLine id="tooltip-k-line" className="k-line-chart"/>
      <MenuContainer
        className="k-line-chart-menu-container">
          <div style={{height:15}}></div>
      </MenuContainer>
    </Layout>
  )
};

export default KlineChart;
