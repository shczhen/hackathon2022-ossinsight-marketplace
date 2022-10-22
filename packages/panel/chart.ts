import winston from "winston";
import vm from 'node:vm';
import { EChartsCoreOption } from "echarts";

export async function getChartOption(script: string, data: any): Promise<EChartsCoreOption> {
    const context = { data: data || [], result: null };
    
    vm.createContext(context);
    const code = `${script}; result = main(data);`;
  
    try {
      vm.runInContext(code, context);
      if (!context.result) {
        throw new Error('The render script must set the global variable named `option`.');
      }
      const result:EChartsCoreOption = context.result as EChartsCoreOption;
      return result;
    } catch (error: any) {
      winston.error('Failed to get chart option: ', error);
      throw error;
    }
}
  