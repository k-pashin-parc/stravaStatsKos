import { Component } from '@angular/core';
import { ActivitiesDataService } from '../../activities/activities.data.service';
import { DeviceService } from '../../common/device/device.service';
import { DetailComponent } from 'src/detail/detail.component';

@Component({
	selector: 'bike-detail',
	templateUrl: 'bike.detail.component.pug',
})
export class BikeDetailComponent extends DetailComponent {
	constructor (
		activitiesDataService: ActivitiesDataService,
		deviceService: DeviceService
	) {
		super(
			'Ride',
			activitiesDataService,
			deviceService,
		);
	}
}
