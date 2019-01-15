import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ActivitiesService } from './activities.service';

@Injectable()
export class ActivitiesDataService {
	private activities: object[];

	private state = {
		isInited: false,
		isLoading: false,
	};

	public init () {
		this.state.isLoading = true;

		return this.activitiesService.getAllData()
			.pipe(
				map((response: object) => {
					this.state.isInited = true;
					this.state.isLoading = false;
					this.setActivities(response['data']);
				}),
				catchError((error) => {
					alert(error.error);
					this.state.isLoading = false;

					return throwError('Something gone wrong again.');
				})
			);
	}

	public setActivities (data: object[]): void {
		this.state.isInited = true;
		this.activities = data;
	}

	public getActivities (field?: string): any {
		return field ? this.activities[field] : this.activities;
	}

	public getState (key?: string): object {
		return key ? this.state[key] : this.state;
	}

	constructor(private activitiesService: ActivitiesService) { }
}
