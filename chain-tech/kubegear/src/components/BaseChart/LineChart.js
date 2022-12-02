// Ref: https://www.highcharts.com.cn/docs/highcharts-react
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official'
import moment from 'moment';
import { colors } from 'constant';

Highcharts.setOptions({
  time: {
    useUTC: false
  }
})

const defaultOptions = {
  credits: {
    enabled: false
  },
  colors,
  title: null,
  tooltip: {
    valueSuffix: '%',
    useHTML:true,
    formatter() {
      return `${moment(this.x).format('MM/DD HH:mm')} <br/>
        ${this.series.name}: ${this.y.toFixed(0)}%`
    },
    split: false
  },
  navigator: {
    xAxis: {
      labels: {
        formatter() {
          return null
        }
      }
    }
  },

  rangeSelector: {
    enabled: false
  },
  xAxis: {
    type: 'datetime',
    dateTimeLabelFormats: {
      millisecond: '%H:%M:%S',
      second: '%H:%M:%S',
      minute: '%H:%M',
      hour: '%H:%M',
      day: '%m/%d %H:%M'
    }
  },
  yAxis: {
    opposite: false,
    labels: {
      format: '{value} %'
    }
  }
}

const PieChart = ({ options }) => {
  const [chartInstance, setChartInstance] = useState(null);

  const chartCallback = chart => {
    setChartInstance(chart);
  }

  useEffect(() => {
    if (chartInstance && chartInstance.reflow)
      chartInstance.reflow();
  }, [chartInstance])
  return (
    <HighchartsReact 
      callback={chartCallback}
      constructorType={'stockChart'}
      highcharts={Highcharts}
      options={{
        ...defaultOptions,
        ...options
      }}
    />
  );
};

PieChart.propTypes = {
  options: PropTypes.object
};

export default PieChart;