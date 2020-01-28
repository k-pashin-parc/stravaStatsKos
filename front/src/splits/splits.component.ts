import { Component, OnInit } from '@angular/core';

import { FieldConfig } from './../config/table.config';
import { HeaderTitleService } from './../common/header_title/header.title.service';
import { ActivitiesDataService } from './../activities/activities.data.service';

@Component({
	selector: 'splits',
	templateUrl: 'splits.component.pug',
})

export class SplitsComponent implements OnInit {
	splits: object[];

	fields: Array<FieldConfig> = [{
		title: '№ п/п',
		fieldName: 'index'
	}, {
		title: 'S, км',
		fieldName: 'distance'
	}, {
		title: 'V, км/ч',
		fieldName: 'moving_speed'
	}];

	constructor (
		private headerTitle: HeaderTitleService,
		private activitiesDataService: ActivitiesDataService,
	) {}

	ngOnInit () {
		const data = this.activitiesDataService.getData('splits');

		this.headerTitle.setTitle(`Отрезки (${data['name']})`);
		this.splits = data['splits'];
	}
}

