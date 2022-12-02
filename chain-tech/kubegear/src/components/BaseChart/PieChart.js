// Ref: https://www.highcharts.com.cn/docs/highcharts-react
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official'
import { colors } from 'constant';

const defaultOptions = {
  title: null,
  chart: {
    type: 'pie',
    width: null
  },
  legend: {
    layout: 'vertical',
    labelFormatter() {
      return `${this.name} ${Math.round(this.y * 100)}%`
    },
    itemMarginTop: 10,
    itemMarginBottom: 10,
    itemStyle: { color: '#A19F9D', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }
  },
  colors,
  credits: {
    enabled: false
  },
  series: [{
    name: 'Brands',
    colorByPoint: true,
    data: [{
      name: 'Chrome',
      y: 61.41
    }, {
      name: 'Internet Explorer',
      y: 11.84
    }, {
      name: 'Firefox',
      y: 10.85
    }, {
      name: 'Edge',
      y: 4.67
    }, {
      name: 'Safari',
      y: 4.18
    }, {
      name: 'Other',
      y: 7.05
    }]
  }],
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format: '<b>{point.name}</b>: {point.percentage:.0f} %'
      },
      size: 100,
      showInLegend: true,
      tooltip: {
        pointFormatter() {
          return `<span style="color:${this.color}">●</span> ${this.name}: <b>${(this.y * 100).toFixed(0)}%</b><br/>`
        }
      }
    }
  },
  accessibility: {
    point: {
      valueSuffix: '%'
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