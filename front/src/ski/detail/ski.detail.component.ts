import { Component, OnInit } from '@angular/core';
import { ActivitiesDataService } from './../../activities/activities.data.service';
import { FieldConfig } from './../../config/table.config';
import { DeviceService, ScreeState } from './../../common/device/device.service';

interface SkiActivityType {
	name: string;
	field: string;
	isSelected: boolean;
}

@Component({
	selector: 'ski-detail',
	templateUrl: 'ski.detail.component.pug',
	styleUrls: ['./ski.detail.component.sass']
})

export class SkiDetailComponent implements OnInit {
	private data: object[];
	private originalData: object[];

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

	private skiActivitiesTypes: Array<SkiActivityType> = [{
		name: 'Заволга',
		field: 'is_not_quick',
		isSelected: true
	}, {
		name: 'Пляж',
		field: 'is_quick',
		isSelected: true
	}, {
		name: 'Чайка',
		field: 'is_on_base',
		isSelected: true
	}];

	private screenState: ScreeState;

	private filter (): void {
		const selectedFiltersKeys = this.skiActivitiesTypes
			.filter(el => el.isSelected)
			.map(el => el.field);

		this.data = this.originalData.filter(activity => {
			return Object
				.entries(activity)
				.filter(el => el[1])
				.map(el => el[0])
				.filter(el => selectedFiltersKeys.includes(el))
				.length;
		});
	}

	constructor (
		private activitiesDataService: ActivitiesDataService,
		private deviceService: DeviceService
	) { }

	ngOnInit () {
		this.screenState = this.deviceService.getScreenInfo();
		this.data = this.activitiesDataService.getActivities('Ski')['activities'];
		this.originalData = [...this.data];

		if (this.screenState.isMobile) {
			this.data.forEach((el: any) => {
				el.speedConcat = `${el.moving_speed} (${el.total_speed})`;
			});
		}
	}
}
