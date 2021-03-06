import { Component } from '@angular/core';
import { ActivitiesDataService } from './../../activities/activities.data.service';
import { SummaryComponent } from 'src/summary/summary.component';

@Component({
	selector: 'ski-summary',
	templateUrl: 'ski.summary.component.pug',
})
export class SkiSummaryComponent extends SummaryComponent {
	constructor (
		activitiesDataService: ActivitiesDataService,
	) {
		super(
			'Ski',
			activitiesDataService,
		);
	}
}
