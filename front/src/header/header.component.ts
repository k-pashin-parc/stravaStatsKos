import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { from } from 'rxjs';

import { HeaderTitleService } from './../common/header_title/header.title.service';
import { DeviceService } from './../common/device/device.service';

interface MenuItems {
	Name: string;
	Url: string;
	Childs?: Array<MenuItems>;
}

@Component({
	selector: 'app-header',
	templateUrl: 'header.component.pug',
	styleUrls: ['header.component.sass']
})

export class AppHeaderComponent implements OnInit {
	isShowSubmenu: boolean;
	selectedMenuItem: object;
	isHideMenu: boolean;
	headerTitle: HeaderTitleService;

	menuItems: Array<MenuItems> = [
		{
			Name: 'Лыжи',
			Url: 'ski',
			Childs: [
				{
					Name: 'Общая информация',
					Url: 'summaryChart'
				},
				{
					Name: 'Общая информация',
					Url: 'summary'
				},
				{
					Name: 'Подробно',
					Url: 'detail'
				},
			]
		},
		{
			Name: 'Бег',
			Url: 'run',
			Childs: [
				{
					Name: 'Общая информация',
					Url: 'summaryChart'
				},
				{
					Name: 'Общая информация',
					Url: 'summary'
				},
				{
					Name: 'Подробно',
					Url: 'detail'
				},
			]
		},
		{
			Name: 'Вел',
			Url: 'bike',
			Childs: [
				{
					Name: 'Общая информация',
					Url: 'summaryChart'
				},
				{
					Name: 'Общая информация',
					Url: 'summary'
				},
				{
					Name: 'Подробно',
					Url: 'detail'
				},
			]
		},
	];

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private deviceService: DeviceService,
		headerTitle: HeaderTitleService
	) {
		this.headerTitle = headerTitle;
	}

	ngOnInit () {
		const isMobile = this.deviceService.getScreenInfo().isMobile;

		this.menuItems = this.menuItems.filter(el => {
			el.Childs = el.Childs.filter(child => {
				return child.Url !== (isMobile ? 'summaryChart' : 'summary');
			});

			return el;
		});

		this.router.events.pipe(
			filter((event) => event instanceof ActivationStart)
		)
			.subscribe((event: ActivationStart) => {
				this.isHideMenu = event.snapshot.data.isHideMenu;
				this.headerTitle.setTitle('');

				from(this.menuItems).pipe(
					filter((item: any) => item.Url === event.snapshot.data.stateName)
				)
				.subscribe((item) => {
					this.selectedMenuItem = item;
					this.isShowSubmenu = !!item.Childs;
				});
			});
	}
}
