/**
* Implement the main function here.
* We will pass the result of your SQL query to the this function.
* You should not use any variables starting with '__' in this function. (such as '__result__')
* @param data Result of your SQL query.
*/
function main(data) {
	// Do remember to return the echart option here.
	const myOption = {
		title: {
			text: 'Additions / Deletions',
			left: 'center'
		},
		grid: {
			bottom: 80
		},
		toolbox: {
			feature: {
				dataZoom: {
					yAxisIndex: 'none'
				},
				restore: {},
				saveAsImage: {}
			}
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				animation: false,
				label: {
					backgroundColor: '#505765'
				}
			}
		},
		legend: {
			data: ['additions', 'deletions'],
			left: 10
		},
		dataZoom: [
			{
				show: true,
				realtime: true,
				start: 0,
				end: data.length
			},
			{
				type: 'inside',
				realtime: true,
				start: 0,
				end: data.length
			}
		],
		xAxis: [
			{
				type: 'category',
				boundaryGap: false,
				axisLine: { onZero: false },
				data: data.map(i => i.event_month)
			}
		],
		yAxis: [
			{
				name: 'Additions',
				type: 'value'
			},
			{
				name: 'Deletions',
				nameLocation: 'start',
				alignTicks: true,
				type: 'value',
				inverse: true
			}
		],
		series: [
			{
				name: 'Additions',
				type: 'line',
				areaStyle: {},
				lineStyle: {
					width: 1
				},
				emphasis: {
					focus: 'series'
				},
				data: data.map(i => i.additions)
			},
			{
				name: 'Deletions',
				type: 'line',
				yAxisIndex: 1,
				areaStyle: {},
				lineStyle: {
					width: 1
				},
				emphasis: {
					focus: 'series'
				},
				data: data.map(i => i.deletions)
			}
		]
	};
	return myOption;
}
