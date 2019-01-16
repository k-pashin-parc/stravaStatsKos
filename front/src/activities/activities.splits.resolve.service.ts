import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { ActivitiesDataService } from './activities.data.service';

@Injectable()
export class ActivitiesSplitsResolveService implements Resolve<any> {
	constructor (private activitiesDataService: ActivitiesDataService) { }

	resolve (route: ActivatedRouteSnapshot) {
		return this.activitiesDataService.getSplits(route.params.id);
	}
}
