import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { from } from 'rxjs';

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
	private isShowSubmenu: boolean;
	private selectedMenuItem: object;

	private menuItems: Array<MenuItems> = [{
		Name: 'Лыжи',
		Url: 'ski',
		Childs: [{
			Name: 'Общая информация',
			Url: 'summary'
		}, /*{
			Name: 'Подробно',
			Url: 'detail'
		}*/]
	}, /*{
		Name: 'Бег',
		Url: 'run',
		Childs: [{
			Name: 'Общая информация',
			Url: 'summary'
		}, {
			Name: 'Подробно',
			Url: 'detail'
		}]
	}, {
		Name: 'Вел',
		Url: 'bike',
		Childs: [{
			Name: 'Общая информация',
			Url: 'summary'
		}, {
			Name: 'Подробно',
			Url: 'detail'
		}]
	}*/];

	constructor(private router: Router, private route: ActivatedRoute) {}

	ngOnInit () {
		this.router.events.pipe(
			filter((event) => event instanceof ActivationStart)
		)
			.subscribe((event: ActivationStart) => {
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