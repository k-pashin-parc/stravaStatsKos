import { Component } from '@angular/core';

import { ActivitiesDataService } from './../activities/activities.data.service';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.pug',
	styleUrls: ['./app.component.sass']
})
export class AppComponent {
	constructor(private activitiesDataService: ActivitiesDataService) { }
}
