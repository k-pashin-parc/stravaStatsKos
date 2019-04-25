import { DetailComponent } from './../../detail/detail.component';
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

export class SkiDetailComponent extends DetailComponent {
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


	protected filter (): void {
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
		activitiesDataService: ActivitiesDataService,
		deviceService: DeviceService,
	) {
		super(
			'Ski',
			activitiesDataService,
			deviceService,
		);
	}
}
