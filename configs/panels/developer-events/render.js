function main(data) {
  option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      show: false
    },
    dataset: {
      dimensions: ['type', 'num'],
      source: data
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {},
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '20',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      }
    }]
  };

  return option;
}