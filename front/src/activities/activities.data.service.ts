import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ActivitiesService } from './activities.service';

@Injectable()
export class ActivitiesDataService {
	private data = {
		general: [],
		splits: {},
		segments: [],
	};

	private state = {
		isInited: false,
		isLoading: false,
	};
	private code;

	init () {
		this.state.isLoading = true;

		this.code = decodeURIComponent(
			window.location.search.replace(
				new RegExp('^(?:.*[&\\?]' + encodeURIComponent('code').replace(/[\.\+\*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'), '$1'
			)
		);

		if (this.code) {
			return this.activitiesService.getAllData(this.code)
				.pipe(
					map((response: object) => {
						this.state.isInited = true;
						this.state.isLoading = false;
						this.data.general = response['data'];
						this.code = null;

						return response;
					}),
					catchError((error) => {
						alert(error.error);
						this.state.isLoading = false;

						return throwError('Something gone wrong again.');
					})
				);
		} else {
			const redirect_url = 'http://localhost:4200/';
			const client_id = 15224;
			const url = `https://www.strava.com/oauth/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_url}&approval_prompt=force&scope=activity:read_all;write`;

			window.location.assign(url);
		}
	}

	getData (path: string): any {
		let res = this.data;

		const keys = path.split('.');

		for (let i = 0, length = keys.length; i < length; i++) {
			const key = keys[i];

			res = res[key];

			if (typeof res === 'undefined') {
				break;
			}
		}

		return res;
	}

	getState (key?: string): object {
		return key ? this.state[key] : this.state;
	}

	getSplits (id: string): Observable<object> {
		this.state.isLoading = true;

		return this.activitiesService
			.getSplits(id)
			.pipe(
				map((response: object) => {
					this.state.isLoading = false;
					this.data.splits = response;

					return response;
				}),
				catchError((error) => {
					alert(error.error);
					this.state.isLoading = false;

					return throwError('Something gone wrong again.');
				})
			);
	}

	getSegments (id: string): Observable<object> {
		this.state.isLoading = true;

		return this.activitiesService
			.getSegments(id)
			.pipe(
				map((response: object) => {
					this.state.isLoading = false;
					this.data.segments = response as [];

					return response;
				}),
				catchError((error) => {
					alert(error.error);
					this.state.isLoading = false;

					return throwError('Something gone wrong again.');
				})
			);
	}

	constructor(private activitiesService: ActivitiesService) { }
}
