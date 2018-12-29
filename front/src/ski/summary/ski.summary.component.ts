import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivitiesDataService } from './../../activities/activities.data.service';

@Component({
	selector: 'ski-summary',
	templateUrl: 'ski.summary.component.pug',
})

export class SkiSummaryComponent implements OnInit {
	constructor (
		private activatedRoute: ActivatedRoute,
		private activitiesDataService: ActivitiesDataService
	) { }

	ngOnInit () {

	}
}
