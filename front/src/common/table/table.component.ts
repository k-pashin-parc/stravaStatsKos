import { Component, Input, OnInit } from '@angular/core';

import { FieldConfig } from './../../config/table.config';

@Component({
	selector: 'common-table',
	templateUrl: 'table.component.pug',
	styleUrls: ['./table.component.sass'],
})

export class TableComponent implements OnInit {
	@Input() private data: object[];
	@Input() private fields: FieldConfig[];
	@Input() private title: string;
	@Input() private classes: string;
	@Input() private isWithoutSeconds: boolean;

	private displayedColumns;

	ngOnInit () {
		this.displayedColumns = this.fields.map(el => {
			return el.fieldName;
		});
	}
}
