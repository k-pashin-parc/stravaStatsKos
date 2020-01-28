import { Component } from '@angular/core';
import { ActivitiesDataService } from '../../activities/activities.data.service';
import { DeviceService } from '../../common/device/device.service';
import { DetailComponent } from 'src/detail/detail.component';
import { CommonUtilitiesService } from './../../common/utilities';

@Component({
	selector: 'bike-detail',
	templateUrl: 'bike.detail.component.pug',
})
export class BikeDetailComponent extends DetailComponent {
	constructor (
		activitiesDataService: ActivitiesDataService,
		deviceService: DeviceService,
		commonUtilitiesService: CommonUtilitiesService
	) {
		super(
			'Ride',
			activitiesDataService,
			deviceService,
			commonUtilitiesService
		);
	}
}
