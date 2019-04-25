import { Component, OnInit } from '@angular/core';
import { ActivitiesDataService } from '../activities/activities.data.service';
import { FieldConfig } from '../config/table.config';
import { DeviceService, ScreeState } from '../common/device/device.service';

export class DetailComponent implements OnInit {
	protected data: {}[];
	protected originalData: {}[];

	mobileFields: Array<FieldConfig> = [{
		title: 'Название',
		fieldName: 'name',
		type: 'link',
		additionalField: {
			fieldName: 'date_display'
		},
		additionalLinks: [{
			name: 'скорости',
			url: '/splits'
		}],
	}, {
		title: 'S, км',
		fieldName: 'distance'
	}, {
		title: 'V, км/ч',
		fieldName: 'speedConcat'
	}, {
		title: 'T',
		fieldName: 'elapsed_time',
		type: 'time'
	}, {
		title: 'Отдых',
		fieldName: 'rest_time',
		type: 'time'
	}];

	generalFields: Array<FieldConfig> = [{
		title: 'Название',
		fieldName: 'name',
		type: 'link',
		additionalLinks: [{
			name: 'скорости',
			url: '/splits'
		}],
	}, {
		title: 'Расстояние, км',
		fieldName: 'distance',
	}, {
		title: 'Скор. в движ., км/ч',
		fieldName: 'moving_speed',
	}, {
		title: 'Время',
		fieldName: 'elapsed_time',
		type: 'time'
	}, {
		title: 'Отдых',
		fieldName: 'rest_time',
		type: 'time'
	}, {
		title: 'Дата',
		fieldName: 'date_display',
	}];

	screenState: ScreeState;

	protected filter (): void {
		this.data = this.originalData.filter(activity => {
			return Object
				.entries(activity)
				.filter(el => el[1])
				.map(el => el[0])
				.length;
		});
	}

	constructor (
		private activityType: string,
		private activitiesDataService: ActivitiesDataService,
		private deviceService: DeviceService,
	) { }

	ngOnInit () {
		this.screenState = this.deviceService.getScreenInfo();
		this.data = this.activitiesDataService.getData(`general.${this.activityType}.activities`);
		this.originalData = [...this.data];

		this.data.forEach((el: any) => {
			el.speedConcat = `${el.moving_speed} (${el.total_speed})`;
			el.url = `http://strava.com/activities/${el.id}`;
		});
	}
}
