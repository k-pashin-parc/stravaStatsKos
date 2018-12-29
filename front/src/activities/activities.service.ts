import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ActivitiesService {
	private url = {
		all: '/api/summary'
	};

	constructor (private http: HttpClient) { }

	public getAllData()  {
		return this.http.get(`${this.url.all}?isExampleData=false`);
	}
}
