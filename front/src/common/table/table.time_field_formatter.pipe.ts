import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'tableTimeFieldFormatter'})

export class TableTimeFieldFormatterPipe implements PipeTransform {
	transform(time: number, isWithoutSeconds?: boolean): string {
		const hours = Math.floor(time / 60 / 60);
		const timeUnits = ['ч', 'мин', 'с'];
		const mins = Math.floor(time / 60) - hours * 60;
		const secs = time % 60;
		let timeArr = [hours, mins, secs];
		const resArr = [];

		let	res;

		if (isWithoutSeconds) {
			timeArr = timeArr.splice(0, 2);
		}

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
	}
}
