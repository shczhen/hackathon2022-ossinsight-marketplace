import { EChartsCoreOption, init } from "echarts";

export function renderSVG(option:EChartsCoreOption):string {
    // @ts-ignore
    const chart = init(null, null, {
      renderer: 'svg', // must use SVG rendering mode
      ssr: true, // enable SSR
      width: 1000, // need to specify height and width
      height: 600,
    });
  
    chart.setOption(option);
    return chart.renderToSVGString();
}