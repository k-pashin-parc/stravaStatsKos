import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ExamplatData } from '../config/data.config';

@Injectable()
export class ActivitiesService {
	private url = {
		all: '/api/summary'
	};

	constructor (private http: HttpClient) { }

	public getAllData(): Observable<object> {
		return this.http
			.get(`${this.url.all}?isExampleData=${ExamplatData.isExampleData}`);
	}
}
