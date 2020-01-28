import { Component } from '@angular/core';

import { ActivitiesDataService } from './../../activities/activities.data.service';
import { DeviceService } from './../../common/device/device.service';
import { CommonUtilitiesService } from './../../common/utilities';
import { DetailComponent } from './../../detail/detail.component';

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
	skiActivitiesTypes: Array<SkiActivityType> = [{
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


	filter (): void {
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
		commonUtilitiesService: CommonUtilitiesService,
	) {
		super(
			'Ski',
			activitiesDataService,
			deviceService,
			commonUtilitiesService
		);
	}
}
