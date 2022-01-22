// Ref: https://www.highcharts.com.cn/docs/highcharts-react
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsSankey from 'highcharts/modules/sankey';
import HighchartsOrganization from 'highcharts/modules/organization';
import HighchartsReact from 'highcharts-react-official';

HighchartsSankey(Highcharts);
HighchartsOrganization(Highcharts);

const defaultOption = {
  chart: {
    height: 500,
    width: 800,
    inverted: true
  },
  credits: {
    enabled: false
  },
  title: {
    text: null
  },
  accessibility: {
    point: {
      descriptionFormatter: function (point) {
        var nodeName = point.toNode.name,
          nodeId = point.toNode.id,
          nodeDesc = nodeName === nodeId ? nodeName : nodeName + ', ' + nodeId,
          parentDesc = point.fromNode.id;
        return point.index + '. ' + nodeDesc + ', reports to ' + parentDesc + '.';
      }
    }
  },
  tooltip: {
    outside: true
  }
}
const OrgChart = ({ options }) => {
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
        ...defaultOption,
        ...options
      }}
    />
  );
};

OrgChart.propTypes = {
  options: PropTypes.object
};

export default OrgChart;