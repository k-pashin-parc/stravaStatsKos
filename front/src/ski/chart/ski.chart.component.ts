import { Component, OnInit } from '@angular/core';
import { ActivitiesDataService } from '../../activities/activities.data.service';

import { scan } from 'rxjs/operators';
import { from } from 'rxjs';

interface SkiChartConfigItem {
	data: Array<{}>;
	config: {};
}

interface SkiChartConfig {
	distance: SkiChartConfigItem;
	speed: SkiChartConfigItem;
	distanceByMonths: SkiChartConfigItem;
	detailSpeed: SkiChartConfigItem;
}

@Component({
	selector: 'ski-chart',
	templateUrl: 'ski.chart.component.pug',
})
export class SkiChartComponent implements OnInit {
	chart: SkiChartConfig = {
		distance: {
			data: [],
			config: {}
		},
		speed: {
			data: [],
			config: {}
		},
		detailSpeed: {
			data: [],
			config: {}
		},
		distanceByMonths: {
			data: [],
			config: {}
		}
	};

	private data;

	setDistanceChart (): void {
		from(this.data).pipe(
			scan((res, val) => {
				return [...res, {
					name: val['title'],
					series: [{
						name: 'Общий пробег',
						value: val['totalDistance']
					}, {
						name: 'По пляжу',
						value: val['quickRidesDistance']
					}, {
						name: 'С Саней',
						value: val['companyRidesDistance']
					}]
				}];
			}, [])
		)
		.subscribe((res: Array<object>) => this.chart.distance.data = res);

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
					}, {
						name: 'Общ. скорость',
						value: val['totalSpeed']
					}]
				}];
			}, [])
		)
		.subscribe((res: Array<object>) => this.chart.speed.data = res);

		this.chart.speed.config = {
			view: [this.chart.speed.data.length * 86],
			yAxisLabel: 'км/ч',
		};
	}

	setDetailSpeedChart (): void {
		from(this.data).pipe(
			scan((res, val) => {
				return [...res, {
					name: val['title'],
					series: [{
						name: 'Скорость за Волгу',
						value: val['notQuickRidesMovingSpeed']
					}, {
						name: 'Общ. скорость за Волгу',
						value: val['notQuickRidesTotalSpeed']
					}, {
						name: 'Скорость по пляжу',
						value: val['quickRidesMovingSpeed']
					}, {
						name: 'Общ. скорость по пляжу',
						value: val['quickRidesTotalSpeed']
					}]
				}];
			}, [])
		)
		.subscribe((res: Array<object>) => this.chart.detailSpeed.data = res);

		this.chart.detailSpeed.config = {
			view: [this.chart.detailSpeed.data.length * 128],
			yAxisLabel: 'км/ч'
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
		.subscribe((res: Array<object>) => this.chart.distanceByMonths.data = res);

		this.chart.distanceByMonths.config = {
			view: [this.chart.distanceByMonths.data.length * 168],
			yAxisLabel: 'км',
			isMonthsColors: true,
		};
	}

	constructor (
		private activitiesDataService: ActivitiesDataService,
	) { }

	ngOnInit () {
		this.data = this.activitiesDataService.getData('general.Ski.seasons');

		this.setDistanceChart();
		this.setSpeedChart();
		this.setDetailSpeedChart();
		this.setDistanceByMonthChart();
	}
}
