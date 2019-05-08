import { Component, Input } from '@angular/core';

@Component({
	selector: 'no-data',
	templateUrl: './no_data.pug',
	styleUrls: ['./no_data.sass']
})

export class NoDataComponent {
	@Input() classes;
}
