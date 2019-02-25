import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
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

	@ViewChild(MatSort) sort: MatSort;

	private displayedColumns;
	private dataSource: MatTableDataSource<{}>;

	ngOnInit () {
		this.dataSource = new MatTableDataSource(this.data);
		this.dataSource.sort = this.sort;

		this.dataSource.sortingDataAccessor = (item, property) => {
			const fields = {
				'date_display': 'date'
			};

			return item[fields[property] || property];
		};

		this.displayedColumns = this.fields.map(el => {
			return el.fieldName;
		});
	}
}
