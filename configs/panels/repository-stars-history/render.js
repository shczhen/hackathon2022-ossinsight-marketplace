function main(data) {
  // Do remember to return the echart option here.
  const myOption = {
    xAxis: {
      type: 'category',
      data: data.map((i) => i.event_day),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: data.map((i) => i.total),
        type: 'bar',
      },
    ],
  };
  return myOption;
}
