import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ActivitiesDataService } from './../activities/activities.data.service';
import { HeaderTitleService } from './../common/header_title/header.title.service';
import { FieldConfig } from './../config/table.config';
import { SegmentDetailComponent } from './../segment_detail/segment_detail.component';
import { ActivitiesService } from './../activities/activities.service';

@Component({
	selector: 'segments',
	templateUrl: './segments.pug',
})
export class SegmentsComponent {
	private data: {};
	private tableTitle;
	private sectionName = 'Участки';

	private segmentMode = {
		values: [{
			Id: 'all',
			Name: 'Все'
		}, {
			Id: 'my',
			Name: 'Только мои'
		}]
	};

	private expandableParams = {
		component: SegmentDetailComponent,
		getData: (item) => {
			return this.activitiesService.getAllSegmentData(item);
		},
	};

	private segmentsFields: Array<FieldConfig> = [{
		title: 'Название',
		fieldName: 'name',
		type: 'expand',
	}, {
		title: 'Расстояние (км)',
		fieldName: 'distance',
	}, {
		title: 'Скор. в движ. (км/ч)',
		fieldName: 'moving_speed',
	}, {
		title: 'Общая скорость (км/ч)',
		fieldName: 'total_speed',
		type: 'time'
	}, {
		title: 'Время',
		fieldName: 'elapsed_time',
		type: 'time'
	}, {
		title: 'Отдых',
		fieldName: 'rest_time',
		type: 'time'
	}];

	constructor(
		private route: ActivatedRoute,
		private activitiesDataService: ActivitiesDataService,
		private headerTitleService: HeaderTitleService,
		private activitiesService: ActivitiesService,
	) {
		this.setTitle(this.sectionName);

		this.route.params.subscribe((params) => {
			this.activitiesDataService.getSegments(params.id)
				.subscribe((res: any) => {
					this.tableTitle = `${res.name} ${res.date}`;
					this.setTitle(`${this.sectionName} – ${res.name}`);
					this.data = res;
				});
		});
	}

	private setTitle (title: string): void {
		this.headerTitleService.setTitle(title);
		this.headerTitleService.setHeaderTitle(title);
	}
}
