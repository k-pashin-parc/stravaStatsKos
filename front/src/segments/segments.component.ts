import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ActivitiesDataService } from './../activities/activities.data.service';
import { HeaderTitleService } from './../common/header_title/header.title.service';
import { FieldConfig } from './../config/table.config';
import { SegmentDetailComponent } from './../segment_detail/segment_detail.component';
import { ActivitiesService } from './../activities/activities.service';
import { DeviceService, ScreeState } from '../common/device/device.service';

interface ISegmensListData {
	date: string;
	name: string;
	segments: [];
}

@Component({
	selector: 'segments',
	templateUrl: './segments.pug',
})
export class SegmentsComponent {
	private data: ISegmensListData;
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

	private generalSegmentsFields: Array<FieldConfig> = [{
		title: 'Название',
		fieldName: 'name',
	}, {
		title: 'Расстояние (км)',
		fieldName: 'distance',
	}, {
		title: 'Скор. в движ. (км/ч)',
		fieldName: 'moving_speed',
	}, {
		title: 'Общая скорость (км/ч)',
		fieldName: 'total_speed',
	}, {
		title: 'Время',
		fieldName: 'elapsed_time',
		type: 'time'
	}, {
		title: 'Отдых',
		fieldName: 'rest_time',
		type: 'time'
	}];

	private mobileSegmentsFields: Array<FieldConfig> = [{
		title: 'Название',
		fieldName: 'name',
	}, {
		title: 'S, км',
		fieldName: 'distance',
	}, {
		title: 'V, км/ч',
		fieldName: 'speedConcat',
	}, {
		title: 'T',
		fieldName: 'elapsed_time',
		type: 'time'
	}, {
		title: 'Отдых',
		fieldName: 'rest_time',
		type: 'time'
	}];

	private screenState: ScreeState;

	constructor(
		private route: ActivatedRoute,
		private activitiesDataService: ActivitiesDataService,
		private headerTitleService: HeaderTitleService,
		private activitiesService: ActivitiesService,
		private deviceService: DeviceService,
	) {
		this.setTitle(this.sectionName);

		this.screenState = this.deviceService.getScreenInfo();

		this.route.params.subscribe((params) => {
			this.activitiesDataService.getSegments(params.id)
				.subscribe((res: ISegmensListData) => {
					this.data = res;
					this.tableTitle = `${this.data.name}, ${this.data.date}`;
					this.setTitle(`${this.sectionName} – ${this.data.name}`);

					this.data.segments.forEach((el: any) => {
						if (this.screenState.isMobile) {
							el.speedConcat = `${el.moving_speed} (${el.total_speed})`;
						}

						el.url = `http://strava.com/activities/${el.id}`;
					});
				});
		});
	}

	private setTitle (title: string): void {
		this.headerTitleService.setTitle(title);
		this.headerTitleService.setHeaderTitle(title);
	}
}
