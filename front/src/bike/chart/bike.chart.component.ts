import { Component, OnInit } from '@angular/core';
import { ActivitiesDataService } from '../../activities/activities.data.service';

import { scan } from 'rxjs/operators';
import { from } from 'rxjs';

interface BikeChartConfigItem {
	data: Array<{}>;
	config: {};
}

interface BikeChartConfig {
	distance: BikeChartConfigItem;
	distanceByMonths: BikeChartConfigItem;
}

@Component({
	selector: 'bike-chart',
	templateUrl: './bike.chart.pug',
})

export class BikeChartComponent implements OnInit {
	chart: BikeChartConfig = {
		distance: {
			data: [],
			config: {},
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
			view: [this.chart.distanceByMonths.data.length * 164],
			yAxisLabel: 'км',
			isMonthsColors: true,
		};
	}

	ngOnInit () {
		this.data = this.activitiesDataService.getData('general.Ride.seasons');
		this.setDistanceChart();
		this.setDistanceByMonthChart();
	}
}
