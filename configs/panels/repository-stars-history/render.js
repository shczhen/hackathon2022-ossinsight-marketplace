function main(data) {
  // Do remember to return the echart option here.
  const option = {
    xAxis: {
      type: 'category',
      data: data.map((i) => i.event_month)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: data.map((i) => i.total),
        type: 'line'
      }
    ]
  };

  return option;
}
