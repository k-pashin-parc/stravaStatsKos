import { Component } from '@angular/core';
import { ActivitiesDataService } from './../../activities/activities.data.service';
import { DeviceService } from './../../common/device/device.service';
import { DetailComponent } from 'src/detail/detail.component';
import { CommonUtilitiesService } from './../../common/utilities';

@Component({
	selector: 'run-detail',
	templateUrl: 'run.detail.component.pug',
})
export class RunDetailComponent extends DetailComponent {
	constructor (
		activitiesDataService: ActivitiesDataService,
		deviceService: DeviceService,
		commonUtilitiesService: CommonUtilitiesService
	) {
		super(
			'Run',
			activitiesDataService,
			deviceService,
			commonUtilitiesService
		);
	}
}
