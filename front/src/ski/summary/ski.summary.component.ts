import { Component, OnInit } from '@angular/core';
import { ActivitiesDataService } from './../../activities/activities.data.service';
import { FieldConfig } from './../../config/table.config';
import { DeviceService, ScreeState } from './../../common/device/device.service';

@Component({
	selector: 'ski-summary',
	templateUrl: 'ski.summary.component.pug',
})

export class SkiSummaryComponent implements OnInit {
	private data;

	private seasonsFields: Array<FieldConfig> = [{
		title: 'сезон',
		fieldName: 'titleShort'
	}, {
		title: 'S',
		fieldName: 'totalDistance'
	}, {
		title: 'S комп.',
		fieldName: 'companyRidesDistance'
	}];

	private speedFields: Array<FieldConfig> = [{
		title: 'сезон',
		fieldName: 'titleShort'
	}, {
		title: 'в движ.',
		fieldName: 'movingSpeed'
	}, {
		title: 'общ.',
		fieldName: 'totalSpeed'
	}];

	private speedDetailFields: Array<FieldConfig> = [{
		title: 'сезон',
		fieldName: 'titleShort'
	}, {
		title: 'за Волгу',
		fieldName: 'notQuickRidesMovingSpeed'
	}, {
		title: 'общ.',
		fieldName: 'notQuickRidesTotalSpeed'
	}, {
		title: 'по пляжу',
		fieldName: 'quickRidesMovingSpeed'
	}, {
		title: 'общ.',
		fieldName: 'quickRidesTotalSpeed'
	}];

	private distanceByMonthsFields: Array<FieldConfig> = [{
		title: 'месяц',
		fieldName: 'title'
	}, {
		title: 'S',
		fieldName: 'value'
	}];

	private screenState: ScreeState;

	constructor (
		private activitiesDataService: ActivitiesDataService,
		private deviceService: DeviceService
	) { }

	ngOnInit () {
		this.screenState = this.deviceService.getScreenInfo();
		this.data = this.activitiesDataService.getActivities('Ski')['seasons'];

		this.data.forEach(el => {
			const arr = el.title.split('/');

			el.titleShort = `${arr[0].substring(2, 4)}/${arr[1].substring(2, 4)}`;
		});
	}
}
