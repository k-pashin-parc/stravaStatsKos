import { Component, OnInit } from '@angular/core';
import { find, forEach } from 'lodash';

import { FieldConfig } from './../config/table.config';
import { DeviceService, ScreeState } from '../common/device/device.service';

@Component({
	selector: 'segment-detail',
	templateUrl: './segment_detail.pug',
	styleUrls: ['./segment_detail.component.sass'],
})
export class SegmentDetailComponent implements OnInit {
	private data;

	private defaultModeId = 'my';

	private generalAllFields: Array<FieldConfig> = [{
		title: 'Место',
		fieldName: 'rank',
	}, {
		title: 'Имя',
		fieldName: 'athlete_name',
	}, {
		title: 'Скрор. в движ., км/ч',
		fieldName: 'moving_speed',
	}, {
		title: 'Общ. скор., км/ч',
		fieldName: 'total_speed',
	}, {
		title: 'Время',
		fieldName: 'elapsed_time',
		type: 'time',
	}, {
		title: 'Отдых',
		fieldName: 'rest_time',
		type: 'time',
	}];

	private generalMyFields: Array<FieldConfig> = [{
		title: 'Дата',
		fieldName: 'date_display',
		type: 'link',
	}, {
		title: 'Скрор. в движ., км/ч',
		fieldName: 'moving_speed',
	}, {
		title: 'Общ. скор., км/ч',
		fieldName: 'total_speed',
	}, {
		title: 'Время',
		fieldName: 'elapsed_time',
		type: 'time',
	}, {
		title: 'Отдых',
		fieldName: 'rest_time',
		type: 'time',
	}];




	private mobileAllFields: Array<FieldConfig> = [{
		title: 'Место',
		fieldName: 'rank',
	}, {
		title: 'Имя',
		fieldName: 'athlete_name',
	}, {
		title: 'V, км/ч',
		fieldName: 'speedConcat',
	}, {
		title: 'T',
		fieldName: 'elapsed_time',
		type: 'time',
	}, {
		title: 'Отдых',
		fieldName: 'rest_time',
		type: 'time',
	}];

	private mobileMyFields: Array<FieldConfig> = [{
		title: 'Дата',
		fieldName: 'date_display',
		type: 'link',
	}, {
		title: 'V, км/ч',
		fieldName: 'speedConcat',
	}, {
		title: 'T',
		fieldName: 'elapsed_time',
		type: 'time',
	}, {
		title: 'Отдых',
		fieldName: 'rest_time',
		type: 'time',
	}];

	private leaderboarbModes = [{
		id: 'all',
		title: 'Все',
	}, {
		id: 'my',
		title: 'Только мои',
	}];

	private leaderboardSelectedMode = find(this.leaderboarbModes, {id: this.defaultModeId});
	private screenState: ScreeState;

	constructor (
		private deviceService: DeviceService,
	) {
		this.screenState = this.deviceService.getScreenInfo();
	}

	ngOnInit () {
		forEach(this.data.myEfforts, (el) => {
			el.url = `http://strava.com/activities/${el.id}`;

			if (this.screenState.isMobile) {
				el.speedConcat = `${el.moving_speed} (${el.total_speed})`;
			}
		});

		if (this.screenState.isMobile) {
			forEach(this.data.leaderboard, (el) => {
				el.speedConcat = `${el.moving_speed} (${el.total_speed})`;
			});
		}
	}
}
