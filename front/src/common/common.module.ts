import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// import { AgmCoreModule } from '@agm/core';
import { MatSelectModule } from '@angular/material/select';

import { MatButtonModule, MatProgressSpinnerModule, MatProgressBarModule } from '@angular/material';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TableComponent } from './table/table.component';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { TableTimeFieldFormatterPipe } from './table/table.time_field_formatter.pipe';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartComponent } from './chart/chart.component';
import { MatSortModule } from '@angular/material';
import { AddContentDirective } from './../add_content/add_content.directive';
import { SegmentDetailComponent } from './../segment_detail/segment_detail.component';
import { NoDataComponent } from './no_data/no_data.component';

@NgModule({
	declarations: [
		TableComponent,
		TableTimeFieldFormatterPipe,
		ChartComponent,
		AddContentDirective,
		SegmentDetailComponent,
		NoDataComponent,
	],
	imports: [
		BrowserModule,
		DeviceDetectorModule.forRoot(),
		MatTableModule,
		MatCheckboxModule,
		RouterModule,
		NgxChartsModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatSortModule,
		BrowserAnimationsModule,
		// AgmCoreModule,
		MatSelectModule,
	],
	exports: [
		FormsModule,
		MatButtonModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatTabsModule,
		TableComponent,
		TableTimeFieldFormatterPipe,
		MatCheckboxModule,
		NgxChartsModule,
		ChartComponent,
		MatSortModule,
		BrowserAnimationsModule,
		AddContentDirective,
		MatSelectModule,
		NoDataComponent,
	],
	providers: [],
	entryComponents: [
		SegmentDetailComponent,
	]
})

export class CommonModule { }
