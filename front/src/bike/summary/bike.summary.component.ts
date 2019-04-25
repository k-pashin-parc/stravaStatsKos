import { Component } from '@angular/core';
import { ActivitiesDataService } from './../../activities/activities.data.service';
import { SummaryComponent } from 'src/summary/summary.component';

@Component({
	selector: 'bike-summary',
	templateUrl: 'bike.summary.component.pug',
})
export class BikeSummaryComponent extends SummaryComponent {
	constructor (
		activitiesDataService: ActivitiesDataService,
	) {
		super(
			'Ride',
			activitiesDataService,
		);
	}
}
