import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'common-table',
	templateUrl: 'table.component.pug',
	styleUrls: ['./table.component.sass'],
})

export class TableComponent implements OnInit {
	@Input() private data;
	@Input() private fields;
	@Input() private title;

	private displayedColumns;

	ngOnInit () {
		this.displayedColumns = this.fields.map((el) => {
			return el.fieldName;
		});
	}
}
