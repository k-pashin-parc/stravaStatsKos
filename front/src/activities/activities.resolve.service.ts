import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { ActivitiesDataService } from './activities.data.service';

@Injectable()
export class ActivitiesResolveService implements Resolve<any> {
	constructor (private activitiesDataService: ActivitiesDataService) { }

	resolve () {
		if (!this.activitiesDataService.getState('isInited')) {
			return this.activitiesDataService.init();
		}
	}
}
