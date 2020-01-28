import { OnInit } from '@angular/core';
import { ActivitiesDataService } from './../activities/activities.data.service';
import { FieldConfig } from './../config/table.config';
import { clone, map } from 'lodash';

export class SummaryComponent implements OnInit {
	data;

	seasonsFields: Array<FieldConfig> = [{
		title: 'Сезон',
		fieldName: 'title'
	}, {
		title: 'S, км',
		fieldName: 'distanceConcat'
	}];

	speedFields: Array<FieldConfig> = [{
		title: 'Сезон',
		fieldName: 'title'
	}, {
		title: 'V, км/ч',
		fieldName: 'speedConcat'
	}];

	speedDetailSkiFields: Array<FieldConfig> = [{
		title: 'Сезон',
		fieldName: 'title'
	}, {
		title: 'Волга, км/ч',
		fieldName: 'notQuickRidesSpeedConcat'
	}, {
		title: 'Пляж, км/ч',
		fieldName: 'quickRidesSpeedConcat'
	}];

	distanceByMonthsFields: Array<FieldConfig> = [{
		title: 'Месяц',
		fieldName: 'name'
	}, {
		title: 'S, км',
		fieldName: 'value'
	}];

	private getIsSki (): boolean {
		return this.activityType === 'Ski';
	}

	constructor (
		private activityType: string,
		private activitiesDataService: ActivitiesDataService,
	) { }

	ngOnInit () {
		this.data = map(this.activitiesDataService.getData(`general.${this.activityType}.seasons`), clone);

		this.data.forEach(el => {
			if (this.getIsSki()) {
				const arr = el.title.split('/');

				el.title = `${arr[0].substring(2, 4)}/${arr[1].substring(2, 4)}`;
			}

			el.distanceConcat = `${el.totalDistance} (${el.companyRidesDistance})`;
			el.speedConcat = `${el.movingSpeed} (${el.totalSpeed})`;
			el.notQuickRidesSpeedConcat = `${el.notQuickRidesMovingSpeed} (${el.notQuickRidesTotalSpeed})`;
			el.quickRidesSpeedConcat = `${el.quickRidesMovingSpeed} (${el.quickRidesTotalSpeed})`;
			el.distanceByMonths = el.distanceByMonths.filter(month => month.value > 0);
		});
	}
}
