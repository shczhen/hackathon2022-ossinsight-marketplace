import type { NextApiRequest, NextApiResponse } from 'next';
import { init } from 'echarts';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // @ts-ignore
  const chart = init(null, null, {
    renderer: 'svg', // must use SVG rendering mode
    ssr: true, // enable SSR
    width: 400, // need to specify height and width
    height: 300,
  });

  const option = {
    title: {
      text: 'ECharts 入门示例',
    },
    tooltip: {},
    legend: {
      data: ['销量'],
    },
    xAxis: {
      data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20],
      },
    ],
  };

  // use setOption as normal
  chart.setOption(option);

  // Output a string
  const svgStr = chart.renderToSVGString();

  res.writeHead(200, {
    'Content-Type': 'image/svg+xml',
    'Cache-Control': `public, max-age=${10 * 60 * 60 * 24}`,
  });
  res.write(svgStr);
  res.end();
}
