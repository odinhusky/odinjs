// Ref: https://www.highcharts.com.cn/docs/highcharts-react
import React, { useEffect, useState } from 'react';

// ^ Plugins
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import highchartsVariablePie from 'highcharts/modules/variable-pie';
import HighchartsReact from 'highcharts-react-official'
import { theme } from 'theme';

// init
highchartsVariablePie(Highcharts);

const defaultOptions = {
  chart: {
    type: 'variablepie'
  },
  title: {
    text: 'Countries compared by population density and total area.'
  },
  credits: {
    enabled: false
  },
  tooltip: {
    headerFormat: '',
    pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
            'Area (square km): <b>{point.y}</b><br/>' +
            'Population density (people per square km): <b>{point.z}</b><br/>'
  },
  plotOptions: {
    variablepie: {
      allowPointSelect: true,
      cursor: 'pointer',
      colors: theme.gpuUtilRateDonutColor
    }
  },
  series: [{
    name: 'Country',
    colorByPoint: true,
    innerSize: '20%',
    zMin: 0,
    data: [{
      name: 'Spain',
      y: 30
    }, {
      name: 'France',
      y: 10
    }, {
      name: 'Poland',
      y: 20
    }, {
      name: 'Czech Republic',
      y: 15
    }, {
      name: 'Italy',
      y: 15
    }]
  }]
}

/**
 * @author odin
 * @level Any/DonutsChart
 * @component DonutsChart
 * @description DonutsChart to show the props data
*/
const DonutsChart = ({ options }) => {
  // # states
  const [chartInstance, setChartInstance] = useState(null);

  // - methods
  const chartCallback = chart => {
    setChartInstance(chart);
  }

  // * hooks
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

DonutsChart.propTypes = {
  options: PropTypes.object
};

export default DonutsChart;