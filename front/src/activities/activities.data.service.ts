import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { ActivitiesService } from './activities.service';

@Injectable()
export class ActivitiesDataService {
	private activities = [];

	private state = {
		isInited: false,
		isLoading: false,
	};

	public init () {
		this.state.isInited = true;
		this.state.isLoading = true;

		return this.activitiesService.getAllData().pipe(
			map((data) => {
				this.state.isLoading = false;
				this.setActivities(data);
			})
		);
	}

	public setActivities (data) {
		this.state.isInited = true;
		this.activities = data;
	}

	public getActivities () {
		return this.activities;
	}

	public getState (key?: string) {
		return key ? this.state[key] : this.state;
	}

	constructor(private activitiesService: ActivitiesService) { }
}
