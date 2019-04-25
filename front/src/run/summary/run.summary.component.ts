import { Component } from '@angular/core';
import { ActivitiesDataService } from './../../activities/activities.data.service';
import { SummaryComponent } from 'src/summary/summary.component';

@Component({
	selector: 'run-summary',
	templateUrl: 'run.summary.component.pug',
})
export class RunSummaryComponent extends SummaryComponent {
	constructor (
		activitiesDataService: ActivitiesDataService,
	) {
		super(
			'Run',
			activitiesDataService,
		);
	}
}
