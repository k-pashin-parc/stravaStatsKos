import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'tableFieldFormatter'})

export class TableFieldFormatterPipe implements PipeTransform {
	transform(val: any, element: any, type = 'string'): string {
		const actions = {
				time: function (time) {
					const hours = Math.floor(time / 60 / 60);
					const timeUnits = ['ч', 'мин', 'с'];
					const mins = Math.floor(time / 60) - hours * 60;
					const secs = time % 60;
					const timeArr = [hours, mins, secs];
					const resArr = [];

					let	res;

					if (time !== 0) {
						timeArr.forEach((el, i) => {
							if (el !== 0) {
								resArr.push(`${el} <span class='small'> ${timeUnits[i]} </span>`);
							}
						});
						res = resArr.join(' ');
					} else {
						res = '-';
					}

					return res;
				},
				string: function (str) {
					return str;
				},
				date: function () {
					return element['date_display'];
				},
				link: function (str) {
					return `<a class='link' href='${element.href}' target='_blank'>${str}</a>`;
				}
			};

		return actions[type](val);
	}
}
