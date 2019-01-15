import { Component, OnInit } from '@angular/core';
import { ActivitiesDataService } from './../../activities/activities.data.service';
import { FieldConfig } from './../../config/table.config';
import { DeviceService, ScreeState } from './../../common/device/device.service';

@Component({
	selector: 'ski-detail',
	templateUrl: 'ski.detail.component.pug',
})

export class SkiDetailComponent implements OnInit {
	private data: [];

	private mobileFields: Array<FieldConfig> = [{
		title: 'Название',
		fieldName: 'name'
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

	private screenState: ScreeState;

	constructor (
		private activitiesDataService: ActivitiesDataService,
		private deviceService: DeviceService
	) { }

	ngOnInit () {
		this.screenState = this.deviceService.getScreenInfo();
		this.data = this.activitiesDataService.getActivities('Ski')['activities'];

		if (this.screenState.isMobile) {
			this.data.forEach((el: any) => {
				el.speedConcat = `${el.moving_speed} (${el.total_speed})`;
			});
		}
	}
}
