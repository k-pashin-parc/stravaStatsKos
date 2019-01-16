import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ExamplatData } from '../config/data.config';

@Injectable()
export class ActivitiesService {
	private url = {
		all: '/api/summary',
		splits: '/api/splits',
	};

	constructor (private http: HttpClient) { }

	getAllData(): Observable<object> {
		return this.http
			.get(`${this.url.all}?isExampleData=${ExamplatData.isExampleData}`);
	}

	getSplits(id): Observable<object> {
		return this.http
			.get(this.url.splits, {
				params: {
					id: id
				}
			});
	}
}
