import { Component, OnInit } from '@angular/core';
import { ActivitiesDataService } from './../../activities/activities.data.service';
import { FieldConfig } from './../../config/table.config';
import { DeviceService, ScreeState } from './../../common/device/device.service';

@Component({
	selector: 'ski-summary',
	templateUrl: 'ski.summary.component.pug',
})

export class SkiSummaryComponent implements OnInit {
	private data;

	private seasonsFields: Array<FieldConfig> = [{
		title: 'Сезон',
		fieldName: 'titleShort'
	}, {
		title: 'S, км',
		fieldName: 'distanceConcat'
	}];

	private speedFields: Array<FieldConfig> = [{
		title: 'Сезон',
		fieldName: 'titleShort'
	}, {
		title: 'V, км/ч',
		fieldName: 'speedConcat'
	}];

	private speedDetailFields: Array<FieldConfig> = [{
		title: 'Сезон',
		fieldName: 'titleShort'
	}, {
		title: 'Волга, км/ч',
		fieldName: 'quickRidesSpeedConcat'
	}, {
		title: 'Пляж, км/ч',
		fieldName: 'notQuickRidesSpeedConcat'
	}];

	private distanceByMonthsFields: Array<FieldConfig> = [{
		title: 'Месяц',
		fieldName: 'title'
	}, {
		title: 'S, км',
		fieldName: 'value'
	}];

	private screenState: ScreeState;

	constructor (
		private activitiesDataService: ActivitiesDataService,
		private deviceService: DeviceService
	) { }

	ngOnInit () {
		this.screenState = this.deviceService.getScreenInfo();
		this.data = this.activitiesDataService.getActivities('Ski')['seasons'];

		if (this.screenState.isMobile) {
			this.data.forEach(el => {
				const arr = el.title.split('/');

				el.titleShort = `${arr[0].substring(2, 4)}/${arr[1].substring(2, 4)}`;
				el.distanceConcat = `${el.totalDistance} (${el.companyRidesDistance})`;
				el.speedConcat = `${el.movingSpeed} (${el.totalSpeed})`;
				el.notQuickRidesSpeedConcat = `${el.notQuickRidesMovingSpeed} (${el.notQuickRidesTotalSpeed})`;
				el.quickRidesSpeedConcat = `${el.quickRidesMovingSpeed} (${el.quickRidesTotalSpeed})`;
			});
		}
	}
}
