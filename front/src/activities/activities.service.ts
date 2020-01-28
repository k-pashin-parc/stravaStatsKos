import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { get } from 'lodash';

import { ExamplatData } from '../config/data.config';

declare interface IActivityItem {
	id: string;
	distance: number;
}

@Injectable({
	providedIn: 'root'
})
export class ActivitiesService {
	private url = {
		all: '/api/summary',
		splits: '/api/splits',
		segments: '/api/segments',
		segmentLeaderboard: '/api/segmentLeaderboard',
		myEfforts: '/api/segmentMyEfforts',
		map: '/api/segmentMap',
	};

	constructor (private http: HttpClient) { }

	getAllData(code: string): Observable<{}> {
		return this.http.get(`${this.url.all}?isExampleData=${ExamplatData.isExampleData}&code=${code}`);
	}

	getSplits(id: string, code: string): Observable<{}> {
		return this.http.get(`${this.url.splits}?code=${code}`, {
				params: {
					id: id
				}
			});
	}

	getSegments (id: string, code: string): Observable<{}> {
		const params = {
			id: id
		};

		return this.http.get(`${this.url.segments}?code=${code}`, {params: params});
	}

	getSegmentLeaderboard (item: IActivityItem): Observable<{}> {
		const params = {
			id: item.id,
			distance: item.distance
		};

		return this.http.get(this.url.segmentLeaderboard, {params: params as any});
	}

	getSegmentMyEfforts (item: IActivityItem): Observable<{}> {
		const params = {
			id: item.id,
			distance: item.distance
		};

		return this.http.get(this.url.myEfforts, {params: params as any});
	}

	getSegmentMap (id: string): Observable<{}> {
		const params = {
			id: id
		};

		return this.http.get(this.url.map, {
			params: params
		});
	}

	getAllSegmentData (item: IActivityItem): Observable<{}> {
		return forkJoin(
			this.getSegmentLeaderboard(item),
			this.getSegmentMyEfforts(item),
			this.getSegmentMap(item.id),
		).pipe(
			map((response) => {
				return {
					leaderboard: get(response, '[0].entries'),
					myEfforts: response[1],
					map: response[2],
				};
			})
		);
	}
}
