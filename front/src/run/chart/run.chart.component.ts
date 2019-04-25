import { Component, OnInit } from '@angular/core';
import { ActivitiesDataService } from '../../activities/activities.data.service';

import { scan } from 'rxjs/operators';
import { from } from 'rxjs';

interface RunChartConfigItem {
	data: Array<{}>;
	config: {};
}

interface RunChartConfig {
	distance: RunChartConfigItem;
	speed: RunChartConfigItem;
	distanceByMonths: RunChartConfigItem;
}

@Component({
	selector: 'run-chart',
	templateUrl: './run.chart.pug',
})

export class RunChartComponent implements OnInit {
	chart: RunChartConfig = {
		distance: {
			data: [],
			config: {},
		},
		speed: {
			data: [],
			config: {}
		},
		distanceByMonths: {
			data: [],
			config: {},
		},
	};

	data;

	constructor(
		private activitiesDataService: ActivitiesDataService,
	) {}

	setDistanceChart (): void {
		from(this.data).pipe(
			scan((res, val) => {
				return [...res, {
					name: val['title'],
					series: [{
						name: 'Общий пробег',
						value: val['totalDistance'],
					},
				]
				}];
			}, [])
		)
		.subscribe((res: Array<{}>) => this.chart.distance.data = res);

		this.chart.distance.config = {
			view: [this.chart.distance.data.length * 128],
			yAxisLabel: 'км',
		};
	}


	setSpeedChart (): void {
		from(this.data).pipe(
			scan((res, val) => {
				return [...res, {
					name: val['title'],
					series: [{
						name: 'Скорость в движении',
						value: val['movingSpeed']
					}]
				}];
			}, [])
		)
		.subscribe((res: Array<{}>) => this.chart.speed.data = res);

		this.chart.speed.config = {
			view: [this.chart.speed.data.length * 64],
			yAxisLabel: 'км/ч',
		};
	}

	setDistanceByMonthChart (): void {
		from(this.data).pipe(
			scan((res, val) => {
				return [...res, {
					name: val['title'],
					series: val['distanceByMonths']
				}];
			}, []),
		)
		.subscribe((res: Array<{}>) => this.chart.distanceByMonths.data = res);

		this.chart.distanceByMonths.config = {
			view: [this.chart.distanceByMonths.data.length * 192],
			yAxisLabel: 'км',
			isMonthsColors: true,
		};
	}

	ngOnInit () {
		this.data = this.activitiesDataService.getData('general.Run.seasons');

		this.setDistanceChart();
		this.setSpeedChart();
		this.setDistanceByMonthChart();
	}
}
