function main(data) {
  option = {
    legend: {},
    tooltip: {},
    dataset: {
      dimensions: ['type', 'num'],
      source: data
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {},
    series: [{ type: 'bar' }]
  };

  return option;
}