function main(data) {
    const option = {
        backgroundColor: '#2c343c',
        title: {
          text: 'Personal most used language',
          left: 'center',
          top: 20,
          textStyle: {
            color: '#ccc'
          }
        },
        tooltip: {
          trigger: 'item'
        },
        visualMap: {
          show: false,
          min: 0,
          max: 100,
          inRange: {
            colorLightness: [0, 1]
          }
        },
        series: [
          {
            name: 'Language',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: data.map(({ language, percentage }) => {
              return {
                value: percentage * 100,
                name: language
              }
            }).sort(function (a, b) {
              return a.value - b.value;
            }),
            roseType: 'radius',
            label: {
              color: 'rgba(255, 255, 255, 0.3)'
            },
            labelLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              },
              smooth: 0.2,
              length: 10,
              length2: 20
            },
            itemStyle: {
              color: '#c23531',
              shadowBlur: 200,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200;
            }
          }
        ]
      };
  
    return option;
}
