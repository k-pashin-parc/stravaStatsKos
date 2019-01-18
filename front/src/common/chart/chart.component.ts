import { Component, OnInit, Input } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ChartConfigDefault, ChartConfig } from './../../common/chart/chart.config';
import { from } from 'rxjs';
import { mergeMap, take, scan } from 'rxjs/operators';
import { ChartMonthsColors } from './chart.config';

@Component({
	selector: 'common-chart',
	templateUrl: 'chart.component.pug',
	styleUrls: ['./chart.component.sass']
})
export class ChartComponent implements OnInit {
	@Input() chartData: object[];
	@Input() chartConfig: ChartConfig;
	private legend: object[] = [];

	constructor () {}

	ngOnInit () {
		this.chartConfig = Object.assign({}, ChartConfigDefault, this.chartConfig);

		if (this.chartConfig.isMonthsColors) {
			this.chartConfig.customColors = month => ChartMonthsColors[month];
		}

		if (this.chartConfig.showCustomLegend) {
			from(this.chartData)
			.pipe(
				take(1),
				mergeMap(el => el['series']),
				scan((res, val) => {
					return [...res, {
						name: val['name'],
						style: {
							background: this.chartConfig.isMonthsColors ? ChartMonthsColors[val['name']] : this.chartConfig.colorScheme.domain[res.length]
						}
					}];
				}, [])
			)
			.subscribe((res: object[]) => {
				this.legend = res;
			});
		}
	}
}
