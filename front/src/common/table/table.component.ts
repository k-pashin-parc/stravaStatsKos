import { findIndex } from 'lodash';
import { MatSort, MatTableDataSource } from '@angular/material';

import {
	Component,
	Input,
	OnInit,
	ViewChild,
	ComponentFactoryResolver,
	ViewChildren,
	QueryList,
	OnChanges,
} from '@angular/core';

import { AddContentDirective } from './../../add_content/add_content.directive';
import { FieldConfig } from './../../config/table.config';
import { CommonUtilitiesService } from './../utilities';

@Component({
	selector: 'common-table',
	templateUrl: 'table.component.pug',
	styleUrls: ['./table.component.sass'],
})
export class TableComponent implements OnInit, OnChanges {
	@Input() title: string;
	@Input() classes: string;
	@Input() isWithoutSeconds: boolean;
	@Input() expandableParams;
	@Input() fields: FieldConfig[];
	@Input() private data: {}[];

	@ViewChild(MatSort) sort: MatSort;
	@ViewChildren(AddContentDirective) addContentEls: QueryList<AddContentDirective>;

	displayedColumns;
	dataSource: MatTableDataSource<{}>;

	private expandedItem;

	constructor (
		private componentFactoryResolver: ComponentFactoryResolver,
		private commonUtilitiesService: CommonUtilitiesService,
	) {}

	ngOnInit () {
		this.setDatasource();

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

	ngOnChanges () {
		this.setDatasource();
	}

	private setDatasource () {
		this.dataSource = new MatTableDataSource(this.data);
		this.dataSource.sort = this.sort;
	}

	private showData (item) {
		if (!item.isLoaded) {
			item.isLoading = true;

			this.expandableParams.getData(item)
				.subscribe((response) => {
					const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.expandableParams.component);
					const viewContainerRef = this.addContentEls.toArray()[findIndex(this.data, item)].viewContainerRef;

					viewContainerRef.clear();

					const componentRef = viewContainerRef.createComponent(componentFactory);
					componentRef.instance['data'] = response;

					item.isLoading = false;
					item.isLoaded = true;
				});
		}
	}

	private toggleRow (item) {
		if (this.expandableParams) {
			this.expandedItem = this.expandedItem === item ? null : item;
			this.showData(item);
		}
	}

	private getAdditionalLink (section: string, id: string): string {
		return this.commonUtilitiesService.getRedirectUrl(`${section}/${id}`);
	}
}
