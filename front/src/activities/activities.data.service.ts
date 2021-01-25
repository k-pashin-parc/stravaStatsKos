import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { CommonUtilitiesService } from './../common/utilities';
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

	private code: string;

	constructor(
		private activitiesService: ActivitiesService,
		private commonUtilitiesService: CommonUtilitiesService,
	) { }

	init () {
		this.code = this.getQueryStringKeyValue('code');

		if (this.code) {
			this.state.isLoading = true;

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
			this.commonUtilitiesService.redirectToAuth('/' + this.commonUtilitiesService.getDefaultRoute());
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
		this.code = this.getQueryStringKeyValue('code');

		if (this.code) {
			this.state.isLoading = true;

			return this.activitiesService
				.getSplits(id, this.code)
				.pipe(
					map((response: object) => {
						this.state.isLoading = false;
						this.data.splits = response;
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
			this.commonUtilitiesService.redirectToAuth(`splits/${id}`);
		}
	}

	getSegments (id: string): Observable<object> {
		this.code = this.getQueryStringKeyValue('code');

		if (this.code) {
			this.state.isLoading = true;

			return this.activitiesService
				.getSegments(id, this.code)
				.pipe(
					map((response: object) => {
						this.state.isLoading = false;
						this.data.segments = response as [];
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
			this.commonUtilitiesService.redirectToAuth(`segments/${id}`);
		}
	}

	private getQueryStringKeyValue (key): string {
		const reg = new RegExp('[?&]' + key + '=([^&#]*)', 'i');
		const string = reg.exec(window.location.href);

		return string ? decodeURIComponent(string[1]) : null;
	}
}
